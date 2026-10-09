/* ------------------------------------------------------------------ */
/* Curriculum                                                          */
/* ------------------------------------------------------------------ */

export type DecisionOption = {
  id: string;
  text: string;
  isRecommended: boolean;
  /** Consequence of this choice — shown immediately after the learner commits. */
  effect: string;
};

export type DecisionStep = {
  kind: 'decision';
  id: string;
  /** Short situational label above the prompt, e.g. "THE FIRST MOVE". */
  contextLabel: string;
  prompt: string;
  options: DecisionOption[];
  /** Why the recommended option works better — shown when another option was chosen. */
  recommendedWhy?: string;
  /** A later challenge changes according to an earlier committed decision. */
  variants?: {
    basedOnStepId: string;
    byOptionId: Record<string, {
      contextLabel: string;
      prompt: string;
      options: DecisionOption[];
      recommendedWhy: string;
    }>;
  };
};

export type SavedAnswer = {
  stepId: string;
  optionId: string;
  isRecommended: boolean;
};

export type LessonSession = {
  lessonId: string;
  stepIndex: number;
  /** Stable ID keeps saved progress aligned when curriculum steps change. */
  stepId?: string;
  answers: Record<string, SavedAnswer>;
  draft?: string;
  firstDraft?: string;
  checkedDraft?: string;
  referenceVisible?: boolean;
};

export type IntroStep = {
  kind: 'intro';
  id: string;
  heading: string;
  /** What the lesson covers and why it matters. */
  body: string;
};

export type ObjectivesStep = {
  kind: 'objectives';
  id: string;
  items: string[];
};

export type ConceptStep = {
  kind: 'concept';
  id: string;
  heading: string;
  body: string;
  points: { label: string; text: string }[];
};

export type ScenarioMessage = {
  sender: string;
  senderRole: string;
  senderRegion: string;
  time: string;
  channel: string;
  text: string;
};

export type ScenarioStep = {
  kind: 'scenario';
  id: string;
  heading: string;
  body: string;
  message: ScenarioMessage;
  /** Facts the learner can rely on when deciding. */
  facts: string[];
};

export type TakeawayStep = {
  kind: 'takeaway';
  id: string;
  heading: string;
  body: string;
};

export type PracticeStep = {
  kind: 'practice';
  id: string;
  heading: string;
  body: string;
  /** Which practice-lab scenario to rewrite. */
  scenarioId: string;
  hint: string;
};

export type ReflectionStep = {
  kind: 'reflection';
  id: string;
  heading: string;
  body: string;
  points: string[];
};

export type LessonStep =
  | IntroStep
  | ObjectivesStep
  | ConceptStep
  | ScenarioStep
  | DecisionStep
  | TakeawayStep
  | PracticeStep
  | ReflectionStep;

export type Lesson = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  steps: LessonStep[];
  /** Concrete skills the learner can now apply — shown on completion. */
  takeaways: string[];
};

export const isDecisionStep = (step: LessonStep): step is DecisionStep =>
  step.kind === 'decision';
