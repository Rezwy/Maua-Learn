export type Choice = {
  id: 'A' | 'B';
  label: string;
};

export type Question = {
  id: string;
  prompt: string;
  choices: [Choice, Choice];
};

export type Lesson = {
  durationLabel: string;
  title: string;
  description: string;
  questions: Question[];
};

export const TODAY_LESSON: Lesson = {
  durationLabel: '5 MIN MICRO-LEARNING',
  title: 'Ethical Leadership in Global Teams',
  description:
    'Practice how you set norms, share credit, and hold the line when cultures and incentives collide.',
  questions: [
    {
      id: 'q1',
      prompt: 'A teammate in another region is silent in standups. What is the more ethical first move?',
      choices: [
        { id: 'A', label: 'Assume disengagement and reassign their work.' },
        { id: 'B', label: 'Check time zones, language load, and invite input privately.' },
      ],
    },
    {
      id: 'q2',
      prompt: 'True or false: Credit for a win should follow the most visible speaker in the room.',
      choices: [
        { id: 'A', label: 'True' },
        { id: 'B', label: 'False' },
      ],
    },
    {
      id: 'q3',
      prompt: 'A local shortcut would speed delivery but violate a partner’s data policy. You…',
      choices: [
        { id: 'A', label: 'Ship now; policies can be explained later.' },
        { id: 'B', label: 'Pause, name the constraint, and find a compliant path.' },
      ],
    },
  ],
};

export const LEARNER = {
  name: 'Alex Rivera',
  track: 'Leadership Track',
  streakDays: 4,
  lessonsCompleted: 12,
} as const;
