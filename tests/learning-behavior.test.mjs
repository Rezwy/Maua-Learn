import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyzeRewrite } from '../src/utils/practice-analyzer.ts';
import { SHOWCASE } from '../src/data/showcase-lesson.ts';
import { createLessonSession, moveLessonSession, restoreLessonSession, resolveLessonStep, canContinueLesson } from '../src/utils/lesson-session.ts';

const strong = 'Hi Aisha, brief #482 has conflicting budget figures in section 2. Could you confirm the budget by Saturday 09:00 UTC? If approval is unavailable, I will use the approved brief for the partner briefing. Thanks for checking.';
const signal = (text, key) => analyzeRewrite(text).checks.find((check) => check.key === key)?.present ?? false;

test('a complete handoff detects five patterns without claiming the message is ready', () => {
  const result = analyzeRewrite(strong);
  assert.equal(result.checks.filter((check) => check.present).length, 5);
  assert.match(result.verdictText, /cannot verify meaning/);
  assert.doesNotMatch(result.verdictText, /could act|ready to send|without a follow-up/i);
});

test('a timezone alone is not a deadline; recurring updates are not a response deadline', () => {
  assert.equal(signal('Hi Aisha, please review the budget in our brief. Our team works in UTC. Thanks for checking.', 'deadline'), false);
  assert.equal(signal('Hi Aisha, please review the budget in our brief. I will send updates every 20 minutes. Thanks.', 'deadline'), false);
});

test('an explicit time with timezone or a response window can be detected', () => {
  for (const deadline of ['by Saturday 09:00 UTC', 'by Friday EOD JST', 'within 30 minutes']) {
    assert.equal(signal(`Hi Aisha, could you confirm the budget in brief #482 ${deadline}? Thanks for checking.`, 'deadline'), true, deadline);
  }
});

test('a promise without a condition or a conditional without an alternative is not a fallback', () => {
  assert.equal(signal('Hi Aisha, please review the budget in our brief. I will check it later and share some notes.', 'fallback'), false);
  assert.equal(signal('Hi Aisha, please review the budget in our brief. If approval is unavailable, let me know. Thanks.', 'fallback'), false);
});

test('a conditional concrete alternative is detected, including typographic apostrophes', () => {
  for (const commitment of ['I will', "I'll", 'I’ll']) {
    assert.equal(signal(`Hi Aisha, could you confirm the budget? If approval is unavailable, ${commitment} use the approved brief. Thanks.`, 'fallback'), true);
  }
});

test('keyword stuffing is not rewarded with five signals', () => {
  const result = analyzeRewrite('Hi thanks please ticket test UTC fallback plan b I will context request deadline warm opener');
  assert.ok(result.checks.filter((check) => check.present).length <= 1);
  assert.notEqual(result.verdict, 'ready');
});

test('a greeting and pressure do not count as a constructive tone', () => {
  assert.equal(signal('Hi Aisha, brief #482 has conflicting budget figures. Could you fix it now ASAP? Thanks for checking.', 'tone'), false);
});

test('short text and copying the original give useful feedback without a success verdict', () => {
  assert.equal(analyzeRewrite('please check this').verdict, 'not-a-message');
  const original = 'The budget in this brief is wrong. Fix it now ASAP before the partner briefing. Seriously, did nobody check this??';
  assert.equal(analyzeRewrite(original, original).verdict, 'needs-work');
});

test('all first decisions create distinct next challenges and actions', () => {
  const index = SHOWCASE.steps.findIndex((step) => step.id === 'decision-2');
  const branches = ['a', 'b', 'c'].map((optionId) => resolveLessonStep(SHOWCASE, index, { 'decision-1': { stepId: 'decision-1', optionId, isRecommended: optionId === 'c' } }));
  assert.equal(new Set(branches.map((branch) => branch.prompt)).size, 3);
  assert.equal(new Set(branches.map((branch) => JSON.stringify(branch.options))).size, 3);
  assert.deepEqual(branches.map((branch) => branch.options.find((option) => option.isRecommended).id), ['a', 'b', 'c']);
});

test('back, forward and JSON resume keep answers, both drafts, check and reference visibility', () => {
  const index = SHOWCASE.steps.findIndex((step) => step.kind === 'practice');
  const session = { ...createLessonSession(SHOWCASE), draft: strong, firstDraft: 'My first draft', checkedDraft: strong, referenceVisible: true,
    answers: { 'decision-1': { stepId: 'decision-1', optionId: 'a', isRecommended: false } } };
  const atPractice = moveLessonSession(SHOWCASE, session, index);
  const back = moveLessonSession(SHOWCASE, atPractice, index - 1);
  const resumed = restoreLessonSession(SHOWCASE, JSON.parse(JSON.stringify(moveLessonSession(SHOWCASE, back, index))));
  assert.equal(resumed.draft, strong);
  assert.equal(resumed.firstDraft, session.firstDraft);
  assert.equal(resumed.checkedDraft, strong);
  assert.equal(resumed.referenceVisible, true);
  assert.deepEqual(resumed.answers, session.answers);
  assert.equal(canContinueLesson(SHOWCASE.steps[index], resumed), true);
});

test('edited and resumed draft does not display a stale check or unlock practice', () => {
  const index = SHOWCASE.steps.findIndex((step) => step.kind === 'practice');
  const session = restoreLessonSession(SHOWCASE, { ...createLessonSession(SHOWCASE), draft: 'Edited draft', checkedDraft: strong });
  assert.equal(session.checkedDraft, undefined);
  assert.equal(canContinueLesson(SHOWCASE.steps[index], session), false);
});

test('legacy practice index migrates by stable step while retaining the existing draft', () => {
  const session = restoreLessonSession(SHOWCASE, { lessonId: SHOWCASE.id, stepIndex: 7, answers: {}, draft: 'Existing work', firstDraft: 'First attempt' });
  assert.equal(SHOWCASE.steps[session.stepIndex].id, 'practice');
  assert.equal(session.draft, 'Existing work');
});

test('restored answers use the branch-specific recommendation and discard nonexistent options', () => {
  const saved = { ...createLessonSession(SHOWCASE), answers: {
    'decision-1': { stepId: 'decision-1', optionId: 'a', isRecommended: true },
    'decision-2': { stepId: 'decision-2', optionId: 'a', isRecommended: false },
    invalid: { stepId: 'invalid', optionId: 'x', isRecommended: true },
  } };
  const restored = restoreLessonSession(SHOWCASE, saved);
  assert.equal(restored.answers['decision-1'].isRecommended, false);
  assert.equal(restored.answers['decision-2'].isRecommended, true);
  assert.equal(restored.answers.invalid, undefined);
});
