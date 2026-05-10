import type { AxisPathway } from '@/model/types';

/**
 * Adrenal steroidogenesis — substrate–product chain view.
 *
 * Cholesterol → Pregnenolone (cholesterol desmolase, rate-limiting, ACTH-driven)
 *   → 17α: Pregnenolone → 17-OH-pregnenolone → DHEA (sex hormones)
 *   → 3β:  Pregnenolone → Progesterone
 *   → Progesterone → 11-deoxycorticosterone (21-OH) → Corticosterone (11β-OH) → Aldosterone
 *   → 17-OH-Pregnenolone → 17-OH-Progesterone (3β-HSD) → 11-deoxycortisol (21-OH) → Cortisol (11β-OH)
 *
 * Enzyme deficiencies (CAH):
 *  - 17α-hydroxylase: HTN, hypokalemia, no sex hormones (XY: atypical genitalia)
 *  - 21-hydroxylase (most common): salt-wasting, virilization, ↑ 17-OH-progesterone
 *  - 11β-hydroxylase: HTN (from 11-DOC), virilization
 *
 * Modeled by representing enzymes as nodes with default baseline = +2 (active).
 * Substrates flow forward via "converts" edges; when an enzyme is clamped to -3 (ablated),
 * its outgoing conversions die and its upstream products accumulate (via separate
 * "pool" edges that route substrate back when downstream conversion is blocked).
 */
