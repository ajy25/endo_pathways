import type { AxisPathway } from '@/model/types';

/**
 * Glucose homeostasis.
 *
 * Insulin (β cells): anabolic — glucose uptake (GLUT4: muscle, adipose), glycogenesis,
 *   lipogenesis, ↑ K⁺ uptake. Triggered by ↑ glucose → ATP → close K-ATP → depolarize → Ca²⁺ → exocytosis.
 * Glucagon (α cells): catabolic — glycogenolysis, gluconeogenesis, ketogenesis. Triggered by hypoglycemia.
 * Somatostatin (δ cells): inhibits both.
 * Incretins (GLP-1, GIP): potentiate glucose-stimulated insulin release. Drugs: GLP-1 agonists, DPP-4i.
 * Counter-regulatory: cortisol, GH, catecholamines, glucagon all ↑ glucose.
 *
 * T1DM: ablate β cells → no insulin, ketosis.
 * T2DM: insulin resistance (block insulin → tissue edge); β cells eventually fail.
 * DKA: clamp insulin LOW, clamp glucagon HIGH.
 * Insulinoma: clamp insulin HIGH while glucose appears low.
 */
export const glucose: AxisPathway = {
  id: 'glucose',
  name: 'Glucose homeostasis',
  shortName: 'Glucose',
  blurb:
    'Insulin (β cell) is anabolic and the only hormone that lowers glucose. Glucagon (α cell) and the counter-regulators (cortisol, GH, catecholamines) raise it. Incretins from the gut potentiate insulin specifically after oral glucose. Somatostatin (δ cell) damps everything.',
  nodes: [
    { id: 'meal', label: 'Meal / ↑ glucose', axis: 'glucose', kind: 'stimulus', description: 'Oral glucose is the strongest insulin secretagogue. The oral response exceeds the IV response by the *incretin effect* (GLP-1, GIP).', position: { x: 60, y: 100 } },
    { id: 'fast', label: 'Fasting / hypoglycemia', axis: 'glucose', kind: 'stimulus', description: 'Hypoglycemia triggers glucagon, epinephrine, cortisol, GH — together the "counter-regulatory" response.', position: { x: 60, y: 320 } },
    { id: 'gut', label: 'Gut', axis: 'glucose', kind: 'gland', description: 'Releases incretins in response to luminal nutrients: GLP-1 (L cells, ileum/colon) and GIP (K cells, duodenum/jejunum).', position: { x: 280, y: 60 } },
    { id: 'incretins', label: 'GLP-1 / GIP', axis: 'glucose', kind: 'hormone', description: 'Potentiate glucose-stimulated insulin release. GLP-1 also slows gastric emptying and suppresses glucagon. Drugs: GLP-1 agonists (semaglutide); DPP-4 inhibitors block their breakdown.', position: { x: 480, y: 60 } },
    { id: 'beta', label: 'β cell', axis: 'glucose', kind: 'gland', description: 'Pancreatic islet (central). Glucose → GLUT2 → glycolysis → ATP → close K-ATP channel → depolarize → open VG Ca²⁺ → exocytose insulin. Sulfonylureas close the K-ATP channel directly.', position: { x: 680, y: 160 } },
    { id: 'alpha', label: 'α cell', axis: 'glucose', kind: 'gland', description: 'Pancreatic islet (peripheral). Secretes glucagon in response to hypoglycemia, amino acids, sympathetics. Suppressed by insulin, somatostatin, GLP-1.', position: { x: 680, y: 280 } },
    { id: 'delta', label: 'δ cell', axis: 'glucose', kind: 'gland', description: 'Pancreatic islet (interspersed). Secretes somatostatin → ⊣ insulin, glucagon, gastrin. Drug analog: octreotide.', position: { x: 680, y: 380 } },
    { id: 'insulin', label: 'Insulin', axis: 'glucose', kind: 'hormone', description: 'Tyrosine kinase receptor → GLUT4 insertion (muscle, adipose). Anabolic: glycogen, lipid, protein synthesis. Drives K⁺ into cells.', position: { x: 880, y: 160 }, isLab: true, units: 'µU/mL' },
    { id: 'glucagon', label: 'Glucagon', axis: 'glucose', kind: 'hormone', description: 'Gs/cAMP. Catabolic: glycogenolysis, gluconeogenesis, ketogenesis, lipolysis. Hepatic effects dominate. Treatment for severe hypoglycemia.', position: { x: 880, y: 280 }, isLab: true },
    { id: 'somatostatin', label: 'Somatostatin', axis: 'glucose', kind: 'hormone', description: 'Pan-inhibitory paracrine. Octreotide used for variceal bleed, acromegaly, carcinoid.', position: { x: 880, y: 380 } },
    { id: 'liver-target', label: 'Liver', axis: 'glucose', kind: 'target', description: 'Insulin: glycogen synthesis, lipogenesis. Glucagon: glycogenolysis, gluconeogenesis, ketogenesis. The two are antagonistic here.', position: { x: 1080, y: 220 } },
    { id: 'muscle-target', label: 'Muscle / adipose', axis: 'glucose', kind: 'target', description: 'GLUT4 insertion is insulin-dependent → glucose uptake. Exercise can also recruit GLUT4 (insulin-independent).', position: { x: 1080, y: 100 } },
    { id: 'serum-glucose', label: 'Serum glucose', axis: 'glucose', kind: 'lab', description: 'Net result of meal, hepatic output, and peripheral uptake. Fasting ≥126 = DM. Random ≥200 with symptoms = DM.', position: { x: 1300, y: 100 }, isLab: true, units: 'mg/dL' },
    { id: 'ketones', label: 'Ketones', axis: 'glucose', kind: 'lab', description: 'Produced by hepatic β-oxidation when insulin is low and glucagon is high. ↑↑ in DKA. Not produced significantly in HHS (some insulin still present).', position: { x: 1300, y: 240 }, isLab: true },
    { id: 'serum-k', label: 'Serum K⁺', axis: 'glucose', kind: 'lab', description: 'Insulin drives K⁺ into cells. Insulin deficiency (DKA) → hyperkalemia despite total body K⁺ depletion. Insulin treatment → hypokalemia.', position: { x: 1300, y: 360 }, isLab: true },
    { id: 'c-peptide', label: 'C-peptide', axis: 'glucose', kind: 'lab', description: 'Cleaved equimolar with endogenous insulin. ↑ in T2DM, insulinoma, sulfonylurea use. ↓/absent with exogenous insulin → distinguishes factitious hypoglycemia.', position: { x: 1080, y: 360 }, isLab: true },
  ],
  edges: [
    { id: 'meal->gut', source: 'meal', target: 'gut', effect: 'stimulates', weight: 1.0 },
    { id: 'meal->beta', source: 'meal', target: 'beta', effect: 'stimulates', weight: 1.0, label: 'glucose' },
    { id: 'gut->incretins', source: 'gut', target: 'incretins', effect: 'stimulates', weight: 1.0 },
    { id: 'incretins->beta', source: 'incretins', target: 'beta', effect: 'stimulates', weight: 0.7, label: 'amplify' },
    { id: 'incretins-|alpha', source: 'incretins', target: 'alpha', effect: 'inhibits', weight: 0.4 },
    { id: 'beta->insulin', source: 'beta', target: 'insulin', effect: 'stimulates', weight: 1.0 },
    { id: 'beta->c-peptide', source: 'beta', target: 'c-peptide', effect: 'stimulates', weight: 1.0, label: 'cosecreted' },
    { id: 'fast->alpha', source: 'fast', target: 'alpha', effect: 'stimulates', weight: 1.0 },
    { id: 'alpha->glucagon', source: 'alpha', target: 'glucagon', effect: 'stimulates', weight: 1.0 },
    { id: 'delta->somatostatin', source: 'delta', target: 'somatostatin', effect: 'stimulates', weight: 1.0 },
    { id: 'somatostatin-|beta', source: 'somatostatin', target: 'beta', effect: 'inhibits', weight: 0.7 },
    { id: 'somatostatin-|alpha', source: 'somatostatin', target: 'alpha', effect: 'inhibits', weight: 0.7 },
    { id: 'insulin-|alpha', source: 'insulin', target: 'alpha', effect: 'inhibits', weight: 0.7 },
    { id: 'insulin->muscle', source: 'insulin', target: 'muscle-target', effect: 'stimulates', weight: 1.0, blockedBy: ['insulin-resistance'] },
    { id: 'insulin->liver', source: 'insulin', target: 'liver-target', effect: 'stimulates', weight: 1.0, blockedBy: ['insulin-resistance'] },
    { id: 'glucagon-|liver', source: 'glucagon', target: 'liver-target', effect: 'inhibits', weight: 1.0 },
    { id: 'muscle-|serum-glucose', source: 'muscle-target', target: 'serum-glucose', effect: 'inhibits', weight: 1.0, label: 'uptake' },
    { id: 'liver-|serum-glucose', source: 'liver-target', target: 'serum-glucose', effect: 'inhibits', weight: 0.8, label: 'storage' },
    { id: 'glucagon->serum-glucose', source: 'glucagon', target: 'serum-glucose', effect: 'stimulates', weight: 1.0, label: 'hepatic output' },
    { id: 'meal->serum-glucose', source: 'meal', target: 'serum-glucose', effect: 'stimulates', weight: 1.0 },
    { id: 'glucagon->ketones', source: 'glucagon', target: 'ketones', effect: 'stimulates', weight: 0.8 },
    { id: 'insulin-|ketones', source: 'insulin', target: 'ketones', effect: 'inhibits', weight: 1.0 },
    { id: 'insulin-|serum-k', source: 'insulin', target: 'serum-k', effect: 'inhibits', weight: 1.0, label: 'shift into cell' },
    // Feedback: glucose ⊕ insulin, ⊣ glucagon
    { id: 'serum-glucose->beta-fb', source: 'serum-glucose', target: 'beta', effect: 'stimulates', weight: 0.6 },
    { id: 'serum-glucose-|alpha-fb', source: 'serum-glucose', target: 'alpha', effect: 'feedback-neg', weight: 0.6 },
  ],
};
