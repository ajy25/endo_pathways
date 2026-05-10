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
  /** Axis tiles hidden in the overview view (other views ignore this). */
  overviewHiddenAxes: Set<string>;
  setAxis: (id: AxisId) => void;
  clearAxis: () => void;
  setClamp: (nodeId: NodeId, value: number | null) => void;
  resetClamps: () => void;
  toggleDrug: (id: DrugId) => void;
  applyScenario: (id: ScenarioId) => void;
  clearScenario: () => void;
  selectNode: (id: NodeId | null) => void;
  toggleOverviewAxis: (axis: string) => void;
  setOverviewVisibility: (mode: 'all' | 'none') => void;
  recompute: () => void;
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
  overviewHiddenAxes: new Set(),

  setAxis: (id) => {
    set({ axisId: id, clamps: {}, activeDrugs: new Set(), activeScenario: null, selectedNodeId: null });
    get().recompute();
  },
  clearAxis: () => set({ axisId: null, clamps: {}, activeDrugs: new Set(), activeScenario: null, selectedNodeId: null, result: null }),

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
    });
    get().recompute();
  },
  clearScenario: () => {
    set({ clamps: {}, activeDrugs: new Set(), activeScenario: null });
    get().recompute();
  },

  selectNode: (id) => set({ selectedNodeId: id }),

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
