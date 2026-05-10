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
    const rfEdges: Edge<PathwayEdgeData>[] = pathway.edges.map((e) => {
      const sourceLevel = result?.values[e.source] ?? 0;
      const active = Math.abs(sourceLevel) > 0.4;
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'pathway',
        data: {
          effect: e.effect,
          label: e.label,
          active,
          blocked: blocked.has(e.id),
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
