import type { AxisPathway } from '@/model/types';

/**
 * Prolactin axis (unusual: tonically *inhibited* by dopamine).
 *
 * Dopamine ⊣ prolactin (tuberoinfundibular pathway).
 * TRH ⊕ prolactin (why 1°/2° hypothyroidism can cause galactorrhea).
 * Suckling ⊕ prolactin.
 * Prolactin ⊣ GnRH → ↓ FSH/LH → hypogonadism, amenorrhea (natural contraception while breastfeeding).
 * Prolactin ⊣ its own secretion (via dopamine).
 */
export const prl: AxisPathway = {
  id: 'prl',
  name: 'Prolactin axis',
  shortName: 'Prolactin',
  blurb:
    'Unlike other anterior pituitary hormones, prolactin is *tonically inhibited* by dopamine. Anything that ↓ dopamine (antipsychotics, antiemetics, pituitary stalk damage) or ↑ TRH (hypothyroidism) raises prolactin. High prolactin suppresses GnRH → hypogonadism.',
  nodes: [
    { id: 'suckling', label: 'Suckling / chest wall', axis: 'prl', kind: 'stimulus', description: 'Nipple stimulation (and chest wall injury) is the strongest physiologic stimulus for prolactin release.', position: { x: 60, y: 60 } },
    { id: 'sleep', label: 'Sleep / stress', axis: 'prl', kind: 'stimulus', description: 'Diurnal: prolactin peaks at night. Stress and exercise also ↑ prolactin.', position: { x: 60, y: 160 } },
    { id: 'estrogen', label: 'Estrogen (pregnancy / OCP)', axis: 'prl', kind: 'stimulus', description: 'Estrogen ↑ prolactin synthesis — explains the rise during pregnancy and on combined OCPs.', position: { x: 60, y: 260 } },
    { id: 'hypothalamus', label: 'Hypothalamus', axis: 'prl', kind: 'gland', description: 'Arcuate / tuberoinfundibular neurons release dopamine onto pituitary lactotrophs. Other hypothalamic neurons release TRH.', position: { x: 280, y: 200 } },
    { id: 'dopamine', label: 'Dopamine', axis: 'prl', kind: 'hormone', description: 'Tonic inhibitor of prolactin. Therapeutic agonists: bromocriptine, cabergoline (prolactinoma). Antagonists (antipsychotics, metoclopramide) → hyperprolactinemia.', position: { x: 480, y: 140 } },
    { id: 'trh', label: 'TRH', axis: 'prl', kind: 'hormone', description: 'Thyrotropin-releasing hormone also weakly stimulates prolactin. Elevated TRH in primary hypothyroidism is a classic cause of galactorrhea.', position: { x: 480, y: 280 } },
    { id: 'pituitary', label: 'Anterior pituitary', axis: 'prl', kind: 'gland', description: 'Lactotrophs (acidophils) release prolactin.', position: { x: 680, y: 200 } },
    {
      id: 'prolactin',
      label: 'Prolactin',
      axis: 'prl',
      kind: 'hormone',
      description: '↑ milk production. Suppresses GnRH (→ ↓ FSH/LH → amenorrhea, ↓ libido, infertility). Structurally homologous to GH.',
      mnemonic: 'Acid PiG: Acidophils — PRL, GH.',
      position: { x: 880, y: 200 },
      isLab: true,
      units: 'ng/mL',
    },
    { id: 'lactation', label: 'Lactation', axis: 'prl', kind: 'target', description: '↑ milk synthesis in alveolar epithelium of breast (prolactin), and milk letdown via oxytocin (separate hormone). Lactation also keeps GnRH suppressed.', position: { x: 1080, y: 120 } },
    { id: 'gnrh', label: 'GnRH (downstream)', axis: 'prl', kind: 'hormone', description: 'Prolactin ⊣ GnRH → ↓ FSH/LH → hypogonadism, amenorrhea (galactorrhea + amenorrhea = classic prolactinoma).', position: { x: 1080, y: 280 } },
  ],
  edges: [
    { id: 'hypothalamus->dopamine', source: 'hypothalamus', target: 'dopamine', effect: 'stimulates', weight: 1.0, label: 'tonic' },
    { id: 'hypothalamus->trh', source: 'hypothalamus', target: 'trh', effect: 'stimulates', weight: 0.5 },
    { id: 'suckling-|dopamine', source: 'suckling', target: 'dopamine', effect: 'inhibits', weight: 1.0 },
    { id: 'sleep-|dopamine', source: 'sleep', target: 'dopamine', effect: 'inhibits', weight: 0.5 },
    { id: 'estrogen->trh', source: 'estrogen', target: 'trh', effect: 'stimulates', weight: 0.5 },
    { id: 'estrogen->pituitary', source: 'estrogen', target: 'pituitary', effect: 'stimulates', weight: 0.7, label: 'direct' },
    { id: 'dopamine-|pituitary', source: 'dopamine', target: 'pituitary', effect: 'inhibits', weight: 1.0, label: 'tonic ⊣', blockedBy: ['bromocriptine', 'cabergoline', 'antipsychotics', 'metoclopramide'] },
    { id: 'trh->pituitary', source: 'trh', target: 'pituitary', effect: 'stimulates', weight: 0.6 },
    { id: 'pituitary->prolactin', source: 'pituitary', target: 'prolactin', effect: 'stimulates', weight: 1.0 },
    { id: 'prolactin->lactation', source: 'prolactin', target: 'lactation', effect: 'stimulates', weight: 1.0 },
    { id: 'prolactin-|gnrh', source: 'prolactin', target: 'gnrh', effect: 'inhibits', weight: 1.0 },
    // Auto-inhibition: prolactin ↑ dopamine
    { id: 'prolactin->dopamine-fb', source: 'prolactin', target: 'dopamine', effect: 'stimulates', weight: 0.4, label: 'short loop' },
  ],
};
