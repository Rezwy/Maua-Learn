import { useGlobalLessonStore } from '@/utils/lesson-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface LessonModule {
  id: string;
  index: number;
  badge: string;
  title: string;
  description: string;
  duration: string;
  questions: Question[];
}

const DAILY_LESSONS: LessonModule[] = [
  {
    id: 'lesson-1',
    index: 1,
    badge: 'STAGE 1 • FOUNDATION',
    title: 'Asynchronous Trust & Communication',
    description: 'Learn how high-performing global teams replace meetings with clear documentation.',
    duration: '4 min',
    questions: [
      {
        id: 1,
        question: 'What is the primary foundation of asynchronous collaboration in distributed teams?',
        options: [
          { text: 'Comprehensive written context and explicit expectations', isCorrect: true },
          { text: 'Constant availability on instant messaging platforms', isCorrect: false },
          { text: 'Mandatory daily sync video calls for every decision', isCorrect: false },
        ],
      },
      {
        id: 2,
        question: 'When communicating across multiple time zones, high-trust leads avoid:',
        options: [
          { text: 'Urgent requests without contextual documentation', isCorrect: true },
          { text: 'Posting status updates in public project repositories', isCorrect: false },
          { text: 'Allowing 24 hours of response buffer for non-critical tasks', isCorrect: false },
        ],
      },
      {
        id: 3,
        question: 'What constitutes an effective asynchronous handoff?',
        options: [
          { text: 'A concise memo outlining current progress, blockers, and next steps', isCorrect: true },
          { text: 'A brief ping stating "check the latest draft" without links', isCorrect: false },
          { text: 'Delaying work until a direct live call can be scheduled', isCorrect: false },
        ],
      },
      {
        id: 4,
        question: 'How should distributed leaders evaluate remote contributor performance?',
        options: [
          { text: 'Concrete deliverable impact and autonomous milestone execution', isCorrect: true },
          { text: 'Total active hours recorded on screen-tracking software', isCorrect: false },
          { text: 'Speed of answering direct Slack notifications', isCorrect: false },
        ],
      },
      {
        id: 5,
        question: 'When is a synchronous meeting strictly necessary in an async-first culture?',
        options: [
          { text: 'Complex interpersonal conflict or ambiguous sensitive negotiations', isCorrect: true },
          { text: 'Routine weekly team status round-robins', isCorrect: false },
          { text: 'Reviewing line-by-line pull requests before merge', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'lesson-2',
    index: 2,
    badge: 'STAGE 2 • NUANCE',
    title: 'Cross-Cultural Feedback Loops',
    description: 'Deliver constructive criticism without triggering defensive reactions across borders.',
    duration: '4 min',
    questions: [
      {
        id: 1,
        question: 'When giving feedback to team members from high-context communication cultures:',
        options: [
          { text: 'Frame critiques constructively with diplomatic nuance and context', isCorrect: true },
          { text: 'Deliver blunt, unbuffered criticism in public channels', isCorrect: false },
          { text: 'Avoid addressing underperformance altogether', isCorrect: false },
        ],
      },
      {
        id: 2,
        question: 'How do elite cross-cultural leads handle written misunderstandings?',
        options: [
          { text: 'Assume positive intent and clarify via an informal short video or audio note', isCorrect: true },
          { text: 'Escalate the dispute directly to executive leadership immediately', isCorrect: false },
          { text: 'Reply with rigid legalistic corporate policy citations', isCorrect: false },
        ],
      },
      {
        id: 3,
        question: 'What is psychological safety in a multi-regional team environment?',
        options: [
          { text: 'The shared belief that taking risks and flagging mistakes will not be punished', isCorrect: true },
          { text: 'Eliminating all forms of critical debate during sprint retrospectives', isCorrect: false },
          { text: 'Ensuring junior engineers never question lead architecture decisions', isCorrect: false },
        ],
      },
      {
        id: 4,
        question: 'How should recognition be handled across varied international teams?',
        options: [
          { text: 'Calibrate between public recognition and private praise based on cultural preference', isCorrect: true },
          { text: 'Mandate public callouts regardless of individual comfort levels', isCorrect: false },
          { text: 'Only reward senior leads to prevent internal competition', isCorrect: false },
        ],
      },
      {
        id: 5,
        question: 'In written feedback loops, what reinforces alignment fastest?',
        options: [
          { text: 'Highlighting concrete behavior patterns accompanied by actionable solutions', isCorrect: true },
          { text: 'Vague statements like "please improve overall code quality"', isCorrect: false },
          { text: 'Comparing the individual against other team members publicly', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'lesson-3',
    index: 3,
    badge: 'STAGE 3 • EXECUTION',
    title: 'High-Stakes Governance',
    description: 'Protect compliance and ethical standards when delivery speed is challenged.',
    duration: '5 min',
    questions: [
      {
        id: 1,
        question: 'What is the correct protocol when delivery deadlines conflict with security audits?',
        options: [
          { text: 'Halt production rollout until core compliance guardrails are satisfied', isCorrect: true },
          { text: 'Bypass security checks quietly to meet marketing launch dates', isCorrect: false },
          { text: 'Sign off on unverified code and patch vulnerabilities post-launch', isCorrect: false },
        ],
      },
      {
        id: 2,
        question: 'In decentralized governance, who holds ultimate accountability for key integrity?',
        options: [
          { text: 'The vault steward and verified multisig key holders', isCorrect: true },
          { text: 'External third-party auditing contractors', isCorrect: false },
          { text: 'Community forum participants without signed roles', isCorrect: false },
        ],
      },
      {
        id: 3,
        question: 'What defines a robust emergency circuit breaker in protocol governance?',
        options: [
          { text: 'Deterministic programmatic pauses triggered by abnormal state deviations', isCorrect: true },
          { text: 'Manual voting rounds that require 48 hours to assemble quorum', isCorrect: false },
          { text: 'Relying entirely on centralized cloud host shutdowns', isCorrect: false },
        ],
      },
      {
        id: 4,
        question: 'When discovering an internal operational exploit, a team member must first:',
        options: [
          { text: 'Submit an encrypted incident report through the designated security channel', isCorrect: true },
          { text: 'Publish details on public social media to pressure immediate fixes', isCorrect: false },
          { text: 'Attempt to exploit the vulnerability personally to confirm severity', isCorrect: false },
        ],
      },
      {
        id: 5,
        question: 'Sustainable global workforce governance prioritizes:',
        options: [
          { text: 'Verifiable audit trails and transparent decision records', isCorrect: true },
          { text: 'Ad-hoc verbal agreements kept between core founders', isCorrect: false },
          { text: 'Unrecorded off-chain handshakes without specification docs', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'lesson-4',
    index: 4,
    badge: 'STAGE 4 • LEADERSHIP',
    title: 'Strategic Decentralization',
    description: 'Empower cross-border squads to make high-velocity decisions without bottlenecks.',
    duration: '4 min',
    questions: [
      {
        id: 1,
        question: 'What defines true operational autonomy in remote teams?',
        options: [
          { text: 'Clear decision boundaries and strategic guardrails', isCorrect: true },
          { text: 'Letting teams work without shared objectives or review', isCorrect: false },
          { text: 'Requiring executive sign-off for minor technical changes', isCorrect: false },
        ],
      },
      {
        id: 2,
        question: 'When should a remote lead intervene in a squad’s autonomous decision?',
        options: [
          { text: 'Only when it breaches core compliance or strategic OKRs', isCorrect: true },
          { text: 'Whenever the lead would have chosen a different personal style', isCorrect: false },
          { text: 'Never, even if systemic security risks are flagged', isCorrect: false },
        ],
      },
      {
        id: 3,
        question: 'How do you prevent knowledge silos when squads operate independently?',
        options: [
          { text: 'Mandate open-by-default documentation and weekly async briefs', isCorrect: true },
          { text: 'Force all engineers to attend other squads’ daily standups', isCorrect: false },
          { text: 'Centralize all cross-team communication into private direct messages', isCorrect: false },
        ],
      },
      {
        id: 4,
        question: 'What is the most effective way to delegate critical project ownership?',
        options: [
          { text: 'Define the desired outcome and give the owner architectural freedom', isCorrect: true },
          { text: 'Micromanage execution through hourly checklists', isCorrect: false },
          { text: 'Delegate the workload while withholding decision authority', isCorrect: false },
        ],
      },
      {
        id: 5,
        question: 'In a decentralized setup, how should team alignment be measured?',
        options: [
          { text: 'By output quality, impact, and milestone delivery', isCorrect: true },
          { text: 'By total hours logged on the corporate network', isCorrect: false },
          { text: 'By how rapidly engineers reply to instant messages', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'lesson-5',
    index: 5,
    badge: 'STAGE 5 • RESILIENCE',
    title: 'Crisis & Incident Continuity',
    description: 'Handle operational outages across multiple time zones without panic or chaos.',
    duration: '5 min',
    questions: [
      {
        id: 1,
        question: 'During a cross-border production incident, what is the lead’s first async move?',
        options: [
          { text: 'Establish a single incident document with a live timeline feed', isCorrect: true },
          { text: 'Send broadcast panic messages across all general channels', isCorrect: false },
          { text: 'Wait until the primary engineer wakes up in their local time zone', isCorrect: false },
        ],
      },
      {
        id: 2,
        question: 'How should handovers between regional shifts be conducted during a crisis?',
        options: [
          { text: 'Structured written logs detailing current state and next hypotheses', isCorrect: true },
          { text: 'Informal verbal chats without recorded action items', isCorrect: false },
          { text: 'Halting triage completely until the original shift returns', isCorrect: false },
        ],
      },
      {
        id: 3,
        question: 'What prevents on-call alert fatigue in a 24/7 global team?',
        options: [
          { text: 'Tuning alerts so only actionable, severe incidents trigger pages', isCorrect: true },
          { text: 'Paging on-call members for routine informational warnings', isCorrect: false },
          { text: 'Disabling all automated alerting systems entirely', isCorrect: false },
        ],
      },
      {
        id: 4,
        question: 'After resolving a high-severity operational outage, the post-mortem should prioritize:',
        options: [
          { text: 'Blameless root-cause analysis and automated hardening', isCorrect: true },
          { text: 'Assigning public blame to the author of the pull request', isCorrect: false },
          { text: 'Deleting logs to protect internal stakeholder optics', isCorrect: false },
        ],
      },
      {
        id: 5,
        question: 'How do you foster psychological safety after an honest operational mistake?',
        options: [
          { text: 'Commend proactive disclosure and invest in defensive safeguards', isCorrect: true },
          { text: 'Revoke deployment permissions for the contributor indefinitely', isCorrect: false },
          { text: 'Issue formal written reprimands during team-wide meetings', isCorrect: false },
        ],
      },
    ],
  },
];

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
  const opacity = useRef(new Animated.Value(1)).current;

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
  const [screen, setScreen] = useState<'today' | 'quiz' | 'completed'>('today');
  const [activeLesson, setActiveLesson] = useState<LessonModule | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<
    Record<number, { text: string; isCorrect: boolean }>
  >({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);

  const { completedLessonIds, completedScores, markLessonComplete } =
    useGlobalLessonStore();

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

    setTimeout(() => {
      const isLastQuestion = questionIndex >= activeLesson.questions.length - 1;
      if (isLastQuestion) {
        const finalCalculatedScore = Object.values(updatedChoices).filter(
          (c) => c.isCorrect
        ).length;
        markLessonComplete(activeLesson.id, finalCalculatedScore);
        setScreen('completed');
      } else {
        const nextIndex = questionIndex + 1;
        setQuestionIndex(nextIndex);
        const nextQ = activeLesson.questions[nextIndex];
        const nextPrevChoice = updatedChoices[nextQ.id];
        setSelectedOption(nextPrevChoice ? nextPrevChoice.text : null);
      }
      setIsAdvancing(false);
    }, 400);
  };

  const handleQuizBack = () => {
    if (!activeLesson) return;
    if (questionIndex > 0) {
      const prevIndex = questionIndex - 1;
      setQuestionIndex(prevIndex);
      const prevQ = activeLesson.questions[prevIndex];
      const prevChoice = selectedChoices[prevQ.id];
      setSelectedOption(prevChoice ? prevChoice.text : null);
    } else {
      setScreen('today');
    }
  };

  const handleBackToToday = () => {
    setSelectedOption(null);
    setIsAdvancing(false);
    setScreen('today');
  };

  const restartCurrentLesson = () => {
    if (activeLesson) {
      startLesson(activeLesson);
    }
  };

  if (screen === 'quiz' && activeLesson) {
    const currentQ = activeLesson.questions[questionIndex];
    const progressPercent = Math.round(
      ((questionIndex + 1) / activeLesson.questions.length) * 100
    );

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
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.quizContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.quizCard}>
            <Text style={styles.quizKicker}>{activeLesson.badge}</Text>
            <Text style={styles.quizQuestionText}>{currentQ.question}</Text>
          </View>

          <View style={styles.optionsList}>
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt.text;

              return (
                <Pressable
                  key={i}
                  disabled={isAdvancing}
                  accessibilityRole="button"
                  onPress={() => handleSelectOption(opt)}
                  style={({ pressed }) => [
                    styles.optionItem,
                    isSelected && styles.optionSelected,
                    pressed && !isSelected && styles.optionItemPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {opt.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
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
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.completedContainer}>
          <View style={styles.completedContent}>
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
          </View>

          <View style={styles.completedActionGroup}>
            <Pressable
              accessibilityRole="button"
              onPress={handleBackToToday}
              style={styles.completedPrimaryButton}
            >
              <Text style={styles.completedPrimaryButtonText}>Back to Curriculum</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={restartCurrentLesson}
              style={styles.completedSecondaryButton}
            >
              <Text style={styles.completedSecondaryButtonText}>Retake Sprint</Text>
            </Pressable>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
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
    transform: [{ scale: 1.015 }],
  },
  optionText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#000000',
  },
  optionTextSelected: {
    color: '#FFFFFF',           // Ganti dari #1B5E20
    fontWeight: '600',
  },

  /* Completed Screen Styles */
  completedContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
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
    marginTop: 40,
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