import { create } from 'zustand';
import type { AxisId, DrugId, NodeId, ScenarioId, SimulationResult } from '@/model/types';
import { buildBlockedEdgeSet, propagate } from '@/sim/propagate';
import { getPathway } from '@/pathways';
import { getScenario } from '@/scenarios';
import { getDrug } from '@/drugs';

interface PathwayState {
  axisId: AxisId | null;
  clamps: Record<NodeId, number>;
  activeDrugs: Set<DrugId>;
  activeScenario: ScenarioId | null;
  selectedNodeId: NodeId | null;
  result: SimulationResult | null;
  /**
   * Resting-state result for the current axis, computed from `defaultClamps` only
   * (no user clamps, no drugs, no scenario). Used as the reference for the
   * "only changed" canvas filter.
   */
  baselineResult: SimulationResult | null;
  /** Axis tiles hidden in the overview view (other views ignore this). */
  overviewHiddenAxes: Set<string>;
  /** Bumped whenever the canvas should pan to the selected node (search / lab click). */
  focusToken: number;
  /** When true, the canvas hides nodes whose current value matches baseline. */
  showOnlyChanged: boolean;
  setAxis: (id: AxisId) => void;
  clearAxis: () => void;
  setClamp: (nodeId: NodeId, value: number | null) => void;
  resetClamps: () => void;
  toggleDrug: (id: DrugId) => void;
  applyScenario: (id: ScenarioId) => void;
  clearScenario: () => void;
  selectNode: (id: NodeId | null) => void;
  /** Like selectNode, but also pans the canvas to the node. */
  focusNode: (id: NodeId) => void;
  toggleOverviewAxis: (axis: string) => void;
  setOverviewVisibility: (mode: 'all' | 'none') => void;
  toggleShowOnlyChanged: () => void;
  recompute: () => void;
}

function computeBaseline(axisId: AxisId): SimulationResult | null {
  const p = getPathway(axisId);
  if (!p) return null;
  return propagate({
    nodes: p.nodes,
    edges: p.edges,
    clamps: p.defaultClamps ?? {},
  });
}

const ALL_OVERVIEW_AXES = [
  'hpt', 'hpa', 'hpg', 'gh', 'prl', 'adh', 'raas', 'ca', 'glucose', 'steroidogenesis', 'appetite',
];

export const usePathwayStore = create<PathwayState>((set, get) => ({
  axisId: null,
  clamps: {},
  activeDrugs: new Set(),
  activeScenario: null,
  selectedNodeId: null,
  result: null,
  baselineResult: null,
  overviewHiddenAxes: new Set(),
  focusToken: 0,
  showOnlyChanged: false,

  setAxis: (id) => {
    set({
      axisId: id,
      clamps: {},
      activeDrugs: new Set(),
      activeScenario: null,
      selectedNodeId: null,
      baselineResult: computeBaseline(id),
    });
    get().recompute();
  },
  clearAxis: () => set({ axisId: null, clamps: {}, activeDrugs: new Set(), activeScenario: null, selectedNodeId: null, result: null, baselineResult: null }),

  setClamp: (nodeId, value) => {
    const next = { ...get().clamps };
    if (value === null) delete next[nodeId];
    else next[nodeId] = value;
    set({ clamps: next, activeScenario: null });
    get().recompute();
  },
  resetClamps: () => {
    set({ clamps: {}, activeDrugs: new Set(), activeScenario: null, selectedNodeId: null });
    get().recompute();
  },

  toggleDrug: (id) => {
    const next = new Set(get().activeDrugs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    set({ activeDrugs: next, activeScenario: null });
    get().recompute();
  },

  applyScenario: (id) => {
    const sc = getScenario(id);
    if (!sc) return;
    const drugs = new Set<DrugId>(sc.drugs ?? []);
    set({
      axisId: sc.axis,
      clamps: { ...sc.clamps },
      activeDrugs: drugs,
      activeScenario: id,
      selectedNodeId: null,
      baselineResult: computeBaseline(sc.axis),
    });
    get().recompute();
  },
  clearScenario: () => {
    set({ clamps: {}, activeDrugs: new Set(), activeScenario: null });
    get().recompute();
  },

  selectNode: (id) => set({ selectedNodeId: id }),
  focusNode: (id) => set((s) => ({ selectedNodeId: id, focusToken: s.focusToken + 1 })),

  toggleOverviewAxis: (axis) => {
    const next = new Set(get().overviewHiddenAxes);
    if (next.has(axis)) next.delete(axis);
    else next.add(axis);
    set({ overviewHiddenAxes: next });
  },
  setOverviewVisibility: (mode) => {
    set({
      overviewHiddenAxes: mode === 'all' ? new Set() : new Set(ALL_OVERVIEW_AXES),
    });
  },
  toggleShowOnlyChanged: () => set((s) => ({ showOnlyChanged: !s.showOnlyChanged })),

  recompute: () => {
    const { axisId, clamps, activeDrugs } = get();
    if (!axisId) return;
    const pathway = getPathway(axisId);
    if (!pathway) return;
    // Resolve drug-imposed clamps as well (e.g., receptor blockers).
    const drugClamps: Record<NodeId, number> = {};
    for (const d of activeDrugs) {
      const drug = getDrug(d);
      if (drug?.clamps) Object.assign(drugClamps, drug.clamps);
    }
    const mergedClamps = { ...(pathway.defaultClamps ?? {}), ...drugClamps, ...clamps };
    const blockedEdges = buildBlockedEdgeSet(pathway.edges, activeDrugs);
    const result = propagate({
      nodes: pathway.nodes,
      edges: pathway.edges,
      clamps: mergedClamps,
      blockedEdges,
    });
    set({ result });
  },
}));
