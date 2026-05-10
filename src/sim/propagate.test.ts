import { describe, it, expect } from 'vitest';
import { propagate, bucketLevel, arrowOf } from './propagate';
import type { PathwayEdge, PathwayNode } from '@/model/types';

/**
 * Minimal three-node HPT-like circuit used to verify the simulator in isolation:
 *   TRH (stimulus) → TSH → T4
 *   T4 ⊣ TSH (feedback)
 *   T4 ⊣ TRH (feedback)
 */
function tinyHpt(): { nodes: PathwayNode[]; edges: PathwayEdge[] } {
  const nodes: PathwayNode[] = [
    { id: 'trh', label: 'TRH', axis: 'hpt', kind: 'hormone', description: '', position: { x: 0, y: 0 } },
    { id: 'tsh', label: 'TSH', axis: 'hpt', kind: 'hormone', description: '', position: { x: 0, y: 0 }, isLab: true },
    { id: 't4',  label: 'T4',  axis: 'hpt', kind: 'hormone', description: '', position: { x: 0, y: 0 }, isLab: true },
  ];
  const edges: PathwayEdge[] = [
    { id: 'trh->tsh', source: 'trh', target: 'tsh', effect: 'stimulates', weight: 1 },
    { id: 'tsh->t4',  source: 'tsh', target: 't4',  effect: 'stimulates', weight: 1 },
    { id: 't4-|tsh',  source: 't4',  target: 'tsh', effect: 'feedback-neg', weight: 0.8 },
    { id: 't4-|trh',  source: 't4',  target: 'trh', effect: 'feedback-neg', weight: 0.6 },
  ];
  return { nodes, edges };
}

describe('propagate — feedback fundamentals', () => {
  it('clamping T4 LOW raises TSH and TRH (primary hypothyroidism)', () => {
    const { nodes, edges } = tinyHpt();
    const r = propagate({ nodes, edges, clamps: { t4: -3 } });
    expect(arrowOf(r.values.tsh)).toBe('↑↑');
    expect(arrowOf(r.values.trh)).toMatch(/↑/);
  });

  it('clamping T4 HIGH suppresses TSH and TRH (primary hyperthyroidism / exogenous T4)', () => {
    const { nodes, edges } = tinyHpt();
    const r = propagate({ nodes, edges, clamps: { t4: +3 } });
    expect(arrowOf(r.values.tsh)).toBe('↓↓');
    expect(arrowOf(r.values.trh)).toMatch(/↓/);
  });

  it('clamping TSH LOW drops T4 (central / secondary hypothyroidism)', () => {
    const { nodes, edges } = tinyHpt();
    const r = propagate({ nodes, edges, clamps: { tsh: -3 } });
    expect(arrowOf(r.values.t4)).toMatch(/↓/);
  });

  it('clamping TSH HIGH raises T4 — and the high T4 then suppresses TRH', () => {
    const { nodes, edges } = tinyHpt();
    const r = propagate({ nodes, edges, clamps: { tsh: +3 } });
    expect(arrowOf(r.values.t4)).toMatch(/↑/);
    // Feedback: T4 high suppresses TRH (TSH is clamped, so it stays high).
    expect(r.values.trh).toBeLessThan(0);
  });

  it('clamping TRH HIGH raises both TSH and T4 (tertiary hyperthyroidism, hypothetical)', () => {
    const { nodes, edges } = tinyHpt();
    const r = propagate({ nodes, edges, clamps: { trh: +3 } });
    expect(r.values.tsh).toBeGreaterThan(0);
    expect(r.values.t4).toBeGreaterThan(0);
  });

  it('converges in a small number of iterations', () => {
    const { nodes, edges } = tinyHpt();
    const r = propagate({ nodes, edges, clamps: { t4: -2 } });
    expect(r.converged).toBe(true);
    expect(r.iterations).toBeLessThan(50);
  });
});

describe('bucket / arrow helpers', () => {
  it('buckets level values correctly', () => {
    expect(bucketLevel(-3)).toBe('very-low');
    expect(bucketLevel(-1)).toBe('low');
    expect(bucketLevel(0)).toBe('normal');
    expect(bucketLevel(1)).toBe('high');
    expect(bucketLevel(3)).toBe('very-high');
  });
});
