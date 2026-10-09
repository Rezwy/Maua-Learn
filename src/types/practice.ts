/* ------------------------------------------------------------------ */
/* Communication Practice Lab                                          */
/* ------------------------------------------------------------------ */

export type PracticeScenario = {
  id: string;
  /** Short label for the scenario switcher. */
  label: string;
  sender: string;
  senderRole: string;
  senderRegion: string;
  channel: string;
  /** Local timestamp shown on the message bubble. */
  timestamp: string;
  /** The original, friction-heavy message. */
  message: string;
  /** Facts the rewriter may reference (links, deadlines, owners). */
  context: string[];
  /** A strong reference rewrite for comparison. */
  exemplar: string;
};

export type CheckKey = 'context' | 'tone' | 'request' | 'deadline' | 'fallback';

export type PracticeCheck = {
  key: CheckKey;
  label: string;
  /** Whether the signal was found in the rewrite. */
  present: boolean;
  /** Matched fragments (present) or friction phrases found (tone). */
  evidence: string[];
  /** How to add the missing signal. */
  tip: string;
};

export type PracticeVerdict = 'ready' | 'close' | 'needs-work' | 'not-a-message';

export type PracticeFeedback = {
  verdict: PracticeVerdict;
  verdictText: string;
  checks: PracticeCheck[];
  wordCount: number;
};
