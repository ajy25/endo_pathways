import type { AxisPathway } from '@/model/types';

/**
 * HPT axis: hypothalamus → pituitary → thyroid → peripheral tissues.
 *
 * TRH ⊕ TSH ⊕ Thyroid → T4 (mostly) and T3 (some).
 * Peripheral 5′-deiodinase converts T4 → T3 (and rT3, inactive).
 * Negative feedback: free T3/T4 → ⊣ TSH (pituitary) and ⊣ TRH (hypothalamus).
 * Graves: TSI ⊕ thyroid (TSH-independent). Hashimoto: auto-destruction of thyroid.
 *
 * Positions are laid out on a left-to-right hierarchy in qualitative pixel units.
 */
export const hpt: AxisPathway = {
  id: 'hpt',
  name: 'Hypothalamic–Pituitary–Thyroid axis',
  shortName: 'HPT axis',
  blurb:
    'TRH drives TSH, which drives the thyroid to release T4 and T3. Peripheral conversion of T4 to T3 amplifies the active signal. Negative feedback by free T3/T4 closes the loop at both the pituitary and the hypothalamus.',
  nodes: [
    {
      id: 'hypothalamus',
      label: 'Hypothalamus',
      axis: 'hpt',
      kind: 'gland',
      description: 'Source of TRH. Senses circulating free T3/T4 and adjusts TRH output to maintain euthyroid state.',
      position: { x: 60, y: 200 },
    },
    {
      id: 'trh',
      label: 'TRH',
      axis: 'hpt',
      kind: 'hormone',
      description:
        'Thyrotropin-releasing hormone. Stimulates TSH (and prolactin) release from the anterior pituitary. Elevated TRH in primary hypothyroidism contributes to hyperprolactinemia.',
      clinicalNotes: ['↑ TRH in 1° or 2° hypothyroidism may ↑ prolactin → galactorrhea.'],
      position: { x: 230, y: 200 },
      isLab: false,
    },
    {
      id: 'pituitary',
      label: 'Anterior pituitary',
      axis: 'hpt',
      kind: 'gland',
      description: 'Releases TSH from thyrotroph (basophil) cells in response to TRH. Free T3/T4 ↓ pituitary sensitivity to TRH.',
      position: { x: 400, y: 200 },
    },
    {
      id: 'tsh',
      label: 'TSH',
      axis: 'hpt',
      kind: 'hormone',
      short: 'TSH',
      description:
        'Thyroid-stimulating hormone. Binds Gs-coupled TSH receptor on thyroid follicular cells → ↑ cAMP → ↑ iodide uptake, organification, T4/T3 synthesis and release, and follicular cell growth.',
      mnemonic: 'B-FLAT (basophils): FSH, LH, ACTH, TSH.',
      clinicalNotes: [
        'Primary hypothyroidism: ↑ TSH, ↓ free T4.',
        'Primary hyperthyroidism: ↓ TSH, ↑ free T4 (Graves: TSI mimics TSH).',
        'Central (2°) hypothyroidism: ↓ TSH, ↓ free T4.',
      ],
      position: { x: 580, y: 200 },
      isLab: true,
      units: 'mIU/L',
    },
    {
      id: 'thyroid',
      label: 'Thyroid gland',
      axis: 'hpt',
      kind: 'gland',
      description:
        'Follicular cells synthesize T4 (majority) and T3 from iodinated thyroglobulin via thyroid peroxidase (organification + coupling). Parafollicular C cells release calcitonin (separate axis).',
      clinicalNotes: ['Wolff-Chaikoff: acute iodine excess transiently ↓ TPO. Jod-Basedow: iodine excess in nodular goiter → ↑ T4.'],
      position: { x: 770, y: 200 },
    },
    {
      id: 'tsi',
      label: 'TSI',
      axis: 'hpt',
      kind: 'stimulus',
      description:
        'Thyroid-stimulating immunoglobulin: autoantibody to the TSH receptor. Continuously activates the receptor, driving hyperthyroidism independent of TSH. Defines Graves disease.',
      position: { x: 770, y: 60 },
    },
    {
      id: 't4',
      label: 'T4 (thyroxine)',
      axis: 'hpt',
      kind: 'hormone',
      description:
        'The major secreted thyroid hormone, but largely a prohormone. Bound to TBG in circulation; only free T4 is active. Converted in peripheral tissues to T3 (active) or rT3 (inactive) by 5′-deiodinase.',
      clinicalNotes: ['Free T4 is the lab to follow in pregnancy and other ↑ TBG states (total T4 misleading).'],
      position: { x: 950, y: 140 },
      isLab: true,
      units: 'ng/dL',
    },
    {
      id: 'deiodinase',
      label: "5′-deiodinase",
      axis: 'hpt',
      kind: 'enzyme',
      description:
        'Peripheral enzyme that converts T4 → T3 (active). Inhibited by glucocorticoids, β-blockers (high-dose propranolol), propylthiouracil, and severe illness — diverting flux to rT3 (sick euthyroid).',
      position: { x: 1130, y: 140 },
    },
    {
      id: 'deiodinase5',
      label: '5-deiodinase',
      axis: 'hpt',
      kind: 'enzyme',
      description:
        'Peripheral enzyme that converts T4 → rT3 (inactive). Relatively up-regulated in stress/illness and glucocorticoid excess — when 5′-deiodinase is suppressed, T4 is shunted here to rT3.',
      position: { x: 1130, y: 280 },
    },
    {
      id: 't3',
      label: 'T3 (active)',
      axis: 'hpt',
      kind: 'hormone',
      description:
        'The metabolically active thyroid hormone. Binds nuclear thyroid hormone receptor with higher affinity than T4. Drives the 7 B effects: brain maturation, bone growth, β-adrenergic, basal metabolic rate, blood sugar, breakdown of lipids, baby surfactant.',
      position: { x: 1320, y: 140 },
      isLab: true,
      units: 'pg/dL',
    },
    {
      id: 'rt3',
      label: 'rT3 (inactive)',
      axis: 'hpt',
      kind: 'hormone',
      description: 'Reverse T3. Metabolically inactive byproduct of peripheral T4 metabolism. Elevated in sick euthyroid syndrome, glucocorticoid excess, GH excess.',
      position: { x: 1320, y: 260 },
      isLab: true,
    },
    {
      id: 'bmr',
      label: 'Basal metabolic rate',
      axis: 'hpt',
      kind: 'target',
      description:
        'T3 ↑ Na⁺/K⁺-ATPase activity → ↑ O₂ consumption → ↑ heat. Hyperthyroidism: heat intolerance, ↑ HR, weight loss. Hypothyroidism: cold intolerance, bradycardia, weight gain.',
      position: { x: 1500, y: 40 },
    },
    {
      id: 'cardiac',
      label: 'β-adrenergic / cardiac',
      axis: 'hpt',
      kind: 'target',
      description:
        'T3 ↑ number and sensitivity of β1 receptors → ↑ HR, contractility, CO. Tachycardia and AFib in hyperthyroidism; bradycardia and ↓ CO in hypothyroidism.',
      position: { x: 1500, y: 140 },
    },
    {
      id: 'bone',
      label: 'Bone & growth',
      axis: 'hpt',
      kind: 'target',
      description:
        'T3 synergizes with GH and IGF-1 to drive linear growth and bone maturation. Hyperthyroidism ↑ osteoclast activity → osteoporosis. Hypothyroidism in children → cretinism.',
      position: { x: 1500, y: 240 },
    },
    {
      id: 'lipids',
      label: 'Lipids / cholesterol',
      axis: 'hpt',
      kind: 'target',
      description:
        'T3 ↑ hepatic LDL receptor expression → ↓ serum LDL. Hypothyroidism: hypercholesterolemia.',
      position: { x: 1500, y: 340 },
      isLab: true,
    },
    {
      id: 'tbg',
      label: 'TBG',
      axis: 'hpt',
      kind: 'second-messenger',
      description:
        'Thyroxine-binding globulin. Carries the majority of circulating T3/T4 (bound = inactive). ↑ in pregnancy/OCP (estrogen) → ↑ total but unchanged free T4. ↓ in nephrotic syndrome, steroid use.',
      position: { x: 950, y: 340 },
    },
  ],
  edges: [
    { id: 'hypothalamus->trh', source: 'hypothalamus', target: 'trh', effect: 'stimulates', weight: 1.0, label: 'synthesizes' },
    { id: 'trh->pituitary', source: 'trh', target: 'pituitary', effect: 'stimulates', weight: 1.0 },
    { id: 'pituitary->tsh', source: 'pituitary', target: 'tsh', effect: 'stimulates', weight: 1.0, label: 'releases' },
    { id: 'tsh->thyroid', source: 'tsh', target: 'thyroid', effect: 'stimulates', weight: 1.0 },
    { id: 'tsi->thyroid', source: 'tsi', target: 'thyroid', effect: 'stimulates', weight: 1.0, label: 'mimics TSH (Graves)' },
    { id: 'thyroid->t4', source: 'thyroid', target: 't4', effect: 'stimulates', weight: 1.0, label: 'releases', blockedBy: ['ptu', 'methimazole'] },
    { id: 'thyroid->t3-direct', source: 'thyroid', target: 't3', effect: 'stimulates', weight: 0.3, label: 'direct (minor)' },
    { id: 't4->deiodinase', source: 't4', target: 'deiodinase', effect: 'stimulates', weight: 1.0, label: 'substrate' },
    { id: 't4->deiodinase5', source: 't4', target: 'deiodinase5', effect: 'stimulates', weight: 0.5, label: 'substrate' },
    { id: 'deiodinase->t3', source: 'deiodinase', target: 't3', effect: 'converts', weight: 1.0, blockedBy: ['ptu', 'propranolol-high', 'glucocorticoids'] },
    { id: 'deiodinase5->rt3', source: 'deiodinase5', target: 'rt3', effect: 'converts', weight: 1.0 },
    { id: 't3->bmr', source: 't3', target: 'bmr', effect: 'stimulates', weight: 1.0 },
    { id: 't3->cardiac', source: 't3', target: 'cardiac', effect: 'stimulates', weight: 1.0 },
    { id: 't3->bone', source: 't3', target: 'bone', effect: 'stimulates', weight: 1.0 },
    { id: 't3->lipids-down', source: 't3', target: 'lipids', effect: 'inhibits', weight: 1.0, label: '↑ LDL-R' },
    // Negative feedback
    { id: 't4-|tsh', source: 't4', target: 'tsh', effect: 'feedback-neg', weight: 0.7 },
    { id: 't3-|tsh', source: 't3', target: 'tsh', effect: 'feedback-neg', weight: 0.7 },
    { id: 't4-|trh', source: 't4', target: 'trh', effect: 'feedback-neg', weight: 0.5 },
    { id: 't3-|trh', source: 't3', target: 'trh', effect: 'feedback-neg', weight: 0.5 },
    // TBG binds T4 — bound T4 is inactive, modeled as a soft inhibition of free T4
    { id: 'tbg-|t4', source: 'tbg', target: 't4', effect: 'inhibits', weight: 0.2 },
  ],
};
