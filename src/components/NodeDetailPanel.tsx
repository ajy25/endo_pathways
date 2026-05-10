import { usePathwayStore } from '@/store/usePathwayStore';
import { getPathway } from '@/pathways';
import { arrowOf, bucketLevel } from '@/sim/propagate';

const CLAMP_OPTIONS: { label: string; value: number | null; tone: string }[] = [
  { label: '↓↓', value: -3, tone: 'bg-blue-900 hover:bg-blue-800' },
  { label: '↓', value: -1.5, tone: 'bg-blue-700 hover:bg-blue-600' },
  { label: '→', value: 0, tone: 'bg-slate-700 hover:bg-slate-600' },
  { label: '↑', value: 1.5, tone: 'bg-red-700 hover:bg-red-600' },
  { label: '↑↑', value: 3, tone: 'bg-red-900 hover:bg-red-800' },
  { label: 'release', value: null, tone: 'bg-canvas-panel hover:bg-slate-700' },
];

export function NodeDetailPanel() {
  const selectedNodeId = usePathwayStore((s) => s.selectedNodeId);
  const axisId = usePathwayStore((s) => s.axisId);
  const result = usePathwayStore((s) => s.result);
  const clamps = usePathwayStore((s) => s.clamps);
  const setClamp = usePathwayStore((s) => s.setClamp);

  const pathway = axisId ? getPathway(axisId) : null;
  if (!pathway) return null;
  if (!selectedNodeId) {
    return (
      <div className="panel p-3 text-sm text-slate-400">
        <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Selected node</div>
        Click a node to see details and perturb it. Use <span className="font-mono">↑/↓</span> buttons to clamp a hormone high or low.
      </div>
    );
  }
  const node = pathway.nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;
  const level = result?.values[node.id] ?? 0;
  const arrow = arrowOf(level);
  const bucket = bucketLevel(level);
  const clamped = node.id in clamps;

  return (
    <div className="panel p-3">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-400">{node.kind}</div>
          <h3 className="text-base font-semibold text-white">{node.label}</h3>
        </div>
        <div className={['text-2xl font-bold', bucket === 'normal' ? 'text-slate-300' : level > 0 ? 'text-red-300' : 'text-blue-300'].join(' ')}>
          {arrow}
        </div>
      </div>

      {node.description && <p className="text-sm text-slate-300 mb-2 leading-snug">{node.description}</p>}

      {node.mnemonic && (
        <div className="text-xs italic text-amber-200 bg-amber-900/20 border border-amber-700/30 rounded p-1.5 mb-2">
          {node.mnemonic}
        </div>
      )}

      {node.clinicalNotes && node.clinicalNotes.length > 0 && (
        <div className="text-xs text-slate-300 mb-3 space-y-1">
          <div className="uppercase tracking-wider text-slate-400">Clinical</div>
          <ul className="list-disc pl-4 space-y-0.5">
            {node.clinicalNotes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Clamp</div>
        <div className="flex flex-wrap gap-1">
          {CLAMP_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setClamp(node.id, opt.value)}
              className={[
                'px-2.5 py-1 text-sm rounded border border-canvas-border text-white',
                opt.tone,
                clamped && opt.value !== null && clamps[node.id] === opt.value ? 'ring-2 ring-yellow-400' : '',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-1.5 leading-snug">
          Clamping holds this node at the chosen level and lets the rest of the network propagate around it.
        </div>
      </div>
    </div>
  );
}
