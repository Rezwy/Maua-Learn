import type { LessonModule } from '@/types/governance';

/**
 * Master curriculum. Every question carries an executive `rationale` that powers the
 * "Decision Breakdown & Post-Mortem" on the completed screen.
 */
export const DAILY_LESSONS: LessonModule[] = [
  {
    id: 'lesson-1',
    index: 1,
    badge: 'STAGE 1 • FOUNDATION',
    title: 'Asynchronous Trust & Communication',
    description: 'Learn how high-performing global teams replace meetings with clear documentation.',
    duration: '4 min',
    questions: [
      {
        id: 1,
        question: 'What is the primary foundation of asynchronous collaboration in distributed teams?',
        options: [
          { text: 'Comprehensive written context and explicit expectations', isCorrect: true },
          { text: 'Constant availability on instant messaging platforms', isCorrect: false },
          { text: 'Mandatory daily sync video calls for every decision', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Written context is the only artefact that survives a time-zone handoff. It lets a contributor in Lagos act on a decision made in San Francisco without waiting 9 hours for clarification.',
          operationalRisk:
            'Availability-driven cultures convert every question into a blocking dependency. Across 4+ time zones this compounds into 1–2 lost delivery days per decision and burnout in whichever region absorbs the overlap.',
        },
      },
      {
        id: 2,
        question: 'When communicating across multiple time zones, high-trust leads avoid:',
        options: [
          { text: 'Urgent requests without contextual documentation', isCorrect: true },
          { text: 'Posting status updates in public project repositories', isCorrect: false },
          { text: 'Allowing 24 hours of response buffer for non-critical tasks', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Context-free urgency forces the receiver to reverse-engineer intent while under pressure. Leads who attach links, owners and deadlines make urgency actionable instead of anxious.',
          operationalRisk:
            'Unqualified "ASAP" pings train teams to treat everything as P0. Real incidents then compete with noise, raising mean-time-to-resolution and eroding trust in leadership signals.',
        },
      },
      {
        id: 3,
        question: 'What constitutes an effective asynchronous handoff?',
        options: [
          { text: 'A concise memo outlining current progress, blockers, and next steps', isCorrect: true },
          { text: 'A brief ping stating "check the latest draft" without links', isCorrect: false },
          { text: 'Delaying work until a direct live call can be scheduled', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'A progress / blockers / next-steps memo gives the next owner a decision-ready state in under two minutes, enabling true follow-the-sun execution.',
          operationalRisk:
            'Vague pings and "let\'s hop on a call" handoffs idle the receiving region. For a 20-person global squad, that is roughly 160 engineer-hours of latency per sprint.',
        },
      },
      {
        id: 4,
        question: 'How should distributed leaders evaluate remote contributor performance?',
        options: [
          { text: 'Concrete deliverable impact and autonomous milestone execution', isCorrect: true },
          { text: 'Total active hours recorded on screen-tracking software', isCorrect: false },
          { text: 'Speed of answering direct Slack notifications', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Outcome-based evaluation rewards the behaviour async teams need most: autonomous, documented progress toward agreed milestones.',
          operationalRisk:
            'Surveillance metrics drive presenteeism, top-talent attrition, and in several jurisdictions (EU, Brazil) expose the company to labour-privacy litigation.',
        },
      },
      {
        id: 5,
        question: 'When is a synchronous meeting strictly necessary in an async-first culture?',
        options: [
          { text: 'Complex interpersonal conflict or ambiguous sensitive negotiations', isCorrect: true },
          { text: 'Routine weekly team status round-robins', isCorrect: false },
          { text: 'Reviewing line-by-line pull requests before merge', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'High-emotion, high-ambiguity situations need tone, real-time repair and trust signals that text cannot carry. Reserve live time for exactly these moments.',
          operationalRisk:
            'Defaulting to meetings for routine status taxes the minority time zone with off-hours calls and silently excludes them from decisions — a leading predictor of regional churn.',
        },
      },
    ],
  },
  {
    id: 'lesson-2',
    index: 2,
    badge: 'STAGE 2 • NUANCE',
    title: 'Cross-Cultural Feedback Loops',
    description: 'Deliver constructive criticism without triggering defensive reactions across borders.',
    duration: '4 min',
    questions: [
      {
        id: 1,
        question: 'When giving feedback to team members from high-context communication cultures:',
        options: [
          { text: 'Frame critiques constructively with diplomatic nuance and context', isCorrect: true },
          { text: 'Deliver blunt, unbuffered criticism in public channels', isCorrect: false },
          { text: 'Avoid addressing underperformance altogether', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'High-context cultures read meaning from framing and setting. Contextualised critique lands as investment in the person, not an attack on their standing.',
          operationalRisk:
            'Public bluntness causes loss of face and silent disengagement; avoidance lets performance debt accumulate until it surfaces as a missed launch or a costly exit.',
        },
      },
      {
        id: 2,
        question: 'How do elite cross-cultural leads handle written misunderstandings?',
        options: [
          { text: 'Assume positive intent and clarify via an informal short video or audio note', isCorrect: true },
          { text: 'Escalate the dispute directly to executive leadership immediately', isCorrect: false },
          { text: 'Reply with rigid legalistic corporate policy citations', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'A 60-second voice or video note restores the tone that text stripped away, de-escalating in one async cycle without forcing a meeting.',
          operationalRisk:
            'Premature escalation and policy-quoting turn a wording issue into an HR matter, consuming executive bandwidth and poisoning cross-regional collaboration for months.',
        },
      },
      {
        id: 3,
        question: 'What is psychological safety in a multi-regional team environment?',
        options: [
          { text: 'The shared belief that taking risks and flagging mistakes will not be punished', isCorrect: true },
          { text: 'Eliminating all forms of critical debate during sprint retrospectives', isCorrect: false },
          { text: 'Ensuring junior engineers never question lead architecture decisions', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Psychological safety is what makes people report bad news early. In distributed teams, early signals are the only way leaders see problems they are not physically near.',
          operationalRisk:
            'Without it, defects and security issues are hidden until production. Industry post-mortems repeatedly trace nine-figure incidents back to someone who "didn\'t feel safe raising it".',
        },
      },
      {
        id: 4,
        question: 'How should recognition be handled across varied international teams?',
        options: [
          { text: 'Calibrate between public recognition and private praise based on cultural preference', isCorrect: true },
          { text: 'Mandate public callouts regardless of individual comfort levels', isCorrect: false },
          { text: 'Only reward senior leads to prevent internal competition', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Recognition only motivates if the recipient experiences it as positive. Calibrating format to individual and cultural preference maximises retention impact per unit of praise.',
          operationalRisk:
            'One-size recognition alienates collectivist-culture contributors and concentrates credit in visible, often HQ-based, staff — skewing promotions and fuelling regional attrition.',
        },
      },
      {
        id: 5,
        question: 'In written feedback loops, what reinforces alignment fastest?',
        options: [
          { text: 'Highlighting concrete behavior patterns accompanied by actionable solutions', isCorrect: true },
          { text: 'Vague statements like "please improve overall code quality"', isCorrect: false },
          { text: 'Comparing the individual against other team members publicly', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Behaviour + example + suggested fix lets the receiver act in their next work block, closing the loop within one async cycle.',
          operationalRisk:
            'Vague or comparative feedback needs multiple clarification rounds across time zones and frequently triggers defensiveness, stretching a one-day correction into weeks.',
        },
      },
    ],
  },
  {
    id: 'lesson-3',
    index: 3,
    badge: 'STAGE 3 • EXECUTION',
    title: 'High-Stakes Governance',
    description: 'Protect compliance and ethical standards when delivery speed is challenged.',
    duration: '5 min',
    questions: [
      {
        id: 1,
        question: 'What is the correct protocol when delivery deadlines conflict with security audits?',
        options: [
          { text: 'Halt production rollout until core compliance guardrails are satisfied', isCorrect: true },
          { text: 'Bypass security checks quietly to meet marketing launch dates', isCorrect: false },
          { text: 'Sign off on unverified code and patch vulnerabilities post-launch', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'A delayed launch is a recoverable schedule cost. Compliance guardrails exist precisely for moments when urgency tempts teams to trade irreversible risk for reversible time.',
          operationalRisk:
            'Shipping unaudited code exposes the company to breach liability, regulatory fines (GDPR: up to 4% of global revenue) and permanent reputational damage that dwarfs any launch-date gain.',
        },
      },
      {
        id: 2,
        question: 'In decentralized governance, who holds ultimate accountability for key integrity?',
        options: [
          { text: 'The vault steward and verified multisig key holders', isCorrect: true },
          { text: 'External third-party auditing contractors', isCorrect: false },
          { text: 'Community forum participants without signed roles', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Accountability must sit with whoever can actually sign. Named stewards and verified multisig holders create a clear, auditable chain of custody.',
          operationalRisk:
            'Diffused accountability means nobody owns key rotation or incident response — the classic precondition for treasury drains and unrecoverable asset loss.',
        },
      },
      {
        id: 3,
        question: 'What defines a robust emergency circuit breaker in protocol governance?',
        options: [
          { text: 'Deterministic programmatic pauses triggered by abnormal state deviations', isCorrect: true },
          { text: 'Manual voting rounds that require 48 hours to assemble quorum', isCorrect: false },
          { text: 'Relying entirely on centralized cloud host shutdowns', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Deterministic triggers act in seconds and do not depend on who is awake. Governance then reviews the pause rather than racing the exploit.',
          operationalRisk:
            'A 48-hour quorum or a cloud-provider dependency leaves funds and users exposed for the entire window, with losses accruing every block.',
        },
      },
      {
        id: 4,
        question: 'When discovering an internal operational exploit, a team member must first:',
        options: [
          { text: 'Submit an encrypted incident report through the designated security channel', isCorrect: true },
          { text: 'Publish details on public social media to pressure immediate fixes', isCorrect: false },
          { text: 'Attempt to exploit the vulnerability personally to confirm severity', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'The designated channel routes the finding to people with authority to patch, while keeping the vulnerability confidential until mitigated.',
          operationalRisk:
            'Public disclosure arms attackers before a fix exists; personal exploitation may be unlawful and destroys forensic evidence needed for root-cause analysis.',
        },
      },
      {
        id: 5,
        question: 'Sustainable global workforce governance prioritizes:',
        options: [
          { text: 'Verifiable audit trails and transparent decision records', isCorrect: true },
          { text: 'Ad-hoc verbal agreements kept between core founders', isCorrect: false },
          { text: 'Unrecorded off-chain handshakes without specification docs', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Decision records let new contributors, auditors and investors reconstruct why something happened — the backbone of trust at scale.',
          operationalRisk:
            'Undocumented founder agreements become due-diligence red flags, block fundraising, and turn every leadership change into an institutional-memory crisis.',
        },
      },
    ],
  },
  {
    id: 'lesson-4',
    index: 4,
    badge: 'STAGE 4 • LEADERSHIP',
    title: 'Strategic Decentralization',
    description: 'Empower cross-border squads to make high-velocity decisions without bottlenecks.',
    duration: '4 min',
    questions: [
      {
        id: 1,
        question: 'What defines true operational autonomy in remote teams?',
        options: [
          { text: 'Clear decision boundaries and strategic guardrails', isCorrect: true },
          { text: 'Letting teams work without shared objectives or review', isCorrect: false },
          { text: 'Requiring executive sign-off for minor technical changes', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Autonomy scales only when squads know exactly which decisions are theirs. Guardrails convert "ask permission" into "act within bounds".',
          operationalRisk:
            'Unbounded autonomy fragments architecture and strategy; executive sign-off on trivia turns leadership into a global bottleneck that stalls every region.',
        },
      },
      {
        id: 2,
        question: 'When should a remote lead intervene in a squad’s autonomous decision?',
        options: [
          { text: 'Only when it breaches core compliance or strategic OKRs', isCorrect: true },
          { text: 'Whenever the lead would have chosen a different personal style', isCorrect: false },
          { text: 'Never, even if systemic security risks are flagged', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Intervening only on compliance or strategic breaches preserves ownership while still protecting the company from material risk.',
          operationalRisk:
            'Style-based overrides teach squads to wait for approval; never intervening lets flagged security risks reach production under leadership\'s watch.',
        },
      },
      {
        id: 3,
        question: 'How do you prevent knowledge silos when squads operate independently?',
        options: [
          { text: 'Mandate open-by-default documentation and weekly async briefs', isCorrect: true },
          { text: 'Force all engineers to attend other squads’ daily standups', isCorrect: false },
          { text: 'Centralize all cross-team communication into private direct messages', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Open documentation plus a weekly brief makes knowledge searchable and time-zone independent at near-zero meeting cost.',
          operationalRisk:
            'DM-based coordination creates single points of failure; when one person leaves or sleeps, critical context leaves with them.',
        },
      },
      {
        id: 4,
        question: 'What is the most effective way to delegate critical project ownership?',
        options: [
          { text: 'Define the desired outcome and give the owner architectural freedom', isCorrect: true },
          { text: 'Micromanage execution through hourly checklists', isCorrect: false },
          { text: 'Delegate the workload while withholding decision authority', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Outcome + authority creates genuine ownership; the owner can make trade-offs in their own working hours without waiting on HQ.',
          operationalRisk:
            'Responsibility without authority is the fastest path to senior-engineer burnout and to decisions stalled for days in approval queues.',
        },
      },
      {
        id: 5,
        question: 'In a decentralized setup, how should team alignment be measured?',
        options: [
          { text: 'By output quality, impact, and milestone delivery', isCorrect: true },
          { text: 'By total hours logged on the corporate network', isCorrect: false },
          { text: 'By how rapidly engineers reply to instant messages', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Outcome metrics are time-zone neutral and directly tied to business value, so every region competes on the same field.',
          operationalRisk:
            'Activity metrics reward whoever overlaps most with HQ, biasing performance reviews against remote regions and inviting discrimination claims.',
        },
      },
    ],
  },
  {
    id: 'lesson-5',
    index: 5,
    badge: 'STAGE 5 • RESILIENCE',
    title: 'Crisis & Incident Continuity',
    description: 'Handle operational outages across multiple time zones without panic or chaos.',
    duration: '5 min',
    questions: [
      {
        id: 1,
        question: 'During a cross-border production incident, what is the lead’s first async move?',
        options: [
          { text: 'Establish a single incident document with a live timeline feed', isCorrect: true },
          { text: 'Send broadcast panic messages across all general channels', isCorrect: false },
          { text: 'Wait until the primary engineer wakes up in their local time zone', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'A single source of truth lets every responder, regardless of time zone, join with full context and prevents duplicate or conflicting fixes.',
          operationalRisk:
            'Broadcast panic fragments the response across channels; waiting for one person extends downtime — at typical SaaS scale, every hour can cost six figures in SLA credits.',
        },
      },
      {
        id: 2,
        question: 'How should handovers between regional shifts be conducted during a crisis?',
        options: [
          { text: 'Structured written logs detailing current state and next hypotheses', isCorrect: true },
          { text: 'Informal verbal chats without recorded action items', isCorrect: false },
          { text: 'Halting triage completely until the original shift returns', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Written state + hypotheses means the incoming shift continues the investigation instead of restarting it.',
          operationalRisk:
            'Verbal or paused handovers reset progress each shift change, multiplying outage duration by the number of regions involved.',
        },
      },
      {
        id: 3,
        question: 'What prevents on-call alert fatigue in a 24/7 global team?',
        options: [
          { text: 'Tuning alerts so only actionable, severe incidents trigger pages', isCorrect: true },
          { text: 'Paging on-call members for routine informational warnings', isCorrect: false },
          { text: 'Disabling all automated alerting systems entirely', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'When every page is actionable, responders trust the pager and react fast to the one alert that truly matters.',
          operationalRisk:
            'Noisy paging causes responders to mute or ignore alerts; disabling alerts removes detection entirely. Both end with customers discovering the outage first.',
        },
      },
      {
        id: 4,
        question: 'After resolving a high-severity operational outage, the post-mortem should prioritize:',
        options: [
          { text: 'Blameless root-cause analysis and automated hardening', isCorrect: true },
          { text: 'Assigning public blame to the author of the pull request', isCorrect: false },
          { text: 'Deleting logs to protect internal stakeholder optics', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Blameless analysis surfaces the systemic causes; automated hardening ensures the same class of failure cannot recur.',
          operationalRisk:
            'Blame suppresses honest reporting in future incidents; deleting logs destroys evidence and may constitute spoliation in regulatory or legal proceedings.',
        },
      },
      {
        id: 5,
        question: 'How do you foster psychological safety after an honest operational mistake?',
        options: [
          { text: 'Commend proactive disclosure and invest in defensive safeguards', isCorrect: true },
          { text: 'Revoke deployment permissions for the contributor indefinitely', isCorrect: false },
          { text: 'Issue formal written reprimands during team-wide meetings', isCorrect: false },
        ],
        rationale: {
          correctReason:
            'Rewarding disclosure makes early reporting the norm, and safeguards make the system — not the individual — the line of defence.',
          operationalRisk:
            'Punishing honest mistakes guarantees the next one is hidden, turning a minutes-long fix into a days-long incident discovered by customers.',
        },
      },
    ],
  },
];
