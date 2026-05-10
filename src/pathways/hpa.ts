import type { AxisPathway } from '@/model/types';

/**
 * HPA axis: hypothalamus → pituitary → adrenal cortex (zona fasciculata).
 *
 * Stress / circadian → CRH ⊕ ACTH ⊕ cortisol.
 * POMC is cleaved into ACTH, MSH (→ pigmentation), β-endorphin.
 * Negative feedback: cortisol ⊣ CRH and ⊣ ACTH.
 *
 * Cushing disease: ACTH-secreting pituitary adenoma.
 * Cushing syndrome (adrenal): clamp cortisol high → suppresses ACTH/CRH.
 * Ectopic ACTH: e.g., small cell lung cancer.
 * Addison: 1° adrenal failure (clamp adrenal low) → ACTH ↑, MSH ↑ (hyperpigmentation).
 * Secondary adrenal insufficiency: clamp pituitary/ACTH low → cortisol ↓, no hyperpigmentation.
 */
export const hpa: AxisPathway = {
  id: 'hpa',
  name: 'Hypothalamic–Pituitary–Adrenal axis',
  shortName: 'HPA axis',
  blurb:
    'Stress and the circadian clock drive CRH → ACTH → cortisol. ACTH is cleaved from POMC alongside MSH, which is why high-ACTH states (Cushing disease, Addison, ectopic ACTH) cause hyperpigmentation.',
  nodes: [
    { id: 'stress', label: 'Stress / circadian', axis: 'hpa', kind: 'stimulus', description: 'Physiologic and psychological stress, plus the circadian rhythm (peak ~6am), drive CRH secretion.', position: { x: 60, y: 180 } },
    { id: 'hypothalamus', label: 'Hypothalamus', axis: 'hpa', kind: 'gland', description: 'Paraventricular nucleus synthesizes CRH (and ADH, which potentiates CRH).', position: { x: 230, y: 180 } },
    { id: 'crh', label: 'CRH', axis: 'hpa', kind: 'hormone', description: 'Corticotropin-releasing hormone. ↑ POMC processing in corticotrophs → ↑ ACTH, MSH, β-endorphin. Suppressed by chronic glucocorticoid use.', position: { x: 400, y: 180 } },
    { id: 'pituitary', label: 'Anterior pituitary', axis: 'hpa', kind: 'gland', description: 'Corticotrophs (basophils) cleave POMC → ACTH + MSH + β-endorphin in response to CRH.', position: { x: 580, y: 180 } },
    { id: 'pomc', label: 'POMC', axis: 'hpa', kind: 'second-messenger', description: 'Proopiomelanocortin. Single precursor cleaved into ACTH, α-MSH, β-endorphin. Explains hyperpigmentation in high-ACTH states.', position: { x: 580, y: 60 } },
    {
      id: 'acth',
      label: 'ACTH',
      axis: 'hpa',
      kind: 'hormone',
      description: 'Adrenocorticotropic hormone. Binds MC2R on zona fasciculata → ↑ cAMP → cortisol synthesis. Also weakly stimulates aldosterone and adrenal androgens.',
      mnemonic: 'B-FLAT: Basophils — FSH, LH, ACTH, TSH.',
      position: { x: 760, y: 180 },
      isLab: true,
      units: 'pg/mL',
    },
    { id: 'msh', label: 'MSH', axis: 'hpa', kind: 'hormone', description: 'Melanocyte-stimulating hormone. Coproduced with ACTH from POMC. Elevated in any high-ACTH state → hyperpigmentation (skin creases, buccal mucosa).', position: { x: 760, y: 60 } },
    {
      id: 'adrenal',
      label: 'Adrenal cortex (ZF)',
      axis: 'hpa',
      kind: 'gland',
      description: 'Zona fasciculata of the adrenal cortex. Synthesizes cortisol from cholesterol via the steroidogenic pathway. Stimulated by ACTH.',
      position: { x: 940, y: 180 },
    },
    {
      id: 'cortisol',
      label: 'Cortisol',
      axis: 'hpa',
      kind: 'hormone',
      description: 'Glucocorticoid. A BIG FIB: ↑ Appetite, ↑ BP (α1 upregulation), ↑ Insulin resistance, ↑ Gluconeogenesis/lipolysis/proteolysis, ↓ Fibroblast activity (poor healing), ↓ Inflammation/Immunity, ↓ Bone formation.',
      mnemonic: 'Cortisol is A BIG FIB.',
      clinicalNotes: [
        'Exogenous glucocorticoids suppress CRH/ACTH → adrenal atrophy → risk of crisis on abrupt withdrawal.',
        'High cortisol → reactivation of TB/candidiasis.',
      ],
      position: { x: 1130, y: 180 },
      isLab: true,
      units: 'µg/dL',
    },
    { id: 'glucose-eff', label: 'Glucose ↑', axis: 'hpa', kind: 'target', description: 'Cortisol ↑ gluconeogenesis, ↓ insulin sensitivity → hyperglycemia, "steroid diabetes."', position: { x: 1320, y: 50 }, isLab: true },
    { id: 'bp-eff', label: 'BP ↑', axis: 'hpa', kind: 'target', description: 'Cortisol upregulates α1 adrenergic receptors → ↑ sensitivity to NE/E (permissive). High-dose cortisol also binds mineralocorticoid receptors → Na⁺/water retention.', position: { x: 1320, y: 140 }, isLab: true },
    { id: 'immune-eff', label: 'Immune ↓', axis: 'hpa', kind: 'target', description: 'Cortisol blocks NF-κB, ↓ leukotrienes/prostaglandins, ↓ WBC adhesion (→ neutrophilia, eosinopenia, lymphopenia), ↓ IL-2. Risk: reactivation of TB.', position: { x: 1320, y: 230 } },
    { id: 'bone-eff', label: 'Bone ↓', axis: 'hpa', kind: 'target', description: '↓ osteoblast activity → osteoporosis. ↓ collagen synthesis → striae and poor wound healing.', position: { x: 1320, y: 320 } },
  ],
  edges: [
    { id: 'stress->hypothalamus', source: 'stress', target: 'hypothalamus', effect: 'stimulates', weight: 1.0 },
    { id: 'hypothalamus->crh', source: 'hypothalamus', target: 'crh', effect: 'stimulates', weight: 1.0 },
    { id: 'crh->pituitary', source: 'crh', target: 'pituitary', effect: 'stimulates', weight: 1.0 },
    { id: 'pituitary->pomc', source: 'pituitary', target: 'pomc', effect: 'stimulates', weight: 1.0 },
    { id: 'pomc->acth', source: 'pomc', target: 'acth', effect: 'converts', weight: 1.0, label: 'cleavage' },
    { id: 'pomc->msh', source: 'pomc', target: 'msh', effect: 'converts', weight: 1.0, label: 'cleavage' },
    { id: 'acth->adrenal', source: 'acth', target: 'adrenal', effect: 'stimulates', weight: 1.0 },
    { id: 'adrenal->cortisol', source: 'adrenal', target: 'cortisol', effect: 'stimulates', weight: 1.0 },
    { id: 'cortisol->glucose', source: 'cortisol', target: 'glucose-eff', effect: 'stimulates', weight: 1.0 },
    { id: 'cortisol->bp', source: 'cortisol', target: 'bp-eff', effect: 'stimulates', weight: 1.0 },
    { id: 'cortisol->immune', source: 'cortisol', target: 'immune-eff', effect: 'inhibits', weight: 1.0 },
    { id: 'cortisol->bone', source: 'cortisol', target: 'bone-eff', effect: 'inhibits', weight: 1.0 },
    // Negative feedback
    { id: 'cortisol-|crh', source: 'cortisol', target: 'crh', effect: 'feedback-neg', weight: 0.7 },
    { id: 'cortisol-|acth', source: 'cortisol', target: 'acth', effect: 'feedback-neg', weight: 0.7 },
  ],
};
