import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PathwayCanvas } from '@/components/PathwayCanvas';
import { LabPanel } from '@/components/LabPanel';
import { NodeDetailPanel } from '@/components/NodeDetailPanel';
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
      <div className="panel overflow-hidden">
        <div className="px-4 py-2 border-b border-canvas-border">
          <h2 className="text-base font-semibold text-white">{pathway.name}</h2>
          <p className="text-xs text-slate-400 leading-snug mt-0.5">{pathway.blurb}</p>
        </div>
        <div className="h-[calc(100%-58px)]">
          <PathwayCanvas />
        </div>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
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
