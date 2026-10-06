import { DecisionBreakdown } from '@/components/governance/decision-breakdown';
import { FrictionDoctor } from '@/components/governance/friction-doctor';
import { TactilePressable } from '@/components/governance/tactile-pressable';
import { DAILY_LESSONS } from '@/data/daily-lessons';
import type { ChoiceMap, LessonModule, Option, Question, QuizScreen } from '@/types/governance';
import { hapticNotify } from '@/utils/haptics';
import { useGlobalLessonStore } from '@/utils/lesson-store';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Timing for the inter-question transition (ms). */
const SELECT_HOLD_MS = 260;
const TRANSITION_OUT_MS = 140;
const TRANSITION_IN_MS = 240;
const TRANSITION_OFFSET = 28;

function baseShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function shuffleOptionsStrict(options: Option[]): Option[] {
  if (options.length <= 1) return [...options];
  const prevCorrectIndex = options.findIndex((o) => o.isCorrect);
  let shuffled = baseShuffle(options);
  let attempts = 0;

  while (shuffled.findIndex((o) => o.isCorrect) === prevCorrectIndex && attempts < 10) {
    shuffled = baseShuffle(options);
    attempts++;
  }

  if (shuffled.findIndex((o) => o.isCorrect) === prevCorrectIndex) {
    const shifted = [...shuffled];
    const first = shifted.shift()!;
    shifted.push(first);
    return shifted;
  }

  return shuffled;
}

function shuffleQuestionsStrict(
  questions: Question[],
  prevFirstQuestionId?: number
): Question[] {
  if (questions.length <= 1) return [...questions];
  let shuffled = baseShuffle(questions);
  let attempts = 0;

  while (shuffled[0].id === prevFirstQuestionId && attempts < 10) {
    shuffled = baseShuffle(questions);
    attempts++;
  }

  if (shuffled[0].id === prevFirstQuestionId) {
    const shifted = [...shuffled];
    const first = shifted.shift()!;
    shifted.push(first);
    shuffled = shifted;
  }

  return shuffled.map((q) => ({
    ...q,
    options: shuffleOptionsStrict(q.options),
  }));
}

const SPLASH_DISPLAY_MS = 2000;
const SPLASH_FADE_MS = 400;

function SplashModal({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!visible) return;

    opacity.setValue(1);

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: SPLASH_FADE_MS,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onDismiss();
      });
    }, SPLASH_DISPLAY_MS);

    return () => {
      clearTimeout(timer);
      opacity.stopAnimation();
    };
  }, [visible, onDismiss, opacity]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      presentationStyle="fullScreen"
      statusBarTranslucent
      transparent={false}
      onRequestClose={() => { }}
    >
      <Animated.View style={[splashStyles.backdrop, { opacity }]}>
        <View style={splashStyles.centeredContent}>
          <View style={splashStyles.squircle}>
            <View style={splashStyles.pillGroup}>
              <View style={splashStyles.pillSide} />
              <View style={splashStyles.pillCenter} />
              <View style={splashStyles.pillSide} />
            </View>
          </View>

          <Text style={splashStyles.kicker}>MAUA OPERATIONAL EXCELLENCE</Text>
          <Text style={splashStyles.displayTitle}>Maua Learn</Text>
          <Text style={splashStyles.subheadline}>
            Asynchronous governance for globally distributed teams
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
}

const splashStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        maxWidth: 440,
        width: '100%',
        alignSelf: 'center',
      },
    }),
  },
  centeredContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  squircle: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  pillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  pillCenter: {
    width: 8,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  pillSide: {
    width: 8,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  kicker: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#000000',
    opacity: 0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  displayTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: '#000000',
    opacity: 0.5,
    textAlign: 'center',
    maxWidth: 280,
  },
});

function MinimalLock() {
  return (
    <View style={lockStyles.container}>
      <View style={lockStyles.shackle} />
      <View style={lockStyles.body}>
        <View style={lockStyles.keyhole} />
      </View>
    </View>
  );
}

