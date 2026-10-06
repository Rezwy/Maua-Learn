/**
 * Domain types for the Maua Learn "Executive Incident Simulator & Micro-Governance Engine".
 */

/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

export interface Option {
  text: string;
  isCorrect: boolean;
}

/** Executive rationale surfaced in the post-mortem after a stage is completed. */
export interface DecisionRationale {
  /** Operational Impact — why the ideal option matters for async remote leadership. */
  correctReason: string;
  /** Risk Guardrail — systemic / financial exposure if the wrong call is made. */
  operationalRisk: string;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  rationale: DecisionRationale;
}

export interface LessonModule {
  id: string;
  index: number;
  badge: string;
  title: string;
  description: string;
  duration: string;
  questions: Question[];
}

/** Map of question id -> option chosen by the learner during a run. */
export type ChoiceMap = Record<number, Option>;

export type QuizScreen = 'today' | 'quiz' | 'completed' | 'doctor';

/* ------------------------------------------------------------------ */
/* Async Friction Doctor                                               */
/* ------------------------------------------------------------------ */

export interface FrictionScenario {
  id: string;
  /** Short label used in the scenario switcher. */
  label: string;
  sender: string;
  senderRole: string;
  senderRegion: string;
  channel: string;
  /** Local time stamp shown on the message bubble. */
  timestamp: string;
  /** The original, friction-heavy message. */
  message: string;
  /** Facts the rewriter is allowed to reference (links, deadlines, owners). */
  context: string[];
  /** A reference rewrite that scores highly on all three metrics. */
  exemplar: string;
}

export type MetricKey = 'context' | 'safety' | 'action';

export type AuditTier = 'STRONG' | 'ADEQUATE' | 'AT RISK';

export interface MetricResult {
  key: MetricKey;
  label: string;
  /** 0 – 100 */
  score: number;
  tier: AuditTier;
  /** Signals that were detected in the rewrite (positive evidence). */
  signals: string[];
  /** Concrete, actionable next improvement. */
  feedback: string;
}

export interface ToneAudit {
  /** Weighted overall governance score, 0 – 100. */
  overall: number;
  tier: AuditTier;
  verdict: string;
  metrics: MetricResult[];
  /** Hostile / friction patterns still present in the rewrite. */
  frictionFlags: string[];
  wordCount: number;
}
