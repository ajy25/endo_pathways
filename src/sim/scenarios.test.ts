/**
 * Scenario-level tests: each disease bundle is applied to its full pathway
 * and the resulting lab values are checked against clinical truth.
 *
 * If a scenario fails here, either:
 *  (a) the scenario clamps are wrong, or
 *  (b) the pathway graph encodes the biology incorrectly.
 *
 * The fix is in the data, never in the test.
 */
import { describe, it, expect } from 'vitest';
import { propagate, arrowOf, buildBlockedEdgeSet } from './propagate';
import { scenarios, getScenario } from '@/scenarios';
import { getPathway } from '@/pathways';
import { getDrug } from '@/drugs';
import type { AxisPathway, NodeId } from '@/model/types';

function runScenario(pathway: AxisPathway, scenarioId: string) {
  const sc = getScenario(scenarioId);
  if (!sc) throw new Error(`scenario ${scenarioId} not found`);
  const drugIds = new Set(sc.drugs ?? []);
  const drugClamps: Record<NodeId, number> = {};
  for (const d of drugIds) {
    const drug = getDrug(d);
    if (drug?.clamps) Object.assign(drugClamps, drug.clamps);
  }
  const result = propagate({
    nodes: pathway.nodes,
    edges: pathway.edges,
    clamps: { ...(pathway.defaultClamps ?? {}), ...drugClamps, ...sc.clamps },
    blockedEdges: buildBlockedEdgeSet(pathway.edges, drugIds),
  });
  return { sc, result };
}

function expectArrow(actualArrow: string, expected: string | undefined, context: string) {
  if (!expected) return;
  const ranks: Record<string, number> = { '↓↓': -2, '↓': -1, '→': 0, '↑': 1, '↑↑': 2 };
  const a = ranks[actualArrow];
  const e = ranks[expected];
  // Allow within one bucket; sign must match (no flipped directions).
  expect(Math.abs(a - e), `${context}: got ${actualArrow}, expected ${expected}`).toBeLessThanOrEqual(1);
  if (e !== 0) {
    expect(Math.sign(a), `${context}: sign mismatch (got ${actualArrow}, expected ${expected})`).toBe(Math.sign(e));
  }
}

describe('scenario library — all axes', () => {
  for (const sc of scenarios) {
    it(`${sc.axis}/${sc.id} produces clinically expected labs`, () => {
      const pathway = getPathway(sc.axis);
      if (!pathway) throw new Error(`pathway ${sc.axis} not found`);
      const { result } = runScenario(pathway, sc.id);
      for (const [nodeId, expected] of Object.entries(sc.expectedLabs)) {
        const v = result.values[nodeId];
        expect(v, `${sc.id}: node ${nodeId} not in result`).toBeDefined();
        expectArrow(arrowOf(v), expected, `${sc.id}:${nodeId}`);
      }
    });
  }
});
