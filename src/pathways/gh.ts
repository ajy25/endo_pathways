import type { AxisPathway } from '@/model/types';

/**
 * GH / IGF-1 axis.
 *
 * Sleep/hypoglycemia/exercise/stress/puberty ⊕ GHRH, ⊣ somatostatin → GH (pulsatile).
 * GH → IGF-1 (somatomedin C) from liver → growth.
 * GH itself: direct anti-insulin / lipolytic / pro-glucose effects.
 * Negative feedback: IGF-1 ⊣ GHRH and ⊕ somatostatin.
 *
 * Acromegaly: clamp GH high → IGF-1 high → poor glucose tolerance.
 * Laron dwarfism: GH receptor defect (clamp IGF-1 low while GH high).
 */
export const gh: AxisPathway = {
  id: 'gh',
  name: 'Growth hormone / IGF-1 axis',
  shortName: 'GH / IGF-1',
  blurb:
    'GHRH and somatostatin from the hypothalamus push and pull GH from the pituitary. GH drives IGF-1 release from the liver, which mediates most of the growth effects and provides negative feedback to the brain. GH also directly produces insulin resistance.',
  nodes: [
    { id: 'sleep', label: 'Sleep / hypoglycemia / exercise', axis: 'gh', kind: 'stimulus', description: 'Deep sleep, hypoglycemia, exercise, stress, and puberty all promote GHRH release.', position: { x: 60, y: 100 } },
    { id: 'hyperglycemia', label: 'Hyperglycemia / aging / obesity', axis: 'gh', kind: 'stimulus', description: 'Hyperglycemia, aging, and obesity suppress GH via ↑ somatostatin / ↓ GHRH.', position: { x: 60, y: 300 } },
    { id: 'hypothalamus', label: 'Hypothalamus', axis: 'gh', kind: 'gland', description: 'Source of GHRH (arcuate nucleus) and somatostatin (periventricular nucleus).', position: { x: 280, y: 200 } },
    { id: 'ghrh', label: 'GHRH', axis: 'gh', kind: 'hormone', description: 'Growth hormone-releasing hormone. ↑ pulsatile GH release.', position: { x: 460, y: 140 } },
    { id: 'somatostatin', label: 'Somatostatin', axis: 'gh', kind: 'hormone', description: 'GHIH (growth-hormone-inhibiting hormone). Also inhibits TSH, glucagon, insulin, gastrin. Therapeutic analog: octreotide.', position: { x: 460, y: 260 } },
    { id: 'pituitary', label: 'Anterior pituitary', axis: 'gh', kind: 'gland', description: 'Somatotrophs (acidophils) release GH in pulses.', position: { x: 640, y: 200 } },
    {
      id: 'gh',
      label: 'GH',
      axis: 'gh',
      kind: 'hormone',
      description: 'Growth hormone (somatotropin). ↑ amino acid uptake, protein synthesis. ↑ lipolysis, ↑ gluconeogenesis (diabetogenic / insulin resistance).',
      mnemonic: 'Acid PiG: Acidophils — PRL, GH.',
      position: { x: 820, y: 200 },
      isLab: true,
      units: 'ng/mL',
    },
    {
      id: 'igf1',
      label: 'IGF-1',
      axis: 'gh',
      kind: 'hormone',
      description: 'Insulin-like growth factor 1 (somatomedin C). Made by liver in response to GH. Mediates most growth effects (long bones, organomegaly). More stable lab than GH (which fluctuates).',
      position: { x: 1000, y: 200 },
      isLab: true,
      units: 'ng/mL',
    },
    { id: 'liver', label: 'Liver', axis: 'gh', kind: 'gland', description: 'Site of IGF-1 synthesis in response to GH.', position: { x: 1000, y: 80 } },
    { id: 'growth-eff', label: 'Bone & soft-tissue growth', axis: 'gh', kind: 'target', description: 'Linear growth at open epiphyses (children: gigantism) or appositional / soft-tissue growth at closed plates (adults: acromegaly).', position: { x: 1200, y: 140 } },
    { id: 'glucose-eff', label: 'Insulin resistance', axis: 'gh', kind: 'target', description: 'GH directly antagonizes insulin → ↑ blood glucose, ↑ free fatty acids. Acromegaly often → impaired glucose tolerance or frank diabetes.', position: { x: 1200, y: 260 }, isLab: true },
  ],
  edges: [
    { id: 'sleep->ghrh', source: 'sleep', target: 'ghrh', effect: 'stimulates', weight: 1.0 },
    { id: 'hyperglycemia->somatostatin', source: 'hyperglycemia', target: 'somatostatin', effect: 'stimulates', weight: 1.0 },
    { id: 'hypothalamus->ghrh', source: 'hypothalamus', target: 'ghrh', effect: 'stimulates', weight: 0.5 },
    { id: 'hypothalamus->somatostatin', source: 'hypothalamus', target: 'somatostatin', effect: 'stimulates', weight: 0.5 },
    { id: 'ghrh->pituitary', source: 'ghrh', target: 'pituitary', effect: 'stimulates', weight: 1.0 },
    { id: 'somatostatin-|pituitary', source: 'somatostatin', target: 'pituitary', effect: 'inhibits', weight: 1.0 },
    { id: 'pituitary->gh', source: 'pituitary', target: 'gh', effect: 'stimulates', weight: 1.0 },
    { id: 'gh->liver', source: 'gh', target: 'liver', effect: 'stimulates', weight: 1.0 },
    { id: 'liver->igf1', source: 'liver', target: 'igf1', effect: 'stimulates', weight: 1.0 },
    { id: 'igf1->growth', source: 'igf1', target: 'growth-eff', effect: 'stimulates', weight: 1.0 },
    { id: 'gh->glucose', source: 'gh', target: 'glucose-eff', effect: 'stimulates', weight: 1.0 },
    // Negative feedback
    { id: 'igf1-|ghrh', source: 'igf1', target: 'ghrh', effect: 'feedback-neg', weight: 0.6 },
    { id: 'igf1->somatostatin-fb', source: 'igf1', target: 'somatostatin', effect: 'stimulates', weight: 0.6, label: 'feedback' },
    { id: 'igf1-|gh', source: 'igf1', target: 'gh', effect: 'feedback-neg', weight: 0.5 },
  ],
};
