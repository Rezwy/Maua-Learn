import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import type { LessonSession } from '@/types/lesson';
export type { SavedAnswer } from '@/types/lesson';

/* ------------------------------------------------------------------ */
/* Persisted state shape                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'maua_learn_progress';

export type InProgressLesson = LessonSession;

type PersistedState = {
  /** Lesson IDs that have been fully completed. */
  completedLessonIds: string[];
  /** Score (recommended-answer count) per completed lesson. */
  completedScores: Record<string, number>;
  /** ISO date strings of completion events — used for streak calculation. */
  completionDates: string[];
  /** A lesson the learner started but did not finish. */
  inProgress: InProgressLesson | null;
  savedSessions: Record<string, LessonSession>;
};

/* ------------------------------------------------------------------ */
/* In-memory state + listeners (external store pattern)                */
/* ------------------------------------------------------------------ */

let listeners: (() => void)[] = [];
let hydrated = false;
let hydrationStarted = false;
let writeQueue: Promise<void> = Promise.resolve();

let state: PersistedState = {
  completedLessonIds: [],
  completedScores: {},
  completionDates: [],
  inProgress: null,
  savedSessions: {},
};

function notify() {
  listeners.forEach((fn) => fn());
}

function persist() {
  const snapshot = JSON.stringify(state);
  writeQueue = writeQueue.then(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, snapshot);
    } catch {
      // Progress remains available in memory for this session.
    }
  });
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function isValidState(obj: unknown): obj is PersistedState {
  if (obj === null || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  const answersAreValid = (value: unknown): boolean =>
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.entries(value).every(([key, answer]) => {
      if (!answer || typeof answer !== 'object') return false;
      const a = answer as Record<string, unknown>;
      return key === a.stepId && typeof a.optionId === 'string' && typeof a.isRecommended === 'boolean';
    });
  const sessionIsValid = (value: unknown): boolean => {
    if (!value || typeof value !== 'object') return false;
    const progress = value as Record<string, unknown>;
    return typeof progress.lessonId === 'string' &&
      Number.isInteger(progress.stepIndex) && (progress.stepIndex as number) >= 0 &&
      answersAreValid(progress.answers) &&
      ['draft', 'firstDraft', 'checkedDraft', 'stepId'].every((key) => progress[key] === undefined || typeof progress[key] === 'string') &&
      (progress.referenceVisible === undefined || typeof progress.referenceVisible === 'boolean');
  };
  return (
    Array.isArray(o.completedLessonIds) &&
    o.completedLessonIds.every((id: unknown) => typeof id === 'string') &&
    typeof o.completedScores === 'object' &&
    o.completedScores !== null &&
    !Array.isArray(o.completedScores) &&
    Object.values(o.completedScores).every((score) => typeof score === 'number' && Number.isFinite(score) && score >= 0) &&
    Array.isArray(o.completionDates) &&
    o.completionDates.every((date: unknown) => typeof date === 'string' && !Number.isNaN(Date.parse(date))) &&
    (o.inProgress == null || sessionIsValid(o.inProgress)) &&
    (o.savedSessions === undefined || (
      o.savedSessions !== null && typeof o.savedSessions === 'object' && !Array.isArray(o.savedSessions) &&
      Object.entries(o.savedSessions).every(([key, value]) => sessionIsValid(value) && (value as LessonSession).lessonId === key)
    ))
  );
}

/* ------------------------------------------------------------------ */
/* Hydration                                                           */
/* ------------------------------------------------------------------ */

async function hydrate() {
  if (hydrationStarted) return;
  hydrationStarted = true;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidState(parsed)) {
        state = {
          completedLessonIds: parsed.completedLessonIds,
          completedScores: parsed.completedScores,
          completionDates: parsed.completionDates,
          inProgress: parsed.inProgress ?? null,
          savedSessions: parsed.savedSessions ?? (parsed.inProgress ? { [parsed.inProgress.lessonId]: parsed.inProgress } : {}),
        };
      }
    }
  } catch {
    // Malformed data — start fresh.
  } finally {
    hydrated = true;
    notify();
  }
}

/* ------------------------------------------------------------------ */
/* Public actions                                                      */
/* ------------------------------------------------------------------ */

export function markLessonComplete(id: string, score: number, session?: LessonSession) {
  if (!state.completedLessonIds.includes(id)) {
    state = {
      ...state,
      completedLessonIds: [...state.completedLessonIds, id],
      completionDates: [...state.completionDates, new Date().toISOString()],
    };
  }
  state = {
    ...state,
    completedScores: { ...state.completedScores, [id]: score },
    inProgress: state.inProgress?.lessonId === id ? null : state.inProgress,
    savedSessions: session ? { ...state.savedSessions, [id]: session } : state.savedSessions,
  };
  notify();
  persist();
}

export function saveInProgress(lesson: InProgressLesson) {
  state = { ...state, inProgress: lesson, savedSessions: { ...state.savedSessions, [lesson.lessonId]: lesson } };
  notify();
  persist();
}

export function clearInProgress() {
  const savedSessions = { ...state.savedSessions };
  if (state.inProgress) delete savedSessions[state.inProgress.lessonId];
  state = { ...state, inProgress: null, savedSessions };
  notify();
  persist();
}

export function resetAllProgress() {
  state = {
    completedLessonIds: [],
    completedScores: {},
    completionDates: [],
    inProgress: null,
    savedSessions: {},
  };
  notify();
  persist();
}

/* ------------------------------------------------------------------ */
/* Derived data                                                        */
/* ------------------------------------------------------------------ */

/** Count unique calendar days (in local time) with at least one completion. */
export function streakDays(dates: string[]): number {
  if (dates.length === 0) return 0;
  const dayNumber = (date: Date) =>
    Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  const uniqueDays = [...new Set(dates.map((value) => new Date(value)).filter((date) => !Number.isNaN(date.getTime())).map(dayNumber))].sort((a, b) => a - b);
  const today = dayNumber(new Date());
  if (uniqueDays.at(-1) !== today && uniqueDays.at(-1) !== today - 1) return 0;

  let streak = 1;
  for (let i = uniqueDays.length - 1; i > 0; i--) {
    if (uniqueDays[i] - uniqueDays[i - 1] === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/* ------------------------------------------------------------------ */
/* React hook                                                          */
/* ------------------------------------------------------------------ */

export function useGlobalLessonStore() {
  const [current, setCurrent] = useState(() => ({ ...state, isHydrated: hydrated }));

  useEffect(() => {
    const listener = () => setCurrent({ ...state, isHydrated: hydrated });
    listeners.push(listener);
    void hydrate();
    // Cover a hydration or write that finished between rendering and subscribing.
    listener();
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    completedLessonIds: current.completedLessonIds,
    completedScores: current.completedScores,
    completedCount: current.completedLessonIds.length,
    completionDates: current.completionDates,
    inProgress: current.inProgress,
    savedSessions: current.savedSessions,
    isHydrated: current.isHydrated,
    markLessonComplete,
    saveInProgress,
    clearInProgress,
    resetAllProgress,
  };
}
