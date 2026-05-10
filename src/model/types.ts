export type NodeId = string;
export type EdgeId = string;
export type DrugId = string;
export type ScenarioId = string;

export type AxisId =
  | 'hpa'
  | 'hpt'
  | 'hpg'
  | 'gh'
  | 'prl'
  | 'adh'
  | 'raas'
  | 'ca'
  | 'glucose'
  | 'steroidogenesis'
  | 'appetite';

export type NodeKind =
  | 'hormone'
  | 'gland'
  | 'enzyme'
  | 'target'
  | 'stimulus'
  | 'second-messenger'
  | 'lab';

export type EdgeEffect = 'stimulates' | 'inhibits' | 'converts' | 'feedback-neg';

export type ClampLevel = 'none' | 'very-low' | 'low' | 'normal' | 'high' | 'very-high' | 'ablated';

export interface PathwayNode {
  id: NodeId;
  axis: AxisId;
  label: string;
  short?: string;
  kind: NodeKind;
  description: string;
  mnemonic?: string;
  clinicalNotes?: string[];
  position: { x: number; y: number };
  /** Surface in the lab panel when relevant. */
  isLab?: boolean;
  units?: string;
  /** Baseline before any propagation (defaults to 0). */
  baseline?: number;
}

export interface PathwayEdge {
  id: EdgeId;
  source: NodeId;
  target: NodeId;
  effect: EdgeEffect;
  /** 0..1 — strength of the influence in qualitative units. */
  weight: number;
  label?: string;
  /** Drugs (by id) that block this edge when active. */
  blockedBy?: DrugId[];
}

export interface AxisPathway {
  id: AxisId;
  name: string;
  shortName: string;
  blurb: string;
  nodes: PathwayNode[];
  edges: PathwayEdge[];
  /** Optional fixed clamps that represent the "always-on" inputs of the system. */
  defaultClamps?: Record<NodeId, number>;
}

export interface Drug {
  id: DrugId;
  name: string;
  axis: AxisId | AxisId[];
  mechanism: string;
  /** Edges that this drug blocks (by edge id). */
  blocks: EdgeId[];
  /** Additional clamps the drug imposes (e.g., spironolactone "clamps" aldo receptor effect low). */
  clamps?: Record<NodeId, number>;
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  axis: AxisId;
  description: string;
  clamps: Record<NodeId, number>;
  /** Drugs applied as part of this scenario (e.g., exogenous steroids). */
  drugs?: DrugId[];
  /** What labs are expected (qualitative). Used in tests and the teaching reveal. */
  expectedLabs: Partial<Record<NodeId, '↑↑' | '↑' | '→' | '↓' | '↓↓'>>;
  teachingPoint: string;
}

/** Numeric current value of a node after propagation: -3..+3 roughly. */
export type LevelValue = number;

export interface SimulationResult {
  values: Record<NodeId, LevelValue>;
  iterations: number;
  converged: boolean;
}

export interface SimulationInput {
  nodes: PathwayNode[];
  edges: PathwayEdge[];
  /** node id → forced level. Overrides propagation. */
  clamps: Record<NodeId, number>;
  /** edge ids that are currently blocked. */
  blockedEdges?: Set<EdgeId>;
}

export interface SimulationOptions {
  maxIterations?: number;
  epsilon?: number;
  damping?: number;
}
