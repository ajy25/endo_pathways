import type { AxisPathway } from '@/model/types';

/**
 * HPG axis (pooled male + female view for Step 1 clarity).
 *
 * GnRH (pulsatile!) ⊕ LH/FSH ⊕ gonads → sex steroids & inhibin.
 * Negative feedback by testosterone/estrogen and inhibin (selectively ⊣ FSH).
 * Continuous (non-pulsatile) GnRH agonist (leuprolide) paradoxically suppresses the axis.
 * Prolactin ⊣ GnRH → hypogonadism in prolactinoma.
 */
export const hpg: AxisPathway = {
  id: 'hpg',
  name: 'Hypothalamic–Pituitary–Gonadal axis',
  shortName: 'HPG axis',
  blurb:
    'Pulsatile GnRH drives FSH and LH from the pituitary, which act on the gonads to produce sex steroids and gametes. Negative feedback by sex steroids and (selectively for FSH) inhibin closes the loop. Hyperprolactinemia or continuous GnRH agonism shuts the axis down.',
  nodes: [
    { id: 'hypothalamus', label: 'Hypothalamus', axis: 'hpg', kind: 'gland', description: 'Arcuate / preoptic nucleus releases GnRH in pulses every 60–120 min.', position: { x: 60, y: 200 } },
    {
      id: 'gnrh',
      label: 'GnRH (pulsatile)',
      axis: 'hpg',
      kind: 'hormone',
      description:
        'Gonadotropin-releasing hormone. Pulsatile release is required for FSH/LH secretion. Tonic GnRH (leuprolide) initially flares then suppresses the axis. Inhibited by prolactin and (in males) by exogenous androgens.',
      clinicalNotes: ['Leuprolide: pulsatile = stimulates fertility; continuous = suppresses (used in prostate cancer, endometriosis).'],
      position: { x: 240, y: 200 },
    },
    { id: 'pituitary', label: 'Anterior pituitary', axis: 'hpg', kind: 'gland', description: 'Gonadotrophs (basophils) release FSH and LH in response to pulsatile GnRH.', position: { x: 420, y: 200 } },
    { id: 'fsh', label: 'FSH', axis: 'hpg', kind: 'hormone', description: 'Stimulates Sertoli cells (spermatogenesis, inhibin secretion) in males; granulosa cells (aromatase → estrogen, follicle growth) in females.', position: { x: 600, y: 140 }, isLab: true, units: 'mIU/mL' },
    { id: 'lh', label: 'LH', axis: 'hpg', kind: 'hormone', description: 'Stimulates Leydig cells (testosterone) in males; theca cells (androgens for granulosa to aromatize), corpus luteum, and ovulation surge in females.', position: { x: 600, y: 260 }, isLab: true, units: 'mIU/mL' },
    { id: 'testes', label: 'Testes', axis: 'hpg', kind: 'gland', description: 'Leydig cells make testosterone (LH-driven). Sertoli cells make sperm and inhibin B (FSH-driven). Sertoli + Leydig: think of FSH = Sperm, LH = Leydig.', position: { x: 800, y: 140 } },
    { id: 'ovaries', label: 'Ovaries', axis: 'hpg', kind: 'gland', description: 'Theca cells make androgens (LH-driven); granulosa cells aromatize them to estradiol (FSH-driven). Corpus luteum makes progesterone after ovulation.', position: { x: 800, y: 260 } },
    { id: 'testosterone', label: 'Testosterone', axis: 'hpg', kind: 'hormone', description: 'Major androgen in males. Negative feedback on LH (and weakly on FSH and GnRH). Converted peripherally to DHT (5α-reductase) and estradiol (aromatase).', position: { x: 980, y: 100 }, isLab: true, units: 'ng/dL' },
    { id: 'dht', label: 'DHT', axis: 'hpg', kind: 'hormone', description: 'Dihydrotestosterone (testosterone → DHT by 5α-reductase, blocked by finasteride). Drives external genitalia development, prostate growth, male pattern baldness.', position: { x: 1180, y: 60 } },
    { id: 'estradiol', label: 'Estradiol', axis: 'hpg', kind: 'hormone', description: 'Major estrogen in premenopausal females. Negative feedback on FSH/LH most of the cycle; positive feedback at high sustained levels → LH surge (ovulation).', position: { x: 980, y: 230 }, isLab: true, units: 'pg/mL' },
    { id: 'progesterone', label: 'Progesterone', axis: 'hpg', kind: 'hormone', description: 'Corpus luteum (luteal phase) and placenta (pregnancy). Maintains endometrium, ↓ uterine motility. Falls at end of luteal phase → menstruation.', position: { x: 980, y: 310 }, isLab: true },
    { id: 'inhibin', label: 'Inhibin B', axis: 'hpg', kind: 'hormone', description: 'Sertoli (male) / granulosa (female) cells. Selectively inhibits FSH (not LH). High → low FSH (an isolated drop in FSH points to gonadal source).', position: { x: 800, y: 350 } },
    { id: 'prolactin-ext', label: 'Prolactin (ext)', axis: 'hpg', kind: 'stimulus', description: 'External input: high prolactin (e.g., prolactinoma, antipsychotics) inhibits GnRH → hypogonadotropic hypogonadism, amenorrhea, ↓ libido.', position: { x: 60, y: 60 } },
  ],
  edges: [
    { id: 'hypothalamus->gnrh', source: 'hypothalamus', target: 'gnrh', effect: 'stimulates', weight: 1.0 },
    { id: 'gnrh->pituitary', source: 'gnrh', target: 'pituitary', effect: 'stimulates', weight: 1.0 },
    { id: 'pituitary->fsh', source: 'pituitary', target: 'fsh', effect: 'stimulates', weight: 1.0 },
    { id: 'pituitary->lh', source: 'pituitary', target: 'lh', effect: 'stimulates', weight: 1.0 },
    { id: 'fsh->testes', source: 'fsh', target: 'testes', effect: 'stimulates', weight: 0.6, label: 'Sertoli' },
    { id: 'lh->testes', source: 'lh', target: 'testes', effect: 'stimulates', weight: 1.0, label: 'Leydig' },
    { id: 'fsh->ovaries', source: 'fsh', target: 'ovaries', effect: 'stimulates', weight: 1.0, label: 'granulosa' },
    { id: 'lh->ovaries', source: 'lh', target: 'ovaries', effect: 'stimulates', weight: 1.0, label: 'theca' },
    { id: 'testes->testosterone', source: 'testes', target: 'testosterone', effect: 'stimulates', weight: 1.0 },
    { id: 'testosterone->dht', source: 'testosterone', target: 'dht', effect: 'converts', weight: 1.0, label: '5α-reductase', blockedBy: ['finasteride'] },
    { id: 'ovaries->estradiol', source: 'ovaries', target: 'estradiol', effect: 'stimulates', weight: 1.0 },
    { id: 'ovaries->progesterone', source: 'ovaries', target: 'progesterone', effect: 'stimulates', weight: 0.7 },
    { id: 'testes->inhibin', source: 'testes', target: 'inhibin', effect: 'stimulates', weight: 0.6 },
    { id: 'ovaries->inhibin', source: 'ovaries', target: 'inhibin', effect: 'stimulates', weight: 0.6 },
    // Negative feedback
    { id: 'testosterone-|lh', source: 'testosterone', target: 'lh', effect: 'feedback-neg', weight: 0.7 },
    { id: 'testosterone-|gnrh', source: 'testosterone', target: 'gnrh', effect: 'feedback-neg', weight: 0.4 },
    { id: 'estradiol-|fsh', source: 'estradiol', target: 'fsh', effect: 'feedback-neg', weight: 0.6 },
    { id: 'estradiol-|lh', source: 'estradiol', target: 'lh', effect: 'feedback-neg', weight: 0.6 },
    { id: 'inhibin-|fsh', source: 'inhibin', target: 'fsh', effect: 'feedback-neg', weight: 0.7 },
    { id: 'prolactin-|gnrh', source: 'prolactin-ext', target: 'gnrh', effect: 'inhibits', weight: 1.0, label: 'prolactin ⊣' },
  ],
};
