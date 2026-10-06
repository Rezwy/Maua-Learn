import type {
  AuditTier,
  FrictionScenario,
  MetricKey,
  MetricResult,
  ToneAudit,
} from '@/types/governance';

/** Simulated model latency so the analyzer feels like a real inference round-trip. */
export const ANALYSIS_LATENCY_MS = 600;

/* ------------------------------------------------------------------ */
/* Scenarios                                                           */
/* ------------------------------------------------------------------ */

export const FRICTION_SCENARIOS: FrictionScenario[] = [
  {
    id: 'pr-broken',
    label: 'Broken PR',
    sender: 'Dmitri Volkov',
    senderRole: 'Staff Engineer',
    senderRegion: 'Berlin · CET',
    channel: '#release-demo',
    timestamp: '23:47',
    message: 'This PR is broken, fix it now ASAP before demo. Seriously, did nobody test this??',
    context: [
      'PR #482 — checkout refactor, authored by Aisha (Lagos · WAT, currently offline)',
      'CI fails in checkout.spec.ts line 118 — currency is null for guest carts',
      'CEO demo with Charlie: tomorrow 15:00 UTC',
      'Link: https://github.com/maua-ai/app/pull/482',
    ],
    exemplar:
      "Hi Aisha — thanks for the checkout refactor in PR #482 (https://github.com/maua-ai/app/pull/482). CI is failing in checkout.spec.ts line 118; looks like currency can be null for guest carts. Could you take a look by 10:00 UTC tomorrow, ahead of the 15:00 UTC demo? If that's not feasible, no worries — I'll revert to the previous flow so we're not blocked. Happy to pair if useful.",
  },
  {
    id: 'missing-docs',
    label: 'Missing Docs',
    sender: 'Lucas Ferreira',
    senderRole: 'Partner Integrations',
    senderRegion: 'São Paulo · BRT',
    channel: '#payments-api',
    timestamp: '18:12',
    message:
      'Why is there STILL no documentation for the payments API?? Third time asking. Unacceptable.',
    context: [
      'Docs owner: Kenji (Tokyo · JST, 12h ahead)',
      'Draft spec: https://notion.so/maua/payments-api',
      'Partner integration kickoff: Monday 13:00 UTC',
      'Only the auth + webhooks sections are blocking the partner',
    ],
    exemplar:
      "Hi Kenji — hope your week is going well. Our partner kickoff is Monday 13:00 UTC and we're blocked on the auth + webhooks sections of the payments spec (https://notion.so/maua/payments-api). Could you share those two sections by Friday EOD JST? The rest isn't blocking. If that timing is tight, let me know and I can draft a first pass for you to review. Thanks!",
  },
  {
    id: 'prod-incident',
    label: 'Prod Incident',
    sender: 'Ryan Cole',
    senderRole: 'Head of Platform',
    senderRegion: 'Austin · CT',
    channel: '#general',
    timestamp: '21:20',
    message: 'Prod is down AGAIN. Who pushed this garbage? Everyone get on a call NOW.',
    context: [
      'API 5xx spike since 02:14 UTC — incident doc: https://maua.ai/inc/2291',
      'Suspected cause: deploy v3.8.1 at 02:05 UTC',
      'On-call: Priya (Bengaluru · IST, 07:50 local)',
      'Rollback runbook is tested and takes ~10 min',
    ],
    exemplar:
      "Hi Priya — we have a SEV-1: API 5xx spike since 02:14 UTC, likely related to deploy v3.8.1 at 02:05 UTC. Incident doc with live timeline: https://maua.ai/inc/2291. Could you lead triage and decide on rollback within 30 min? I'll handle stakeholder comms and post updates every 20 min in the doc. If rollback isn't safe, let's pair on a hotfix. Thanks — no blame here, we'll do a blameless review after.",
  },
];

/* ------------------------------------------------------------------ */
/* Signal dictionaries                                                 */
/* ------------------------------------------------------------------ */

