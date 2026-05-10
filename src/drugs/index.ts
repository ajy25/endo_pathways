import type { Drug, DrugId } from '@/model/types';

export const drugs: Drug[] = [
  // === HPT ===
  {
    id: 'ptu',
    name: 'PTU',
    axis: 'hpt',
    mechanism: 'Inhibits thyroid peroxidase AND peripheral 5′-deiodinase. Preferred in 1st-trimester pregnancy and thyroid storm.',
    blocks: ['thyroid->t4', 'deiodinase->t3'],
  },
  {
    id: 'methimazole',
    name: 'Methimazole',
    axis: 'hpt',
    mechanism: 'Inhibits thyroid peroxidase. More potent than PTU; first-line for non-pregnant hyperthyroidism. Teratogenic in 1st trimester (aplasia cutis).',
    blocks: ['thyroid->t4'],
  },
  {
    id: 'propranolol-high',
    name: 'Propranolol (high-dose)',
    axis: 'hpt',
    mechanism: 'β-blocker. High doses inhibit 5′-deiodinase. Symptomatic relief in thyroid storm.',
    blocks: ['deiodinase->t3'],
  },
  {
    id: 'glucocorticoids',
    name: 'Glucocorticoids',
    axis: 'hpt',
    mechanism: 'Inhibit 5′-deiodinase and TSH release. Adjunct in thyroid storm and Graves ophthalmopathy.',
    blocks: ['deiodinase->t3'],
  },

  // === HPG ===
  {
    id: 'finasteride',
    name: 'Finasteride',
    axis: 'hpg',
    mechanism: '5α-reductase inhibitor. Blocks T → DHT. Used for BPH and androgenic alopecia.',
    blocks: ['testosterone->dht'],
  },

  // === Prolactin ===
  {
    id: 'bromocriptine',
    name: 'Bromocriptine',
    axis: 'prl',
    mechanism: 'Dopamine agonist. Restores tonic inhibition of lactotrophs → ↓ prolactin. Used for prolactinoma.',
    blocks: [],
    clamps: { dopamine: +3 },
  },
  {
    id: 'cabergoline',
    name: 'Cabergoline',
    axis: 'prl',
    mechanism: 'Long-acting dopamine agonist. First-line for prolactinoma (better tolerated than bromocriptine).',
    blocks: [],
    clamps: { dopamine: +3 },
  },
  {
    id: 'antipsychotics',
    name: 'Antipsychotics',
    axis: 'prl',
    mechanism: 'D2 antagonists (haloperidol, risperidone). Block dopamine\'s tonic inhibition → ↑ prolactin.',
    blocks: ['dopamine-|pituitary'],
  },
  {
    id: 'metoclopramide',
    name: 'Metoclopramide',
    axis: 'prl',
    mechanism: 'D2 antagonist (antiemetic / prokinetic). Causes hyperprolactinemia and galactorrhea.',
    blocks: ['dopamine-|pituitary'],
  },

  // === ADH ===
  {
    id: 'lithium',
    name: 'Lithium',
    axis: 'adh',
    mechanism: 'Blunts V2 signaling in the collecting duct → acquired nephrogenic DI. Also causes thyroid dysfunction.',
    blocks: ['adh->kidney'],
  },
  {
    id: 'demeclocycline',
    name: 'Demeclocycline',
    axis: 'adh',
    mechanism: 'Tetracycline that inhibits ADH action in the collecting duct. Used for SIADH (induces nephrogenic DI therapeutically).',
    blocks: ['adh->kidney'],
  },
  {
    id: 'conivaptan',
    name: 'Conivaptan',
    axis: 'adh',
    mechanism: 'V1a/V2 receptor antagonist. Used in euvolemic and hypervolemic hyponatremia (SIADH, heart failure).',
    blocks: ['adh->kidney'],
  },
  {
    id: 'tolvaptan',
    name: 'Tolvaptan',
    axis: 'adh',
    mechanism: 'V2-selective antagonist. Oral. For SIADH; also slows ADPKD progression.',
    blocks: ['adh->kidney'],
  },

  // === RAAS ===
  {
    id: 'acei',
    name: 'ACE inhibitor',
    axis: 'raas',
    mechanism: 'Blocks AngI → AngII. Also blocks bradykinin degradation → cough, angioedema. Renoprotective in diabetic nephropathy.',
    blocks: ['ace->angII'],
  },
  {
    id: 'arb',
    name: 'ARB (losartan)',
    axis: 'raas',
    mechanism: 'AT1 receptor antagonist. Same hemodynamic effects as ACEi, no bradykinin → no cough. Same renoprotection.',
    blocks: ['angII->aldo', 'angII->vasoconstriction', 'angII->thirst'],
  },
  {
    id: 'spironolactone',
    name: 'Spironolactone',
    axis: 'raas',
    mechanism: 'Aldosterone receptor antagonist. K⁺-sparing diuretic. Also anti-androgen → gynecomastia.',
    blocks: ['aldo->serum-na', 'aldo-|serum-k', 'aldo->serum-ph'],
  },
  {
    id: 'eplerenone',
    name: 'Eplerenone',
    axis: 'raas',
    mechanism: 'Selective aldosterone receptor antagonist. No gynecomastia (no progesterone/androgen receptor effect).',
    blocks: ['aldo->serum-na', 'aldo-|serum-k', 'aldo->serum-ph'],
  },

  // === Glucose ===
  {
    id: 'insulin-resistance',
    name: 'Insulin resistance',
    axis: 'glucose',
    mechanism: 'Functional state, not a drug. Tissues do not respond normally to insulin. Defining feature of T2DM and metabolic syndrome.',
    blocks: ['insulin->muscle', 'insulin->liver'],
  },

  // === Appetite ===
  {
    id: 'leptin-resistance',
    name: 'Leptin resistance',
    axis: 'appetite',
    mechanism: 'Functional state. The satiety center and the hunger-suppression pathway both fail to respond to circulating leptin — typical of common obesity.',
    blocks: ['leptin->satiety', 'leptin-|hunger'],
  },
];

export function getDrug(id: DrugId): Drug | undefined {
  return drugs.find((d) => d.id === id);
}

export function drugsForAxis(axisId: string): Drug[] {
  return drugs.filter((d) => {
    if (Array.isArray(d.axis)) return d.axis.includes(axisId as never);
    return d.axis === axisId;
  });
}
