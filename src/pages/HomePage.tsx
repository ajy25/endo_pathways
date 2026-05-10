import { Link } from 'react-router-dom';
import { pathways } from '@/pathways';
import type { AxisId, AxisPathway } from '@/model/types';

const AXIS_ORDER: AxisId[] = ['hpt', 'hpa', 'hpg', 'gh', 'prl', 'adh', 'raas', 'ca', 'glucose', 'steroidogenesis', 'appetite'];

const AXIS_LABELS: Record<AxisId, string> = {
  hpt: 'Hypothalamic–Pituitary–Thyroid',
  hpa: 'Hypothalamic–Pituitary–Adrenal',
  hpg: 'Hypothalamic–Pituitary–Gonadal',
  gh: 'Growth hormone / IGF-1',
  prl: 'Prolactin',
  adh: 'ADH (vasopressin) / osmolality',
  raas: 'RAAS (renin–angiotensin–aldosterone)',
  ca: 'Calcium & phosphate',
  glucose: 'Glucose homeostasis',
  steroidogenesis: 'Adrenal steroidogenesis (CAH)',
  appetite: 'Appetite regulation',
};

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Endo Pathways</h1>
        <p className="text-slate-300 max-w-2xl">
          Interactive visualizations of the major endocrine axes covered on USMLE Step 1.
          Click a node to inspect it; clamp it high or low to see how the rest of the system responds.
          Try a disease scenario to see classic patterns (Graves, Hashimoto, Cushing, Addison, etc.).
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AXIS_ORDER.map((id) => {
          const p = pathways[id] as AxisPathway | null;
          const ready = p !== null;
          return (
            <AxisCard key={id} id={id} title={AXIS_LABELS[id]} blurb={p?.blurb} ready={ready} />
          );
        })}
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300 leading-relaxed">
        <div className="panel p-4">
          <div className="text-slate-200 font-semibold mb-2">How to use</div>
          <p className="text-slate-400">
            Each axis is a network of hormones, glands, and target effects. Levels are
            qualitative (direction-of-change only). Click a node and clamp it ↑ / ↓ to see
            how the whole system responds. The lab panel summarizes the labs you'd see on a
            test question.
          </p>
        </div>
        <div className="panel p-4">
          <div className="text-slate-200 font-semibold mb-2">Keyboard shortcuts</div>
          <ul className="space-y-1 text-slate-400">
            <li><kbd className="kbd">1</kbd>–<kbd className="kbd">9</kbd> <span className="ml-1">jump to an axis</span></li>
            <li><kbd className="kbd">H</kbd> <span className="ml-1">back to home</span></li>
            <li><kbd className="kbd">R</kbd> <span className="ml-1">reset all perturbations</span></li>
            <li><kbd className="kbd">Esc</kbd> <span className="ml-1">deselect node</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function AxisCard({ id, title, blurb, ready }: { id: AxisId; title: string; blurb?: string; ready: boolean }) {
  if (!ready) {
    return (
      <div className="panel p-4 opacity-50">
        <div className="flex items-center justify-between mb-1">
          <div className="text-base font-semibold text-slate-200">{title}</div>
          <span className="chip bg-slate-500/30 text-slate-300">soon</span>
        </div>
        <div className="text-xs text-slate-500">Not implemented yet.</div>
      </div>
    );
  }
  return (
    <Link to={`/axis/${id}`} className="panel p-4 block hover:border-indigo-500 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <div className="text-base font-semibold text-white">{title}</div>
        <span className="chip bg-indigo-500/30 text-indigo-200">open →</span>
      </div>
      {blurb && <div className="text-xs text-slate-400 leading-snug line-clamp-3">{blurb}</div>}
    </Link>
  );
}
