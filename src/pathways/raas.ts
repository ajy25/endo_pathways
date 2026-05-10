import type { AxisPathway } from '@/model/types';

/**
 * Renin–Angiotensin–Aldosterone System.
 *
 * ↓ renal perfusion / ↓ Na⁺ delivery / β1 sympathetics → JG cells → renin.
 * Renin: angiotensinogen → AngI. ACE: AngI → AngII (in lung).
 * AngII: vasoconstriction; ⊕ aldosterone (zona glomerulosa); ⊕ ADH; ⊕ thirst; ⊕ proximal Na⁺/H⁺ reabsorption; efferent arteriolar constriction.
 * Aldosterone: principal cells — ↑ ENaC, ↑ ROMK (K⁺ secretion), ↑ H⁺-ATPase in α-intercalated cells.
 *
 * Conn (primary hyperaldo): clamp aldo high → ↑ Na⁺, ↓ K⁺, ↓ renin.
 * Renal artery stenosis: clamp renin high.
 * ACEi/ARB: block AngI→AngII or AngII action.
 */
export const raas: AxisPathway = {
  id: 'raas',
  name: 'Renin–Angiotensin–Aldosterone System',
  shortName: 'RAAS',
  blurb:
    'A volume + BP-regulating cascade. Renin is the rate-limiting step. ACE converts AngI → AngII, which directly vasoconstricts and stimulates aldosterone, ADH, and thirst. Aldosterone retains Na⁺ and secretes K⁺/H⁺ at the principal cell.',
  nodes: [
    { id: 'low-perfusion', label: '↓ renal perfusion', axis: 'raas', kind: 'stimulus', description: 'JG cells sense renal afferent arteriolar pressure. ↓ perfusion (volume loss, RAS, CHF) → ↑ renin.', position: { x: 60, y: 100 } },
    { id: 'low-na', label: '↓ distal Na⁺ delivery', axis: 'raas', kind: 'stimulus', description: 'Macula densa senses NaCl in the distal tubule. ↓ NaCl → ↑ renin (also dilates the afferent arteriole).', position: { x: 60, y: 220 } },
    { id: 'sympathetics', label: 'β1 sympathetics', axis: 'raas', kind: 'stimulus', description: 'Sympathetic activation directly stimulates JG cell renin release via β1 receptors.', position: { x: 60, y: 340 } },
    { id: 'jg', label: 'JG cells', axis: 'raas', kind: 'gland', description: 'Modified smooth muscle in the afferent arteriole. Synthesize and release renin.', position: { x: 260, y: 220 } },
    { id: 'renin', label: 'Renin', axis: 'raas', kind: 'enzyme', description: 'Enzyme that cleaves angiotensinogen → AngI. Rate-limiting step of RAAS.', position: { x: 440, y: 220 }, isLab: true, units: 'ng/mL/hr' },
    { id: 'angI', label: 'Angiotensin I', axis: 'raas', kind: 'hormone', description: 'Inactive decapeptide. Converted to AngII by ACE in the pulmonary endothelium.', position: { x: 620, y: 220 } },
    { id: 'ace', label: 'ACE', axis: 'raas', kind: 'enzyme', description: 'Angiotensin-converting enzyme. Also degrades bradykinin (ACEi cough/angioedema). Blocked by lisinopril, captopril, etc.', position: { x: 800, y: 220 } },
    { id: 'angII', label: 'Angiotensin II', axis: 'raas', kind: 'hormone', description: 'Octapeptide effector. Vasoconstricts (esp. efferent arteriole), ⊕ aldosterone, ⊕ ADH, ⊕ thirst, ⊕ proximal Na⁺/H⁺ exchange. Blocked by ARBs (losartan).', position: { x: 980, y: 220 }, isLab: true },
    { id: 'aldo', label: 'Aldosterone', axis: 'raas', kind: 'hormone', description: 'Zona glomerulosa. Acts on principal cells: ↑ ENaC, ↑ Na⁺/K⁺-ATPase → Na⁺ reabsorption, K⁺ secretion. ↑ H⁺ secretion (intercalated cells) → metabolic alkalosis.', position: { x: 1160, y: 140 }, isLab: true, units: 'ng/dL' },
    { id: 'vasoconstriction', label: 'Vasoconstriction', axis: 'raas', kind: 'target', description: 'AngII directly constricts systemic arterioles (↑ SVR, ↑ BP). Preferentially constricts efferent arteriole → ↑ GFR despite ↓ flow.', position: { x: 1160, y: 220 } },
    { id: 'thirst', label: 'Thirst / ADH', axis: 'raas', kind: 'target', description: 'AngII stimulates subfornical organ → thirst, and ↑ posterior pituitary ADH release.', position: { x: 1160, y: 300 } },
    { id: 'serum-na', label: 'Serum Na⁺', axis: 'raas', kind: 'lab', description: 'Aldosterone retains Na⁺ (often normal because water follows it — volume rather than concentration changes).', position: { x: 1380, y: 100 }, isLab: true },
    { id: 'serum-k', label: 'Serum K⁺', axis: 'raas', kind: 'lab', description: 'Aldosterone excretes K⁺. Hyperaldo → hypokalemia. Hypoaldo (Addison) → hyperkalemia.', position: { x: 1380, y: 180 }, isLab: true },
    { id: 'serum-bp', label: 'Blood pressure', axis: 'raas', kind: 'lab', description: 'Integrated output: vasoconstriction + volume retention. Hyperaldo or RAS → hypertension. Hypoaldo → hypotension.', position: { x: 1380, y: 260 }, isLab: true, units: 'mmHg' },
    { id: 'serum-ph', label: 'Arterial pH', axis: 'raas', kind: 'lab', description: 'Aldosterone ↑ H⁺ secretion → metabolic alkalosis (hyperaldo). Addison → metabolic acidosis (no H⁺ excretion).', position: { x: 1380, y: 340 }, isLab: true },
  ],
  edges: [
    { id: 'low-perfusion->jg', source: 'low-perfusion', target: 'jg', effect: 'stimulates', weight: 1.0 },
    { id: 'low-na->jg', source: 'low-na', target: 'jg', effect: 'stimulates', weight: 1.0 },
    { id: 'sympathetics->jg', source: 'sympathetics', target: 'jg', effect: 'stimulates', weight: 0.8 },
    { id: 'jg->renin', source: 'jg', target: 'renin', effect: 'stimulates', weight: 1.0 },
    { id: 'renin->angI', source: 'renin', target: 'angI', effect: 'stimulates', weight: 1.0 },
    { id: 'angI->ace', source: 'angI', target: 'ace', effect: 'stimulates', weight: 1.0 },
    { id: 'ace->angII', source: 'ace', target: 'angII', effect: 'converts', weight: 1.0, blockedBy: ['acei'] },
    { id: 'angII->aldo', source: 'angII', target: 'aldo', effect: 'stimulates', weight: 1.0, blockedBy: ['arb'] },
    { id: 'angII->vasoconstriction', source: 'angII', target: 'vasoconstriction', effect: 'stimulates', weight: 1.0, blockedBy: ['arb'] },
    { id: 'angII->thirst', source: 'angII', target: 'thirst', effect: 'stimulates', weight: 0.8, blockedBy: ['arb'] },
    { id: 'aldo->serum-na', source: 'aldo', target: 'serum-na', effect: 'stimulates', weight: 0.5, blockedBy: ['spironolactone', 'eplerenone'] },
    { id: 'aldo-|serum-k', source: 'aldo', target: 'serum-k', effect: 'inhibits', weight: 1.0, blockedBy: ['spironolactone', 'eplerenone'] },
    { id: 'aldo->serum-ph', source: 'aldo', target: 'serum-ph', effect: 'stimulates', weight: 0.6, label: '↑ H⁺ excretion → ↑ pH', blockedBy: ['spironolactone', 'eplerenone'] },
    { id: 'aldo->bp', source: 'aldo', target: 'serum-bp', effect: 'stimulates', weight: 0.8 },
    { id: 'vasoconstriction->bp', source: 'vasoconstriction', target: 'serum-bp', effect: 'stimulates', weight: 1.0 },
    // Feedback: high BP / high Na⁺ ↓ renin
    { id: 'serum-bp-|jg', source: 'serum-bp', target: 'jg', effect: 'feedback-neg', weight: 0.7 },
  ],
};
