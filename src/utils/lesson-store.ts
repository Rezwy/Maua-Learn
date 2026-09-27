import { useEffect, useState } from 'react';

let listeners: (() => void)[] = [];

let state = {
  completedLessonIds: [] as string[],
  completedScores: {} as Record<string, number>,
  completedCount: 0, 
};

export function resetAllProgress() {
  state = {
    completedLessonIds: [],
    completedScores: {},
    completedCount: 0,
  };
  listeners.forEach((listener) => listener());
}

export function markLessonComplete(id: string, score: number) {
  if (!state.completedLessonIds.includes(id)) {
    state.completedLessonIds = [...state.completedLessonIds, id];
    state.completedCount += 1;
  }
  state.completedScores = { ...state.completedScores, [id]: score };
  listeners.forEach((listener) => listener());
}

export function useGlobalLessonStore() {
  const [current, setCurrent] = useState(state);

  useEffect(() => {
    const listener = () => setCurrent({ ...state });
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    completedLessonIds: current.completedLessonIds,
    completedScores: current.completedScores,
    completedCount: current.completedCount,
    markLessonComplete,
    resetAllProgress,
  };
}