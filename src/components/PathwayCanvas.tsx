import { useEffect, useMemo } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  useReactFlow,
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
// A node counts as "changed" when its current value differs from its
// baseline (defaultClamps-only) value by more than this amount. Tuned to
// roughly match where `bucketLevel` starts calling things non-normal.
const CHANGED_EPSILON = 0.3;

export function PathwayCanvas() {
  const axisId = usePathwayStore((s) => s.axisId);
  const result = usePathwayStore((s) => s.result);
  const baselineResult = usePathwayStore((s) => s.baselineResult);
  const clamps = usePathwayStore((s) => s.clamps);
  const activeDrugs = usePathwayStore((s) => s.activeDrugs);
  const selectedNodeId = usePathwayStore((s) => s.selectedNodeId);
  const selectNode = usePathwayStore((s) => s.selectNode);
  const overviewHiddenAxes = usePathwayStore((s) => s.overviewHiddenAxes);
  const showOnlyChanged = usePathwayStore((s) => s.showOnlyChanged);

  const pathway = axisId ? getPathway(axisId) : null;

  const { nodes, edges, totalNodeCount, changedFilterActive } = useMemo(() => {
    if (!pathway) {
      return { nodes: [] as Node[], edges: [] as Edge[], totalNodeCount: 0, changedFilterActive: false };
    }
    const blocked = buildBlockedEdgeSet(pathway.edges, activeDrugs);
    // In overview mode, drop tiles for axes the user has toggled off. Node ids
    // are prefixed `${axis}:` in the overview pathway, so a prefix check is enough.
    const isOverview = pathway.id === 'overview';
    let visibleNodes = isOverview && overviewHiddenAxes.size > 0
      ? pathway.nodes.filter((n) => {
          const axis = n.id.split(':', 1)[0];
          return !overviewHiddenAxes.has(axis);
        })
      : pathway.nodes;
    const totalAfterAxisFilter = visibleNodes.length;
    const filterChanged = showOnlyChanged && !!result && !!baselineResult;
    if (filterChanged) {
      visibleNodes = visibleNodes.filter((n) => {
        const cur = result!.values[n.id] ?? 0;
        const base = baselineResult!.values[n.id] ?? 0;
        return Math.abs(cur - base) > CHANGED_EPSILON;
      });
    }
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = isOverview && overviewHiddenAxes.size > 0
      ? pathway.edges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target))
      : pathway.edges;
    const rfNodes: Node<HormoneNodeData>[] = visibleNodes.map((n) => ({
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
    const edgeKeys = visibleEdges.map((e) => {
      const { sourceHandle, targetHandle } = handleFor(e.source, e.target, e.effect);
      const key = `${e.source}:${sourceHandle}->${e.target}:${targetHandle}`;
      siblingCount.set(key, (siblingCount.get(key) ?? 0) + 1);
      siblingIndex.set(e.id, (siblingCount.get(key) ?? 1) - 1);
      return { key, sourceHandle, targetHandle };
    });
    const rfEdges: Edge<PathwayEdgeData>[] = visibleEdges.map((e, i) => {
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
    return {
      nodes: rfNodes,
      edges: rfEdges,
      totalNodeCount: totalAfterAxisFilter,
      changedFilterActive: filterChanged,
    };
  }, [pathway, result, baselineResult, clamps, activeDrugs, selectedNodeId, overviewHiddenAxes, showOnlyChanged]);

  // Force a refit when the overview filter or "only changed" filter changes so
  // the visible nodes fill the canvas.
  const fitKey = [
    pathway?.id ?? 'none',
    pathway?.id === 'overview' ? [...overviewHiddenAxes].sort().join(',') : '',
    showOnlyChanged ? `c${nodes.length}` : 'all',
  ].join('|');

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

  const emptyChangedState = changedFilterActive && nodes.length === 0;

  return (
    <div className="h-full w-full relative">
      <EdgeArrowMarkers />
      {changedFilterActive && totalNodeCount > 0 && (
        <div className="absolute top-2 left-2 z-10 panel px-2 py-1 text-[11px] text-amber-200 border-amber-500/40">
          Only changes: {nodes.length} of {totalNodeCount}
        </div>
      )}
      {emptyChangedState && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="panel px-4 py-3 text-sm text-slate-300 border-amber-500/40">
            Nothing has shifted from baseline yet — clamp a node or apply a scenario.
          </div>
        </div>
      )}
      <ReactFlow
        key={fitKey}
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
        <FocusOnSelected />
      </ReactFlow>
    </div>
  );
}

/**
 * Pans the viewport to the selected node whenever focusToken bumps (e.g., a lab
 * row click or search pick). Plain node clicks don't bump the token, so they
 * don't yank the canvas around.
 */
function FocusOnSelected() {
  const selectedNodeId = usePathwayStore((s) => s.selectedNodeId);
  const focusToken = usePathwayStore((s) => s.focusToken);
  const { setCenter, getNode, getZoom } = useReactFlow();
  useEffect(() => {
    if (!selectedNodeId || focusToken === 0) return;
    const node = getNode(selectedNodeId);
    if (!node) return;
    const w = node.measured?.width ?? node.width ?? 160;
    const h = node.measured?.height ?? node.height ?? 70;
    const x = node.position.x + w / 2;
    const y = node.position.y + h / 2;
    const zoom = Math.max(getZoom(), 0.9);
    setCenter(x, y, { duration: 500, zoom });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusToken]);
  return null;
}
