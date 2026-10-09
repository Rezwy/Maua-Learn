import { SHOWCASE } from './showcase-lesson';
import type { DecisionStep, Lesson } from '@/types/lesson';

/**
 * Curriculum content, kept separate from presentation.
 * All people, teams and links in the scenarios are fictional demo content.
 *
 * Module 1 is the showcase lesson: a complete journey from introduction to
 * application. Modules 2–5 are shorter decision drills that reuse the same
 * immediate-feedback mechanics.
 */

/* ------------------------------------------------------------------ */
/* Module 1 — showcase lesson                                          */
/* ------------------------------------------------------------------ */

type QuizQuestion = {
  id: string;
  prompt: string;
  options: { text: string; isCorrect: boolean }[];
  correctReason: string;
  operationalRisk: string;
};

function quizSteps(questions: QuizQuestion[]): DecisionStep[] {
  return questions.map((q) => ({
    kind: 'decision' as const,
    id: q.id,
    contextLabel: 'DECISION',
    prompt: q.prompt,
    options: q.options.map((o, i) => ({
      id: String.fromCharCode(97 + i),
      text: o.text,
      isRecommended: o.isCorrect,
      effect: o.isCorrect ? q.correctReason : q.operationalRisk,
    })),
    recommendedWhy: q.correctReason,
  }));
}

const CROSS_CULTURAL: Lesson = {
  id: 'lesson-2',
  title: 'Cross-Cultural Feedback Loops',
  description:
    'Give feedback that colleagues in other regions receive as help, not attack. Five short decisions.',
  durationMinutes: 4,
  steps: [
    {
      kind: 'intro',
      id: 'intro',
      heading: 'Feedback that travels well',
      body: 'Written feedback crosses borders instantly — but tone and intent have to be guessed. These five decisions practise giving feedback that a colleague in another culture can act on without losing face.',
    },
    ...quizSteps([
      {
        id: 'q1',
        prompt: 'A teammate from a high-context communication culture missed a detail in their last two reviews. How do you raise it?',
        options: [
          { text: 'Deliver blunt, unbuffered criticism in the public review channel', isCorrect: false },
          { text: 'Say nothing — avoiding the topic keeps the relationship smooth', isCorrect: false },
          { text: 'Message them privately, describe the specific pattern, and offer to review the next one together', isCorrect: true },
        ],
        correctReason:
          'Naming a concrete pattern privately, with an offer of help, reads as investment in the person — and it survives translation into a second language.',
        operationalRisk:
          'Public bluntness causes loss of face and silent disengagement in many cultures; staying silent lets the gap grow until it surfaces as a missed launch.',
      },
      {
        id: 'q2',
        prompt: 'A written comment you left was misunderstood and the teammate is clearly upset. What helps most?',
        options: [
          { text: 'Escalate to their manager so the misunderstanding is formally documented', isCorrect: false },
          { text: 'Send a short voice note explaining what you actually meant', isCorrect: true },
          { text: 'Quote the original comment back and point out how it was misread', isCorrect: false },
        ],
        correctReason:
          'A 60-second voice note restores the tone that text stripped away — one async cycle, no meeting, no escalation.',
        operationalRisk:
          'Escalation or re-litigating the words turns a wording issue into an HR matter and poisons the working relationship for months.',
      },
      {
        id: 'q3',
        prompt: 'What is psychological safety in a distributed team, in practice?',
        options: [
          { text: 'Nobody disagrees in meetings, so discussions stay calm', isCorrect: false },
          { text: 'People believe flagging a mistake or risk will not be punished', isCorrect: true },
          { text: 'Junior members defer to senior architects on technical calls', isCorrect: false },
        ],
        correctReason:
          'Safety is what makes people report bad news early — and early signals are the only way a lead sees problems they are not physically near.',
        operationalRisk:
          'Without it, defects and security issues are hidden until production. Post-mortems repeatedly trace serious incidents back to someone who did not feel safe raising it.',
      },
      {
        id: 'q4',
        prompt: 'A colleague in another region landed a big win. How do you recognise it?',
        options: [
          { text: 'Congratulate them in the public team channel — visibility for everyone', isCorrect: false },
          { text: 'Ask them first whether they would like a public shout-out or a private note', isCorrect: true },
          { text: 'Recognise only the leads, to avoid stirring competition', isCorrect: false },
        ],
        correctReason:
          'Recognition only motivates if the recipient experiences it as positive — comfort with public praise varies by person and culture, so a quick question costs nothing.',
        operationalRisk:
          'One-size recognition alienates contributors who find it uncomfortable and quietly concentrates credit in whoever is most visible — often HQ-based staff.',
      },
      {
        id: 'q5',
        prompt: 'Which written feedback is fastest for the receiver to act on?',
        options: [
          { text: '“Please improve the overall quality of your documentation.”', isCorrect: false },
          { text: '“The setup section skips step 3 — could you add it before Friday’s release?”', isCorrect: true },
          { text: '“The docs are not as good as Maria’s — have a look at hers.”', isCorrect: false },
        ],
        correctReason:
          'Behaviour + example + concrete fix lets the receiver act in their next work block and close the loop in one async cycle.',
        operationalRisk:
          'Vague or comparative feedback triggers clarification rounds across time zones and defensiveness — stretching a one-day correction into weeks.',
      },
    ]),
  ],
  takeaways: [
    'Frame criticism around specific, observable behaviour — privately first',
    'Use voice notes to repair tone that text lost',
    'Ask before recognising someone publicly',
  ],
};

