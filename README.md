# Maua Learn

An iPhone-first learning prototype for people working across time zones. The main lesson teaches a clear handoff: give context, name the next action, set a deadline, and offer a safe alternative.

## Implemented experience

- One guided lesson, **A clear handoff, across time zones**, designed for approximately 5–8 minutes. Seven steps cover introduction, concept, scenario, two decisions, writing practice, and reflection.
- The first decision changes the next morning's situation, choices, and final recap. Recommendations explain the scenario's constraints.
- Previous-step review and device-local resume preserve choices, first/current drafts, checked text, and reference visibility. Completed work remains available through **Review your lesson**.
- A local writing checklist detects five structural signals and supports revision/comparison. It cannot judge meaning, verify facts, or approve a message for sending.
- Four optional five-question decision drills are separate from the guided lesson.
- System typography, a persistent primary action, keyboard avoidance, accessible labels/announcements, and reduced-motion support. Native iPhone behavior still requires device verification.

## Run locally

Use a supported Node.js release; this revision was verified with Node.js 24.13.0. Dependencies are pinned in `package-lock.json`.

```bash
npm ci
npx expo start
```

For a browser preview:

```bash
npx expo start --web
```

## Verify

```bash
npx expo lint
npx tsc --noEmit
npm run test:learning
npx expo export --platform web --output-dir dist --max-workers 2
```

Behavior tests cover misleading checklist inputs, branching decisions, draft retention, stale feedback, and legacy session restoration. Web export generates individual lesson routes; Vercel uses `dist` with clean URLs.

## Scope and evidence

Content and people are fictional. The interface is English-only. Progress is stored on this device; there is no account, organization integration, or cross-device sync. Default Expo artwork has been replaced with a simple Maua Learn mark.

An iOS build, TestFlight distribution, and App Store submission have not been performed. See [TESTING.md](./TESTING.md) for results, native verification gaps, and the EAS audit. See [DEMO.md](./DEMO.md) for the reviewer walkthrough.
