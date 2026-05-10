import { useMemo } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { usePathwayStore } from '@/store/usePathwayStore';
import { getPathway } from '@/pathways';
import { HormoneNode, type HormoneNodeData } from './HormoneNode';
import { EdgeArrowMarkers, PathwayEdge, type PathwayEdgeData } from './PathwayEdge';
import { buildBlockedEdgeSet } from '@/sim/propagate';

const nodeTypes = { hormone: HormoneNode };
const edgeTypes = { pathway: PathwayEdge };

const LAYOUT_SCALE_X = 1.45;
const LAYOUT_SCALE_Y = 1.35;

export function PathwayCanvas() {
  const axisId = usePathwayStore((s) => s.axisId);
  const result = usePathwayStore((s) => s.result);
  const clamps = usePathwayStore((s) => s.clamps);
  const activeDrugs = usePathwayStore((s) => s.activeDrugs);
  const selectedNodeId = usePathwayStore((s) => s.selectedNodeId);
  const selectNode = usePathwayStore((s) => s.selectNode);

  const pathway = axisId ? getPathway(axisId) : null;

  const { nodes, edges } = useMemo(() => {
    if (!pathway) return { nodes: [] as Node[], edges: [] as Edge[] };
    const blocked = buildBlockedEdgeSet(pathway.edges, activeDrugs);
    const rfNodes: Node<HormoneNodeData>[] = pathway.nodes.map((n) => ({
      id: n.id,
      type: 'hormone',
      position: { x: n.position.x * LAYOUT_SCALE_X, y: n.position.y * LAYOUT_SCALE_Y },
      data: {
        label: n.label,
        kind: n.kind,
        level: result?.values[n.id] ?? 0,
        clamped: n.id in clamps,
        selected: selectedNodeId === n.id,
        isLab: n.isLab,
      },
      selected: selectedNodeId === n.id,
    }));
    const nodeById = new Map(pathway.nodes.map((n) => [n.id, n]));
    type HandleChoice = { sourceHandle: string; targetHandle: string };
    const handleFor = (sourceId: string, targetId: string, effect: string): HandleChoice => {
      const s = nodeById.get(sourceId);
      const t = nodeById.get(targetId);
      if (!s || !t) return { sourceHandle: 'sr', targetHandle: 'tl' };
      const dx = t.position.x - s.position.x;
      const dy = t.position.y - s.position.y;
      // Feedback (negative feedback to upstream): route up and over the top.
      if (effect === 'feedback-neg') {
        return { sourceHandle: 'st', targetHandle: 'tt' };
      }
      // Edge that travels backward in x (target sits left of source) — also route over the top.
      if (dx < -20) {
        return { sourceHandle: 'st', targetHandle: 'tt' };
      }
      // Strongly vertical: enter/exit via top/bottom.
      if (Math.abs(dy) > Math.abs(dx) * 1.3) {
        return dy > 0
          ? { sourceHandle: 'sb', targetHandle: 'tt' }
          : { sourceHandle: 'st', targetHandle: 'tb' };
      }
      // Default: horizontal flow right→left.
      return { sourceHandle: 'sr', targetHandle: 'tl' };
    };
    // Group edges that share an endpoint and routing direction so we can fan them out.
    const siblingIndex = new Map<string, number>();
    const siblingCount = new Map<string, number>();
    const edgeKeys = pathway.edges.map((e) => {
      const { sourceHandle, targetHandle } = handleFor(e.source, e.target, e.effect);
      const key = `${e.source}:${sourceHandle}->${e.target}:${targetHandle}`;
      siblingCount.set(key, (siblingCount.get(key) ?? 0) + 1);
      siblingIndex.set(e.id, (siblingCount.get(key) ?? 1) - 1);
      return { key, sourceHandle, targetHandle };
    });
    const rfEdges: Edge<PathwayEdgeData>[] = pathway.edges.map((e, i) => {
      const sourceLevel = result?.values[e.source] ?? 0;
      const active = Math.abs(sourceLevel) > 0.4;
      const { key, sourceHandle, targetHandle } = edgeKeys[i];
      const total = siblingCount.get(key) ?? 1;
      const idx = siblingIndex.get(e.id) ?? 0;
      // Spread siblings symmetrically around 0; first sibling gets 0 offset when alone.
      const lane = total > 1 ? idx - (total - 1) / 2 : 0;
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle,
        targetHandle,
        type: 'pathway',
        data: {
          effect: e.effect,
          label: e.label,
          active,
          blocked: blocked.has(e.id),
          lane,
        },
      };
    });
    return { nodes: rfNodes, edges: rfEdges };
  }, [pathway, result, clamps, activeDrugs, selectedNodeId]);

  const onNodeClick: NodeMouseHandler = (_, node) => {
    selectNode(node.id);
  };

  if (!pathway) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        Pick an axis to begin.
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <EdgeArrowMarkers />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onPaneClick={() => selectNode(null)}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background color="#1e293b" gap={24} />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