const GOVERNANCE: Lesson = {
  id: 'lesson-3',
  title: 'High-Stakes Governance',
  description:
    'Hold compliance and ethics lines when delivery speed is challenged. Five short decisions.',
  durationMinutes: 4,
  steps: [
    {
      kind: 'intro',
      id: 'intro',
      heading: 'When the deadline meets the rule',
      body: 'The pressure to cut a corner is always real — and so is the cost of cutting it. These five decisions practise holding the line when a launch date argues otherwise.',
    },
    ...quizSteps([
      {
        id: 'q1',
        prompt: 'A marketing launch is tomorrow, but the security audit of the new feature is not finished. What do you do?',
        options: [
          { text: 'Launch now — finish the audit after, if there is time', isCorrect: false },
          { text: 'Launch, but tell the security team to retroactively sign off', isCorrect: false },
          { text: 'Delay the feature until the audit is done; ship the rest of the release', isCorrect: true },
        ],
        correctReason:
          'A delayed feature is a recoverable schedule cost. Guardrails exist precisely for the moment when urgency argues for trading an irreversible risk for reversible time.',
        operationalRisk:
          'Shipping unaudited code can expose the company to breaches, regulatory fines and reputational damage that dwarf any one-day launch slip.',
      },
      {
        id: 'q2',
        prompt: 'Who should hold signing authority over critical company accounts?',
        options: [
          { text: 'Whoever built the system — they understand it best', isCorrect: false },
          { text: 'Named stewards plus verified co-signers, recorded in writing', isCorrect: true },
          { text: 'Everyone on the leadership team, for maximum flexibility', isCorrect: false },
        ],
        correctReason:
          'Accountability must sit with whoever can actually sign — named stewards create a clear, auditable chain of custody.',
        operationalRisk:
          'Diffused or informal authority means nobody owns key rotation or incident response — the classic precondition for unrecoverable loss.',
      },
      {
        id: 'q3',
        prompt: 'What makes an emergency stop mechanism trustworthy?',
        options: [
          { text: 'A rule that triggers automatically when abnormal conditions are detected', isCorrect: true },
          { text: 'A committee vote, convened within 48 hours of the alarm', isCorrect: false },
          { text: 'Trusting the cloud provider to shut things down if needed', isCorrect: false },
        ],
        correctReason:
          'Automatic triggers act in seconds and do not depend on who is awake. People then review the pause instead of racing the damage.',
        operationalRisk:
          'A 48-hour quorum or an external dependency leaves users exposed for the entire window, with losses accruing the whole time.',
      },
      {
        id: 'q4',
        prompt: 'You find an internal process that could be exploited to bypass approvals. First move?',
        options: [
          { text: 'Post the details publicly so it gets fixed fast', isCorrect: false },
          { text: 'Quietly test it yourself to confirm it is exploitable', isCorrect: false },
          { text: 'Report it through the designated internal security channel', isCorrect: true },
        ],
        correctReason:
          'The designated channel routes the finding to people with authority to patch, while keeping the weakness confidential until it is fixed.',
        operationalRisk:
          'Public disclosure arms bad actors before a fix exists; testing it yourself may be unlawful and destroys the evidence needed for root-cause analysis.',
      },
      {
        id: 'q5',
        prompt: 'What makes decisions at a global organisation trustworthy over time?',
        options: [
          { text: 'Written decision records anyone can read and question', isCorrect: true },
          { text: 'Strong verbal alignment among the founding team', isCorrect: false },
          { text: 'Trusting senior leaders to make the right call case by case', isCorrect: false },
        ],
        correctReason:
          'Decision records let new contributors, auditors and partners reconstruct why something happened — the backbone of trust at scale.',
        operationalRisk:
          'Undocumented agreements become due-diligence red flags, and every leadership change turns into an institutional-memory crisis.',
      },
    ]),
  ],
  takeaways: [
    'Prefer a recoverable schedule slip to an irreversible risk',
    'Route security findings through the designated channel, first and fast',
    'Write decisions down so trust does not depend on memory',
  ],
};

