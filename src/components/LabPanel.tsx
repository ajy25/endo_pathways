import { usePathwayStore } from '@/store/usePathwayStore';
import { getPathway } from '@/pathways';
import { arrowOf, bucketLevel } from '@/sim/propagate';

const ARROW_COLOR: Record<ReturnType<typeof bucketLevel>, string> = {
  'very-low': 'text-blue-300',
  low: 'text-blue-300',
  normal: 'text-slate-300',
  high: 'text-red-300',
  'very-high': 'text-red-300',
};

export function LabPanel() {
  const axisId = usePathwayStore((s) => s.axisId);
  const result = usePathwayStore((s) => s.result);
  const clamps = usePathwayStore((s) => s.clamps);
  const drugs = usePathwayStore((s) => s.activeDrugs);
  const scenario = usePathwayStore((s) => s.activeScenario);

  const pathway = axisId ? getPathway(axisId) : null;
  if (!pathway || !result) return null;
  const labs = pathway.nodes.filter((n) => n.isLab);

  return (
    <div className="panel p-3">
      <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">Lab panel</div>
      <ul className="space-y-1.5">
        {labs.map((node) => {
          const v = result.values[node.id] ?? 0;
          const b = bucketLevel(v);
          const arrow = arrowOf(v);
          const isClamped = node.id in clamps;
          return (
            <li key={node.id} className="flex items-baseline justify-between text-sm">
              <span className="text-slate-200">{node.label}</span>
              <span className={['font-mono font-bold', ARROW_COLOR[b]].join(' ')}>
                {arrow}
                {isClamped && <span className="ml-1 text-yellow-400 text-xs">●</span>}
              </span>
            </li>
          );
        })}
      </ul>

      {(Object.keys(clamps).length > 0 || drugs.size > 0 || scenario) && (
        <div className="mt-3 pt-3 border-t border-canvas-border">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1.5">
            Active perturbations
          </div>
          <ul className="text-xs space-y-1 text-slate-300">
            {scenario && (
              <li>
                <span className="text-indigo-300">Scenario:</span> {scenario}
              </li>
            )}
            {Object.entries(clamps).map(([id, v]) => {
              const node = pathway.nodes.find((n) => n.id === id);
              return (
                <li key={id}>
                  <span className="text-yellow-300">●</span> {node?.label ?? id}: {clampLabel(v)}
                </li>
              );
            })}
            {[...drugs].map((d) => (
              <li key={d}>
                <span className="text-emerald-300">℞</span> {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function clampLabel(v: number) {
  if (v <= -2.5) return 'absent / very low';
  if (v <= -0.5) return 'low';
  if (v < 0.5) return 'normal';
  if (v < 2.5) return 'high';
  return 'very high';
}
