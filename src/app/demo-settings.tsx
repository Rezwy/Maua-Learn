import { TactilePressable } from '@/components/governance/tactile-pressable';
import { resetAllProgress } from '@/utils/lesson-store';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DemoSettings() {
  const reset = () => {
    const execute = () => { resetAllProgress(); router.replace('/'); };
    const message = 'Remove all saved answers, handoffs and completions on this device?';
    if (Platform.OS === 'web') { if (window.confirm(message)) execute(); }
    else Alert.alert('Reset demo progress?', message, [{ text: 'Cancel', style: 'cancel' }, { text: 'Reset', style: 'destructive', onPress: execute }]);
  };
  return <SafeAreaView style={s.safe}><ScrollView contentContainerStyle={s.content}>
    <TactilePressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={s.button}><Text style={s.link}>‹ Back</Text></TactilePressable>
    <Text accessibilityRole="header" style={s.title}>Demo settings</Text>
    <Text style={s.body}>One guided lesson and four shorter decision drills. The fictional scenarios are examples, not organizational policies.</Text>
    <Text style={s.body}>The writing checker runs locally and detects English wording patterns. It cannot validate facts, meaning or suitability. No account or cloud sync is included.</Text>
    <Text style={s.body}>Use reset before a fresh reviewer walkthrough. This removes your saved work.</Text>
    <TactilePressable accessibilityRole="button" onPress={reset} style={s.reset}><Text style={s.resetText}>Reset demo progress</Text></TactilePressable>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' }, content: { padding: 24, gap: 20, maxWidth: 500, width: '100%', alignSelf: 'center' },
  button: { minHeight: 44, justifyContent: 'center' }, link: { fontSize: 17, color: '#1C1C1E' },
  title: { fontSize: 30, fontWeight: '700', color: '#1C1C1E' }, body: { fontSize: 17, lineHeight: 25, color: '#48484A' },
  reset: { minHeight: 52, padding: 16, backgroundColor: '#FFFFFF', borderRadius: 14, alignItems: 'center' }, resetText: { color: '#B42318', fontSize: 17, fontWeight: '600' },
});
