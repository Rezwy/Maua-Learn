# Maua Learn — reviewer guide

## What to try

Maua Learn helps staff in a global organization leave a handoff that a colleague can act on the next morning. This demo contains one complete guided lesson and four optional decision drills. The scenario concerns a partner briefing, so no software engineering background is needed.

The main lesson is **A clear handoff, across time zones**. Allow approximately 5–8 minutes to read, choose, write, and revise. This is a design target, not a measured result from independent users.

## A 90-second introduction

1. Open **Today**. The main card identifies the skill, estimated duration, and format. Select **Start lesson** (or **Resume lesson** / **Review your lesson** for saved work).
2. Show the four-part handoff and Friday evening partner-briefing scenario. Advance to the first decision, choose an action, and select **See what happens**.
3. Read the consequence, then select **See the next morning**. Show how the next challenge follows that choice. Waking Aisha, keeping work private, and leaving a shared handoff produce different situations and recommended responses.
4. In writing practice, show a draft, checklist feedback, revision, and first/current comparison. Explain that detected patterns do not establish accuracy or appropriateness.

The introduction previews the strongest moments. The complete lesson takes longer than 90 seconds. Let reviewers continue without verbal instructions.

## Full journey

| Step | Reviewer action | What to observe |
| --- | --- | --- |
| 1. Introduction | Read the outcome and continue. | A clear purpose for a short session. |
| 2. Concept | Read context, action, deadline, and fallback. | Teaching before decisions. |
| 3. Scenario | Read the Friday 23:00 UTC handoff and Saturday 15:00 UTC briefing constraints. | Explicit time zones, ownership, and an approved previous brief as an alternative. |
| 4. First decision | Select an action and **See what happens**. | Consequences refer to the choice. |
| 5. Next morning | Respond to the resulting situation and read feedback. | Three narrative branches with distinct options and recommended actions. |
| 6. Writing practice | Write at least 12 words, check, revise, recheck, and optionally open the reference. | Five structural checks, revision advice, and first/current comparison. A checked draft can continue even if signals remain missing. |
| 7. Reflection | Review both actions, consequences, and draft; complete the lesson. | A principle to apply to one real message this week. |
| Completion | Read the principles and saved handoff; return to Today. | Completed status, saved review, and a completion streak. |

## Navigation and persistence

- **Back** reviews earlier steps. Committed choices remain locked for that attempt, so going back does not silently rewrite consequences.
- **Save & exit** stores the step, choices, draft versions, checked text, and open reference. Relaunch or reload, then select **Resume lesson**.
- Editing checked text clears the old check. Run the checklist again before continuing.
- **Review your lesson** opens the completed attempt from its introduction. Answers and writing remain available as you advance.
- **Explore another path** on completion starts a fresh attempt after confirmation. It replaces that exercise's saved answers/draft; other exercise sessions remain.
- **My learning** shows device progress. Prototype details and reset controls are in **Demo settings**.

## Writing examples

Weak draft:

> The partner brief has a budget problem in section two. Please fix the message soon and let me know when you have finished the update.

Stronger revision:

> Partner brief #482 has conflicting budget figures in section 2. Aisha, please confirm the approved budget in the shared brief by Saturday 09:00 UTC. If you cannot confirm it by then, I will use the approved previous brief and omit the new initiative.

Misleading keyword input:

> Context tone request deadline fallback UTC. I will check again every twenty minutes. Please help with this whenever you have a chance to read it.

The last example should not get five detected signals merely for containing checklist words, a timezone, and “I will.” Automated cases live in `tests/learning-behavior.test.mjs`.

## Reset for another demo

Open **My learning → Demo settings → Reset demo progress**, then confirm. This removes this device's attempts, drafts, completion history, and streak. Reset only when those records are no longer needed.

## Honest boundaries

- English-only; no implemented language switch. Scenario times explicitly use UTC and local context. Today's date follows the device locale.
- Fictional people and documents; no fabricated organization policies or real partner records.
- Local pattern matching, not semantic assessment. It cannot verify the budget, recipient, actual timing, feasible fallback, or message suitability.
- No account, course-management backend, organization integrations, or cross-device sync. Storage removal also removes progress.
- One guided lesson and four short drills; no claimed complete curriculum.
- Browser verification is documented in [TESTING.md](./TESTING.md). Native keyboard, large text, VoiceOver, lifecycle, and distribution tests remain outstanding. App Store readiness is not established.
