import { TactilePressable } from '@/components/governance/tactile-pressable';
import { LESSONS, findLesson } from '@/data/lessons';
import { formatTodayHeader } from '@/utils/format-date';
import { streakDays, useGlobalLessonStore } from '@/utils/lesson-store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [showDrills, setShowDrills] = useState(false);
  const { completedLessonIds, completionDates, inProgress, savedSessions, isHydrated } = useGlobalLessonStore();
  const lesson = LESSONS[0];
  const completed = completedLessonIds.includes(lesson.id);
  const active = inProgress ? findLesson(inProgress.lessonId) : undefined;
  const resumeMain = active?.id === lesson.id || Boolean(savedSessions[lesson.id] && !completed);
  const mainSession = savedSessions[lesson.id];
  const streak = streakDays(completionDates);
  const openLesson = (id: string, mode?: string) => router.push({ pathname: '/lesson/[id]', params: { id, mode } });
  if (!isHydrated) return <SafeAreaView style={s.safe}><Text style={s.loading}>Loading your learning…</Text></SafeAreaView>;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']} accessibilityLanguage="en">
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.date}>{formatTodayHeader()}</Text>
        <Text accessibilityRole="header" style={s.title}>Today</Text>
        <Text style={s.intro}>Work well across time zones.</Text>
        <Text style={s.body}>Practical learning for people who coordinate work with colleagues around the world.</Text>
        {active && active.id !== lesson.id && <View style={s.resume}>
          <Text style={s.label}>Continue your exercise</Text><Text style={s.rowTitle}>{active.title}</Text>
          <TactilePressable accessibilityRole="button" onPress={() => openLesson(active.id)} style={s.linkButton}><Text style={s.link}>Resume exercise</Text></TactilePressable>
        </View>}
        <View style={s.lesson}>
          <Text style={s.label}>Guided lesson · About {lesson.durationMinutes} minutes</Text>
          <Text accessibilityRole="header" style={s.lessonTitle}>{lesson.title}</Text>
          <Text style={s.body}>{lesson.description}</Text>
          <View style={s.outcomes}><Text style={s.outcome}>Two decisions that shape the next morning</Text><Text style={s.outcome}>One handoff to write, check and improve</Text></View>
          {resumeMain && mainSession && <Text style={s.status}>Your lesson is saved. Continue where you left off.</Text>}
          {completed && !resumeMain && <Text style={s.status}>Completed · Your answers and handoff are saved on this device</Text>}
          <TactilePressable accessibilityRole="button" onPress={() => openLesson(lesson.id, completed && !resumeMain ? 'review' : undefined)} style={s.primary}><Text style={s.primaryText}>{resumeMain ? 'Continue lesson' : completed ? 'Review your lesson' : 'Start lesson'}</Text></TactilePressable>
        </View>
        <View style={s.progress}>
          <Text accessibilityRole="header" style={s.sectionTitle}>Your learning</Text>
          <Text style={s.body}>{completed ? 'Guided lesson completed. Try the handoff check on one real message this week.' : 'Start with one complete lesson. Your work is saved as you go.'}</Text>
          {streak > 0 && <Text style={s.status}>Learning streak: {streak} {streak === 1 ? 'day' : 'days'}</Text>}
        </View>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: showDrills }} onPress={() => setShowDrills(!showDrills)} style={({ pressed }) => [s.libraryToggle, pressed && s.pressed]}>
          <View style={s.flex}><Text style={s.sectionTitle}>Optional decision drills</Text><Text style={s.caption}>Four short exercises · feedback after each choice</Text></View><Text style={s.chevron}>{showDrills ? '−' : '+'}</Text>
        </Pressable>
        {showDrills && <View style={s.library}>
          <Text style={s.body}>These are standalone quizzes for extra practice. They have a shorter format than the guided lesson.</Text>
          {LESSONS.slice(1).map((drill) => <View key={drill.id} style={s.drill}>
            <Text style={s.rowTitle}>{drill.title}</Text><Text style={s.caption}>{drill.description}</Text>
            <TactilePressable accessibilityRole="button" accessibilityLabel={`Open ${drill.title} decision drill`} onPress={() => openLesson(drill.id, completedLessonIds.includes(drill.id) ? 'review' : undefined)} style={s.linkButton}><Text style={s.link}>{completedLessonIds.includes(drill.id) ? 'Review drill' : 'Open drill'} · {drill.durationMinutes} min</Text></TactilePressable>
          </View>)}
        </View>}
        <Text style={s.footer}>English demo · Fictional workplace scenarios{'\n'}Progress stays on this device.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' }, flex: { flex: 1 }, loading: { padding: 24, fontSize: 17 },
  content: { padding: 20, paddingBottom: 32, maxWidth: 500, width: '100%', alignSelf: 'center' },
  date: { fontSize: 13, color: '#636366', marginTop: 8 }, title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, color: '#1C1C1E', marginTop: 4, marginBottom: 20 },
  intro: { fontSize: 22, fontWeight: '600', color: '#1C1C1E', marginBottom: 8, letterSpacing: -0.3 }, body: { fontSize: 17, lineHeight: 25, color: '#48484A' },
  lesson: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 22, marginTop: 24, gap: 14 }, label: { fontSize: 13, fontWeight: '500', color: '#636366' },
  lessonTitle: { fontSize: 27, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.6 }, outcomes: { gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#D1D1D6', paddingTop: 16 }, outcome: { fontSize: 15, lineHeight: 22, color: '#48484A' },
  primary: { backgroundColor: '#1C1C1E', borderRadius: 14, minHeight: 52, padding: 14, alignItems: 'center' }, primaryText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600', textAlign: 'center' },
  status: { fontSize: 13, color: '#636366', lineHeight: 19, marginTop: 4 }, progress: { paddingVertical: 24, gap: 8 }, sectionTitle: { fontSize: 19, fontWeight: '600', color: '#1C1C1E' },
  libraryToggle: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#C7C7CC', paddingVertical: 18, minHeight: 52 }, chevron: { fontSize: 25, color: '#636366' }, caption: { fontSize: 14, color: '#636366', lineHeight: 21, marginTop: 4 },
  library: { gap: 8 }, drill: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#D1D1D6', paddingVertical: 16 }, rowTitle: { fontSize: 17, fontWeight: '600', color: '#1C1C1E' },
  linkButton: { minHeight: 44, justifyContent: 'center', paddingVertical: 10 }, link: { fontSize: 16, color: '#1C1C1E', fontWeight: '600' }, resume: { marginTop: 24, padding: 16, backgroundColor: '#E5E5EA', borderRadius: 16, gap: 8 },
  footer: { marginTop: 24, fontSize: 12, color: '#636366', lineHeight: 18, textAlign: 'center' }, pressed: { opacity: 0.5 },
});
