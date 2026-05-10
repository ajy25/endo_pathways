import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PathwayCanvas } from '@/components/PathwayCanvas';
import { LabPanel } from '@/components/LabPanel';
import { NodeDetailPanel } from '@/components/NodeDetailPanel';
import { NodeSearch } from '@/components/NodeSearch';
import { usePathwayStore } from '@/store/usePathwayStore';
import { getPathway } from '@/pathways';
import type { AxisId } from '@/model/types';
import { getScenario, scenariosForAxis } from '@/scenarios';

export function AxisPage() {
  const { axisId } = useParams<{ axisId: AxisId }>();
  const currentAxis = usePathwayStore((s) => s.axisId);
  const activeScenario = usePathwayStore((s) => s.activeScenario);
  const setAxis = usePathwayStore((s) => s.setAxis);

  useEffect(() => {
    if (axisId && axisId !== currentAxis) {
      setAxis(axisId);
    }
  }, [axisId, currentAxis, setAxis]);

  if (!axisId) return <Navigate to="/" replace />;
  const pathway = getPathway(axisId);
  if (!pathway) {
    return (
      <div className="p-6 text-slate-300">
        <div className="text-lg text-white mb-2">{axisId} not implemented yet</div>
        <div className="text-sm text-slate-400">This axis hasn't been wired up. Pick a different one from the top bar.</div>
      </div>
    );
  }
  const scenarioObj = activeScenario ? getScenario(activeScenario) : null;

  return (
    <div className="grid grid-cols-[1fr_320px] gap-3 p-3 h-[calc(100vh-60px)]">
      <div className="panel overflow-hidden flex flex-col">
        <div className="px-4 py-2 border-b border-canvas-border shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white">{pathway.name}</h2>
              <p className="text-xs text-slate-400 leading-snug mt-0.5">{pathway.blurb}</p>
            </div>
            <ChangedOnlyToggle />
          </div>
          {axisId === 'overview' && <OverviewAxisToggles />}
        </div>
        <div className="grow min-h-0">
          <PathwayCanvas />
        </div>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
        <NodeSearch />
        <LabPanel />
        <NodeDetailPanel />
        {scenarioObj && <ScenarioCard />}
        <ScenarioHelp axisId={axisId} />
      </div>
    </div>
  );
}

function ScenarioCard() {
  const activeScenario = usePathwayStore((s) => s.activeScenario);
  if (!activeScenario) return null;
  const sc = getScenario(activeScenario);
  if (!sc) return null;
  return (
    <div className="panel p-3 border-indigo-500/50">
      <div className="text-xs uppercase tracking-wider text-indigo-300 mb-1">Scenario</div>
      <div className="text-sm font-semibold text-white mb-1">{sc.name}</div>
      <p className="text-sm text-slate-300 leading-snug mb-2">{sc.description}</p>
      <details className="text-sm">
        <summary className="cursor-pointer text-indigo-300 hover:text-indigo-200">Teaching point</summary>
        <p className="text-sm text-slate-200 mt-1 leading-snug">{sc.teachingPoint}</p>
      </details>
    </div>
  );
}

function ChangedOnlyToggle() {
  const on = usePathwayStore((s) => s.showOnlyChanged);
  const toggle = usePathwayStore((s) => s.toggleShowOnlyChanged);
  return (
    <button
      onClick={toggle}
      title="Hide nodes whose value matches the resting baseline"
      className={[
        'chip cursor-pointer transition-colors border shrink-0 whitespace-nowrap',
        on
          ? 'bg-amber-500/30 text-amber-100 border-amber-500/50'
          : 'bg-canvas-bg text-slate-400 border-canvas-border hover:text-slate-200',
      ].join(' ')}
    >
      {on ? '● Only changes' : 'Only changes'}
    </button>
  );
}

const OVERVIEW_AXES: { id: string; label: string }[] = [
  { id: 'hpt', label: 'HPT' },
  { id: 'hpa', label: 'HPA' },
  { id: 'hpg', label: 'HPG' },
  { id: 'gh', label: 'GH' },
  { id: 'prl', label: 'PRL' },
  { id: 'adh', label: 'ADH' },
  { id: 'raas', label: 'RAAS' },
  { id: 'ca', label: 'Ca' },
  { id: 'glucose', label: 'Glucose' },
  { id: 'steroidogenesis', label: 'Steroid' },
  { id: 'appetite', label: 'Appetite' },
];

function OverviewAxisToggles() {
  const hidden = usePathwayStore((s) => s.overviewHiddenAxes);
  const toggle = usePathwayStore((s) => s.toggleOverviewAxis);
  const setVisibility = usePathwayStore((s) => s.setOverviewVisibility);
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 mr-1">Tiles</span>
      {OVERVIEW_AXES.map((a) => {
        const on = !hidden.has(a.id);
        return (
          <button
            key={a.id}
            onClick={() => toggle(a.id)}
            className={[
              'chip cursor-pointer transition-colors border',
              on
                ? 'bg-indigo-500/30 text-indigo-100 border-indigo-500/50'
                : 'bg-canvas-bg text-slate-500 border-canvas-border hover:text-slate-300',
            ].join(' ')}
          >
            {a.label}
          </button>
        );
      })}
      <button
        onClick={() => setVisibility('all')}
        className="ml-2 text-[11px] text-slate-400 hover:text-slate-200 underline-offset-2 hover:underline"
      >
        all
      </button>
      <button
        onClick={() => setVisibility('none')}
        className="text-[11px] text-slate-400 hover:text-slate-200 underline-offset-2 hover:underline"
      >
        none
      </button>
    </div>
  );
}

function ScenarioHelp({ axisId }: { axisId: AxisId }) {
  const apply = usePathwayStore((s) => s.applyScenario);
  const list = scenariosForAxis(axisId);
  if (list.length === 0) return null;
  return (
    <div className="panel p-3">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">Try a scenario</div>
      <ul className="space-y-1">
        {list.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => apply(s.id)}
              className="text-sm text-indigo-300 hover:text-indigo-200 text-left w-full"
            >
              → {s.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