interface Signal {
  re: RegExp;
  label: string;
  weight: number;
}

const CONTEXT_SIGNALS: Signal[] = [
  { re: /https?:\/\/\S+/i, label: 'Direct link', weight: 28 },
  { re: /(?:\bPR\s?#?\d+|#\d{2,}|\bpull request\b|\bticket\b|\bv\d+\.\d+)/i, label: 'Artifact reference', weight: 16 },
  { re: /\b[\w-]+\.(?:ts|tsx|js|jsx|py|go|rs|ya?ml|json|sql|md)\b/i, label: 'File reference', weight: 12 },
  {
    re: /\b(?:test|spec|logs?|stack ?trace|error|5xx|repro|line \d+|CI|pipeline|build|deploy|section|spec)\b/i,
    label: 'Technical evidence',
    weight: 14,
  },
  {
    re: /\b(?:looks like|seems|likely|root cause|because|caused by|the issue is|related to)\b/i,
    label: 'Diagnosis',
    weight: 12,
  },
  {
    re: /\b(?:suggest|propose|could try|one option|workaround|revert|rollback|roll back|hotfix|draft|pair|I can help)\b/i,
    label: 'Proposed solution',
    weight: 18,
  },
];

const SAFETY_PENALTIES: Signal[] = [
  { re: /\bASAP\b/i, label: 'ASAP pressure', weight: 14 },
  { re: /\b(?:fix|do|get on)\s+(?:it|this|a call)?\s*now\b|\bright now\b|\bimmediately\b/i, label: 'Demand phrasing', weight: 12 },
  { re: /\b(?:broken|garbage|trash|terrible|mess|sloppy|useless|unacceptable|ridiculous)\b/i, label: 'Loaded judgement', weight: 14 },
  { re: /\byou (?:always|never|broke|didn'?t|did not|failed)\b|\bwho (?:pushed|broke|did)\b/i, label: 'Blame targeting', weight: 16 },
  { re: /[!?]{2,}/, label: 'Escalated punctuation', weight: 8 },
  { re: /\b(?:obviously|seriously|clearly|how hard|still|again|third time)\b/i, label: 'Condescension / frustration', weight: 10 },
  { re: /\bwhy (?:did|didn'?t|would|is there|isn'?t)\b/i, label: 'Interrogative blame', weight: 8 },
  { re: /\b(?:nobody|everyone)\b/i, label: 'Sweeping generalisation', weight: 6 },
];

const SAFETY_BOOSTS: Signal[] = [
  { re: /\b(?:thanks|thank you|appreciate)\b/i, label: 'Appreciation', weight: 10 },
  { re: /\b(?:could you|would you|can you|would it be possible|mind)\b/i, label: 'Invitational ask', weight: 8 },
  { re: /\b(?:we|let'?s|us|our)\b/i, label: 'Shared ownership', weight: 8 },
  { re: /\b(?:no worries|no rush|happy to|glad to|I can help|pair|no blame|blameless)\b/i, label: 'Support offered', weight: 10 },
  { re: /\b(?:let me know|correct me|thoughts\?|I might be wrong|if useful)\b/i, label: 'Open to input', weight: 6 },
  { re: /^\s*(?:hi|hey|hello|good (?:morning|afternoon|evening))\b/i, label: 'Warm opener', weight: 4 },
];

const ACTION_SIGNALS: Signal[] = [
  {
    re: /\b(?:by|before|until|ahead of)\s+(?:\d{1,2}(?::\d{2})?\s?(?:am|pm)?|EOD|end of day|tomorrow|today|monday|tuesday|wednesday|thursday|friday|the demo|kickoff)\b/i,
    label: 'Explicit deadline',
    weight: 24,
  },
  {
    re: /\b(?:UTC|GMT|CET|WAT|BRT|JST|IST|SGT|WIB|PST|PT|CT|ET|your (?:morning|afternoon|evening|time))\b/,
    label: 'Time-zone anchor',
    weight: 18,
  },
  { re: /\b(?:within|in|every)\s+\d+\s?(?:h|hrs?|hours?|mins?|minutes?)\b/i, label: 'Response window', weight: 12 },
  { re: /\b(?:could you|can you|please|would you)\b/i, label: 'Explicit ask', weight: 14 },
  {
    re: /\b(?:if not|otherwise|fallback|plan b|if (?:that|this|it)'?s? (?:not|tight)|isn'?t (?:feasible|safe|possible)|not feasible)\b/i,
    label: 'Fallback path',
    weight: 14,
  },
  { re: /\b(?:I'?ll|I will|I can|I'?m going to)\b/i, label: 'Sender commitment', weight: 10 },
  {
    re: /\b(?:blocking|non-blocking|not blocking|isn'?t blocking|priority|P[0-3]|SEV-?\d|only need|the rest)\b/i,
    label: 'Priority / scope',
    weight: 12,
  },
];

/* Upper-case tokens that are legitimate acronyms, not shouting. */
const ACRONYMS = new Set([
  'PR', 'CI', 'CD', 'UTC', 'GMT', 'CET', 'WAT', 'BRT', 'JST', 'IST', 'SGT', 'WIB', 'PST', 'CT', 'ET',
  'API', 'QA', 'EOD', 'SEV', 'SLA', 'URL', 'UI', 'UX', 'CEO', 'CTO', 'OKR', 'OKRS', 'SDK', 'DB', 'PM',
  'AM', 'P0', 'P1', 'P2', 'P3', 'ASAP',
]);

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function tierFor(score: number): AuditTier {
  if (score >= 75) return 'STRONG';
  if (score >= 45) return 'ADEQUATE';
  return 'AT RISK';
}

function collect(text: string, signals: Signal[]) {
  const hits = signals.filter((s) => s.re.test(text));
  const total = hits.reduce((sum, s) => sum + s.weight, 0);
  return { hits, total };
}

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

function shoutingTokens(text: string): string[] {
  const caps = text.match(/\b[A-Z]{3,}\b/g) ?? [];
  return caps.filter((w) => !ACRONYMS.has(w));
}

function firstMissing(signals: Signal[], hits: Signal[]): Signal | undefined {
  return [...signals]
    .sort((a, b) => b.weight - a.weight)
    .find((s) => !hits.includes(s));
}

const CONTEXT_TIPS: Record<string, string> = {
  'Direct link': 'Attach the exact link (PR, doc, dashboard) so the receiver can act without searching.',
  'Proposed solution': 'Offer a hypothesis or fallback fix — it turns a complaint into a collaboration.',
  'Artifact reference': 'Name the artifact (PR number, ticket, release version) to anchor the discussion.',
  'Technical evidence': 'Cite the failing test, log line or section so the issue is reproducible.',
  'File reference': 'Point to the specific file to cut investigation time for the next time zone.',
  Diagnosis: 'Share what you believe is causing it ("looks like…") to accelerate triage.',
};

const ACTION_TIPS: Record<string, string> = {
  'Explicit deadline': 'State a concrete deadline ("by 10:00 UTC tomorrow") instead of implied urgency.',
  'Time-zone anchor': 'Anchor times to UTC or the receiver’s local zone to avoid off-by-a-day errors.',
  'Explicit ask': 'Phrase one clear request ("Could you…") so ownership is unambiguous.',
  'Fallback path': 'Define what happens if the deadline is missed — it removes pressure and protects delivery.',
  'Priority / scope': 'Clarify what is blocking vs. nice-to-have so the receiver can scope effort.',
  'Response window': 'Set a response window ("within 30 min") for time-critical requests.',
  'Sender commitment': 'Commit to your own next step ("I’ll handle comms") to share the load.',
};

export function analyzeMessage(text: string, original?: string): ToneAudit {
  const trimmed = text.trim();
  const words = tokenize(trimmed);
  const wordCount = words.length;

  /* 1 · Context & Clarity ------------------------------------------------ */
  const ctx = collect(trimmed, CONTEXT_SIGNALS);
  let contextScore = ctx.total;
  if (wordCount >= 30) contextScore += 10;
  else if (wordCount < 12) contextScore -= 15;
  contextScore = clamp(contextScore);
  const ctxMissing = firstMissing(CONTEXT_SIGNALS, ctx.hits);

  /* 2 · Psychological Safety -------------------------------------------- */
  const penalties = collect(trimmed, SAFETY_PENALTIES);
  const boosts = collect(trimmed, SAFETY_BOOSTS);
  const shouting = shoutingTokens(trimmed);
  const shoutPenalty = shouting.length > 0 ? 10 + Math.min(shouting.length - 1, 3) * 4 : 0;
  const safetyScore = clamp(
    wordCount === 0 ? 0 : 62 + boosts.total - penalties.total - shoutPenalty
  );

  const frictionFlags = penalties.hits.map((p) => p.label);
  if (shouting.length > 0) frictionFlags.push(`Shouting (${shouting.slice(0, 2).join(', ')})`);

  /* 3 · Actionable Next Step -------------------------------------------- */
  const act = collect(trimmed, ACTION_SIGNALS);
  const actionScore = clamp(act.total);
  const actMissing = firstMissing(ACTION_SIGNALS, act.hits);

  /* Feedback ------------------------------------------------------------ */
  const contextFeedback =
    contextScore >= 75
      ? 'Receiver has everything needed to act without a follow-up question.'
      : (ctxMissing && CONTEXT_TIPS[ctxMissing.label]) ?? 'Add specifics the receiver can act on.';

  const safetyFeedback =
    penalties.hits.length > 0 || shouting.length > 0
      ? `Remove "${frictionFlags[0]}" — replace pressure with shared ownership ("we", "let's").`
      : safetyScore >= 75
        ? 'Constructive, blame-free tone. Safe for a cross-cultural public channel.'
        : 'Add appreciation or an offer of support to signal positive intent.';

  const actionFeedback =
    actionScore >= 75
      ? 'Clear owner, time-boxed expectation and fallback — fully async-executable.'
      : (actMissing && ACTION_TIPS[actMissing.label]) ?? 'Define the next step and when it is due.';

  const metrics: MetricResult[] = [
    {
      key: 'context' as MetricKey,
      label: 'Context & Clarity',
      score: contextScore,
      tier: tierFor(contextScore),
      signals: ctx.hits.map((h) => h.label),
      feedback: contextFeedback,
    },
    {
      key: 'safety' as MetricKey,
      label: 'Psychological Safety',
      score: safetyScore,
      tier: tierFor(safetyScore),
      signals: boosts.hits.map((h) => h.label),
      feedback: safetyFeedback,
    },
    {
      key: 'action' as MetricKey,
      label: 'Actionable Next Step',
      score: actionScore,
      tier: tierFor(actionScore),
      signals: act.hits.map((h) => h.label),
      feedback: actionFeedback,
    },
  ];

  let overall = clamp(contextScore * 0.35 + safetyScore * 0.35 + actionScore * 0.3);

  /* Guard against submitting the original message (or a light paraphrase). */
  if (original && similarity(trimmed, original) > 0.6) {
    frictionFlags.unshift('Mirrors original message');
    overall = Math.min(overall, 30);
  }

  const tier = tierFor(overall);
  const verdict =
    tier === 'STRONG'
      ? 'Governance-ready. This message de-escalates, informs and unblocks across time zones.'
      : tier === 'ADEQUATE'
        ? 'Acceptable, but the receiver may still need a follow-up cycle to act confidently.'
        : 'High friction. Likely to trigger defensiveness or a stalled handoff across regions.';

  return { overall, tier, verdict, metrics, frictionFlags, wordCount };
}
