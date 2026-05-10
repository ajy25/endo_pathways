import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { NodeKind } from '@/model/types';
import { bucketLevel } from '@/sim/propagate';

export interface HormoneNodeData extends Record<string, unknown> {
  label: string;
  kind: NodeKind;
  level: number;
  clamped: boolean;
  selected: boolean;
  isLab?: boolean;
}

const KIND_BADGE: Record<NodeKind, { label: string; tint: string }> = {
  hormone: { label: 'hormone', tint: 'bg-indigo-500/20 text-indigo-200' },
  gland: { label: 'gland', tint: 'bg-pink-500/20 text-pink-200' },
  enzyme: { label: 'enzyme', tint: 'bg-amber-500/20 text-amber-200' },
  target: { label: 'effect', tint: 'bg-emerald-500/20 text-emerald-200' },
  stimulus: { label: 'stimulus', tint: 'bg-slate-500/20 text-slate-200' },
  'second-messenger': { label: 'binder', tint: 'bg-sky-500/20 text-sky-200' },
  lab: { label: 'lab', tint: 'bg-violet-500/20 text-violet-200' },
};

const LEVEL_BG: Record<ReturnType<typeof bucketLevel>, string> = {
  'very-low': 'bg-blue-900 border-blue-400',
  low: 'bg-blue-700 border-blue-300',
  normal: 'bg-slate-700 border-slate-400',
  high: 'bg-red-700 border-red-300',
  'very-high': 'bg-red-900 border-red-400',
};

function arrowFor(level: number): string {
  const b = bucketLevel(level);
  if (b === 'very-low') return '↓↓';
  if (b === 'low') return '↓';
  if (b === 'high') return '↑';
  if (b === 'very-high') return '↑↑';
  return '→';
}

const HormoneNodeComponent = ({ data, selected }: NodeProps) => {
  const d = data as unknown as HormoneNodeData;
  const bucket = bucketLevel(d.level);
  const badge = KIND_BADGE[d.kind];
  const bg = LEVEL_BG[bucket];
  return (
    <div
      className={[
        'rounded-lg border-2 px-3 py-2 min-w-[150px] shadow-md transition-all',
        bg,
        selected ? 'ring-2 ring-indigo-400' : '',
        d.clamped ? 'ring-2 ring-yellow-400' : '',
      ].join(' ')}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-semibold text-white leading-tight">{d.label}</div>
        <div className="text-lg font-bold text-white leading-none">{arrowFor(d.level)}</div>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <span className={['chip', badge.tint].join(' ')}>{badge.label}</span>
        {d.isLab && <span className="chip bg-violet-500/20 text-violet-200">lab</span>}
        {d.clamped && <span className="chip bg-yellow-500/30 text-yellow-100">clamped</span>}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export const HormoneNode = memo(HormoneNodeComponent);