const DECENTRALIZATION: Lesson = {
  id: 'lesson-4',
  title: 'Strategic Decentralization',
  description:
    'Give cross-border squads real decision rights without losing alignment. Five short decisions.',
  durationMinutes: 4,
  steps: [
    {
      kind: 'intro',
      id: 'intro',
      heading: 'Autonomy in both directions',
      body: 'Decentralisation fails in two ways: squads blocked on every approval, or squads drifting with no guardrails. These five decisions practise where decision rights should sit.',
    },
    ...quizSteps([
      {
        id: 'q1',
        prompt: 'What does genuine squad autonomy require?',
        options: [
          { text: 'Clear, written boundaries for which decisions are theirs to make', isCorrect: true },
          { text: 'No shared objectives — teams know best what to build', isCorrect: false },
          { text: 'Executive sign-off on anything customer-facing', isCorrect: false },
        ],
        correctReason:
          'Autonomy scales only when squads know exactly which decisions are theirs. Guardrails convert “ask permission” into “act within bounds”.',
        operationalRisk:
          'Unbounded autonomy fragments the product; sign-off on everything turns leadership into a global bottleneck that stalls every region.',
      },
      {
        id: 'q2',
        prompt: 'A squad makes a technical choice you personally disagree with, but it is inside their stated boundaries. What now?',
        options: [
          { text: 'Override it — you have seen this fail before', isCorrect: false },
          { text: 'Leave it, and note your concern in their decision record', isCorrect: true },
          { text: 'Take the decision type away from them permanently', isCorrect: false },
        ],
        correctReason:
          'Within agreed boundaries, the squad owns the call. Recording your concern keeps the information without taking back the decision.',
        operationalRisk:
          'Style-based overrides teach squads to wait for approval — the autonomy programme dies one override at a time.',
      },
      {
        id: 'q3',
        prompt: 'How do you prevent knowledge silos between autonomous squads?',
        options: [
          { text: 'Require everyone to attend each other’s daily standups', isCorrect: false },
          { text: 'Keep cross-squad coordination in leadership DMs', isCorrect: false },
          { text: 'Open-by-default documentation plus a weekly written brief', isCorrect: true },
        ],
        correctReason:
          'Open documentation plus a short weekly brief makes knowledge searchable and time-zone independent at near-zero meeting cost.',
        operationalRisk:
          'DM-based coordination creates single points of failure: when one person is asleep or leaves, the context leaves with them.',
      },
      {
        id: 'q4',
        prompt: 'You are delegating ownership of a critical project. What does real delegation look like?',
        options: [
          { text: 'Define the outcome; give the owner freedom on the approach', isCorrect: true },
          { text: 'Delegate the work but keep every decision yourself', isCorrect: false },
          { text: 'Check in hourly so nothing drifts', isCorrect: false },
        ],
        correctReason:
          'Outcome plus authority creates ownership — the owner can make trade-offs in their own working hours without waiting for yours.',
        operationalRisk:
          'Responsibility without authority is the fastest path to burnout, and decisions stall for days in approval queues.',
      },
      {
        id: 'q5',
        prompt: 'How should a distributed organisation measure team alignment?',
        options: [
          { text: 'Response time to messages during HQ working hours', isCorrect: false },
          { text: 'Quality of output and delivery against agreed milestones', isCorrect: true },
          { text: 'Hours logged, so every region is comparable', isCorrect: false },
        ],
        correctReason:
          'Outcome measures are time-zone neutral and tied to actual value, so every region is judged on the same field.',
        operationalRisk:
          'Activity and responsiveness metrics reward whoever overlaps most with headquarters and quietly bias reviews against remote regions.',
      },
    ]),
  ],
  takeaways: [
    'Write decision boundaries down instead of deciding case by case',
    'Delegate outcomes with authority, not just work',
    'Measure outputs, not hours or response speed',
  ],
};

