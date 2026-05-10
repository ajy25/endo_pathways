import type { AxisPathway } from '@/model/types';

/**
 * Appetite regulation — minimal Step 1-relevant view.
 *
 * Ghrelin (stomach): orexigenic. Acts on lateral hypothalamus (hunger).
 *   ↑ with sleep deprivation, fasting, Prader-Willi.
 * Leptin (adipose): anorexigenic. Acts on ventromedial hypothalamus (satiety).
 *   ↑ with adiposity; obese patients usually leptin-*resistant*.
 * Endocannabinoids: ↑ appetite (homeostatic + hedonic).
 */
export const appetite: AxisPathway = {
  id: 'appetite',
  name: 'Appetite regulation',
  shortName: 'Appetite',
  blurb:
    'Two hypothalamic centers compete: the lateral area drives hunger (stimulated by ghrelin), the ventromedial area drives satiety (stimulated by leptin). Ghrelin from an empty stomach raises appetite; leptin from adipose suppresses it (when functional).',
  nodes: [
    { id: 'fasting', label: 'Fasting / sleep loss', axis: 'appetite', kind: 'stimulus', description: 'Empty stomach, sleep deprivation, and Prader-Willi all ↑ ghrelin and ↓ leptin → hunger.', position: { x: 60, y: 100 } },
    { id: 'adiposity', label: 'Adipose tissue', axis: 'appetite', kind: 'gland', description: 'Source of leptin (in proportion to fat mass). Obese patients have ↑ leptin but are functionally leptin-resistant.', position: { x: 60, y: 320 } },
    { id: 'stomach', label: 'Stomach', axis: 'appetite', kind: 'gland', description: 'Source of ghrelin. ↑ when empty, ↓ after eating. ↑↑ in Prader-Willi syndrome.', position: { x: 260, y: 100 } },
    { id: 'ghrelin', label: 'Ghrelin', axis: 'appetite', kind: 'hormone', description: 'Orexigenic peptide. Acts on the lateral hypothalamus (hunger center) and also ↑ GH release.', mnemonic: 'Ghrelin makes you ghrow hunghry.', position: { x: 460, y: 100 }, isLab: true },
    { id: 'leptin', label: 'Leptin', axis: 'appetite', kind: 'hormone', description: 'Anorexigenic adipokine. Acts on the ventromedial hypothalamus (satiety). Mutation → severe early-onset obesity. Obesity typically associated with leptin resistance.', mnemonic: 'Leptin keeps you thin.', position: { x: 460, y: 320 }, isLab: true },
    { id: 'hunger-center', label: 'Lateral hypothalamus (hunger)', axis: 'appetite', kind: 'target', description: 'Hunger center. Activation → ↑ food intake.', position: { x: 700, y: 100 } },
    { id: 'satiety-center', label: 'Ventromedial hypothalamus (satiety)', axis: 'appetite', kind: 'target', description: 'Satiety center. Activation → stop eating. Destruction (e.g., craniopharyngioma compression) → hyperphagia.', position: { x: 700, y: 320 } },
    { id: 'appetite-out', label: 'Appetite', axis: 'appetite', kind: 'lab', description: 'Net drive to eat. ↑ in fasting, Prader-Willi, cannabinoid use, glucocorticoids. ↓ in leptin treatment, GLP-1 agonists.', position: { x: 940, y: 200 }, isLab: true },
  ],
  edges: [
    { id: 'fasting->stomach', source: 'fasting', target: 'stomach', effect: 'stimulates', weight: 1.0 },
    { id: 'fasting-|adiposity', source: 'fasting', target: 'adiposity', effect: 'inhibits', weight: 0.5 },
    { id: 'stomach->ghrelin', source: 'stomach', target: 'ghrelin', effect: 'stimulates', weight: 1.0 },
    { id: 'adiposity->leptin', source: 'adiposity', target: 'leptin', effect: 'stimulates', weight: 1.0 },
    { id: 'ghrelin->hunger', source: 'ghrelin', target: 'hunger-center', effect: 'stimulates', weight: 1.0 },
    { id: 'leptin->satiety', source: 'leptin', target: 'satiety-center', effect: 'stimulates', weight: 1.0, blockedBy: ['leptin-resistance'] },
    { id: 'hunger->appetite', source: 'hunger-center', target: 'appetite-out', effect: 'stimulates', weight: 1.0 },
    { id: 'satiety-|appetite', source: 'satiety-center', target: 'appetite-out', effect: 'inhibits', weight: 1.0 },
    // Cross: leptin also damps hunger center
    { id: 'leptin-|hunger', source: 'leptin', target: 'hunger-center', effect: 'inhibits', weight: 0.5 },
  ],
};
