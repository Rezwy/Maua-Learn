/** Content renderers. Navigation and persisted state live in lesson-player.tsx. */

import { findScenario } from '@/data/practice-scenarios';
import type {
  ConceptStep,
  DecisionOption,
  DecisionStep,
  IntroStep,
  LessonStep,
  ObjectivesStep,
  PracticeStep,
  ReflectionStep,
  ScenarioStep,
  TakeawayStep,
} from '@/types/lesson';
import type { SavedAnswer } from '@/utils/lesson-store';
import type { PracticeFeedback } from '@/types/practice';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TactilePressable } from './tactile-pressable';

type StepRendererProps = {
  step: LessonStep;
  selectedOption: DecisionOption | null;
  committed: boolean;
  onSelectOption: (opt: DecisionOption, step: DecisionStep) => void;
  draft: string;
  onDraftChange: (text: string) => void;
  feedback: PracticeFeedback | null;
  firstDraft: string;
  onAnalyze: (scenarioId: string) => void;
  onRevise: () => void;
  referenceVisible: boolean;
  onToggleReference: () => void;
  onFeedbackLayout: (y: number) => void;
  answers: Record<string, SavedAnswer>;
  decisionSteps: DecisionStep[];
};

export function LessonStepContent(props: StepRendererProps) {
  const { step } = props;
  switch (step.kind) {
    case 'intro':
      return <IntroCard step={step} />;
    case 'objectives':
      return <ObjectivesCard step={step} />;
    case 'concept':
      return <ConceptCard step={step} />;
    case 'scenario':
      return <ScenarioCard step={step} />;
    case 'decision':
      return (
        <DecisionCard
          step={step}
          selectedOption={props.selectedOption}
          committed={props.committed}
          onSelect={props.onSelectOption}
          onFeedbackLayout={props.onFeedbackLayout}
        />
      );
    case 'takeaway':
      return <TakeawayCard step={step} />;
    case 'practice':
      return (
        <PracticeCard
          step={step}
          draft={props.draft}
          onDraftChange={props.onDraftChange}
          feedback={props.feedback}
          firstDraft={props.firstDraft}
          onAnalyze={props.onAnalyze}
          onRevise={props.onRevise}
          referenceVisible={props.referenceVisible}
          onToggleReference={props.onToggleReference}
          onFeedbackLayout={props.onFeedbackLayout}
        />
      );
    case 'reflection':
      return (
        <ReflectionCard
          step={step}
          answers={props.answers}
          decisionSteps={props.decisionSteps}
        />
      );
    default:
      return null;
  }
}

/* --- Intro --- */
function IntroCard({ step }: { step: IntroStep }) {
  return (
    <View style={s.card}>
      <Text style={s.stepBadge}>INTRODUCTION</Text>
      <Text accessibilityRole="header" style={s.cardHeading}>{step.heading}</Text>
      <Text style={s.cardBody}>{step.body}</Text>
    </View>
  );
}

