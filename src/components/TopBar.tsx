import { Link, useNavigate } from 'react-router-dom';
import { usePathwayStore } from '@/store/usePathwayStore';
import { pathways } from '@/pathways';
import { scenariosForAxis } from '@/scenarios';
import { drugsForAxis } from '@/drugs';

export function TopBar() {
  const axisId = usePathwayStore((s) => s.axisId);
  const activeDrugs = usePathwayStore((s) => s.activeDrugs);
  const activeScenario = usePathwayStore((s) => s.activeScenario);
  const setAxis = usePathwayStore((s) => s.setAxis);
  const toggleDrug = usePathwayStore((s) => s.toggleDrug);
  const applyScenario = usePathwayStore((s) => s.applyScenario);
  const resetClamps = usePathwayStore((s) => s.resetClamps);
  const nav = useNavigate();

  const availableAxisEntries = (Object.entries(pathways) as [string, (typeof pathways)[keyof typeof pathways]][]).filter(
    ([, v]) => v !== null,
  );
  const scenarios = axisId ? scenariosForAxis(axisId) : [];
  const drugs = axisId ? drugsForAxis(axisId) : [];

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-canvas-border bg-canvas-panel">
      <Link to="/" className="text-white font-bold tracking-tight text-lg shrink-0 hover:text-indigo-300">
        Endo Pathways
      </Link>
      <div className="text-slate-500 shrink-0">/</div>

      <label className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs uppercase text-slate-400">Axis</span>
        <select
          value={axisId ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            setAxis(v as Parameters<typeof setAxis>[0]);
            nav(`/axis/${v}`);
          }}
          className="bg-canvas-bg border border-canvas-border rounded px-2 py-1 text-sm text-slate-100"
        >
          <option value="">— pick —</option>
          {availableAxisEntries.map(([id, p]) => (
            <option key={id} value={id}>
              {p!.shortName}
            </option>
          ))}
        </select>
      </label>

      {axisId && scenarios.length > 0 && (
        <label className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs uppercase text-slate-400">Scenario</span>
          <select
            value={activeScenario ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              if (v) applyScenario(v);
              else resetClamps();
            }}
            className="bg-canvas-bg border border-canvas-border rounded px-2 py-1 text-sm text-slate-100"
          >
            <option value="">— none —</option>
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {axisId && drugs.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs uppercase text-slate-400">Drugs</span>
          {drugs.map((d) => {
            const on = activeDrugs.has(d.id);
            return (
              <button
                key={d.id}
                onClick={() => toggleDrug(d.id)}
                title={d.mechanism}
                className={[
                  'chip cursor-pointer transition-colors',
                  on ? 'bg-emerald-600 text-white' : 'bg-canvas-bg text-slate-300 hover:bg-slate-700 border border-canvas-border',
                ].join(' ')}
              >
                {d.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="grow" />

      <button onClick={resetClamps} className="btn shrink-0">
        Reset
      </button>
    </div>
  );
}
