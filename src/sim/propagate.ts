import type {
  EdgeId,
  LevelValue,
  NodeId,
  PathwayEdge,
  PathwayNode,
  SimulationInput,
  SimulationOptions,
  SimulationResult,
} from '@/model/types';

export const OUTPUT_SCALE = 3;
export const DEFAULT_MAX_ITER = 60;
export const DEFAULT_EPSILON = 1e-3;
export const DEFAULT_DAMPING = 0.5;

/**
 * Qualitative direction-of-change simulator.
 *
 * Each node has a level in roughly [-OUTPUT_SCALE, +OUTPUT_SCALE] where 0 = baseline.
 * Each edge applies a signed influence: stimulates / converts → positive;
 * inhibits / feedback-neg → negative. Influences are summed at each target and
 * squashed with tanh to stay bounded. Damping smooths oscillation in feedback loops.
 *
 * This is not a quantitative PK/PD model. It models the sign-of-change relationships
 * that Step 1 tests ("if TSH is high, is T4 high or low?"), not concentrations.
 */
export function propagate(
  input: SimulationInput,
  opts: SimulationOptions = {},
): SimulationResult {
  const maxIter = opts.maxIterations ?? DEFAULT_MAX_ITER;
  const epsilon = opts.epsilon ?? DEFAULT_EPSILON;
  const damping = opts.damping ?? DEFAULT_DAMPING;

  const { nodes, edges, clamps, blockedEdges } = input;

  const values: Record<NodeId, LevelValue> = {};
  for (const node of nodes) values[node.id] = node.baseline ?? 0;
  // Apply clamps as initial values too — gives feedback loops a head start.
  for (const [id, v] of Object.entries(clamps)) values[id] = v;

  // Pre-index incoming edges per node for O(N + E) per iteration.
  const incoming = new Map<NodeId, PathwayEdge[]>();
  for (const node of nodes) incoming.set(node.id, []);
  for (const edge of edges) {
    if (blockedEdges?.has(edge.id)) continue;
    const list = incoming.get(edge.target);
    if (list) list.push(edge);
  }

  let iter = 0;
  let converged = false;
  for (; iter < maxIter; iter++) {
    let maxDelta = 0;
    const next: Record<NodeId, LevelValue> = { ...values };
    for (const node of nodes) {
      if (node.id in clamps) {
        next[node.id] = clamps[node.id];
        continue;
      }
      const inputs = incoming.get(node.id) ?? [];
      if (inputs.length === 0) {
        // No driver: relax toward baseline.
        const baseline = node.baseline ?? 0;
        const blended = damping * baseline + (1 - damping) * values[node.id];
        next[node.id] = blended;
        maxDelta = Math.max(maxDelta, Math.abs(blended - values[node.id]));
        continue;
      }
      let influence = 0;
      for (const e of inputs) {
        const sign = signOfEffect(e);
        influence += sign * e.weight * values[e.source];
      }
      const squashed = OUTPUT_SCALE * Math.tanh(influence / OUTPUT_SCALE);
      const blended = damping * squashed + (1 - damping) * values[node.id];
      next[node.id] = blended;
      maxDelta = Math.max(maxDelta, Math.abs(blended - values[node.id]));
    }
    Object.assign(values, next);
    if (maxDelta < epsilon) {
      converged = true;
      break;
    }
  }

  return { values, iterations: iter + 1, converged };
}

function signOfEffect(e: PathwayEdge): number {
  switch (e.effect) {
    case 'stimulates':
    case 'converts':
      return +1;
    case 'inhibits':
    case 'feedback-neg':
      return -1;
  }
}

/** Quantize a continuous level into a qualitative bucket for display. */
export function bucketLevel(v: LevelValue): 'very-low' | 'low' | 'normal' | 'high' | 'very-high' {
  if (v <= -2) return 'very-low';
  if (v <= -0.5) return 'low';
  if (v < 0.5) return 'normal';
  if (v < 2) return 'high';
  return 'very-high';
}

/** Qualitative arrow notation used in scenario expectedLabs and the lab panel. */
export function arrowOf(v: LevelValue): '↑↑' | '↑' | '→' | '↓' | '↓↓' {
  const b = bucketLevel(v);
  switch (b) {
    case 'very-low':
      return '↓↓';
    case 'low':
      return '↓';
    case 'normal':
      return '→';
    case 'high':
      return '↑';
    case 'very-high':
      return '↑↑';
  }
}

export function buildBlockedEdgeSet(
  edges: PathwayEdge[],
  activeDrugIds: ReadonlySet<string>,
): Set<EdgeId> {
  const blocked = new Set<EdgeId>();
  for (const e of edges) {
    if (!e.blockedBy) continue;
    for (const d of e.blockedBy) {
      if (activeDrugIds.has(d)) {
        blocked.add(e.id);
        break;
      }
    }
  }
  return blocked;
}

/** Convenience: pull just the nodes flagged as lab values from a result. */
export function labsOf(
  nodes: PathwayNode[],
  result: SimulationResult,
): { node: PathwayNode; value: LevelValue; arrow: ReturnType<typeof arrowOf> }[] {
  return nodes
    .filter((n) => n.isLab)
    .map((n) => ({
      node: n,
      value: result.values[n.id] ?? 0,
      arrow: arrowOf(result.values[n.id] ?? 0),
    }));
}
