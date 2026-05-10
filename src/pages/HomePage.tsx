import { Link } from 'react-router-dom';
import { pathways } from '@/pathways';
import type { AxisId, AxisPathway } from '@/model/types';

const AXIS_ORDER: Exclude<AxisId, 'overview'>[] = ['hpt', 'hpa', 'hpg', 'gh', 'prl', 'adh', 'raas', 'ca', 'glucose', 'steroidogenesis', 'appetite'];

const AXIS_LABELS: Record<Exclude<AxisId, 'overview'>, string> = {
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
      <Link
        to="/axis/overview"
        className="panel p-4 mb-3 block border-indigo-500/50 hover:border-indigo-400 transition-colors bg-gradient-to-r from-indigo-900/30 to-canvas-panel"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="text-base font-semibold text-white">Overview — all axes</div>
          <span className="chip bg-indigo-500/40 text-indigo-100">cross-axis links →</span>
        </div>
        <div className="text-xs text-slate-300 leading-snug">
          See every axis on one canvas, with the classic cross-axis links wired up
          (TRH→PRL, GC→deiodinase, leptin→GnRH, GH→glucose, aldo→K⁺, …). Clamping
          propagates across axes.
        </div>
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AXIS_ORDER.map((id) => {
          const p = pathways[id] as AxisPathway | null;
          const ready = p !== null;
          return (
            <AxisCard key={id} id={id} title={AXIS_LABELS[id]} blurb={p?.blurb} ready={ready} />
          );
        })}
      </div>
      <div className="mt-8 text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
        <span>Shortcuts:</span>
        <span><kbd className="kbd">1</kbd>–<kbd className="kbd">9</kbd> jump to axis</span>
        <span><kbd className="kbd">H</kbd> home</span>
        <span><kbd className="kbd">R</kbd> reset</span>
        <span><kbd className="kbd">Esc</kbd> deselect</span>
      </div>
    </div>
  );
}

function AxisCard({ id, title, blurb, ready }: { id: Exclude<AxisId, 'overview'>; title: string; blurb?: string; ready: boolean }) {
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
