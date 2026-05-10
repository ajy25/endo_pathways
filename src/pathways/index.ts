import type { AxisId, AxisPathway } from '@/model/types';
import { hpt } from './hpt';
import { hpa } from './hpa';
import { hpg } from './hpg';
import { gh } from './gh';
import { prl } from './prl';
import { adh } from './adh';
import { raas } from './raas';
import { ca } from './ca';
import { glucose } from './glucose';
import { appetite } from './appetite';
import { steroidogenesis } from './steroidogenesis';

export const pathways: Record<AxisId, AxisPathway | null> = {
  hpt,
  hpa,
  hpg,
  gh,
  prl,
  adh,
  raas,
  ca,
  glucose,
  appetite,
  steroidogenesis,
};

export const availableAxes: AxisId[] = (Object.keys(pathways) as AxisId[]).filter(
  (id) => pathways[id] !== null,
);

export function getPathway(id: AxisId): AxisPathway | null {
  return pathways[id] ?? null;
}
