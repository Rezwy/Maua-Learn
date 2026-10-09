/**
 * Communication Practice Lab — checklist-based message analyzer.
 *
 * This is a rule-based text scanner, NOT an AI model. It checks the learner's
 * rewrite against five signals: context, tone, a clear request, a deadline, and
 * a fallback plan. Each check reports what it found (or what is missing) with an
 * actionable tip.
 *
 * The analyzer intentionally does NOT produce a numerical "governance score" or
 * claim to measure psychological safety. It shows which signals are present and
 * which are missing, so the learner can improve one signal at a time.
 */

import type {
  CheckKey,
  PracticeCheck,
  PracticeFeedback,
  PracticeVerdict,
} from '@/types/practice';

/* ------------------------------------------------------------------ */
/* Signal patterns                                                     */
/* ------------------------------------------------------------------ */

type Pattern = { re: RegExp; evidence: string };

const CONTEXT_PATTERNS: Pattern[] = [
  { re: /https?:\/\/\S+/i, evidence: 'Link' },
  { re: /(?:\bPR\s?#?\d+|#\d{2,}|\b(?:brief|ticket|document|case|order)\s+#?\d+\b)/i, evidence: 'Specific reference' },
  { re: /\b[\w-]+\.(?:ts|tsx|js|jsx|py|go|rs|ya?ml|json|sql|md)\b/i, evidence: 'File reference' },
  {
    re: /\b(?:fails?|missing|incorrect|outdated|conflicting|blocked|unapproved|not approved)\b.{1,70}\b(?:test|section|currency|price|figures?|date|budget|approval|translation|version|document|brief)\b|\b(?:test|section|currency|price|figures?|date|budget|approval|translation|version|document|brief)\b.{1,70}\b(?:fails?|missing|incorrect|outdated|conflicting|blocked|unapproved|not approved)\b/i,
    evidence: 'Issue described',
  },
  {
    re: /\b(?:looks like|seems|likely|root cause|because|caused by|the issue is|related to)\b/i,
    evidence: 'Diagnosis',
  },
];

const TONE_FRICTION: Pattern[] = [
  { re: /\bASAP\b/, evidence: '"ASAP"' },
  { re: /\b(?:fix|do|get on)\s+(?:it|this|a call)?\s*now\b|\bright now\b|\bimmediately\b/i, evidence: 'Demand phrasing' },
  { re: /\b(?:broken|garbage|trash|terrible|mess|sloppy|useless|unacceptable|ridiculous)\b/i, evidence: 'Loaded judgement' },
  { re: /\byou (?:always|never|broke|didn'?t|did not|failed)\b|\bwho (?:pushed|broke|did)\b/i, evidence: 'Blame targeting' },
  { re: /[!?]{2,}/, evidence: 'Aggressive punctuation' },
  { re: /\b(?:seriously|how hard|third time)\b/i, evidence: 'Frustration / condescension' },
];

const TONE_POSITIVE: Pattern[] = [
  { re: /\b(?:thanks|thank you|appreciate)\b/i, evidence: 'Appreciation' },
  { re: /\b(?:could you|would you|can you|would it be possible|mind)\b/i, evidence: 'Invitational ask' },
  { re: /\b(?:we|let'?s|us|our)\b/i, evidence: 'Shared ownership' },
  { re: /\b(?:no worries|no rush|happy to|glad to|I can help|pair|no blame|blameless)\b/i, evidence: 'Support offered' },
  { re: /^\s*(?:hi|hey|hello|good (?:morning|afternoon|evening))\b/i, evidence: 'Warm opener' },
];

const REQUEST_PATTERNS: Pattern[] = [
  { re: /\b(?:could you|can you|would you|please)\s+(?:help\s+)?(?:review|check|confirm|share|send|update|approve|lead|fix|compare|draft|take a look at)\s+\S+(?:\s+\S+)?/i, evidence: 'Request with an action and subject' },
];

const DEADLINE_PATTERNS: Pattern[] = [
  {
    re: /\b(?:by|before|until|ahead of)\s+(?:the\s+)?(?:(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow)\s+)?(?:\d{1,2}:\d{2}|\d{1,2}\s?(?:am|pm)|EOD|end of day)\s*(?:UTC|GMT|CET|WAT|BRT|JST|IST|SGT|WIB|PST|PT|CT|ET)\b/i,
    evidence: 'Deadline with a time-zone anchor',
  },
  { re: /\bwithin\s+\d+\s?(?:h|hrs?|hours?|mins?|minutes?)\b/i, evidence: 'Explicit response window' },
];

const FALLBACK_PATTERNS: Pattern[] = [
  {
    re: /\bif\b[^.!?\n]{3,100}\b(?:I(?:'|’)?ll|I will|we(?:'|’)?ll|we will|I can|we can)\s+(?:use|send|revert|pause|draft|reschedule|escalate|roll back|switch|cancel|share|hold|post|pair)\s+[^.!?\n]{3,100}/i,
    evidence: 'Conditional plan with a concrete action',
  },
  { re: /\botherwise[,\s]+(?:I(?:'|’)?ll|I will|we(?:'|’)?ll|we will)\s+(?:use|send|revert|pause|draft|reschedule|escalate|switch|cancel|share|hold|post)\s+[^.!?\n]{3,100}/i, evidence: 'Alternative with a concrete action' },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

function similarity(a: string, b: string): number {
  const A = new Set(tokenize(a));
  const B = new Set(tokenize(b));
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  A.forEach((t) => {
    if (B.has(t)) inter += 1;
  });
  return inter / new Set([...A, ...B]).size;
}

function findEvidence(text: string, patterns: Pattern[]): string[] {
  return patterns.filter((p) => p.re.test(text)).map((p) => p.evidence);
}

/* ------------------------------------------------------------------ */
/* Main analysis function                                              */
/* ------------------------------------------------------------------ */

const TIPS: Record<CheckKey, string> = {
  context:
    'Name the document, brief or ticket and describe the specific issue. A reference alone does not explain what needs attention.',
  tone:
    'Replace pressure phrases with invitational language ("Could you...", "Let\'s...") and add a warm opener.',
  request:
    'Ask someone to do a specific action on a specific item — for example, "Could you confirm the budget in brief #482?"',
  deadline:
    'Pair the deadline with its time zone ("by 10:00 UTC") or give an explicit response window ("within 30 minutes"). A time zone by itself is not a deadline.',
  fallback:
    'Give a condition and an alternative action — "If approval is not available, I will use the approved version." A promise by itself is not a fallback.',
};

const CHECK_LABELS: Record<CheckKey, string> = {
  context: 'Context & specifics',
  tone: 'Constructive tone',
  request: 'Clear request',
  deadline: 'Time-boxed deadline',
  fallback: 'Fallback plan',
};

export function analyzeRewrite(
  text: string,
  originalMessage?: string
): PracticeFeedback {
  const trimmed = text.trim();
  const wordCount = (trimmed.match(/\S+/g) ?? []).length;

  if (wordCount < 12) {
    return {
      verdict: 'not-a-message',
      verdictText:
        'Write a complete message with at least 12 words. The checker needs enough context to offer useful suggestions.',
      checks: [],
      wordCount,
    };
  }

  // Guard: reject if the learner just pasted the original message back
  if (originalMessage && similarity(trimmed, originalMessage) > 0.6) {
    return {
      verdict: 'needs-work',
      verdictText:
        'This is very close to the original message. Try rewriting it with your own words — include context, a clear ask, and a fallback.',
      checks: [],
      wordCount,
    };
  }

  const contextEvidence = findEvidence(trimmed, CONTEXT_PATTERNS);
  const frictionEvidence = findEvidence(trimmed, TONE_FRICTION);
  const positiveEvidence = findEvidence(trimmed, TONE_POSITIVE);
  const requestEvidence = findEvidence(trimmed, REQUEST_PATTERNS);
  const deadlineEvidence = findEvidence(trimmed, DEADLINE_PATTERNS);
  const fallbackEvidence = findEvidence(trimmed, FALLBACK_PATTERNS);

  const tonePresent =
    frictionEvidence.length === 0 && positiveEvidence.length > 0;

  const checks: PracticeCheck[] = [
    {
      key: 'context',
      label: CHECK_LABELS.context,
      present: contextEvidence.length >= 2,
      evidence: contextEvidence,
      tip: TIPS.context,
    },
    {
      key: 'tone',
      label: CHECK_LABELS.tone,
      present: tonePresent,
      evidence:
        frictionEvidence.length > 0
          ? frictionEvidence
          : positiveEvidence,
      tip:
        frictionEvidence.length > 0
          ? `Remove ${frictionEvidence[0]} — ${TIPS.tone}`
          : TIPS.tone,
    },
    {
      key: 'request',
      label: CHECK_LABELS.request,
      present: requestEvidence.length > 0,
      evidence: requestEvidence,
      tip: TIPS.request,
    },
    {
      key: 'deadline',
      label: CHECK_LABELS.deadline,
      present: deadlineEvidence.length > 0,
      evidence: deadlineEvidence,
      tip: TIPS.deadline,
    },
    {
      key: 'fallback',
      label: CHECK_LABELS.fallback,
      present: fallbackEvidence.length > 0,
      evidence: fallbackEvidence,
      tip: TIPS.fallback,
    },
  ];

  const presentCount = checks.filter((c) => c.present).length;
  let verdict: PracticeVerdict;
  let verdictText: string;

  if (presentCount === 5) {
    verdict = 'ready';
    verdictText =
      'Patterns for all five signals were found. Check the facts, the owner and the timing yourself before sending; this checklist cannot verify meaning or whether the plan is appropriate.';
  } else if (presentCount >= 3) {
    verdict = 'close';
    const missing = checks
      .filter((c) => !c.present)
      .map((c) => c.label.toLowerCase());
    verdictText = `${presentCount} of 5 signal patterns found. Review: ${missing.join(', ')}. The checklist cannot verify factual accuracy or whether the plan fits this situation.`;
  } else {
    verdict = 'needs-work';
    const missing = checks
      .filter((c) => !c.present)
      .map((c) => c.label.toLowerCase());
    verdictText = `${presentCount} of 5 signals found. Try adding: ${missing.join(', ')}.`;
  }

  return { verdict, verdictText, checks, wordCount };
}