const CRISIS: Lesson = {
  id: 'lesson-5',
  title: 'Crisis & Incident Continuity',
  description:
    'Run a cross-region incident calmly, in writing. Five short decisions.',
  durationMinutes: 4,
  steps: [
    {
      kind: 'intro',
      id: 'intro',
      heading: '03:00 UTC belongs to whoever is awake',
      body: 'An outage does not wait for the right time zone. These five decisions practise keeping a cross-region incident calm, coordinated and recoverable — in writing.',
    },
    ...quizSteps([
      {
        id: 'q1',
        prompt: 'A production incident starts during the Asia-Pacific morning while European leads sleep. First move?',
        options: [
          { text: 'Post an urgent “everyone get online now” in the general channel', isCorrect: false },
          { text: 'Open one incident document with a live timeline and link it from channels', isCorrect: true },
          { text: 'Wait for the on-call engineer’s region to wake up', isCorrect: false },
        ],
        correctReason:
          'A single source of truth lets every responder join with full context, and prevents duplicate or conflicting fixes across regions.',
        operationalRisk:
          'Broadcast panic fragments the response; waiting for one person extends the outage — at SaaS scale, every hour can cost six figures in credits.',
      },
      {
        id: 'q2',
        prompt: 'How should one region hand an ongoing incident to the next shift?',
        options: [
          { text: 'A written log: current state, what was tried, next hypotheses', isCorrect: true },
          { text: 'A quick verbal summary as the new shift logs on', isCorrect: false },
          { text: 'Pause triage until the original responders return', isCorrect: false },
        ],
        correctReason:
          'Written state plus hypotheses means the incoming shift continues the investigation instead of restarting it.',
        operationalRisk:
          'Verbal or paused handovers reset progress at every shift change, multiplying the outage by the number of regions involved.',
      },
      {
        id: 'q3',
        prompt: 'What keeps on-call alerting trustworthy over months?',
        options: [
          { text: 'Page on-call for every warning so nothing is missed', isCorrect: false },
          { text: 'Only actionable, severe events trigger a page', isCorrect: true },
          { text: 'Disable automated alerts; call people directly instead', isCorrect: false },
        ],
        correctReason:
          'When every page is actionable, responders trust the pager and move fast on the one alert that matters.',
        operationalRisk:
          'Noisy paging gets muted — and then the real alert is discovered by customers. Disabling alerts removes detection entirely.',
      },
      {
        id: 'q4',
        prompt: 'The outage is resolved; a junior engineer’s deploy caused it. What does the post-mortem focus on?',
        options: [
          { text: 'Blameless analysis of the systemic causes, then hardening', isCorrect: true },
          { text: 'Naming who caused it, so it does not happen again', isCorrect: false },
          { text: 'Keeping the details quiet to protect the team', isCorrect: false },
        ],
        correctReason:
          'Blameless analysis surfaces the conditions that allowed the mistake; automated hardening ensures the same class of failure cannot recur.',
        operationalRisk:
          'Blame guarantees the next mistake gets hidden — turning a minutes-long fix into a days-long incident discovered by customers.',
      },
      {
        id: 'q5',
        prompt: 'The engineer who caused it flags it themselves within minutes. How do you respond?',
        options: [
          { text: 'Thank them publicly for the fast report, then fix the system', isCorrect: true },
          { text: 'Restrict their deploy permissions for a month', isCorrect: false },
          { text: 'A formal warning, documented with HR', isCorrect: false },
        ],
        correctReason:
          'Rewarding disclosure makes early reporting the norm — and safeguards make the system, not the individual, the line of defence.',
        operationalRisk:
          'Punishing an honest mistake teaches everyone to delay or hide bad news. The next incident starts with a cover-up.',
      },
    ]),
  ],
  takeaways: [
    'Run incidents from one written document with a live timeline',
    'Hand over with state, attempted fixes and next hypotheses in writing',
    'Reward fast disclosure — it is your earliest warning system',
  ],
};

export const LESSONS: Lesson[] = [SHOWCASE, CROSS_CULTURAL, GOVERNANCE, DECENTRALIZATION, CRISIS];

export const SHOWCASE_LESSON_ID = 'lesson-1';

export function findLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function decisionCount(lesson: Lesson): number {
  return lesson.steps.filter((s) => s.kind === 'decision').length;
}
