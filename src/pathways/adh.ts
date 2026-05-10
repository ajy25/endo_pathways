import type { AxisPathway } from '@/model/types';

/**
 * ADH axis (posterior pituitary).
 *
 * Stimuli: ↑ plasma osmolality (1°), ↓ volume / ↓ BP (2°, via baroreceptors).
 * ADH (V2 on collecting duct → aquaporin insertion → water reabsorption).
 * V1 on vascular smooth muscle → vasoconstriction (used in septic shock).
 *
 * SIADH: clamp ADH high → ↑ urine osm, ↓ serum osm, hyponatremia.
 * Central DI: clamp ADH low (pituitary lesion).
 * Nephrogenic DI: collecting duct doesn't respond — drugs: lithium, demeclocycline,
 *   or hypercalcemia / hypokalemia. Model as block of ADH → V2 receptor edge.
 */
export const adh: AxisPathway = {
  id: 'adh',
  name: 'ADH (vasopressin) axis',
  shortName: 'ADH',
  blurb:
    'ADH is released from the posterior pituitary in response to ↑ plasma osmolality (primary) or ↓ volume. It opens aquaporin channels in the renal collecting duct, concentrating the urine. SIADH = too much. Central DI = none. Nephrogenic DI = kidney ignores it.',
  nodes: [
    { id: 'osmolality', label: 'Plasma osmolality ↑', axis: 'adh', kind: 'stimulus', description: 'Primary stimulus. Osmoreceptors in the anterior hypothalamus detect ↑ tonicity → ↑ ADH and thirst.', position: { x: 60, y: 100 } },
    { id: 'volume', label: 'Volume / BP ↓', axis: 'adh', kind: 'stimulus', description: 'Secondary stimulus via carotid and aortic baroreceptors. Less sensitive than osmotic input but dominant in hypovolemia.', position: { x: 60, y: 280 } },
    { id: 'hypothalamus', label: 'Hypothalamus', axis: 'adh', kind: 'gland', description: 'Supraoptic and paraventricular nuclei synthesize ADH; transported via neurophysins down the infundibulum to the posterior pituitary for release.', position: { x: 260, y: 200 } },
    { id: 'pituitary', label: 'Posterior pituitary', axis: 'adh', kind: 'gland', description: 'Storage and release site for ADH (and oxytocin). Derived from neuroectoderm.', position: { x: 460, y: 200 } },
    {
      id: 'adh',
      label: 'ADH (vasopressin)',
      axis: 'adh',
      kind: 'hormone',
      description: 'V2 (Gs/cAMP) on principal cells → aquaporin-2 insertion → water reabsorption. V1 (Gq/IP3) on vascular smooth muscle → vasoconstriction. Desmopressin = V2-selective analog.',
      position: { x: 660, y: 200 },
      isLab: true,
      units: 'pg/mL',
    },
    { id: 'kidney', label: 'Collecting duct', axis: 'adh', kind: 'target', description: 'Principal cells insert aquaporin-2 into the apical membrane in response to V2 activation → water reabsorption from collecting duct lumen.', position: { x: 880, y: 140 } },
    { id: 'vessels', label: 'Vascular smooth muscle', axis: 'adh', kind: 'target', description: 'V1-mediated vasoconstriction. Therapeutic use: vasopressin infusion to ↑ MAP in distributive shock.', position: { x: 880, y: 280 } },
    { id: 'urine-osm', label: 'Urine osmolality', axis: 'adh', kind: 'lab', description: '↑ with ADH activity (concentrated urine). Maximally concentrated ~1200 mOsm/kg.', position: { x: 1100, y: 100 }, isLab: true },
    { id: 'urine-vol', label: 'Urine volume', axis: 'adh', kind: 'lab', description: '↓ with ADH activity. ↑↑ in diabetes insipidus (>3 L/day, dilute).', position: { x: 1100, y: 180 }, isLab: true },
    { id: 'serum-na', label: 'Serum Na⁺', axis: 'adh', kind: 'lab', description: '↓ with ADH excess (water retention dilutes Na⁺ — euvolemic hyponatremia in SIADH). ↑ in DI (free water loss).', position: { x: 1100, y: 260 }, isLab: true, units: 'mEq/L' },
    { id: 'serum-osm', label: 'Serum osmolality', axis: 'adh', kind: 'lab', description: '↓ with ADH excess (SIADH). ↑ in DI (free water loss → hypernatremia).', position: { x: 1100, y: 340 }, isLab: true },
  ],
  edges: [
    { id: 'osmolality->hypothalamus', source: 'osmolality', target: 'hypothalamus', effect: 'stimulates', weight: 1.0 },
    { id: 'volume-|hypothalamus', source: 'volume', target: 'hypothalamus', effect: 'inhibits', weight: 0.6 },
    { id: 'hypothalamus->pituitary', source: 'hypothalamus', target: 'pituitary', effect: 'stimulates', weight: 1.0 },
    { id: 'pituitary->adh', source: 'pituitary', target: 'adh', effect: 'stimulates', weight: 1.0 },
    { id: 'adh->kidney', source: 'adh', target: 'kidney', effect: 'stimulates', weight: 1.0, label: 'V2', blockedBy: ['lithium', 'demeclocycline', 'conivaptan', 'tolvaptan'] },
    { id: 'adh->vessels', source: 'adh', target: 'vessels', effect: 'stimulates', weight: 0.7, label: 'V1' },
    { id: 'kidney->urine-osm', source: 'kidney', target: 'urine-osm', effect: 'stimulates', weight: 1.0 },
    { id: 'kidney-|urine-vol', source: 'kidney', target: 'urine-vol', effect: 'inhibits', weight: 1.0 },
    { id: 'kidney-|serum-osm', source: 'kidney', target: 'serum-osm', effect: 'inhibits', weight: 1.0 },
    { id: 'kidney-|serum-na', source: 'kidney', target: 'serum-na', effect: 'inhibits', weight: 1.0 },
    // Feedback: water retention lowers osmolality, reducing the drive
    { id: 'serum-osm->osmolality-fb', source: 'serum-osm', target: 'osmolality', effect: 'stimulates', weight: 0.3, label: 'feedback' },
  ],
};
