import type { Lesson } from '../types/lesson';

export const SHOWCASE: Lesson = {
  id: 'lesson-1',
  title: 'A clear handoff, across time zones',
  description: 'Lead a shared deadline, see the impact of your decisions, and write a message your colleague can act on.',
  durationMinutes: 7,
  steps: [
    {
      kind: 'intro', id: 'intro', heading: 'Your evening. Their morning.',
      body: 'You coordinate an international outreach team. A deadline is approaching and the colleague with the answers is asleep. In this lesson, you will protect the deadline without making someone else guess: decide what to do, see how the team responds, then practise a clear handoff.',
    },
    {
      kind: 'concept', id: 'concept', heading: 'Let the message do the meeting',
      body: 'A missing detail can turn one question into a full day of waiting. Give the next person enough to act when their day begins.',
      points: [
        { label: 'Context', text: 'Name the item and what needs attention.' },
        { label: 'One clear request', text: 'Say who needs to do what.' },
        { label: 'A deadline', text: 'Give a time and time zone, or a response window.' },
        { label: 'A fallback', text: 'Say what you will do if the request cannot be met.' },
      ],
    },
    {
      kind: 'scenario', id: 'scenario', heading: 'A brief that cannot go out yet',
      body: 'It is Friday, 20:00 in São Paulo (23:00 UTC). You receive this message from Dmitri, an outreach coordinator in Berlin:',
      message: {
        sender: 'Dmitri Volkov', senderRole: 'Outreach coordinator', senderRegion: 'Berlin',
        time: 'after midnight', channel: '#partner-briefing',
        text: 'The budget in this brief is wrong. Fix it now ASAP before the partner briefing. Seriously, did nobody check this??',
      },
      facts: [
        'Brief #482 has conflicting budget figures in section 2. Aisha, the owner in Lagos, is offline; it is midnight there.',
        'The partner briefing starts Saturday at 15:00 UTC, 16 hours from now.',
        'The previous brief is approved and accurate. You can use it, but it omits the new initiative.',
        'There is no live safety incident. You can pause the new version until the figures are confirmed.',
      ],
    },
    {
      kind: 'decision', id: 'decision-1', contextLabel: 'Friday · 23:00 UTC',
      prompt: 'What will you do before logging off?',
      options: [
        { id: 'a', text: 'Call Aisha now and ask her to correct the figures.', isRecommended: false,
          effect: 'Aisha answers, tired, and asks which figures are wrong. You gain contact but still need to explain the issue. Her morning starts with an interrupted night and no shared record of the plan.' },
        { id: 'b', text: 'Tell Dmitri “I will handle it” and check the figures yourself in the morning.', isRecommended: false,
          effect: 'You take responsibility, but Aisha and the briefing host cannot see the plan. While you sleep, they each make assumptions about which version will be used.' },
        { id: 'c', text: 'Post the conflicting figures, ask Aisha to confirm by 09:00 UTC, and say you will use the approved brief if confirmation is unavailable.', isRecommended: true,
          effect: 'The team has one shared plan. Aisha can review it when she wakes, and the host knows which version to use if the new figures remain unconfirmed.' },
      ],
      recommendedWhy: 'With no live safety incident and an approved fallback, a shared handoff protects both the deadline and rest. A genuine emergency or an agreed on-call arrangement could justify waking the owner.',
    },
    {
      kind: 'decision', id: 'decision-2', contextLabel: 'Saturday · 06:00 UTC',
      prompt: 'Aisha is online. The new figures still need approval. How will you protect the briefing?',
      options: [
        { id: 'a', text: 'Use the new version because the briefing needs the initiative.', isRecommended: false, effect: 'The briefing includes unconfirmed figures. A deadline does not make the numbers reliable.' },
        { id: 'b', text: 'Leave the version choice to Aisha.', isRecommended: false, effect: 'Aisha still lacks the host’s expectations. The owner needs context and a clear boundary.' },
        { id: 'c', text: 'Use the approved brief and schedule an update once the figures are confirmed.', isRecommended: true, effect: 'The host can proceed with accurate information. The new initiative waits for approval.' },
      ],
      recommendedWhy: 'The approved version is a credible fallback, given the facts in this scenario.',
      variants: {
        basedOnStepId: 'decision-1',
        byOptionId: {
          a: {
            contextLabel: 'You woke the owner · Saturday 06:00 UTC',
            prompt: 'Aisha says: “I lost sleep, and I still do not know which budget to use.” Approval is unavailable before the briefing. How will you repair the handoff?',
            options: [
              { id: 'a', text: 'Acknowledge the interruption, publish the missing context, and tell the host to use the approved brief.', isRecommended: true, effect: 'You repair the shared record and acknowledge the cost of the call. Aisha can focus on approval later; the host has an accurate version now.' },
              { id: 'b', text: 'Ask Aisha to estimate the figures so the new initiative can still be included.', isRecommended: false, effect: 'Aisha now has both fatigue and pressure to invent certainty. The team could present a budget nobody has approved.' },
              { id: 'c', text: 'Apologise privately and wait for Aisha to choose a version.', isRecommended: false, effect: 'The apology addresses the interruption, but the briefing host still lacks a plan. Repair requires a visible decision as well as an apology.' },
            ],
            recommendedWhy: 'Repair the interruption and the information gap together. Waiting for approval is reasonable; sending guessed figures is not.',
          },
          b: {
            contextLabel: 'Your plan stayed private · Saturday 06:00 UTC',
            prompt: 'The host has downloaded the unapproved brief while Aisha is updating another copy. Two versions are moving in parallel. What do you do now?',
            options: [
              { id: 'a', text: 'Keep working on your copy and explain after the briefing.', isRecommended: false, effect: 'The host may present the unconfirmed figures before your explanation arrives. Private work does not resolve the version conflict.' },
              { id: 'b', text: 'Post one shared version decision, ask the host to confirm receipt, and use the approved brief for this briefing.', isRecommended: true, effect: 'You stop the competing copies and check that the person presenting has the plan. Aisha can finish the new version without a rushed approval.' },
              { id: 'c', text: 'Ask Aisha and the host to settle it between themselves.', isRecommended: false, effect: 'They still do not share the facts you used. Delegating the conflict without context adds another round of messages.' },
            ],
            recommendedWhy: 'A visible handoff and confirmation of receipt resolve the coordination failure your private promise left behind.',
          },
          c: {
            contextLabel: 'Your shared plan is in place · Saturday 06:00 UTC',
            prompt: 'Aisha has read your handoff: “I can correct the draft, but approval will take until Monday.” The host asks to include the new initiative anyway. What do you choose?',
            options: [
              { id: 'a', text: 'Include the corrected draft; approval can follow on Monday.', isRecommended: false, effect: 'Correction and approval are different. The host would present numbers that have not passed the agreed review.' },
              { id: 'b', text: 'Cancel the whole partner briefing until Monday.', isRecommended: false, effect: 'You remove the uncertainty but also discard a useful, approved briefing. The fallback lets you meet the deadline without overstating the new initiative.' },
              { id: 'c', text: 'Use the approved brief, explain the omitted initiative to the host, and schedule a follow-up after approval.', isRecommended: true, effect: 'Your fallback works. The partner receives accurate information now and a clear expectation for the update later.' },
            ],
            recommendedWhy: 'Follow the fallback you made visible, explain its tradeoff, and preserve a path to the fuller update.',
          },
        },
      },
    },
    {
      kind: 'practice', id: 'practice', heading: 'Write a clear handoff',
      body: 'Rewrite Dmitri’s message for Aisha’s morning. Check your draft, then improve one weak point.',
      scenarioId: 'pr-broken', hint: 'Brief #482 · conflicting figures in section 2 · confirm by Saturday 09:00 UTC · approved brief as the fallback.',
    },
    {
      kind: 'reflection', id: 'reflection', heading: 'Take this into your next handoff',
      body: 'Your decisions shaped the team’s next morning. Review the consequences below, then use this four-part check on one real message this week.',
      points: [
        'Name the item and the specific issue.',
        'Give one person a clear action and an explicit time.',
        'State a fallback and its tradeoff before you log off.',
        'Before sending: could the reader act without asking what you meant?',
      ],
    },
  ],
  takeaways: [
    'Write a handoff with context, a request, a deadline and a fallback.',
    'Make a version or ownership decision visible to everyone affected.',
    'Protect a deadline with an approved alternative when facts remain unconfirmed.',
  ],
};
