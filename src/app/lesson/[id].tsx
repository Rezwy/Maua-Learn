import { LessonJourney } from '@/components/governance/lesson-journey';
import { TactilePressable } from '@/components/governance/tactile-pressable';
import { LESSONS, findLesson } from '@/data/lessons';
import { createLessonSession, moveLessonSession, restoreLessonSession } from '@/utils/lesson-session';
import { useGlobalLessonStore } from '@/utils/lesson-store';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: lesson.id }));
}

export default function LessonRoute() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const store = useGlobalLessonStore();
  const lesson = findLesson(id);
  if (!store.isHydrated) return <SafeAreaView style={s.safe}><Text style={s.body}>Loading your lesson…</Text></SafeAreaView>;
  if (!lesson) return <SafeAreaView style={s.safe}><Text style={s.heading}>Lesson unavailable</Text><TactilePressable accessibilityRole="button" onPress={() => router.replace('/')} style={s.primary}><Text style={s.primaryText}>Back to Today</Text></TactilePressable></SafeAreaView>;
  const saved = store.savedSessions[lesson.id];
  const initial = saved ? restoreLessonSession(lesson, saved) : createLessonSession(lesson);
  return <LessonJourney key={lesson.id} lesson={lesson} initialSession={mode === 'review' ? moveLessonSession(lesson, initial, 0) : initial} onComplete={store.markLessonComplete} />;
}

const s = StyleSheet.create({
  safe: { flex: 1, padding: 24, backgroundColor: '#F2F2F7' },
  heading: { fontSize: 30, fontWeight: '700', color: '#1C1C1E' },
  body: { fontSize: 17, color: '#48484A' },
  primary: { minHeight: 52, padding: 14, backgroundColor: '#1C1C1E', borderRadius: 14 },
  primaryText: { color: '#FFFFFF', fontSize: 17, textAlign: 'center' },
});