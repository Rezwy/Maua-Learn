# Verification record

Date: 9 October 2026. Host: Windows. Runtime: Node.js 24.13.0, Expo SDK 57, React Native 0.86.3, React 19.2.3.

## Automated checks

| Check | Result |
| --- | --- |
| `npx expo lint` | Passed, exit 0. |
| `npx tsc --noEmit` | Passed, exit 0. |
| `npm run test:learning` | 13 tests passed. |
| `npx expo export --platform web --output-dir dist --max-workers 2` | Passed; static routes include all five lessons. |
| `git diff --check` | Passed; Windows line-ending notices are not whitespace errors. |
| Expo public configuration | App name and replacement artwork paths resolve; portrait, light theme, static web output configured. |

Behavior tests cover strong/weak writing, keyword stuffing, timezones without deadlines, recurring checks, promises without fallbacks, explicit alternatives, copy/short-input guards, pressure tone, all three decision branches, draft retention, serialized resume, stale checked text, legacy step mapping, and answer validation.

Node reports a module-type warning when importing TypeScript utility files in the test runner. Tests complete successfully; package module type was left unchanged because project configuration includes CommonJS files.

## Observed browser flow

Used the Codex in-app browser against the local Expo web server. A narrow 375 × 667 layout preview was inspected, followed by the full flow in the normal browser viewport. These observations establish web behavior only.

- Today communicates the audience and skill, with one prominent guided lesson and collapsed optional drills.
- The first choice was “wake Aisha”; the next decision presented the repair-the-interruption branch. Saved choices and consequences appeared in reflection.
- A weak draft produced 3 of 5 signals; a revision with a concrete request, UTC deadline, and approved fallback produced 5 of 5. Feedback retained the limitation of the local checker.
- Going back retained writing. Save and exit, reload, and resume restored the practice step, first draft, checked draft, feedback, and open reference.
- Completion displayed the final handoff and principles. Today showed completion and a one-day streak; reload retained completion.
- Reviewing the completed lesson restored the original choices, both draft versions, five detected signals, and the open reference. Leaving that review offers **Continue lesson** at the saved review position.
- Reload testing exposed a hydration/render issue; the store hook now publishes hydration as reactive state instead of relying on a module flag.

This was an implementation walkthrough by the developer agent. No independent first-time participants, task success rate, or timed 5–8-minute result have been collected.

Browser proof: [Today](./verification/today-web.png). The black padding introduced by the browser capture adapter was cropped out; application content was preserved. This image is not a native iPhone screenshot.

## Native iPhone verification required

No iPhone or iOS simulator was available in this Windows session. Narrow web previews cannot establish these results:

1. Safe areas and primary action visibility on a small supported iPhone.
2. Keyboard opening, editing, scrolling, checking, and closing without covering the next action.
3. Larger system text throughout the lesson, footer, reference, and completion.
4. VoiceOver reading order, selected choices, progress, and feedback announcements.
5. Reduce Motion, haptics, background/foreground, force quit, and persistent resume.
6. Cold launch and native splash artwork.

Accessible roles, labels, announcements, default system text scaling, minimum touch heights, safe-area containers, keyboard avoidance, and reduced-motion handling are implemented. Native usability remains unverified.

## iOS and EAS audit

- `app.json` contains an EAS project ID and replacement PNG icon/splash assets. Native directories are not edited manually.
- `ios.bundleIdentifier` is absent. The organization must supply the real unique identifier and Apple Developer ownership before distribution.
- `eas.json` has development, preview, and production profiles. Development enables `developmentClient`, but `expo-dev-client` is not installed. Install it with `npx expo install expo-dev-client` before using that profile.
- Preview uses internal distribution. iOS testing needs appropriate signing and registered devices. Production uses auto-increment; signing/build credentials have not been validated.
- No EAS build, TestFlight installation, App Store submission, or published update was performed. Web export does not verify an iOS binary.
- Store identity, organization branding, learning policy/content ownership, language priorities, support details, and accurate privacy/data declarations need real organization information.

Official guidance: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [app configuration](https://docs.expo.dev/versions/v57.0.0/config/app/), [iOS builds](https://docs.expo.dev/build-reference/ios-builds/), [internal distribution](https://docs.expo.dev/build/internal-distribution/).

## Release claim

The local application and web demo are verified to the extent above. App Store readiness and independent first-session usability have not been established.
