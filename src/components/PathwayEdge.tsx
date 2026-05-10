import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, Position, type EdgeProps } from '@xyflow/react';
import type { EdgeEffect } from '@/model/types';

export interface PathwayEdgeData extends Record<string, unknown> {
  effect: EdgeEffect;
  label?: string;
  active: boolean;
  blocked: boolean;
  /** Symmetric lane index (..., -1, 0, 1, ...) used to fan out sibling edges. */
  lane?: number;
}

const LANE_SPACING = 22;

const STROKE: Record<EdgeEffect, string> = {
  stimulates: '#22c55e',
  inhibits: '#ef4444',
  'feedback-neg': '#f97316',
  converts: '#a78bfa',
};

const DASH: Record<EdgeEffect, string | undefined> = {
  stimulates: undefined,
  inhibits: '6 4',
  'feedback-neg': '4 4',
  converts: undefined,
};

const MARKER: Record<EdgeEffect, string> = {
  stimulates: 'url(#arrow-stim)',
  inhibits: 'url(#arrow-inhib)',
  'feedback-neg': 'url(#arrow-inhib)',
  converts: 'url(#arrow-stim)',
};

const PathwayEdgeComponent = (props: EdgeProps) => {
  const { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, data } = props;
  const d = (data ?? {}) as PathwayEdgeData;
  const lane = d.lane ?? 0;
  // Feedback edges leave the top of the source and enter the top of the target —
  // arc them higher when there are multiple, so they don't pile up at the same y.
  const isTopArc = sourcePosition === Position.Top && targetPosition === Position.Top;
  const isBottomArc = sourcePosition === Position.Bottom && targetPosition === Position.Bottom;
  const isHorizontal = sourcePosition === Position.Right || sourcePosition === Position.Left;
  let centerX: number | undefined;
  let centerY: number | undefined;
  if (isTopArc) {
    // Push the elbow further above the nodes for each lane.
    centerY = Math.min(sourceY, targetY) - 40 - Math.abs(lane) * LANE_SPACING;
  } else if (isBottomArc) {
    centerY = Math.max(sourceY, targetY) + 40 + Math.abs(lane) * LANE_SPACING;
  } else if (isHorizontal) {
    // Shift the vertical column of the elbow so siblings ride parallel tracks.
    centerX = (sourceX + targetX) / 2 + lane * LANE_SPACING;
  } else {
    // Vertical run: shift the horizontal row of the elbow instead.
    centerY = (sourceY + targetY) / 2 + lane * LANE_SPACING;
  }
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 12,
    centerX,
    centerY,
  });
  const stroke = d.blocked ? '#64748b' : STROKE[d.effect ?? 'stimulates'];
  const dash = d.blocked ? '2 2' : DASH[d.effect ?? 'stimulates'];
  const markerEnd = d.blocked ? undefined : MARKER[d.effect ?? 'stimulates'];
  return (
    <>
      <BaseEdge
        id={props.id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke,
          strokeWidth: d.active ? 3 : 1.5,
          strokeDasharray: dash,
          opacity: d.blocked ? 0.35 : 1,
        }}
      />
      {d.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
            className="text-[10px] px-1 py-0.5 rounded bg-slate-800/80 border border-slate-600 text-slate-200"
          >
            {d.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export const PathwayEdge = memo(PathwayEdgeComponent);

export function EdgeArrowMarkers() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <marker
          id="arrow-stim"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
        </marker>
        <marker
          id="arrow-inhib"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          {/* T-bar for inhibition */}
          <path d="M 8 0 L 8 10" stroke="#ef4444" strokeWidth="3" fill="none" />
        </marker>
      </defs>
    </svg>
  );
}
