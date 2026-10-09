import type { PracticeScenario } from '@/types/practice';

/**
 * Scenarios for the Communication Practice Lab. All people, teams and links are
 * fictional demo content.
 */
export const PRACTICE_SCENARIOS: PracticeScenario[] = [
  {
    id: 'pr-broken',
    label: 'Partner brief',
    sender: 'Dmitri Volkov',
    senderRole: 'Outreach coordinator',
    senderRegion: 'Berlin',
    channel: '#partner-briefing',
    timestamp: 'after midnight',
    message: 'The budget in this brief is wrong. Fix it now ASAP before the partner briefing. Seriously, did nobody check this??',
    context: [
      'Brief #482 is owned by Aisha in Lagos. At 23:00 UTC it is midnight for her; she is offline.',
      'Section 2 has conflicting budget figures. The new version is not approved.',
      'Ask for confirmation by Saturday 09:00 UTC. The briefing starts at 15:00 UTC.',
      'The previous brief is approved and accurate, but omits the new initiative.',
    ],
    exemplar:
      "Hi Aisha, brief #482 has conflicting budget figures in section 2. Could you confirm the budget by Saturday 09:00 UTC (10:00 in Lagos)? The partner briefing starts at 15:00 UTC. If approval is not available by then, I will use the approved brief and tell the host that the new initiative will follow after approval. Thanks for checking when your day begins.",
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
      'Docs owner: Kenji (Tokyo · JST, 12 hours ahead of you)',
      'Draft spec: https://notion.so/maua-learn/payments-api',
      'Partner integration kickoff: Monday 13:00 UTC',
      'Only the auth + webhooks sections are blocking the partner',
    ],
    exemplar:
      "Hi Kenji — hope your week is going well. Our partner kickoff is Monday 13:00 UTC and we're blocked on the auth + webhooks sections of the payments spec (https://notion.so/maua-learn/payments-api). Could you share those two sections by Friday EOD JST? The rest isn't blocking. If that timing is tight, let me know and I can draft a first pass for you to review. Thanks!",
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
      'API 5xx spike since 02:14 UTC — incident doc: https://maua-learn.example/inc/2291',
      'Suspected cause: deploy v3.8.1 at 02:05 UTC',
      'On-call: Priya (Bengaluru · IST, 07:50 local)',
      'Rollback runbook is tested and takes ~10 min',
    ],
    exemplar:
      "Hi Priya — we have a SEV-1: API 5xx spike since 02:14 UTC, likely related to deploy v3.8.1 at 02:05 UTC. Incident doc with live timeline: https://maua-learn.example/inc/2291. Could you lead triage and decide on rollback within 30 min? I'll handle stakeholder comms and post updates every 20 min in the doc. If rollback isn't safe, let's pair on a hotfix. Thanks — no blame here, we'll do a blameless review after.",
  },
];

export function findScenario(id: string): PracticeScenario {
  return PRACTICE_SCENARIOS.find((s) => s.id === id) ?? PRACTICE_SCENARIOS[0];
}