/* --- Objectives --- */
function ObjectivesCard({ step }: { step: ObjectivesStep }) {
  return (
    <View style={s.card}>
      <Text style={s.stepBadge}>LEARNING OBJECTIVES</Text>
      <Text accessibilityRole="header" style={s.cardHeading}>After this lesson you will be able to:</Text>
      <View style={s.objectivesList}>
        {step.items.map((item, i) => (
          <View key={i} style={s.objectiveRow}>
            <View style={s.objectiveBullet}>
              <Text style={s.objectiveBulletText}>{i + 1}</Text>
            </View>
            <Text style={s.objectiveText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* --- Concept --- */
function ConceptCard({ step }: { step: ConceptStep }) {
  return (
    <View style={s.card}>
      <Text style={s.stepBadge}>CONCEPT</Text>
      <Text accessibilityRole="header" style={s.cardHeading}>{step.heading}</Text>
      <Text style={s.cardBody}>{step.body}</Text>
      <View style={s.pointsList}>
        {step.points.map((p, i) => (
          <View key={i} style={s.pointItem}>
            <Text style={s.pointLabel}>{p.label}</Text>
            <Text style={s.pointText}>{p.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* --- Scenario --- */
function ScenarioCard({ step }: { step: ScenarioStep }) {
  const msg = step.message;
  const initials = msg.sender
    .split(' ')
    .map((w) => w[0])
    .join('');

  return (
    <View style={s.stack}>
      <View style={s.card}>
        <Text style={s.stepBadge}>SCENARIO</Text>
        <Text accessibilityRole="header" style={s.cardHeading}>{step.heading}</Text>
        <Text style={s.cardBody}>{step.body}</Text>

        {/* Message bubble */}
        <View style={s.messageBubbleContainer}>
          <View style={s.senderRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View style={s.flex}>
              <Text style={s.senderName}>
                {msg.sender}{' '}
                <Text style={s.senderTime}>{msg.time}</Text>
              </Text>
              <Text style={s.senderMeta}>
                {msg.senderRole} · {msg.senderRegion}
              </Text>
            </View>
          </View>
          <View style={s.bubble}>
            <Text style={s.bubbleText}>{msg.text}</Text>
          </View>
          <Text style={s.channelLabel}>{msg.channel}</Text>
        </View>
      </View>

      {/* Facts */}
      <View style={[s.card, s.factsCard]}>
        <Text style={s.stepBadge}>WHAT YOU KNOW</Text>
        {step.facts.map((fact, i) => (
          <View key={i} style={s.factRow}>
            <View style={s.factDot} />
            <Text style={s.factText}>{fact}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/* --- Decision --- */
function DecisionCard({
  step,
  selectedOption,
  committed,
  onSelect,
  onFeedbackLayout,
}: {
  step: DecisionStep;
  selectedOption: DecisionOption | null;
  committed: boolean;
  onSelect: (opt: DecisionOption, step: DecisionStep) => void;
  onFeedbackLayout: (y: number) => void;
}) {
  return (
    <View style={s.stack}>
      <View style={s.card}>
        <Text style={s.stepBadge}>{step.contextLabel}</Text>
        <Text accessibilityRole="header" style={s.cardHeading}>{step.prompt}</Text>
      </View>

      <View style={s.optionsList}>
        {step.options.map((opt) => {
          const isSelected = selectedOption?.id === opt.id;
          const showAsRecommended = committed && opt.isRecommended && !isSelected;
          const showAsChosen = committed && isSelected;

          return (
            <TactilePressable
              key={opt.id}
              accessibilityRole="button"
              accessibilityState={{
                selected: isSelected,
                disabled: committed,
              }}
              accessibilityLabel={`Option: ${opt.text}`}
              disabled={committed}
              onPress={() => onSelect(opt, step)}
              haptic="light"
              pressScale={0.975}
              style={[
                s.optionItem,
                isSelected && !committed && s.optionSelected,
                showAsChosen && (opt.isRecommended ? s.optionCorrect : s.optionIncorrect),
                showAsRecommended && s.optionRecommendedHint,
              ]}
            >
              <Text
                style={[
                  s.optionText,
                  isSelected && !committed && s.optionTextSelected,
                  showAsChosen && s.optionTextCommitted,
                ]}
              >
                {opt.text}
              </Text>
              {showAsChosen && (
                <Text style={s.optionMarker}>
                  Your choice
                </Text>
              )}
              {showAsRecommended && (
                <Text style={s.optionMarkerRecommended}>Recommended in this situation</Text>
              )}
            </TactilePressable>
          );
        })}
      </View>

      {/* Feedback — shown after committing */}
      {committed && selectedOption && (
        <View style={s.feedbackCard} accessibilityLiveRegion="polite" onLayout={(event) => onFeedbackLayout(event.nativeEvent.layout.y)}>
          <Text style={s.feedbackBadge}>
            What happens next
          </Text>
          <Text style={s.feedbackText}>{selectedOption.effect}</Text>
          {!selectedOption.isRecommended && step.recommendedWhy && (
            <View style={s.recommendedBlock}>
              <Text style={s.recommendedLabel}>Given the facts in this scenario</Text>
              <Text style={s.recommendedText}>{step.recommendedWhy}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

/* --- Takeaway --- */
function TakeawayCard({ step }: { step: TakeawayStep }) {
  return (
    <View style={s.card}>
      <Text style={s.stepBadge}>KEY TAKEAWAY</Text>
      <Text accessibilityRole="header" style={s.cardHeading}>{step.heading}</Text>
      <Text style={s.cardBody}>{step.body}</Text>
    </View>
  );
}

/* --- Practice --- */
function PracticeCard({
  step,
  draft,
  onDraftChange,
  feedback,
  firstDraft,
  onAnalyze,
  onRevise,
  referenceVisible,
  onToggleReference,
  onFeedbackLayout,
}: {
  step: PracticeStep;
  draft: string;
  onDraftChange: (text: string) => void;
  feedback: PracticeFeedback | null;
  firstDraft: string;
  onAnalyze: (scenarioId: string) => void;
  onRevise: () => void;
  referenceVisible: boolean;
  onToggleReference: () => void;
  onFeedbackLayout: (y: number) => void;
}) {
  const scenario = findScenario(step.scenarioId);
  const wordCount = (draft.trim().match(/\S+/g) ?? []).length;
  const canAnalyze = wordCount >= 12;

  return (
    <View style={s.stack}>
      <View style={s.card}>
        <Text style={s.stepBadge}>COMMUNICATION PRACTICE LAB</Text>
        <Text accessibilityRole="header" style={s.cardHeading}>{step.heading}</Text>
        <Text style={s.cardBody}>{step.body}</Text>
        {step.hint ? (
          <View style={s.hintBox}>
            <Text style={s.hintText}>💡 {step.hint}</Text>
          </View>
        ) : null}
      </View>

      {/* Original message */}
      <View style={[s.card, s.practiceCard]}>
        <Text style={s.stepBadge}>ORIGINAL MESSAGE · {scenario.channel}</Text>
        <View style={s.senderRow}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>
              {scenario.sender
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </Text>
          </View>
          <View style={s.flex}>
            <Text style={s.senderName}>
              {scenario.sender}{' '}
              <Text style={s.senderTime}>{scenario.timestamp}</Text>
            </Text>
            <Text style={s.senderMeta}>
              {scenario.senderRole} · {scenario.senderRegion}
            </Text>
          </View>
        </View>
        <View style={s.bubble}>
          <Text style={s.bubbleText}>{scenario.message}</Text>
        </View>
      </View>

      {/* Editor */}
      <View style={[s.card, s.practiceCard]}>
        <View style={s.editorHeader}>
          <Text style={s.stepBadge}>YOUR REWRITE</Text>
          <Text style={s.wordCountLabel}>{wordCount} words</Text>
        </View>
        <TextInput
          value={draft}
          onChangeText={onDraftChange}
          multiline
          maxLength={4000}
          placeholder="Rewrite the message with context, a clear ask, a deadline, and a fallback…"
          placeholderTextColor="#636366"
          style={s.textInput}
          textAlignVertical="top"
          autoCorrect
          editable={!feedback}
          accessibilityLabel="Rewrite the message"
        />
        {wordCount > 0 && wordCount < 12 && (
          <Text style={s.hintSmall}>
            Add at least {12 - wordCount} more words to check.
          </Text>
        )}
      </View>

      {!feedback && (
        <View style={s.practiceButtonWrap}>
          <Text style={s.practiceDisclaimer}>
            This checklist detects wording patterns. You still need to verify the facts, timing and suitability of your message.
          </Text>
          <TactilePressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canAnalyze }}
            disabled={!canAnalyze}
            onPress={() => onAnalyze(step.scenarioId)}
            haptic="medium"
            style={[s.analyzeBtn, !canAnalyze && s.analyzeBtnDisabled]}
          >
            <Text style={s.analyzeBtnText}>Check My Rewrite</Text>
          </TactilePressable>
        </View>
      )}

      {/* Results */}
      {feedback && (
        <>
          <View onLayout={(event) => onFeedbackLayout(event.nativeEvent.layout.y)}><PracticeResults feedback={feedback} draft={draft} firstDraft={firstDraft} /></View>
          <TactilePressable
            accessibilityRole="button"
            accessibilityLabel="Revise your message and check again"
            onPress={onRevise}
            style={s.reviseBtn}
          >
            <Text style={s.reviseBtnText}>Revise & Check Again</Text>
          </TactilePressable>
        </>
      )}
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: referenceVisible }}
        onPress={onToggleReference} style={({ pressed }) => [s.refToggle, pressed && s.dimmed]}>
        <Text style={s.refToggleText}>{referenceVisible ? 'Hide example handoff' : 'See an example handoff'}</Text>
      </Pressable>
      {referenceVisible && <View style={s.card}><Text style={s.stepBadge}>One possible approach</Text><Text style={s.referenceText} selectable>{scenario.exemplar}</Text></View>}
    </View>
  );
}

function PracticeResults({
  feedback,
  draft,
  firstDraft,
}: {
  feedback: PracticeFeedback;
  draft: string;
  firstDraft: string;
}) {
  const verdictColor =
    feedback.verdict === 'ready'
      ? '#2E7D32'
      : feedback.verdict === 'close'
        ? '#E65100'
        : '#636366';

  return (
    <View style={s.stack}>
      {/* Verdict */}
      <View style={[s.card, s.practiceCard]}>
        <Text style={[s.stepBadge, { color: verdictColor }]}>
          {feedback.verdict === 'ready'
            ? 'Five patterns detected'
            : feedback.verdict === 'close'
              ? 'Some patterns detected'
              : 'Review your draft'}
        </Text>
        <Text style={s.feedbackText}>{feedback.verdictText}</Text>
      </View>

      {/* Checks */}
      {feedback.checks.length > 0 && (
        <View style={[s.card, s.practiceCard]}>
          <Text style={s.stepBadge}>SIGNAL CHECKLIST</Text>
          {feedback.checks.map((check) => (
            <View key={check.key} style={s.checkRow}>
              <View style={s.checkHeader}>
                <Text style={s.checkMarker}>{check.present ? '✓' : '○'}</Text>
                <Text
                  style={[s.checkLabel, !check.present && s.checkLabelMissing]}
                >
                  {check.label}
                </Text>
              </View>
              {check.present && check.evidence.length > 0 && (
                <View style={s.evidenceWrap}>
                  {check.evidence.map((e) => (
                    <View key={e} style={s.evidenceChip}>
                      <Text style={s.evidenceChipText}>{e}</Text>
                    </View>
                  ))}
                </View>
              )}
              {!check.present && (
                <Text style={s.checkTip}>→ {check.tip}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {firstDraft && firstDraft !== draft && (
        <View style={[s.card, s.practiceCard]}>
          <Text style={s.stepBadge}>YOUR REVISION</Text>
          <Text style={s.compareLabel}>FIRST DRAFT</Text>
          <Text style={s.compareText}>{firstDraft}</Text>
          <Text style={s.compareLabel}>CURRENT DRAFT</Text>
          <Text style={s.compareText}>{draft}</Text>
        </View>
      )}

    </View>
  );
}

/* --- Reflection --- */
function ReflectionCard({
  step,
  answers,
  decisionSteps,
}: {
  step: ReflectionStep;
  answers: Record<string, SavedAnswer>;
  decisionSteps: DecisionStep[];
}) {
  return (
    <View style={s.stack}>
      <View style={s.card}>
        <Text style={s.stepBadge}>REFLECTION</Text>
        <Text accessibilityRole="header" style={s.cardHeading}>{step.heading}</Text>
        <Text style={s.cardBody}>{step.body}</Text>
        <View style={s.reflectionPoints}>
          {step.points.map((pt, i) => (
            <View key={i} style={s.reflectionRow}>
              <Text style={s.reflectionBullet}>•</Text>
              <Text style={s.reflectionText}>{pt}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Decision recap */}
      {decisionSteps.length > 0 && (
        <View style={[s.card, s.recapCard]}>
          <Text style={s.stepBadge}>YOUR DECISIONS</Text>
          {decisionSteps.map((ds) => {
            const answer = answers[ds.id];
            const chosen = answer
              ? ds.options.find((o) => o.id === answer.optionId)
              : null;
            return (
              <View key={ds.id} style={s.recapItem}>
                <Text style={s.recapLabel}>{ds.contextLabel}</Text>
                {chosen && (
                  <View style={s.recapChoiceRow}>
                    <Text style={s.recapChoiceText}>
                      {chosen.text}
                    </Text>
                  </View>
                )}
                {chosen && <Text style={s.cardBody}>{chosen.effect}</Text>}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const webColumn = Platform.select({
  web: { maxWidth: 440, width: '100%' as const, alignSelf: 'center' as const },
});

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  web: { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)' },
});

const s = StyleSheet.create({
  stack: { gap: 14 },
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#F2F2F7' },
  dimmed: { opacity: 0.5 },

  /* Header */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingRight: 10,
    minWidth: 72,
  },
  backChevron: {
    fontSize: 26,
    lineHeight: 26,
    color: '#000000',
    marginRight: 4,
  },
  backText: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headerProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#636366',
  },
  headerSpacer: { minWidth: 72 },

  /* Progress */
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E5EA',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 14,
    ...webColumn,
  },

  /* Cards */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    ...cardShadow,
  },
  factsCard: { marginTop: 0 },
  practiceCard: { marginTop: 0 },
  recapCard: { marginTop: 0 },

  /* Step badge */
  stepBadge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#636366',
    marginBottom: 10,
  },

  /* Typography */
  cardHeading: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#000000',
    lineHeight: 28,
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 17,
    lineHeight: 25,
    color: '#3A3A3C',
  },

  /* Objectives */
  objectivesList: { gap: 12, marginTop: 8 },
  objectiveRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  objectiveBullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  objectiveBulletText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  objectiveText: { flex: 1, fontSize: 15, lineHeight: 22, color: '#3A3A3C' },

  /* Concept points */
  pointsList: { gap: 12, marginTop: 16 },
  pointItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 14,
  },
  pointLabel: { fontSize: 14, fontWeight: '700', color: '#000000', marginBottom: 4 },
  pointText: { fontSize: 14, lineHeight: 20, color: '#3A3A3C' },

  /* Scenario */
  messageBubbleContainer: { marginTop: 16 },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  senderName: { fontSize: 15, fontWeight: '700', color: '#000000' },
  senderTime: { fontSize: 12, fontWeight: '500', color: '#636366' },
  senderMeta: { fontSize: 12, color: '#636366', marginTop: 1 },
  bubble: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    borderTopLeftRadius: 4,
    padding: 14,
  },
  bubbleText: { fontSize: 15, lineHeight: 21, color: '#000000', fontWeight: '500' },
  channelLabel: { fontSize: 12, color: '#636366', marginTop: 8, fontWeight: '500' },

  /* Facts */
  factRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  factDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#000000',
    marginTop: 7,
  },
  factText: { flex: 1, fontSize: 14, lineHeight: 20, color: '#3A3A3C' },

  /* Decision options */
  optionsList: { gap: 10 },
  optionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
    ...cardShadow,
  },
  optionSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  optionCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#A5D6A7',
  },
  optionIncorrect: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFCC80',
  },
  optionRecommendedHint: {
    borderColor: '#A5D6A7',
    borderStyle: 'dashed' as const,
  },
  optionText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: '#000000',
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionTextCommitted: {
    fontWeight: '600',
  },
  optionMarker: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636366',
    marginTop: 8,
  },
  optionMarkerRecommended: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 8,
  },

  /* Confirm */
  confirmContainer: { marginTop: 8 },
  confirmBtn: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

  /* Feedback */
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 14,
    ...cardShadow,
  },
  feedbackBadge: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#636366',
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#3A3A3C',
  },
  recommendedBlock: {
    marginTop: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 14,
  },
  recommendedLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#636366',
    marginBottom: 6,
  },
  recommendedText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3C',
  },

  /* Hint */
  hintBox: {
    marginTop: 16,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 14,
  },
  hintText: { fontSize: 14, lineHeight: 20, color: '#636366' },

  /* Practice editor */
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wordCountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#636366',
    fontVariant: ['tabular-nums'],
  },
  textInput: {
    minHeight: 140,
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 14,
    paddingTop: 14,
    fontSize: 15,
    lineHeight: 21,
    color: '#000000',
  },
  hintSmall: { fontSize: 12, color: '#636366', marginTop: 8 },
  practiceButtonWrap: { gap: 8 },
  practiceDisclaimer: {
    fontSize: 12,
    color: '#636366',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  analyzeBtn: {
    minHeight: 52,
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  analyzeBtnDisabled: { backgroundColor: '#C7C7CC' },
  analyzeBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  reviseBtn: { backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  reviseBtnText: { color: '#000000', fontSize: 15, fontWeight: '700' },
  compareLabel: { fontSize: 11, fontWeight: '700', color: '#636366', marginTop: 12, marginBottom: 5 },
  compareText: { fontSize: 14, lineHeight: 20, color: '#3A3A3C' },

  /* Practice results */
  checkRow: { marginBottom: 14 },
  checkHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkMarker: { fontSize: 16, fontWeight: '700', color: '#000000', width: 20 },
  checkLabel: { fontSize: 15, fontWeight: '600', color: '#000000' },
  checkLabelMissing: { color: '#636366' },
  evidenceWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginLeft: 28,
  },
  evidenceChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  evidenceChipText: { fontSize: 11, fontWeight: '600', color: '#000000' },
  checkTip: {
    fontSize: 13,
    lineHeight: 19,
    color: '#636366',
    marginTop: 4,
    marginLeft: 28,
  },

  refToggle: {
    minHeight: 44,
    alignItems: 'center',
    paddingVertical: 12,
  },
  refToggleText: { fontSize: 15, fontWeight: '600', color: '#000000' },
  referenceText: { fontSize: 14, lineHeight: 21, color: '#3A3A3C' },

  /* Reflection */
  reflectionPoints: { gap: 8, marginTop: 12 },
  reflectionRow: { flexDirection: 'row', gap: 8 },
  reflectionBullet: { fontSize: 15, color: '#000000', fontWeight: '700' },
  reflectionText: { flex: 1, fontSize: 15, lineHeight: 22, color: '#3A3A3C' },

  recapItem: { marginBottom: 14 },
  recapLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#636366',
    marginBottom: 4,
  },
  recapChoiceRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  recapMarker: { fontSize: 14, fontWeight: '700', color: '#000000' },
  recapChoiceText: { flex: 1, fontSize: 14, lineHeight: 20, color: '#3A3A3C' },

  /* Footer */
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    ...webColumn,
  },
  continueBtn: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
