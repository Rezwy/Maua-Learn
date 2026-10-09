import { findScenario } from '@/data/practice-scenarios';
import type { Lesson, LessonSession } from '@/types/lesson';
import { hapticNotify } from '@/utils/haptics';
import { canContinueLesson, moveLessonSession, resolveLessonStep } from '@/utils/lesson-session';
import { analyzeRewrite } from '@/utils/practice-analyzer';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LessonStepContent } from './lesson-screen';
import { TactilePressable } from './tactile-pressable';

type Props = {
  lesson: Lesson;
  initialSession: LessonSession;
  onProgress: (session: LessonSession) => void;
  onExit: (session: LessonSession) => void;
  onComplete: (session: LessonSession, score: number) => void;
};

export function LessonScreen({ lesson, initialSession, onProgress, onExit, onComplete }: Props) {
  const [session, setSession] = useState(initialSession);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const finishing = useRef(false);
  const revealFeedback = useRef(false);
  const step = resolveLessonStep(lesson, session.stepIndex, session.answers);
  const answer = step.kind === 'decision' ? session.answers[step.id] : undefined;
  const selectedOption = step.kind === 'decision'
    ? step.options.find((option) => option.id === (answer?.optionId ?? selectedId)) ?? null : null;
  const committed = Boolean(answer);
  const practiceStep = lesson.steps.find((item) => item.kind === 'practice');
  const feedback = session.checkedDraft && session.checkedDraft === session.draft && practiceStep?.kind === 'practice'
    ? analyzeRewrite(session.checkedDraft, findScenario(practiceStep.scenarioId).message) : null;
  const isLast = session.stepIndex === lesson.steps.length - 1;
  const canContinue = canContinueLesson(step, session);
  const canCommit = step.kind === 'decision' && !committed && Boolean(selectedOption);
  const enabled = canContinue || canCommit;

  useEffect(() => {
    if (!finishing.current) onProgress(session);
  }, [session, onProgress]);

  const goToStep = (index: number) => {
    Keyboard.dismiss();
    setSelectedId(null);
    setSession(moveLessonSession(lesson, session, index));
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    const next = resolveLessonStep(lesson, index, session.answers);
    AccessibilityInfo.announceForAccessibility(`Step ${index + 1} of ${lesson.steps.length}. ${next.kind === 'decision' ? next.contextLabel : 'heading' in next ? next.heading : 'Learning objectives'}`);
  };

  const handlePrimary = () => {
    if (!enabled || finishing.current) return;
    if (step.kind === 'decision' && !committed && selectedOption) {
      revealFeedback.current = true;
      setSession({ ...session, answers: { ...session.answers, [step.id]: {
        stepId: step.id, optionId: selectedOption.id, isRecommended: selectedOption.isRecommended,
      } } });
      hapticNotify(selectedOption.isRecommended ? 'success' : 'warning');
      AccessibilityInfo.announceForAccessibility(selectedOption.effect);
      return;
    }
    if (isLast) {
      finishing.current = true;
      const score = Object.values(session.answers).filter((item) => item.isRecommended).length;
      onComplete(session, score);
    } else goToStep(session.stepIndex + 1);
  };

  const checkDraft = (scenarioId: string) => {
    Keyboard.dismiss();
    const result = analyzeRewrite(session.draft ?? '', findScenario(scenarioId).message);
    revealFeedback.current = true;
    setSession({ ...session, firstDraft: session.firstDraft || session.draft, checkedDraft: session.draft });
    AccessibilityInfo.announceForAccessibility(result.verdictText);
  };

  const primaryLabel = canCommit ? 'See what happens'
    : step.kind === 'decision' && !committed ? 'Choose an action'
    : step.kind === 'practice' && !canContinue ? 'Check your draft to continue'
    : isLast ? 'Complete lesson'
    : step.id === 'decision-1' ? 'See the next morning'
    : step.kind === 'practice' ? 'Review what you learned' : 'Continue';

  return (
    <SafeAreaView style={styles.safe} accessibilityLanguage="en">
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Previous step" accessibilityHint="Review your saved work. Committed choices remain unchanged."
          disabled={session.stepIndex === 0} accessibilityState={{ disabled: session.stepIndex === 0 }}
          onPress={() => goToStep(session.stepIndex - 1)} style={({ pressed }) => [styles.headerButton, (pressed || session.stepIndex === 0) && styles.dim]}>
          <Text style={styles.headerText}>‹ Back</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Save and exit lesson" onPress={() => { Keyboard.dismiss(); onExit(session); }} style={({ pressed }) => [styles.headerButton, pressed && styles.dim]}>
          <Text style={styles.headerText}>Save & exit</Text>
        </Pressable>
      </View>
      <View style={styles.progressArea}>
        <Text style={styles.progressText}>Step {session.stepIndex + 1} of {lesson.steps.length}</Text>
        <View accessibilityRole="progressbar" accessibilityLabel="Lesson progress" accessibilityValue={{ min: 0, max: lesson.steps.length, now: session.stepIndex + 1 }} style={styles.track}>
          <View style={[styles.fill, { width: `${((session.stepIndex + 1) / lesson.steps.length) * 100}%` }]} />
        </View>
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView ref={scrollRef} style={styles.flex} contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <LessonStepContent step={step} selectedOption={selectedOption} committed={committed}
            onSelectOption={(option) => setSelectedId(option.id)}
            draft={session.draft ?? ''} onDraftChange={(draft) => setSession({ ...session, draft, checkedDraft: undefined })}
            firstDraft={session.firstDraft ?? ''} feedback={feedback} onAnalyze={checkDraft}
            onRevise={() => setSession({ ...session, checkedDraft: undefined })}
            referenceVisible={session.referenceVisible ?? false}
            onToggleReference={() => setSession({ ...session, referenceVisible: !session.referenceVisible })}
            onFeedbackLayout={(y) => { if (revealFeedback.current) { revealFeedback.current = false; scrollRef.current?.scrollTo({ y: y + 16, animated: false }); } }}
            answers={session.answers}
            decisionSteps={lesson.steps.map((_, index) => resolveLessonStep(lesson, index, session.answers)).filter((item) => item.kind === 'decision')} />
        </ScrollView>
        <View style={styles.footer}>
          {committed && <Text style={styles.reviewNote}>Choice saved. You can review earlier steps or explore another path after completing.</Text>}
          <TactilePressable accessibilityRole="button" accessibilityState={{ disabled: !enabled }} disabled={!enabled}
            onPress={handlePrimary} style={[styles.primary, !enabled && styles.disabled]}>
            <Text style={[styles.primaryText, !enabled && styles.disabledText]}>{primaryLabel}</Text>
          </TactilePressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' }, flex: { flex: 1 }, dim: { opacity: 0.4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  headerButton: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 4 },
  headerText: { fontSize: 17, fontWeight: '500', color: '#1C1C1E' },
  progressArea: { padding: 16, paddingTop: 8, gap: 8, backgroundColor: '#FFFFFF' },
  progressText: { fontSize: 13, color: '#636366' }, track: { height: 3, backgroundColor: '#E5E5EA', borderRadius: 2 },
  fill: { height: 3, borderRadius: 2, backgroundColor: '#1C1C1E' },
  content: { padding: 16, paddingBottom: 28, width: '100%', maxWidth: 500, alignSelf: 'center' },
  footer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#D1D1D6' },
  reviewNote: { fontSize: 12, color: '#636366', lineHeight: 17, marginBottom: 8 },
  primary: { minHeight: 52, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 14, backgroundColor: '#1C1C1E', alignItems: 'center' },
  primaryText: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  disabled: { backgroundColor: '#E5E5EA' }, disabledText: { color: '#636366' },
});
