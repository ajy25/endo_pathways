import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathwayStore } from '@/store/usePathwayStore';
import { getPathway } from '@/pathways';
import type { PathwayNode } from '@/model/types';

const MAX_RESULTS = 8;

export function NodeSearch() {
  const axisId = usePathwayStore((s) => s.axisId);
  const focusNode = usePathwayStore((s) => s.focusNode);
  const overviewHiddenAxes = usePathwayStore((s) => s.overviewHiddenAxes);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const pathway = axisId ? getPathway(axisId) : null;

  const searchable = useMemo<PathwayNode[]>(() => {
    if (!pathway) return [];
    if (pathway.id !== 'overview' || overviewHiddenAxes.size === 0) return pathway.nodes;
    return pathway.nodes.filter((n) => {
      const axis = n.id.split(':', 1)[0];
      return !overviewHiddenAxes.has(axis);
    });
  }, [pathway, overviewHiddenAxes]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const matches: { node: PathwayNode; score: number }[] = [];
    for (const n of searchable) {
      const label = n.label.toLowerCase();
      const short = n.short?.toLowerCase() ?? '';
      const id = n.id.toLowerCase();
      let score = -1;
      if (label.startsWith(q)) score = 0;
      else if (short && short.startsWith(q)) score = 1;
      else if (label.includes(q)) score = 2;
      else if (short.includes(q)) score = 3;
      else if (id.includes(q)) score = 4;
      if (score >= 0) matches.push({ node: n, score });
    }
    matches.sort((a, b) => a.score - b.score || a.node.label.localeCompare(b.node.label));
    return matches.slice(0, MAX_RESULTS).map((m) => m.node);
  }, [query, searchable]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // "/" anywhere focuses the search box (skip if user is typing in another input).
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== '/') return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      const inEditable = tag === 'INPUT' || tag === 'TEXTAREA' || t?.isContentEditable;
      if (inEditable) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const pick = (n: PathwayNode) => {
    focusNode(n.id);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  if (!pathway) return null;

  const showDropdown = open && results.length > 0;

  return (
    <div className="panel p-2 relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setQuery('');
              setOpen(false);
              (e.target as HTMLInputElement).blur();
            } else if (e.key === 'ArrowDown' && results.length > 0) {
              e.preventDefault();
              setActiveIdx((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === 'ArrowUp' && results.length > 0) {
              e.preventDefault();
              setActiveIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && results[activeIdx]) {
              e.preventDefault();
              pick(results[activeIdx]);
            }
          }}
          placeholder="Search nodes…"
          className="w-full bg-canvas-bg border border-canvas-border rounded pl-7 pr-10 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">⌕</span>
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 border border-canvas-border rounded px-1 pointer-events-none">/</kbd>
      </div>
      {showDropdown && (
        <ul className="absolute left-2 right-2 top-full mt-1 bg-canvas-panel border border-canvas-border rounded shadow-lg z-30 max-h-72 overflow-y-auto">
          {results.map((n, i) => (
            <li key={n.id}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(n)}
                onMouseEnter={() => setActiveIdx(i)}
                className={[
                  'w-full text-left px-2 py-1.5 text-sm flex items-baseline justify-between gap-2',
                  i === activeIdx ? 'bg-indigo-500/25 text-white' : 'text-slate-200 hover:bg-slate-700/40',
                ].join(' ')}
              >
                <span className="truncate">{n.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 shrink-0">{n.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && results.length === 0 && (
        <div className="absolute left-2 right-2 top-full mt-1 bg-canvas-panel border border-canvas-border rounded shadow-lg z-30 px-2 py-1.5 text-sm text-slate-500">
          No matches
        </div>
      )}
    </div>
  );
}
