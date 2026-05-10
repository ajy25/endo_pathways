import type { AxisPathway } from '@/model/types';

/**
 * Calcium / phosphate homeostasis.
 *
 * PTH (chief cells) responds to ↓ ionized Ca²⁺ and ↓ Mg²⁺ (mild; severe ↓ Mg suppresses).
 *  → ↑ bone resorption (RANK-L on osteoblasts → osteoclasts)
 *  → ↑ DCT Ca²⁺ reabsorption
 *  → ↓ PCT phosphate reabsorption (phosphate trashing)
 *  → ↑ 1α-hydroxylase → ↑ calcitriol
 *
 * Calcitriol (1,25-(OH)2 D3): ↑ gut Ca²⁺ AND PO₄³⁻ absorption; ↑ bone resorption synergistically with PTH.
 * Calcitonin (C cells): mild ↓ bone resorption. Not important physiologically.
 * PTHrP (paraneoplastic, esp. squamous cell lung): mimics PTH but doesn't ↑ calcitriol.
 */
export const ca: AxisPathway = {
  id: 'ca',
  name: 'Calcium & phosphate homeostasis',
  shortName: 'Calcium / PO₄',
  blurb:
    'PTH is the master regulator: it raises Ca²⁺ and lowers PO₄³⁻. Calcitriol (active vitamin D) is the gut absorber, made from 25-OH-D via 1α-hydroxylase (which PTH activates). Calcitonin is a minor counter-regulator. PTHrP causes humoral hypercalcemia of malignancy.',
  nodes: [
    { id: 'low-ca-stim', label: '↓ ionized Ca²⁺', axis: 'ca', kind: 'stimulus', description: 'Primary regulator of PTH. Detected by calcium-sensing receptor (CaSR) on parathyroid chief cells.', position: { x: 60, y: 100 } },
    { id: 'low-mg-stim', label: 'Mild ↓ Mg²⁺', axis: 'ca', kind: 'stimulus', description: 'Mild hypomagnesemia ↑ PTH; *severe* hypomagnesemia paradoxically *suppresses* PTH secretion (think alcoholics, aminoglycosides).', position: { x: 60, y: 220 } },
    { id: 'parathyroid', label: 'Parathyroid', axis: 'ca', kind: 'gland', description: 'Four glands behind the thyroid. Chief cells secrete PTH continuously, modulated by ionized Ca²⁺ via the CaSR.', position: { x: 260, y: 160 } },
    { id: 'pth', label: 'PTH', axis: 'ca', kind: 'hormone', description: 'Parathyroid hormone — "phosphate-trashing hormone." ↑ bone resorption (via RANK-L), ↑ DCT Ca²⁺ reabsorption, ↓ PCT phosphate reabsorption, ↑ 1α-hydroxylase.', mnemonic: 'PTH = Phosphate-Trashing Hormone.', position: { x: 460, y: 160 }, isLab: true, units: 'pg/mL' },
    { id: 'pthrp', label: 'PTHrP', axis: 'ca', kind: 'stimulus', description: 'Mimics PTH (binds same receptor) but is *not* under feedback control of Ca²⁺. Secreted by squamous cell lung cancer, RCC, breast cancer → humoral hypercalcemia of malignancy.', position: { x: 460, y: 60 } },
    { id: 'kidney-d', label: '1α-hydroxylase (kidney)', axis: 'ca', kind: 'enzyme', description: 'Proximal tubule enzyme. Converts inactive 25-OH-D → active calcitriol. ↑ by PTH and ↓ PO₄³⁻; ↓ by FGF23 and ↑ Ca²⁺.', position: { x: 660, y: 240 } },
    { id: 'calcitriol', label: '1,25-(OH)2 D3 (calcitriol)', axis: 'ca', kind: 'hormone', description: 'Active vitamin D. ↑ gut absorption of Ca²⁺ AND PO₄³⁻. Synergizes with PTH on bone. Nuclear receptor (intracellular).', position: { x: 860, y: 240 }, isLab: true, units: 'pg/mL' },
    { id: 'gut', label: 'Gut absorption', axis: 'ca', kind: 'target', description: 'Calcitriol-driven. ↑ Ca²⁺ AND PO₄³⁻ absorption in the small intestine.', position: { x: 1080, y: 240 } },
    { id: 'bone', label: 'Bone resorption', axis: 'ca', kind: 'target', description: 'Osteoblasts express RANK-L → activates osteoclasts → ↑ Ca²⁺ and PO₄³⁻ release. Driven by PTH and calcitriol.', position: { x: 1080, y: 100 } },
    { id: 'dct', label: 'DCT Ca²⁺ reabsorption', axis: 'ca', kind: 'target', description: 'PTH-stimulated; ↑ serum Ca²⁺ without phosphate (the kidney is selective).', position: { x: 660, y: 100 } },
    { id: 'pct', label: 'PCT PO₄³⁻ reabsorption ↓', axis: 'ca', kind: 'target', description: 'PTH inhibits NPT2a in PCT → phosphaturia → ↓ serum PO₄³⁻. Hallmark of primary hyperparathyroidism.', position: { x: 860, y: 100 } },
    { id: 'calcitonin', label: 'Calcitonin', axis: 'ca', kind: 'hormone', description: 'C cells (parafollicular) of thyroid. ↓ bone resorption. Minor in adult Ca²⁺ homeostasis; useful tumor marker (medullary thyroid carcinoma).', position: { x: 460, y: 360 } },
    { id: 'serum-ca', label: 'Serum Ca²⁺', axis: 'ca', kind: 'lab', description: 'The integrated output. Hypercalcemia: "stones, bones, groans, psychiatric overtones." Hypocalcemia: tetany, Chvostek, Trousseau.', position: { x: 1300, y: 100 }, isLab: true, units: 'mg/dL' },
    { id: 'serum-po4', label: 'Serum PO₄³⁻', axis: 'ca', kind: 'lab', description: 'Inverse to PTH activity. Low PO₄³⁻ + high Ca²⁺ + high PTH = 1° hyperparathyroidism. High PO₄³⁻ + low Ca²⁺ + high PTH = CKD-MBD / pseudohypoPTH / 2° hyperparathyroidism.', position: { x: 1300, y: 200 }, isLab: true, units: 'mg/dL' },
    { id: 'urine-camp', label: 'Urine cAMP', axis: 'ca', kind: 'lab', description: 'PTH activates Gs at PCT → ↑ cAMP excretion. ↑ in hyperparathyroidism; absent response in pseudohypoPTH type 1a (Albright).', position: { x: 1300, y: 300 }, isLab: true },
  ],
  edges: [
    { id: 'low-ca-|pth', source: 'low-ca-stim', target: 'pth', effect: 'stimulates', weight: 1.0, label: 'CaSR' },
    { id: 'low-mg->pth', source: 'low-mg-stim', target: 'pth', effect: 'stimulates', weight: 0.5 },
    { id: 'parathyroid->pth', source: 'parathyroid', target: 'pth', effect: 'stimulates', weight: 1.0 },
    { id: 'pthrp->bone', source: 'pthrp', target: 'bone', effect: 'stimulates', weight: 1.0, label: 'mimics PTH' },
    { id: 'pthrp->dct', source: 'pthrp', target: 'dct', effect: 'stimulates', weight: 1.0 },
    { id: 'pthrp->pct', source: 'pthrp', target: 'pct', effect: 'stimulates', weight: 1.0 },
    { id: 'pth->bone', source: 'pth', target: 'bone', effect: 'stimulates', weight: 1.0 },
    { id: 'pth->dct', source: 'pth', target: 'dct', effect: 'stimulates', weight: 1.0 },
    { id: 'pth->pct', source: 'pth', target: 'pct', effect: 'stimulates', weight: 1.0 },
    { id: 'pth->kidney-d', source: 'pth', target: 'kidney-d', effect: 'stimulates', weight: 1.0 },
    { id: 'kidney-d->calcitriol', source: 'kidney-d', target: 'calcitriol', effect: 'stimulates', weight: 1.0 },
    { id: 'calcitriol->gut', source: 'calcitriol', target: 'gut', effect: 'stimulates', weight: 1.0 },
    { id: 'calcitriol->bone-syn', source: 'calcitriol', target: 'bone', effect: 'stimulates', weight: 0.5 },
    { id: 'gut->serum-ca', source: 'gut', target: 'serum-ca', effect: 'stimulates', weight: 0.8 },
    { id: 'gut->serum-po4', source: 'gut', target: 'serum-po4', effect: 'stimulates', weight: 0.8 },
    { id: 'bone->serum-ca', source: 'bone', target: 'serum-ca', effect: 'stimulates', weight: 1.0 },
    { id: 'bone->serum-po4', source: 'bone', target: 'serum-po4', effect: 'stimulates', weight: 1.0 },
    { id: 'dct->serum-ca', source: 'dct', target: 'serum-ca', effect: 'stimulates', weight: 0.8 },
    { id: 'pct-|serum-po4', source: 'pct', target: 'serum-po4', effect: 'inhibits', weight: 2.5 },
    { id: 'pth->urine-camp', source: 'pth', target: 'urine-camp', effect: 'stimulates', weight: 1.0 },
    { id: 'calcitonin-|bone', source: 'calcitonin', target: 'bone', effect: 'inhibits', weight: 0.5 },
    // Feedback: high serum Ca²⁺ ⊣ PTH
    { id: 'serum-ca-|pth', source: 'serum-ca', target: 'pth', effect: 'feedback-neg', weight: 1.0 },
    { id: 'serum-ca->calcitonin-fb', source: 'serum-ca', target: 'calcitonin', effect: 'stimulates', weight: 0.5 },
  ],
};