export const steroidogenesis: AxisPathway = {
  id: 'steroidogenesis',
  name: 'Adrenal steroidogenesis (CAH)',
  shortName: 'Steroidogenesis',
  blurb:
    'The chemistry pathway from cholesterol to the three adrenal product classes: mineralocorticoids (aldosterone), glucocorticoids (cortisol), and androgens (DHEA → testosterone/estradiol). Click an enzyme to ablate it and see the CAH phenotype.',
  nodes: [
    { id: 'acth-in', label: 'ACTH (input)', axis: 'steroidogenesis', kind: 'stimulus', description: 'Drives cholesterol desmolase (StAR), the rate-limiting step. Elevated in all CAH (loss of cortisol feedback) → adrenal hyperplasia.', position: { x: 60, y: 200 }, baseline: 0 },
    { id: 'cholesterol', label: 'Cholesterol', axis: 'steroidogenesis', kind: 'hormone', description: 'Starting substrate for all steroid hormones.', position: { x: 260, y: 200 }, baseline: 0 },
    { id: 'desmolase', label: 'Cholesterol desmolase', axis: 'steroidogenesis', kind: 'enzyme', description: 'Rate-limiting enzyme. ACTH-regulated. Inhibited by ketoconazole.', position: { x: 460, y: 200 }, baseline: 1 },

    { id: 'pregnenolone', label: 'Pregnenolone', axis: 'steroidogenesis', kind: 'hormone', description: 'Branchpoint: 17α-hydroxylase → 17-OH-pregnenolone (sex hormones); 3β-HSD → progesterone (mineralo/gluco).', position: { x: 660, y: 200 }, baseline: 0 },

    { id: 'enzyme17a', label: '17α-hydroxylase', axis: 'steroidogenesis', kind: 'enzyme', description: 'Adds OH at C17 and (with 17,20-lyase activity) cleaves to make androgens. Deficiency → no sex hormones + HTN/hypokalemia from accumulated 11-DOC.', position: { x: 860, y: 80 }, baseline: 1 },
    { id: 'enzyme3b', label: '3β-HSD', axis: 'steroidogenesis', kind: 'enzyme', description: '3β-hydroxysteroid dehydrogenase. Moves Δ5 → Δ4. Deficiency rare.', position: { x: 860, y: 280 }, baseline: 1 },

    { id: 'oh-pregnenolone', label: '17-OH-pregnenolone', axis: 'steroidogenesis', kind: 'hormone', description: '17α-hydroxylated. Substrate for DHEA via 17,20-lyase.', position: { x: 1060, y: 80 }, baseline: 0 },
    { id: 'progesterone', label: 'Progesterone', axis: 'steroidogenesis', kind: 'hormone', description: 'Substrate for mineralocorticoid branch via 21-hydroxylase.', position: { x: 1060, y: 280 }, baseline: 0 },

    { id: 'dhea', label: 'DHEA', axis: 'steroidogenesis', kind: 'hormone', description: 'Adrenal androgen. Substrate for downstream testosterone and estrogen in peripheral tissue.', position: { x: 1260, y: 80 }, isLab: true, baseline: 0 },
    { id: 'oh-progesterone', label: '17-OH-progesterone', axis: 'steroidogenesis', kind: 'hormone', description: '↑↑ is the screening lab for 21-hydroxylase deficiency (most common CAH).', position: { x: 1260, y: 180 }, isLab: true, baseline: 0 },

    { id: 'enzyme21', label: '21-hydroxylase', axis: 'steroidogenesis', kind: 'enzyme', description: 'Most common cause of CAH (~90%). Deficiency → ↓ aldo (salt wasting), ↓ cortisol, ↑ androgens (virilization).', position: { x: 1460, y: 280 }, baseline: 1 },

    { id: 'deoxy-cortico', label: '11-deoxycorticosterone', axis: 'steroidogenesis', kind: 'hormone', description: 'Weak mineralocorticoid. Accumulates in 11β-OH and 17α-OH deficiency → HTN.', position: { x: 1660, y: 380 }, baseline: 0 },
    { id: 'deoxy-cortisol', label: '11-deoxycortisol', axis: 'steroidogenesis', kind: 'hormone', description: 'Substrate for 11β-hydroxylation to cortisol.', position: { x: 1660, y: 180 }, baseline: 0 },

    { id: 'enzyme11b', label: '11β-hydroxylase', axis: 'steroidogenesis', kind: 'enzyme', description: 'Deficiency → no cortisol, no aldosterone, but 11-DOC accumulates → HTN (mineralocorticoid) and virilization.', position: { x: 1860, y: 280 }, baseline: 1 },

    { id: 'corticosterone', label: 'Corticosterone', axis: 'steroidogenesis', kind: 'hormone', description: 'Mineralocorticoid intermediate. Substrate for aldosterone synthase.', position: { x: 2060, y: 380 }, baseline: 0 },
    { id: 'cortisol', label: 'Cortisol', axis: 'steroidogenesis', kind: 'hormone', description: 'Major glucocorticoid. Adrenal zona fasciculata product.', position: { x: 2060, y: 180 }, isLab: true, units: 'µg/dL', baseline: 0 },

    { id: 'aldo-synthase', label: 'Aldosterone synthase', axis: 'steroidogenesis', kind: 'enzyme', description: 'Zona glomerulosa-specific. Driven by angiotensin II, not ACTH.', position: { x: 2260, y: 380 }, baseline: 1 },
    { id: 'aldosterone', label: 'Aldosterone', axis: 'steroidogenesis', kind: 'hormone', description: 'Final mineralocorticoid. Low in 17α and 21 deficiencies (salt wasting); functionally low in 11β-OH (but HTN from 11-DOC).', position: { x: 2460, y: 380 }, isLab: true, units: 'ng/dL', baseline: 0 },
  ],
  edges: [
    { id: 'acth->desmolase', source: 'acth-in', target: 'desmolase', effect: 'stimulates', weight: 1.0 },
    { id: 'cholesterol->desmolase', source: 'cholesterol', target: 'desmolase', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: 'desmolase->pregnenolone', source: 'desmolase', target: 'pregnenolone', effect: 'converts', weight: 1.0 },

    // From pregnenolone: two branches via 17α and 3β
    { id: 'pregnenolone->17a', source: 'pregnenolone', target: 'enzyme17a', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: 'pregnenolone->3b', source: 'pregnenolone', target: 'enzyme3b', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: '17a->oh-pregnenolone', source: 'enzyme17a', target: 'oh-pregnenolone', effect: 'converts', weight: 1.0 },
    { id: '3b->progesterone', source: 'enzyme3b', target: 'progesterone', effect: 'converts', weight: 1.0 },

    // From OH-pregnenolone: 17,20-lyase to DHEA; route 3β-HSD activity through the enzyme node
    { id: 'oh-pregnenolone->17a-lyase', source: 'oh-pregnenolone', target: 'enzyme17a', effect: 'stimulates', weight: 0.3, label: 'substrate (17,20-lyase)' },
    { id: '17a->dhea', source: 'enzyme17a', target: 'dhea', effect: 'converts', weight: 0.7 },
    { id: 'oh-pregnenolone->3b', source: 'oh-pregnenolone', target: 'enzyme3b', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: '3b->oh-progesterone', source: 'enzyme3b', target: 'oh-progesterone', effect: 'converts', weight: 1.0 },

    // From progesterone: 17α-OH gives OH-progesterone too — must route through 17α enzyme node
    { id: 'progesterone->17a', source: 'progesterone', target: 'enzyme17a', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: '17a->oh-progesterone', source: 'enzyme17a', target: 'oh-progesterone', effect: 'converts', weight: 0.7 },

    // 21-hydroxylase branches both ways
    { id: 'progesterone->21', source: 'progesterone', target: 'enzyme21', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: 'oh-progesterone->21', source: 'oh-progesterone', target: 'enzyme21', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: '21->deoxy-cortico', source: 'enzyme21', target: 'deoxy-cortico', effect: 'converts', weight: 1.0 },
    { id: '21->deoxy-cortisol', source: 'enzyme21', target: 'deoxy-cortisol', effect: 'converts', weight: 1.0 },

    // 11β
    { id: 'deoxy-cortisol->11b', source: 'deoxy-cortisol', target: 'enzyme11b', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: 'deoxy-cortico->11b', source: 'deoxy-cortico', target: 'enzyme11b', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: '11b->cortisol', source: 'enzyme11b', target: 'cortisol', effect: 'converts', weight: 1.0 },
    { id: '11b->corticosterone', source: 'enzyme11b', target: 'corticosterone', effect: 'converts', weight: 1.0 },

    // Aldo synthase
    { id: 'corticosterone->aldo-synthase', source: 'corticosterone', target: 'aldo-synthase', effect: 'stimulates', weight: 1.0 },
    { id: 'aldo-synthase->aldosterone', source: 'aldo-synthase', target: 'aldosterone', effect: 'converts', weight: 1.0 },
  ],
  defaultClamps: {
    'acth-in': 0.5,
    cholesterol: 1.5,
  },
};
