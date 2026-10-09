import { TactilePressable } from '@/components/governance/tactile-pressable';
import { LESSONS } from '@/data/lessons';
import { streakDays, useGlobalLessonStore } from '@/utils/lesson-store';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { completedLessonIds, completionDates, isHydrated } = useGlobalLessonStore();
  const completedMain = completedLessonIds.includes(LESSONS[0].id);
  const drills = LESSONS.slice(1).filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  return <SafeAreaView style={s.safe} edges={['top', 'left', 'right']} accessibilityLanguage="en">
    <ScrollView contentContainerStyle={s.content}>
      <Text accessibilityRole="header" style={s.title}>My learning</Text>
      <Text style={s.body}>Your progress and handoffs are saved on this device.</Text>
      {!isHydrated ? <Text style={s.body}>Loading your learning…</Text> : <View style={s.group}>
        <View style={s.row}><Text style={s.rowLabel}>Guided lesson</Text><Text style={s.value}>{completedMain ? 'Completed' : 'Not completed'}</Text></View>
        <View style={s.row}><Text style={s.rowLabel}>Decision drills</Text><Text style={s.value}>{drills} of 4 completed</Text></View>
        <View style={s.row}><Text style={s.rowLabel}>Learning streak</Text><Text style={s.value}>{streakDays(completionDates)} days</Text></View>
      </View>}
      <Text accessibilityRole="header" style={s.heading}>Keep practising</Text>
      <Text style={s.body}>Before your next handoff, check for context, one clear request, a deadline and a fallback.</Text>
      <TactilePressable accessibilityRole="button" onPress={() => router.navigate('/')} style={s.button}><Text style={s.buttonText}>Go to your learning</Text></TactilePressable>
      <Text style={s.note}>Demo content is in English. Scenario deadlines use explicit time zones; your device date is shown on Today.</Text>
      <TactilePressable accessibilityRole="button" onPress={() => router.push('/demo-settings')} style={s.settings}><Text style={s.settingsText}>Demo settings</Text></TactilePressable>
    </ScrollView>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' }, content: { padding: 24, maxWidth: 500, width: '100%', alignSelf: 'center', gap: 16 },
  title: { fontSize: 34, fontWeight: '700', color: '#1C1C1E', letterSpacing: -0.8, marginTop: 12 },
  body: { fontSize: 17, lineHeight: 25, color: '#48484A' }, group: { marginVertical: 8, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 20 },
  row: { paddingVertical: 18, gap: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5EA' },
  rowLabel: { fontSize: 17, color: '#1C1C1E' }, value: { fontSize: 15, color: '#636366' }, heading: { fontSize: 20, fontWeight: '600', color: '#1C1C1E' },
  button: { minHeight: 52, padding: 14, alignItems: 'center', backgroundColor: '#1C1C1E', borderRadius: 14 }, buttonText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF' },
  note: { fontSize: 13, color: '#636366', lineHeight: 20, marginTop: 16 }, settings: { minHeight: 48, justifyContent: 'center' }, settingsText: { fontSize: 15, color: '#636366' },
});
