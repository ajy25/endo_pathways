import type { AxisId, AxisPathway, PathwayEdge, PathwayNode } from '@/model/types';
import { hpt } from './hpt';
import { hpa } from './hpa';
import { hpg } from './hpg';
import { gh } from './gh';
import { prl } from './prl';
import { adh } from './adh';
import { raas } from './raas';
import { ca } from './ca';
import { glucose } from './glucose';
import { appetite } from './appetite';
import { steroidogenesis } from './steroidogenesis';

const TILE_W = 1900;
const TILE_H = 700;

const AXIS_GRID: Record<Exclude<AxisId, 'overview'>, { col: number; row: number; source: AxisPathway }> = {
  hpt: { col: 0, row: 0, source: hpt },
  hpa: { col: 1, row: 0, source: hpa },
  hpg: { col: 2, row: 0, source: hpg },
  gh: { col: 3, row: 0, source: gh },
  prl: { col: 0, row: 1, source: prl },
  steroidogenesis: { col: 1, row: 1, source: steroidogenesis },
  appetite: { col: 2, row: 1, source: appetite },
  adh: { col: 3, row: 1, source: adh },
  glucose: { col: 0, row: 2, source: glucose },
  raas: { col: 1, row: 2, source: raas },
  ca: { col: 2, row: 2, source: ca },
};

const prefix = (axis: AxisId, id: string) => `${axis}:${id}`;

function relocate(axis: AxisId, col: number, row: number, p: AxisPathway): { nodes: PathwayNode[]; edges: PathwayEdge[] } {
  const dx = col * TILE_W;
  const dy = row * TILE_H;
  const nodes: PathwayNode[] = p.nodes.map((n) => ({
    ...n,
    id: prefix(axis, n.id),
    position: { x: n.position.x + dx, y: n.position.y + dy },
  }));
  const edges: PathwayEdge[] = p.edges.map((e) => ({
    ...e,
    id: prefix(axis, e.id),
    source: prefix(axis, e.source),
    target: prefix(axis, e.target),
  }));
  return { nodes, edges };
}

/**
 * Cross-axis edges — the classic Step-1 interactions that get tested as "this lab
 * doesn't fit the single axis you're studying" questions.
 */
const CROSS_AXIS_EDGES: PathwayEdge[] = [
  {
    id: 'x:trh->prl',
    source: prefix('hpt', 'trh'),
    target: prefix('prl', 'prolactin'),
    effect: 'stimulates',
    weight: 0.6,
    label: 'TRH stim PRL',
  },
  {
    id: 'x:cortisol-|deiodinase',
    source: prefix('hpa', 'cortisol'),
    target: prefix('hpt', 'deiodinase'),
    effect: 'inhibits',
    weight: 0.5,
    label: 'GC shifts T4→rT3',
  },
  {
    id: 'x:cortisol-|gnrh',
    source: prefix('hpa', 'cortisol'),
    target: prefix('hpg', 'gnrh'),
    effect: 'inhibits',
    weight: 0.5,
    label: 'stress amenorrhea',
  },
  {
    id: 'x:estradiol->tbg',
    source: prefix('hpg', 'estradiol'),
    target: prefix('hpt', 'tbg'),
    effect: 'stimulates',
    weight: 0.5,
    label: '↑ TBG (preg/OCP)',
  },
  {
    id: 'x:ghrelin->gh',
    source: prefix('appetite', 'ghrelin'),
    target: prefix('gh', 'gh'),
    effect: 'stimulates',
    weight: 0.4,
    label: 'ghrelin → GH',
  },
  {
    id: 'x:leptin->gnrh',
    source: prefix('appetite', 'leptin'),
    target: prefix('hpg', 'gnrh'),
    effect: 'stimulates',
    weight: 0.4,
    label: 'leptin permits puberty',
  },
  {
    id: 'x:somatostatin-|gh',
    source: prefix('glucose', 'somatostatin'),
    target: prefix('gh', 'gh'),
    effect: 'inhibits',
    weight: 0.5,
    label: 'somatostatin ⊣ GH',
  },
  {
    id: 'x:gh->glucose',
    source: prefix('gh', 'gh'),
    target: prefix('glucose', 'serum-glucose'),
    effect: 'stimulates',
    weight: 0.4,
    label: 'GH diabetogenic',
  },
  {
    id: 'x:adh->pituitary',
    source: prefix('adh', 'adh'),
    target: prefix('hpa', 'pituitary'),
    effect: 'stimulates',
    weight: 0.3,
    label: 'ADH potentiates ACTH',
  },
  {
    id: 'x:aldo-|k',
    source: prefix('raas', 'aldo'),
    target: prefix('glucose', 'serum-k'),
    effect: 'inhibits',
    weight: 0.5,
    label: 'aldo wastes K⁺',
  },
];

function build(): AxisPathway {
  const allNodes: PathwayNode[] = [];
  const allEdges: PathwayEdge[] = [];
  (Object.entries(AXIS_GRID) as [Exclude<AxisId, 'overview'>, (typeof AXIS_GRID)[Exclude<AxisId, 'overview'>]][]).forEach(
    ([axis, { col, row, source }]) => {
      const { nodes, edges } = relocate(axis, col, row, source);
      allNodes.push(...nodes);
      allEdges.push(...edges);
    },
  );
  allEdges.push(...CROSS_AXIS_EDGES);
  return {
    id: 'overview',
    name: 'Overview — all axes',
    shortName: 'Overview',
    blurb:
      'Every axis at once, with the cross-axis links highlighted. Clamp a node anywhere — propagation runs across the whole map, so e.g. clamping cortisol high will shift T4→rT3 in the HPT tile and suppress GnRH in the HPG tile.',
    nodes: allNodes,
    edges: allEdges,
  };
}

export const overview: AxisPathway = build();
