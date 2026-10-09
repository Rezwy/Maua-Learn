import type { Lesson, LessonSession, LessonStep, SavedAnswer } from '../types/lesson';

export function resolveLessonStep(
  lesson: Lesson,
  index: number,
  answers: Record<string, SavedAnswer>,
): LessonStep {
  const step = lesson.steps[index];
  if (step.kind !== 'decision' || !step.variants) return step;
  const priorChoice = answers[step.variants.basedOnStepId]?.optionId;
  const variant = step.variants.byOptionId[priorChoice];
  return variant ? { ...step, ...variant } : step;
}

export function createLessonSession(lesson: Lesson): LessonSession {
  return {
    lessonId: lesson.id, stepIndex: 0, stepId: lesson.steps[0].id,
    answers: {}, draft: '', firstDraft: '', referenceVisible: false,
  };
}

export function moveLessonSession(lesson: Lesson, session: LessonSession, index: number): LessonSession {
  const stepIndex = Math.max(0, Math.min(index, lesson.steps.length - 1));
  return { ...session, stepIndex, stepId: lesson.steps[stepIndex].id };
}

export function restoreLessonSession(lesson: Lesson, saved: LessonSession): LessonSession {
  const stableIndex = lesson.steps.findIndex((step) => step.id === saved.stepId);
  // The previous showcase had a separate objectives page. Fold it into the intro.
  const legacySteps = ['intro', 'intro', 'concept', 'scenario', 'decision-1', 'decision-2', 'practice', 'practice', 'reflection'];
  const legacyIndex = lesson.id === 'lesson-1' && !saved.stepId
    ? lesson.steps.findIndex((step) => step.id === legacySteps[saved.stepIndex]) : saved.stepIndex;
  const session = moveLessonSession(lesson, saved, stableIndex >= 0 ? stableIndex : legacyIndex);
  const answers: Record<string, SavedAnswer> = {};
  lesson.steps.forEach((_, index) => {
    const step = resolveLessonStep(lesson, index, answers);
    if (step.kind !== 'decision') return;
    const option = step.options.find((candidate) => candidate.id === saved.answers[step.id]?.optionId);
    if (option) answers[step.id] = { stepId: step.id, optionId: option.id, isRecommended: option.isRecommended };
  });
  // A stale check must never be displayed for an edited draft.
  return { ...session, answers, checkedDraft: saved.checkedDraft === saved.draft ? saved.checkedDraft : undefined };
}

export function canContinueLesson(step: LessonStep, session: LessonSession): boolean {
  if (step.kind === 'decision') return Boolean(session.answers[step.id]);
  if (step.kind === 'practice') return Boolean(session.checkedDraft && session.checkedDraft === session.draft && session.checkedDraft.trim().split(/\s+/).length >= 12);
  return true;
}
