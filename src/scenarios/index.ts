import type { Scenario, ScenarioId } from '@/model/types';

export const scenarios: Scenario[] = [
  // === HPT ===
  {
    id: 'primary-hypothyroid',
    name: 'Primary hypothyroidism (Hashimoto)',
    axis: 'hpt',
    description:
      'Autoimmune destruction of the thyroid gland (most commonly Hashimoto thyroiditis). The thyroid cannot produce T4/T3; the pituitary and hypothalamus see ↓ free hormone and ramp up TSH and TRH.',
    clamps: { thyroid: -2.5 },
    expectedLabs: { tsh: '↑↑', t4: '↓', t3: '↓' },
    teachingPoint:
      'High TSH + low free T4 = primary hypothyroidism. Free T4 distinguishes overt from subclinical disease (subclinical = ↑ TSH, normal free T4). Elevated TRH can raise prolactin → galactorrhea.',
  },
  {
    id: 'graves',
    name: 'Graves disease',
    axis: 'hpt',
    description:
      'Autoimmune hyperthyroidism: thyroid-stimulating immunoglobulin (TSI) binds the TSH receptor and continuously activates the thyroid, independent of pituitary control.',
    clamps: { tsi: +3, thyroid: +2 },
    expectedLabs: { tsh: '↓↓', t4: '↑↑', t3: '↑↑' },
    teachingPoint:
      'Low TSH + high free T4 + diffuse goiter + ophthalmopathy = Graves. TSI both drives the thyroid and is responsible for orbital and pretibial myxedema features.',
  },
  {
    id: 'central-hypothyroid',
    name: 'Central (secondary) hypothyroidism',
    axis: 'hpt',
    description:
      'Pituitary cannot release adequate TSH (pituitary tumor, surgery, Sheehan syndrome). With low TSH drive, the thyroid involutes and free T4 falls.',
    clamps: { pituitary: -2.5 },
    expectedLabs: { tsh: '↓', t4: '↓' },
    teachingPoint:
      'Low TSH + low free T4 = central (secondary) hypothyroidism. Contrast with primary (high TSH, low T4) — the TSH tells you where the lesion is.',
  },
  {
    id: 'sick-euthyroid',
    name: 'Sick euthyroid syndrome',
    axis: 'hpt',
    description:
      'Severe non-thyroidal illness inhibits 5′-deiodinase and up-regulates 5-deiodinase, shunting T4 toward inactive rT3. TSH and total T4 may be near-normal; free T3 falls.',
    clamps: { deiodinase: -2, deiodinase5: +2 },
    expectedLabs: { t3: '↓', rt3: '↑' },
    teachingPoint:
      "Low T3, high rT3, near-normal TSH in a critically ill patient = sick euthyroid (low T3 syndrome). Don't treat it — it resolves with the underlying illness.",
  },

  // === HPA ===
  {
    id: 'cushing-disease',
    name: 'Cushing disease (pituitary)',
    axis: 'hpa',
    description:
      'ACTH-secreting pituitary adenoma. Drives the adrenals to overproduce cortisol. ACTH and MSH (POMC-derived) both elevated → hyperpigmentation.',
    clamps: { acth: +3 },
    expectedLabs: { acth: '↑', cortisol: '↑↑', 'glucose-eff': '↑' },
    teachingPoint:
      'High ACTH + high cortisol + suppressible by high-dose dex = Cushing *disease* (pituitary source). Distinct from "Cushing syndrome" which is the broader hypercortisolism phenotype.',
  },
  {
    id: 'cushing-adrenal',
    name: 'Cushing syndrome (adrenal adenoma)',
    axis: 'hpa',
    description:
      'Autonomous cortisol-secreting adrenal adenoma. Cortisol suppresses CRH and ACTH → low MSH → no hyperpigmentation.',
    clamps: { cortisol: +3 },
    expectedLabs: { acth: '↓↓', cortisol: '↑↑' },
    teachingPoint:
      'High cortisol + low ACTH = adrenal source of Cushing syndrome. ACTH-dependent (Cushing disease, ectopic) vs ACTH-independent (adrenal) is the key bifurcation in workup.',
  },
  {
    id: 'ectopic-acth',
    name: 'Ectopic ACTH (small cell lung)',
    axis: 'hpa',
    description:
      'Paraneoplastic ACTH secretion, most often by small cell lung carcinoma. ACTH levels exceed those seen in Cushing disease; cortisol does NOT suppress with high-dose dex.',
    clamps: { acth: +3, crh: -2 },
    expectedLabs: { acth: '↑↑', cortisol: '↑↑' },
    teachingPoint:
      'Very high ACTH that does not suppress with high-dose dexamethasone = ectopic. Hyperpigmentation prominent (POMC processing yields a lot of MSH too).',
  },
  {
    id: 'addison',
    name: 'Addison disease (primary adrenal insufficiency)',
    axis: 'hpa',
    description:
      'Autoimmune destruction of the adrenal cortex (other causes: TB, hemorrhage, metastases). Loss of cortisol (and aldosterone) → ↑ CRH/ACTH/MSH (hyperpigmentation).',
    clamps: { adrenal: -3 },
    expectedLabs: { acth: '↑↑', cortisol: '↓↓', msh: '↑' },
    teachingPoint:
      'Low cortisol + high ACTH + hyperpigmentation + hyponatremia/hyperkalemia (aldosterone also lost) = Addison disease. Hyperpigmentation is the differentiator from secondary insufficiency.',
  },
  {
    id: 'secondary-adrenal',
    name: 'Secondary adrenal insufficiency',
    axis: 'hpa',
    description:
      'Pituitary cannot make adequate ACTH (often after chronic exogenous steroid use and abrupt withdrawal, or pituitary surgery). Adrenal atrophy. No mineralocorticoid axis problem.',
    clamps: { pituitary: -3 },
    expectedLabs: { acth: '↓', cortisol: '↓' },
    teachingPoint:
      'Low cortisol + low ACTH + no hyperpigmentation + normal K⁺ (aldosterone preserved via RAAS) = secondary (pituitary) or tertiary (hypothalamic) insufficiency.',
  },
  {
    id: 'exogenous-steroids',
    name: 'Chronic exogenous glucocorticoids',
    axis: 'hpa',
    description:
      'Long-term steroid use suppresses CRH and ACTH → adrenal atrophy. Endogenous cortisol low but exogenous keeps tissue effects high. Abrupt withdrawal → adrenal crisis.',
    clamps: { cortisol: +2.5, crh: -2.5, acth: -2.5 },
    expectedLabs: { acth: '↓↓', cortisol: '↑' },
    teachingPoint:
      'Suppressed HPA axis from chronic exogenous steroids needs slow taper. The patient looks Cushingoid (high effective glucocorticoid) but endogenous ACTH/cortisol are profoundly suppressed.',
  },

  // === HPG ===
  {
    id: 'prolactinoma',
    name: 'Prolactinoma → HPG suppression',
    axis: 'hpg',
    description:
      'High prolactin (from a lactotroph adenoma or dopamine antagonist) suppresses GnRH → low FSH/LH → hypogonadism. In women: amenorrhea + galactorrhea. In men: ↓ libido, ED, gynecomastia.',
    clamps: { 'prolactin-ext': +3 },
    expectedLabs: { gnrh: '↓', fsh: '↓', lh: '↓', testosterone: '↓', estradiol: '↓' },
    teachingPoint:
      'Hypogonadotropic hypogonadism in the setting of galactorrhea = check prolactin. Treat the cause (dopamine agonist for prolactinoma; stop the offending drug).',
  },
  {
    id: 'kallmann',
    name: 'Kallmann syndrome',
    axis: 'hpg',
    description:
      'Failed migration of GnRH neurons from the olfactory placode → no GnRH. Hypogonadotropic hypogonadism + anosmia (no sense of smell).',
    clamps: { gnrh: -3 },
    expectedLabs: { fsh: '↓↓', lh: '↓↓', testosterone: '↓↓', estradiol: '↓↓' },
    teachingPoint:
      'Delayed puberty + anosmia = Kallmann. GnRH, FSH, LH, sex steroids all low. Distinct from primary gonadal failure (high FSH/LH).',
  },
  {
    id: 'primary-gonadal-failure',
    name: 'Primary gonadal failure',
    axis: 'hpg',
    description:
      'Damage to the gonads themselves (Turner, Klinefelter, chemo, mumps orchitis, premature ovarian insufficiency). Loss of feedback raises FSH and LH.',
    clamps: { testes: -3, ovaries: -3 },
    expectedLabs: { fsh: '↑↑', lh: '↑↑', testosterone: '↓', estradiol: '↓' },
    teachingPoint:
      'High FSH/LH + low sex steroids = primary gonadal (hypergonadotropic hypogonadism). Common Step 1: Turner, Klinefelter, menopause.',
  },

  // === GH ===
  {
    id: 'acromegaly',
    name: 'Acromegaly (GH excess)',
    axis: 'gh',
    description:
      'Pituitary somatotroph adenoma. Excess GH after epiphyseal closure → soft tissue and visceral growth, insulin resistance, HFpEF (leading cause of death).',
    clamps: { gh: +3 },
    expectedLabs: { gh: '↑↑', igf1: '↑↑', 'glucose-eff': '↑' },
    teachingPoint:
      'Diagnose by IGF-1 (stable) and failure of GH to suppress on OGTT. Treat: surgery; medical = octreotide, pegvisomant, cabergoline.',
  },
  {
    id: 'gh-deficiency',
    name: 'GH deficiency',
    axis: 'gh',
    description:
      'Childhood: short stature with normal proportions. Adult: ↓ lean mass, central obesity, dyslipidemia. Causes: idiopathic, craniopharyngioma, Sheehan, irradiation.',
    clamps: { gh: -3 },
    expectedLabs: { gh: '↓↓', igf1: '↓↓', 'growth-eff': '↓' },
    teachingPoint:
      'Short stature with delayed bone age + low IGF-1 + failure to ↑ GH on stimulation = GH deficiency. Treat with recombinant GH.',
  },

  // === Prolactin ===
  {
    id: 'prolactinoma-direct',
    name: 'Prolactinoma',
    axis: 'prl',
    description:
      'Lactotroph adenoma — the most common pituitary adenoma. Bromocriptine/cabergoline are first-line (dopamine agonists shrink the tumor).',
    clamps: { pituitary: +3 },
    expectedLabs: { prolactin: '↑↑', gnrh: '↓' },
    teachingPoint:
      'Galactorrhea, amenorrhea, and bitemporal hemianopia → think prolactinoma. First-line therapy is medical, not surgical.',
  },
  {
    id: 'antipsychotic-hyperprl',
    name: 'Antipsychotic-induced hyperprolactinemia',
    axis: 'prl',
    description:
      'Dopamine antagonists (risperidone, haloperidol, metoclopramide) block D2 on lactotrophs → prolactin rises (no dopamine brake).',
    clamps: { dopamine: -3 },
    expectedLabs: { prolactin: '↑↑' },
    teachingPoint:
      'New-onset galactorrhea on an antipsychotic = drug-induced hyperprolactinemia. Switch to an agent with less D2 affinity (aripiprazole, clozapine) if possible.',
  },
  {
    id: 'hypothyroid-galactorrhea',
    name: 'Hypothyroidism → galactorrhea',
    axis: 'prl',
    description:
      'In primary hypothyroidism, TRH is elevated. TRH weakly stimulates lactotrophs → mildly ↑ prolactin → galactorrhea.',
    clamps: { trh: +2 },
    expectedLabs: { prolactin: '↑' },
    teachingPoint:
      'Always check TSH in a patient with galactorrhea — primary hypothyroidism is an easy reversible cause.',
  },

  // === ADH ===
  {
    id: 'siadh',
    name: 'SIADH',
    axis: 'adh',
    description:
      'Inappropriate (high) ADH despite normal/low osmolality. Causes: small cell lung cancer, CNS disease, pulmonary disease, SSRIs, carbamazepine. Euvolemic hyponatremia with inappropriately concentrated urine.',
    clamps: { adh: +3 },
    expectedLabs: { 'urine-osm': '↑↑', 'urine-vol': '↓', 'serum-na': '↓↓', 'serum-osm': '↓' },
    teachingPoint:
      "Euvolemic hyponatremia with U_osm > S_osm and ↑ urine Na⁺ = SIADH. Treat with fluid restriction; demeclocycline or vaptans if refractory. Correct slowly — risk of osmotic demyelination.",
  },
  {
    id: 'central-di',
    name: 'Central diabetes insipidus',
    axis: 'adh',
    description:
      "Posterior pituitary cannot release ADH. Causes: head trauma, surgery, pituitary apoplexy, infiltrative disease. Polyuria with dilute urine; ↑ serum Na⁺.",
    clamps: { pituitary: -3 },
    expectedLabs: { adh: '↓↓', 'urine-osm': '↓', 'urine-vol': '↑↑', 'serum-na': '↑', 'serum-osm': '↑' },
    teachingPoint:
      'Hypernatremia + polyuria + dilute urine that *responds* to desmopressin = central DI. Treat with desmopressin (DDAVP).',
  },
  {
    id: 'nephrogenic-di',
    name: 'Nephrogenic diabetes insipidus',
    axis: 'adh',
    description:
      'Collecting duct does not respond to ADH. Causes: lithium, demeclocycline, hypercalcemia, hypokalemia, V2 receptor mutation. ADH is high or normal.',
    clamps: { adh: +1, kidney: -3 },
    expectedLabs: { 'urine-osm': '↓', 'urine-vol': '↑↑', 'serum-na': '↑' },
    teachingPoint:
      'Polyuria + dilute urine that does *not* respond to desmopressin = nephrogenic DI. Fix the cause (stop lithium, correct Ca²⁺/K⁺). HCTZ paradoxically helps.',
  },

  // === RAAS ===
  {
    id: 'conn',
    name: 'Conn syndrome (primary hyperaldosteronism)',
    axis: 'raas',
    description:
      'Autonomous aldosterone-secreting adrenal adenoma or bilateral hyperplasia. Aldosterone retains Na⁺/water, excretes K⁺/H⁺ → HTN + hypokalemia + metabolic alkalosis. Renin is *suppressed*.',
    clamps: { aldo: +3, renin: -2 },
    expectedLabs: { 'serum-k': '↓↓', 'serum-bp': '↑↑', 'serum-ph': '↑' },
    teachingPoint:
      'HTN + hypokalemia + low renin/high aldo (high aldo:renin ratio) = primary hyperaldo. Screen with aldo:renin ratio.',
  },
  {
    id: 'renal-artery-stenosis',
    name: 'Renal artery stenosis (2° hyperaldo)',
    axis: 'raas',
    description:
      'Renal artery narrowing → ↓ renal perfusion → ↑ renin → ↑ AngII → ↑ aldo. Renin is *high* (key contrast with Conn).',
    clamps: { 'low-perfusion': +3 },
    expectedLabs: { renin: '↑↑', angII: '↑', aldo: '↑', 'serum-bp': '↑↑' },
    teachingPoint:
      'Refractory HTN + abdominal bruit + ↓ renal function on starting ACEi = renal artery stenosis. Both renin and aldo are high (secondary).',
  },
  {
    id: 'chf-raas',
    name: 'CHF — RAAS activation',
    axis: 'raas',
    description:
      'Heart failure ↓ effective circulating volume → ↑ renin → ↑ AngII / aldo → maladaptive Na⁺/water retention and ventricular remodeling. ACEi and aldosterone antagonists improve mortality.',
    clamps: { 'low-perfusion': +2, sympathetics: +2 },
    expectedLabs: { renin: '↑', angII: '↑', aldo: '↑' },
    teachingPoint:
      "Why ACEi/ARB and spironolactone help in HFrEF: they break the maladaptive RAAS loop driving remodeling.",
  },

  // === Calcium ===
  {
    id: 'primary-hyperparathyroid',
    name: 'Primary hyperparathyroidism',
    axis: 'ca',
    description:
      'Autonomous PTH-secreting parathyroid adenoma (single, 80%). High PTH → high Ca²⁺, low PO₄³⁻, high calcitriol, high urine cAMP.',
    clamps: { parathyroid: +3 },
    expectedLabs: { pth: '↑', 'serum-ca': '↑', 'serum-po4': '↓', calcitriol: '↑', 'urine-camp': '↑' },
    teachingPoint:
      '"Stones, bones, groans, psychiatric overtones" + ↑ Ca²⁺ + ↑ PTH = primary hyperPTH. Often incidentally found on routine chemistry.',
  },
  {
    id: 'secondary-hyperparathyroid',
    name: 'Secondary hyperparathyroidism (CKD)',
    axis: 'ca',
    description:
      'Renal failure → ↓ 1α-hydroxylase → ↓ calcitriol → ↓ gut Ca²⁺ absorption → ↓ Ca²⁺. Also ↓ PO₄³⁻ excretion → ↑ PO₄³⁻, which directly suppresses calcitriol and binds Ca²⁺. Result: high PTH, low Ca²⁺, high PO₄³⁻.',
    clamps: { 'kidney-d': -3, 'serum-po4': +2 },
    expectedLabs: { pth: '↑↑', 'serum-ca': '↓', 'serum-po4': '↑', calcitriol: '↓' },
    teachingPoint:
      'CKD-MBD: ↓ Ca²⁺, ↑ PO₄³⁻, ↑ PTH, ↓ calcitriol. Treat with calcitriol (or analog), phosphate binders, and the calcimimetic cinacalcet.',
  },
  {
    id: 'hypoparathyroid',
    name: 'Hypoparathyroidism',
    axis: 'ca',
    description:
      'Loss of PTH (post-thyroidectomy, DiGeorge, autoimmune). Low Ca²⁺ + high PO₄³⁻ + tetany (Chvostek/Trousseau).',
    clamps: { parathyroid: -3 },
    expectedLabs: { pth: '↓↓', 'serum-ca': '↓' },
    teachingPoint:
      'Perioral tingling, carpopedal spasm after total thyroidectomy = hypoCa from accidentally removed parathyroids.',
  },
  {
    id: 'humoral-hypercalcemia',
    name: 'Humoral hypercalcemia of malignancy (PTHrP)',
    axis: 'ca',
    description:
      'Squamous cell lung carcinoma, RCC, or breast cancer secretes PTHrP. Mimics PTH at the receptor but is not under feedback. Importantly, PTHrP does NOT stimulate 1α-hydroxylase.',
    clamps: { pthrp: +3 },
    expectedLabs: { pth: '↓', 'serum-ca': '↑↑', 'serum-po4': '↓', calcitriol: '→' },
    teachingPoint:
      'High Ca²⁺ + low PTH + low PO₄³⁻ + cancer = PTHrP-mediated hypercalcemia. Endogenous PTH is suppressed by the high Ca²⁺.',
  },

  // === Glucose ===
  {
    id: 't1dm',
    name: 'Type 1 diabetes mellitus',
    axis: 'glucose',
    description:
      'Autoimmune destruction of pancreatic β cells. Absolute insulin deficiency. Tendency to DKA.',
    clamps: { beta: -3 },
    expectedLabs: { insulin: '↓↓', 'c-peptide': '↓↓', 'serum-glucose': '↑↑', ketones: '↑↑', 'serum-k': '↑' },
    teachingPoint:
      'Young patient with weight loss, polyuria, polydipsia, DKA → T1DM. Low C-peptide distinguishes from T2DM and from exogenous insulin overdose.',
  },
  {
    id: 't2dm',
    name: 'Type 2 diabetes mellitus',
    axis: 'glucose',
    description:
      'Peripheral insulin resistance + relative insulin deficiency. β cell mass preserved early; β cell exhaustion late. Hyperglycemia without ketosis (some insulin still present).',
    clamps: { meal: +2, 'serum-glucose': +1.5 },
    drugs: ['insulin-resistance'],
    expectedLabs: { 'serum-glucose': '↑', insulin: '↑' },
    teachingPoint:
      'Insulin resistance defines T2DM. C-peptide is normal or high (β cells working). Treat with weight loss, metformin, GLP-1 agonists.',
  },
  {
    id: 'dka',
    name: 'Diabetic ketoacidosis (DKA)',
    axis: 'glucose',
    description:
      'Profound insulin deficiency + counter-regulatory excess (especially glucagon). Lipolysis → ketogenesis → anion-gap metabolic acidosis. Hyperkalemia despite total body K⁺ depletion.',
    clamps: { insulin: -3, glucagon: +3 },
    expectedLabs: { 'serum-glucose': '↑↑', ketones: '↑↑', 'serum-k': '↑' },
    teachingPoint:
      'IV fluids first, then insulin (with K⁺ replacement as it shifts back into cells), find the trigger (infection, missed insulin, MI).',
  },
  {
    id: 'insulinoma',
    name: 'Insulinoma',
    axis: 'glucose',
    description:
      'Autonomous β-cell tumor. Inappropriate insulin secretion during hypoglycemia. C-peptide HIGH (distinguishes from exogenous insulin abuse).',
    clamps: { beta: +3 },
    expectedLabs: { insulin: '↑↑', 'c-peptide': '↑↑' },
    teachingPoint:
      'Whipple triad (hypoglycemia, symptoms, relief on glucose) + ↑ insulin + ↑ C-peptide during fasting hypoglycemia = insulinoma. Look for MEN1 association.',
  },

  // === Appetite ===
  {
    id: 'prader-willi',
    name: 'Prader-Willi syndrome',
    axis: 'appetite',
    description:
      'Paternal 15q11-q13 deletion / maternal uniparental disomy. Hyperphagia from very high ghrelin; obesity; intellectual disability; hypogonadism.',
    clamps: { stomach: +3 },
    expectedLabs: { ghrelin: '↑↑', 'appetite-out': '↑↑' },
    teachingPoint:
      'Infantile hypotonia → childhood hyperphagia + obesity = Prader-Willi. Mother\'s allele expressed = Angelman; father\'s expressed = Prader-Willi.',
  },
  {
    id: 'leptin-resistance',
    name: 'Obesity / leptin resistance',
    axis: 'appetite',
    description:
      'Most obesity is characterized by leptin resistance: adipose tissue is increased and leptin is high, but the satiety signal is not heeded.',
    clamps: { adiposity: +2.5 },
    drugs: ['leptin-resistance'],
    expectedLabs: { leptin: '↑' },
    teachingPoint:
      'High leptin in obesity reflects the failed feedback — the brain ignores it. Rare loss-of-function leptin mutations produce profound early-onset obesity that *responds* to recombinant leptin.',
  },

  // === Steroidogenesis ===
  {
    id: 'cah-21',
    name: '21-hydroxylase deficiency CAH',
    axis: 'steroidogenesis',
    description:
      'Most common CAH (~90%). No mineralo or glucocorticoid; 17-OH-progesterone accumulates and shunts to androgens. Salt wasting + virilization of XX infant.',
    clamps: { enzyme21: -3, 'acth-in': +3 },
    expectedLabs: { 'oh-progesterone': '↑↑', dhea: '↑', cortisol: '↓', aldosterone: '↓' },
    teachingPoint:
      'Newborn screen: ↑ 17-OH-progesterone. Salt-wasting crisis in infancy; ambiguous genitalia in XX. Treat with glucocorticoid + mineralocorticoid replacement.',
  },
  {
    id: 'cah-11b',
    name: '11β-hydroxylase deficiency CAH',
    axis: 'steroidogenesis',
    description:
      'Block before cortisol and corticosterone. 11-deoxycorticosterone accumulates → mineralocorticoid effect → HTN. Androgens still made → virilization.',
    clamps: { enzyme11b: -3, 'acth-in': +3 },
    expectedLabs: { 'deoxy-cortico': '↑↑', cortisol: '↓', dhea: '↑' },
    teachingPoint:
      'HTN + hypokalemia + virilization + low aldo (but 11-DOC mimics it) = 11β-OH deficiency. Mnemonic: enzymes ending in 1 (11 or 1) virilize; enzymes starting with 1 (17) feminize and cause HTN.',
  },
  {
    id: 'cah-17',
    name: '17α-hydroxylase deficiency CAH',
    axis: 'steroidogenesis',
    description:
      'No 17-hydroxylation → no cortisol and no sex hormones. Mineralocorticoid pathway intact and over-driven → 11-DOC ↑ → HTN. XY: undescended testes / atypical genitalia. XX: no 2° sexual development.',
    clamps: { enzyme17a: -3, 'acth-in': +3 },
    expectedLabs: { dhea: '↓', cortisol: '↓' },
    teachingPoint:
      '17α-OH deficiency: HTN + hypokalemia + lack of sex hormones. Opposite gonadal phenotype to 21-OH and 11β-OH (which both virilize).',
  },
];

export function getScenario(id: ScenarioId): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function scenariosForAxis(axisId: string): Scenario[] {
  return scenarios.filter((s) => s.axis === axisId);
}