const lockStyles = StyleSheet.create({
  container: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shackle: {
    width: 10,
    height: 7,
    borderWidth: 1.5,
    borderColor: '#8E8E93',
    borderBottomWidth: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: -1,
  },
  body: {
    width: 13,
    height: 9,
    backgroundColor: '#8E8E93',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyhole: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#FFFFFF',
  },
});

function getScoreBadgeTheme(score: number, total: number) {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.8) {
    return {
      bg: '#E8F5E9',
      text: '#2E7D32',
      icon: '✓',
      badgeBg: '#E8F5E9',
      badgeColor: '#2E7D32',
      passed: true,
      kickerText: 'STAGE COMPLETED • PASSED',
      desc: 'Exemplary Mastery • Zero Operational Blindspots',
    };
  }
  if (ratio >= 0.5) {
    return {
      bg: '#FFF3E0',
      text: '#E65100',
      icon: '✓',
      badgeBg: '#FFF3E0',
      badgeColor: '#E65100',
      passed: true,
      kickerText: 'STAGE COMPLETED • PASSED',
      desc: 'Proficient Decision-Making • Competency Verified',
    };
  }
  return {
    bg: '#FFEBEE',
    text: '#C62828',
    icon: '!',
    badgeBg: '#FFEBEE',
    badgeColor: '#C62828',
    passed: false,
    kickerText: 'STAGE COMPLETED • NEEDS RETAKE',
    desc: 'Review Required • Reinforce Protocol Guardrails',
  };
}

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<QuizScreen>('today');
  const [activeLesson, setActiveLesson] = useState<LessonModule | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<ChoiceMap>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const { completedLessonIds, completedScores, markLessonComplete } =
    useGlobalLessonStore();

  /* ---------- Micro-interaction engine ---------- */
  const [questionOpacity] = useState(() => new Animated.Value(1));
  const [questionShift] = useState(() => new Animated.Value(0));
  const [progressAnim] = useState(() => new Animated.Value(0));
  const [completedAnim] = useState(() => new Animated.Value(0));
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const progressWidth = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }),
    [progressAnim]
  );

  const heroTranslate = useMemo(
    () =>
      completedAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
    [completedAnim]
  );

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const totalQuestions = activeLesson?.questions.length ?? 0;
  useEffect(() => {
    if (screen !== 'quiz' || totalQuestions === 0) return;
    Animated.timing(progressAnim, {
      toValue: (questionIndex + 1) / totalQuestions,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [questionIndex, screen, totalQuestions, progressAnim]);

  useEffect(() => {
    if (screen !== 'completed') return;
    completedAnim.setValue(0);
    Animated.timing(completedAnim, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [screen, completedAnim]);

  /** Fade + slide the current question out, swap content, then ease the next one in. */
  const transitionQuestion = (direction: 1 | -1, swap: () => void, onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 0,
        duration: TRANSITION_OUT_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(questionShift, {
        toValue: -TRANSITION_OFFSET * direction,
        duration: TRANSITION_OUT_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      swap();
      questionShift.setValue(TRANSITION_OFFSET * direction);
      Animated.parallel([
        Animated.timing(questionOpacity, {
          toValue: 1,
          duration: TRANSITION_IN_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(questionShift, {
          toValue: 0,
          speed: 18,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start(() => onDone?.());
    });
  };

  const startLesson = (lesson: LessonModule) => {
    const masterLesson = DAILY_LESSONS.find((l) => l.id === lesson.id) || lesson;
    const prevFirstQuestionId =
      activeLesson?.id === lesson.id ? activeLesson.questions[0]?.id : undefined;

    const randomizedQuestions = shuffleQuestionsStrict(
      masterLesson.questions,
      prevFirstQuestionId
    );

    setActiveLesson({
      ...masterLesson,
      questions: randomizedQuestions,
    });

    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    questionOpacity.setValue(1);
    questionShift.setValue(0);
    progressAnim.setValue(0);

    setQuestionIndex(0);
    setSelectedChoices({});
    setSelectedOption(null);
    setIsAdvancing(false);
    setScreen('quiz');
  };

  const handleSelectOption = (opt: Option) => {
    if (isAdvancing || !activeLesson) return;
    setSelectedOption(opt.text);
    setIsAdvancing(true);

    const currentQ = activeLesson.questions[questionIndex];
    const updatedChoices = {
      ...selectedChoices,
      [currentQ.id]: opt,
    };
    setSelectedChoices(updatedChoices);

    advanceTimer.current = setTimeout(() => {
      const isLastQuestion = questionIndex >= activeLesson.questions.length - 1;
      if (isLastQuestion) {
        const finalCalculatedScore = Object.values(updatedChoices).filter(
          (c) => c.isCorrect
        ).length;
        markLessonComplete(activeLesson.id, finalCalculatedScore);
        hapticNotify(
          finalCalculatedScore / activeLesson.questions.length >= 0.5 ? 'success' : 'warning'
        );
        setIsAdvancing(false);
        setScreen('completed');
        return;
      }

      const nextIndex = questionIndex + 1;
      transitionQuestion(
        1,
        () => {
          setQuestionIndex(nextIndex);
          const nextQ = activeLesson.questions[nextIndex];
          const nextPrevChoice = updatedChoices[nextQ.id];
          setSelectedOption(nextPrevChoice ? nextPrevChoice.text : null);
        },
        () => setIsAdvancing(false)
      );
    }, SELECT_HOLD_MS);
  };

  const handleQuizBack = () => {
    if (!activeLesson || isAdvancing) return;
    if (questionIndex > 0) {
      const prevIndex = questionIndex - 1;
      setIsAdvancing(true);
      transitionQuestion(
        -1,
        () => {
          setQuestionIndex(prevIndex);
          const prevQ = activeLesson.questions[prevIndex];
          const prevChoice = selectedChoices[prevQ.id];
          setSelectedOption(prevChoice ? prevChoice.text : null);
        },
        () => setIsAdvancing(false)
      );
    } else {
      setScreen('today');
    }
  };

  const handleBackToToday = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setSelectedOption(null);
    setIsAdvancing(false);
    setScreen('today');
  };

  const restartCurrentLesson = () => {
    if (activeLesson) {
      startLesson(activeLesson);
    }
  };

  if (screen === 'doctor') {
    return <FrictionDoctor onBack={() => setScreen('today')} />;
  }

  if (screen === 'quiz' && activeLesson) {
    const currentQ = activeLesson.questions[questionIndex];

    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {/* iOS Native Header Bar */}
        <View style={styles.quizHeaderBar}>
          <Pressable
            accessibilityRole="button"
            onPress={handleQuizBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.quizHeaderProgress}>
            {questionIndex + 1} of {activeLesson.questions.length}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleBackToToday}
            style={({ pressed }) => [styles.exitButton, pressed && styles.backButtonPressed]}
          >
            <Text style={styles.exitText}>Exit</Text>
          </Pressable>
        </View>

        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.quizContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: questionOpacity,
              transform: [{ translateX: questionShift }],
            }}
          >
            <View style={styles.quizCard}>
              <Text style={styles.quizKicker}>{activeLesson.badge}</Text>
              <Text style={styles.quizQuestionText}>{currentQ.question}</Text>
            </View>

            <View style={styles.optionsList}>
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt.text;
                const optionKey = String.fromCharCode(65 + i);

                return (
                  <TactilePressable
                    key={`${currentQ.id}-${opt.text}`}
                    disabled={isAdvancing}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected, disabled: isAdvancing }}
                    accessibilityLabel={`Option ${optionKey}: ${opt.text}`}
                    onPress={() => handleSelectOption(opt)}
                    haptic="light"
                    pressScale={0.975}
                    style={[styles.optionItem, isSelected && styles.optionSelected]}
                    pressedStyle={!isSelected ? styles.optionItemPressed : undefined}
                  >
                    <View style={[styles.optionKey, isSelected && styles.optionKeySelected]}>
                      <Text style={[styles.optionKeyText, isSelected && styles.optionKeyTextSelected]}>
                        {optionKey}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {opt.text}
                    </Text>
                  </TactilePressable>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'completed' && activeLesson) {
    const finalScore = Object.values(selectedChoices).filter((c) => c.isCorrect).length;
    const totalQ = activeLesson.questions.length;
    const nextStageNum = activeLesson.index + 1;
    const resultTheme = getScoreBadgeTheme(finalScore, totalQ);

    return (
      <SafeAreaView style={styles.completedSafe} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.completedScroll}
          contentContainerStyle={styles.completedContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.completedContent,
              { opacity: completedAnim, transform: [{ translateY: heroTranslate }] },
            ]}
          >
            <View style={[styles.completedIconBadge, { backgroundColor: resultTheme.bg }]}>
              <Text style={[styles.completedIconText, { color: resultTheme.text }]}>
                {resultTheme.icon}
              </Text>
            </View>

            <Text style={[styles.completedKicker, { color: resultTheme.text }]}>
              {resultTheme.kickerText}
            </Text>
            <Text style={styles.completedTitle}>{activeLesson.title}</Text>
            <Text style={styles.completedSubtitle}>
              Decision assessment recorded. Stage {activeLesson.index} is now verified.
              {resultTheme.passed
                ? nextStageNum <= DAILY_LESSONS.length
                  ? ` Stage ${nextStageNum} has been unlocked.`
                  : ' All sprint modules finished!'
                : ' Review protocol guardrails and retake stage to ensure competency.'}
            </Text>

            <View style={styles.scoreResultBox}>
              <Text style={styles.scoreResultLabel}>ASSESSMENT RESULT</Text>
              <Text style={[styles.scoreResultValue, { color: resultTheme.text }]}>
                {finalScore} / {totalQ} Correct
              </Text>
              <Text style={[styles.scoreResultDesc, { color: resultTheme.text }]}>
                {resultTheme.desc}
              </Text>
            </View>

            <DecisionBreakdown lesson={activeLesson} choices={selectedChoices} />
          </Animated.View>
        </ScrollView>

        <View style={styles.completedFooter}>
          <View style={styles.completedActionGroup}>
            <TactilePressable
              accessibilityRole="button"
              onPress={handleBackToToday}
              haptic="light"
              pressScale={0.98}
              style={styles.completedPrimaryButton}
            >
              <Text style={styles.completedPrimaryButtonText}>Back to Curriculum</Text>
            </TactilePressable>

            <TactilePressable
              accessibilityRole="button"
              onPress={restartCurrentLesson}
              pressScale={0.98}
              style={styles.completedSecondaryButton}
            >
              <Text style={styles.completedSecondaryButtonText}>Retake Sprint</Text>
            </TactilePressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const finishedCount = completedLessonIds.length;
  const totalCount = DAILY_LESSONS.length;
  const sprintPercentage = Math.round((finishedCount / totalCount) * 100);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <SplashModal visible={showSplash} onDismiss={() => setShowSplash(false)} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>WEDNESDAY, SEP 23</Text>
        <Text style={styles.title}>Daily Focus</Text>

        <View style={styles.targetCard}>
          <View style={styles.targetHeaderRow}>
            <View>
              <Text style={styles.targetKicker}>TODAY’S TARGET</Text>
              <Text style={styles.targetTitle}>
                {finishedCount} of {totalCount} Lessons Finished
              </Text>
            </View>
            <Text style={styles.targetPercentage}>{sprintPercentage}%</Text>
          </View>
          <View style={styles.targetBarTrack}>
            <View style={[styles.targetBarFill, { width: `${sprintPercentage}%` }]} />
          </View>
        </View>

        <Text style={styles.sectionHeading}>GOVERNANCE LAB</Text>
        <TactilePressable
          accessibilityRole="button"
          accessibilityLabel="Open Async Friction Doctor"
          onPress={() => setScreen('doctor')}
          haptic="light"
          pressScale={0.98}
          style={styles.labCard}
        >
          <View style={styles.labHeaderRow}>
            <Text style={styles.labKicker}>AI SIMULATION • INTERACTIVE</Text>
            <View style={styles.labLivePill}>
              <View style={styles.labLiveDot} />
              <Text style={styles.labLiveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.labTitle}>Async Friction Doctor</Text>
          <Text style={styles.labDescription}>
            Rewrite a high-friction cross-border message and get an instant governance audit
            across clarity, psychological safety and actionability.
          </Text>
          <View style={styles.labFooterRow}>
            <Text style={styles.labMeta}>3 incident scenarios · ~3 min</Text>
            <View style={styles.labButton}>
              <Text style={styles.labButtonText}>Open Lab</Text>
            </View>
          </View>
        </TactilePressable>

        <Text style={styles.sectionHeading}>TODAY’S CURRICULUM</Text>

        <View style={styles.lessonList}>
          {DAILY_LESSONS.map((module) => {
            const isCompleted = completedLessonIds.includes(module.id);
            // KUNCI BERURUTAN: Stage 1 selalu terbuka. Stage N terkunci sampai Stage N-1 selesai
            const isLocked =
              module.index > 1 &&
              !completedLessonIds.includes(`lesson-${module.index - 1}`);
            const score = completedScores[module.id];
            const badgeTheme =
              isCompleted && score !== undefined
                ? getScoreBadgeTheme(score, module.questions.length)
                : null;

            return (
              <View key={module.id} style={styles.lessonCard}>
                <View style={styles.lessonHeaderRow}>
                  <Text style={styles.lessonBadge}>{module.badge}</Text>
                  <View style={styles.headerRightGroup}>
                    {isCompleted && score !== undefined && badgeTheme && (
                      <View style={[styles.scorePill, { backgroundColor: badgeTheme.bg }]}>
                        <Text style={[styles.scorePillText, { color: badgeTheme.text }]}>
                          {score}/{module.questions.length} Correct
                        </Text>
                      </View>
                    )}
                    {isCompleted && badgeTheme ? (
                      <View style={[styles.checkmarkCircle, { backgroundColor: badgeTheme.badgeBg }]}>
                        <Text style={[styles.checkmarkIcon, { color: badgeTheme.badgeColor }]}>
                          {badgeTheme.icon}
                        </Text>
                      </View>
                    ) : isCompleted ? (
                      <View style={styles.checkmarkCircle}>
                        <Text style={styles.checkmarkIcon}>✓</Text>
                      </View>
                    ) : isLocked ? (
                      <MinimalLock />
                    ) : null}
                  </View>
                </View>

                <Text style={styles.lessonTitle}>{module.title}</Text>
                <Text style={styles.lessonDescription}>{module.description}</Text>

                <View style={styles.lessonFooterRow}>
                  <Text style={styles.lessonDuration}>
                    {module.duration} Micro-learning
                  </Text>

                  {isCompleted ? (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>Completed ✓</Text>
                    </View>
                  ) : isLocked ? (
                    <View style={styles.lockedBadgeButton}>
                      <Text style={styles.lockedBadgeText}>Locked</Text>
                    </View>
                  ) : (
                    <Pressable
                      style={({ pressed }) => [
                        styles.startLessonButton,
                        pressed && styles.buttonPressed,
                      ]}
                      onPress={() => startLesson(module)}
                    >
                      <Text style={styles.startLessonButtonText}>Start Lesson</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    ...Platform.select({
      web: {
        maxWidth: 440,
        width: '100%',
        alignSelf: 'center',
      },
    }),
  },
  kicker: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',       // Ganti dari '700'
    letterSpacing: 0.5,      // Ganti dari 0.8
    color: '#8E8E93',
  },
  title: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 34,
    fontWeight: '700',       // Ganti dari '800'
    letterSpacing: -0.5,     // Selaraskan dengan Profile
    color: '#000000',
  },
  targetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  targetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  targetKicker: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  targetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  targetPercentage: {
    fontSize: 22,
    fontWeight: '700',       // Ganti dari '800'
    color: '#000000',
    letterSpacing: -0.3,
  },
  targetBarTrack: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  targetBarFill: {
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '600',       // Ganti dari '700'
    letterSpacing: 0.5,      // Ganti dari 0.6
    color: '#8E8E93',
    marginBottom: 12,
    marginLeft: 14,          // Samakan margin indent Profile (14-16pt)
  },
  lessonList: {
    gap: 14,
  },
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  lessonHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lessonBadge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#8E8E93',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scorePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scorePillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  checkmarkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    fontSize: 13,
    color: '#34C759',
    fontWeight: '800',
  },
  lockIconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconText: {
    fontSize: 13,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  lessonDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#636366',
    marginBottom: 16,
  },
  lessonFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonDuration: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },

  /* Apple Action Buttons (Pill / Capsule Spec) */
  startLessonButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startLessonButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  completedBadgeButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadgeText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '600',
  },
  lockedBadgeButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedBadgeText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  /* Quiz Screen Styles */
  quizHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 10,
  },
  backButtonPressed: {
    opacity: 0.5,
  },
  backChevron: {
    fontSize: 26,
    lineHeight: 26,
    color: '#000000', // Ganti dari #007AFF
    marginRight: 4,
    fontWeight: '400',
  },
  backText: {
    fontSize: 17,
    color: '#000000', // Ganti dari #007AFF
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  quizHeaderProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  exitButton: {
    paddingVertical: 4,
    paddingLeft: 10,
  },
  exitText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  quizContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    ...Platform.select({
      web: {
        maxWidth: 440,
        width: '100%',
        alignSelf: 'center',
      },
    }),
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 14,
      },
      web: {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.06)',
      },
    }),
  },
  quizKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#8E8E93',
    marginBottom: 8,
  },
  quizQuestionText: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
  optionItemPressed: {
    backgroundColor: '#F2F2F7',
    borderColor: '#C7C7CC',
  },
  optionSelected: {
    backgroundColor: '#000000', // Ganti dari #E8F5E9
    borderColor: '#000000',     // Ganti dari #34C759
  },
  optionKey: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionKeySelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionKeyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
  },
  optionKeyTextSelected: {
    color: '#000000',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#000000',
  },
  optionTextSelected: {
    color: '#FFFFFF',           // Ganti dari #1B5E20
    fontWeight: '600',
  },

  /* Governance Lab Card */
  labCard: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
      },
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
      },
    }),
  },
  labHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.55)',
  },
  labLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  labLiveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  labLiveText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#FFFFFF',
  },
  labTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  labDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  labFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labMeta: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  labButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    minHeight: 40,
    justifyContent: 'center',
  },
  labButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },

  /* Completed Screen Styles */
  completedSafe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  completedScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  completedContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: {
        maxWidth: 440,
        width: '100%',
        alignSelf: 'center',
      },
    }),
  },
  completedFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    ...Platform.select({
      web: {
        maxWidth: 440,
        width: '100%',
        alignSelf: 'center',
      },
    }),
  },
  completedContent: {
    alignItems: 'center',
    marginTop: 24,
  },
  completedIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#E8F5E9',
  },
  completedIconText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#34C759',
  },
  completedKicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#34C759',
    marginBottom: 6,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '700',       // Ganti dari '800'
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  completedSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#636366',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  scoreResultBox: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  scoreResultLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#8E8E93',
    marginBottom: 6,
  },
  scoreResultValue: {
    fontSize: 32,
    fontWeight: '700',       // Ganti dari '800'
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  scoreResultDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34C759',
    textAlign: 'center',
  },
  completedActionGroup: {
    gap: 12,
    marginBottom: 12,
  },
  completedPrimaryButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  completedPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  completedSecondaryButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  completedSecondaryButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
});
