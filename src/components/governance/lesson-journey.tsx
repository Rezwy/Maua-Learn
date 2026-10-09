import { LessonScreen } from '@/components/governance/lesson-player';
import { TactilePressable } from '@/components/governance/tactile-pressable';
import type { Lesson, LessonSession } from '@/types/lesson';
import { createLessonSession } from '@/utils/lesson-session';
import { saveInProgress } from '@/utils/lesson-store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LessonJourney({ lesson, initialSession, onComplete }: {
  lesson: Lesson; initialSession: LessonSession; onComplete: (id: string, score: number, session?: LessonSession) => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const [start, setStart] = useState(initialSession);
  const [completedSession, setCompletedSession] = useState<LessonSession | null>(null);
  const restart = () => {
    const begin = () => { setStart(createLessonSession(lesson)); setCompletedSession(null); setAttempt((value) => value + 1); };
    const message = 'This starts a fresh attempt and replaces the saved answers and draft for this exercise.';
    if (Platform.OS === 'web') { if (window.confirm(message)) begin(); }
    else Alert.alert('Explore another path?', message, [{ text: 'Cancel', style: 'cancel' }, { text: 'Start again', onPress: begin }]);
  };
  if (completedSession) return (
    <SafeAreaView style={s.safe} accessibilityLanguage="en"><ScrollView contentContainerStyle={s.content}>
      <Text style={s.label}>Lesson completed</Text>
      <Text accessibilityRole="header" style={s.heading}>{lesson.id === 'lesson-1' ? 'A better next morning starts with your handoff.' : 'Your decision drill is complete.'}</Text>
      <Text style={s.body}>{lesson.id === 'lesson-1' ? 'You explored two decisions and wrote a handoff. Apply the four-part check to one real message this week.' : 'Review the reasoning behind your choices and try it in your next team decision.'}</Text>
      <View style={s.card}><Text accessibilityRole="header" style={s.sectionTitle}>Keep these principles</Text>{lesson.takeaways.map((text) => <Text key={text} style={s.body}>{text}</Text>)}</View>
      {completedSession.draft && <View style={s.card}><Text accessibilityRole="header" style={s.sectionTitle}>Your handoff</Text><Text selectable style={s.body}>{completedSession.draft}</Text><Text style={s.label}>Saved on this device. Review it from Today.</Text></View>}
      <TactilePressable accessibilityRole="button" onPress={() => router.replace('/')} style={s.primary}><Text style={s.primaryText}>Back to Today</Text></TactilePressable>
      <TactilePressable accessibilityRole="button" onPress={restart} style={s.secondary}><Text style={s.secondaryText}>Explore another path</Text></TactilePressable>
    </ScrollView></SafeAreaView>
  );
  return <LessonScreen key={attempt} lesson={lesson} initialSession={start} onProgress={saveInProgress}
    onExit={(session) => { saveInProgress(session); if (router.canGoBack()) router.back(); else router.replace('/'); }}
    onComplete={(session, score) => { onComplete(lesson.id, score, session); setCompletedSession(session); }} />;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' }, content: { padding: 24, gap: 20, maxWidth: 500, width: '100%', alignSelf: 'center' },
  label: { fontSize: 13, lineHeight: 19, color: '#636366' }, heading: { fontSize: 30, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.6 }, body: { fontSize: 17, lineHeight: 25, color: '#48484A' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, gap: 16 }, sectionTitle: { fontSize: 19, fontWeight: '600', color: '#1C1C1E' },
  primary: { backgroundColor: '#1C1C1E', borderRadius: 14, minHeight: 52, padding: 14, alignItems: 'center' }, primaryText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  secondary: { minHeight: 48, alignItems: 'center', justifyContent: 'center' }, secondaryText: { color: '#1C1C1E', fontSize: 17 },
});
