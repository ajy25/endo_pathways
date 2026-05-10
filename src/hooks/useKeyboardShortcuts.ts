import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePathwayStore } from '@/store/usePathwayStore';
import { pathways } from '@/pathways';
import type { AxisId } from '@/model/types';

const AXIS_NUMERIC: AxisId[] = ['hpa', 'hpt', 'hpg', 'gh', 'prl', 'adh', 'raas', 'ca', 'glucose'];

export function useKeyboardShortcuts() {
  const nav = useNavigate();
  const resetClamps = usePathwayStore((s) => s.resetClamps);
  const selectedNodeId = usePathwayStore((s) => s.selectedNodeId);
  const selectNode = usePathwayStore((s) => s.selectNode);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;

      if (e.key === 'Escape') {
        if (selectedNodeId) {
          selectNode(null);
          e.preventDefault();
        }
        return;
      }

      if (e.key.toLowerCase() === 'r') {
        resetClamps();
        e.preventDefault();
        return;
      }

      if (e.key.toLowerCase() === 'h') {
        nav('/');
        e.preventDefault();
        return;
      }

      const digit = parseInt(e.key, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= AXIS_NUMERIC.length) {
        const axis = AXIS_NUMERIC[digit - 1];
        if (pathways[axis]) {
          nav(`/axis/${axis}`);
          e.preventDefault();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav, resetClamps, selectedNodeId, selectNode]);
}
