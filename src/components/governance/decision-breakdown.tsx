import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import type { ChoiceMap, LessonModule, Question } from '@/types/governance';
import { TactilePressable } from './tactile-pressable';

interface DecisionBreakdownProps {
  lesson: LessonModule;
  choices: ChoiceMap;
}

/**
 * "Decision Breakdown & Post-Mortem" — an accordion that replays every decision made in a
 * stage, contrasting the learner's call with the ideal one and surfacing business impact.
 */
export function DecisionBreakdown({ lesson, choices }: DecisionBreakdownProps) {
  const aligned = lesson.questions.filter((q) => choices[q.id]?.isCorrect).length;
  const deviations = lesson.questions.length - aligned;
  const firstDeviationId = lesson.questions.find((q) => !choices[q.id]?.isCorrect)?.id;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionKicker}>DECISION BREAKDOWN & POST-MORTEM</Text>
      <Text style={styles.sectionSubtitle}>
        {deviations === 0
          ? 'Every call aligned with protocol. Review the rationale to coach others.'
          : `${deviations} decision${deviations > 1 ? 's' : ''} deviated from protocol. Tap to review impact.`}
      </Text>

      <View style={styles.summaryRow}>
        <SummaryStat value={aligned} label="Aligned" inverted />
        <SummaryStat value={deviations} label="Deviations" />
      </View>

      <View style={styles.list}>
        {lesson.questions.map((q, i) => (
          <PostMortemItem
            key={q.id}
            index={i}
            question={q}
            chosenText={choices[q.id]?.text}
            isCorrect={Boolean(choices[q.id]?.isCorrect)}
            defaultExpanded={q.id === firstDeviationId}
          />
        ))}
      </View>
    </View>
  );
}

function SummaryStat({ value, label, inverted }: { value: number; label: string; inverted?: boolean }) {
  return (
    <View style={[styles.stat, inverted && styles.statInverted]}>
      <Text style={[styles.statValue, inverted && styles.textInverted]}>{value}</Text>
      <Text style={[styles.statLabel, inverted && styles.statLabelInverted]}>{label}</Text>
    </View>
  );
}

interface PostMortemItemProps {
  index: number;
  question: Question;
  chosenText?: string;
  isCorrect: boolean;
  defaultExpanded?: boolean;
}

function PostMortemItem({ index, question, chosenText, isCorrect, defaultExpanded }: PostMortemItemProps) {
  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));
  const [rotation] = useState(() => new Animated.Value(defaultExpanded ? 1 : 0));
  const [reveal] = useState(() => new Animated.Value(defaultExpanded ? 1 : 0));

  const ideal = question.options.find((o) => o.isCorrect)?.text ?? '';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotation, {
        toValue: expanded ? 1 : 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(reveal, {
        toValue: expanded ? 1 : 0,
        duration: expanded ? 260 : 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded, rotation, reveal]);

  const chevronRotate = useMemo(
    () => rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }),
    [rotation]
  );
  const bodyTranslate = useMemo(
    () => reveal.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }),
    [reveal]
  );

  return (
    <View style={styles.item}>
      <TactilePressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`Decision ${index + 1}: ${isCorrect ? 'aligned' : 'deviation'}`}
        onPress={() => setExpanded((v) => !v)}
        pressScale={0.985}
        style={styles.itemHeader}
      >
        <View style={[styles.indexBadge, isCorrect ? styles.indexBadgeAligned : styles.indexBadgeDeviation]}>
          <Text style={[styles.indexText, isCorrect && styles.textInverted]}>
            {String(index + 1).padStart(2, '0')}
          </Text>
        </View>

        <View style={styles.itemHeaderText}>
          <Text style={styles.statusLabel}>{isCorrect ? 'ALIGNED WITH PROTOCOL' : 'DEVIATION DETECTED'}</Text>
          <Text style={styles.itemQuestion} numberOfLines={expanded ? undefined : 2}>
            {question.question}
          </Text>
        </View>

        <Animated.Text style={[styles.chevron, { transform: [{ rotate: chevronRotate }] }]}>›</Animated.Text>
      </TactilePressable>

      {expanded && (
        <Animated.View style={[styles.body, { opacity: reveal, transform: [{ translateY: bodyTranslate }] }]}>
          <DecisionRow
            label="YOUR DECISION"
            text={chosenText ?? 'No answer recorded'}
            marker={isCorrect ? '✓' : '✕'}
            emphasis={isCorrect}
          />
          {!isCorrect && <DecisionRow label="IDEAL DECISION" text={ideal} marker="✓" emphasis />}

          <View style={styles.insightBlock}>
            <Text style={styles.insightLabel}>OPERATIONAL IMPACT</Text>
            <Text style={styles.insightText}>{question.rationale.correctReason}</Text>
          </View>

          <View style={styles.riskBlock}>
            <View style={styles.riskHeader}>
              <View style={styles.riskDot} />
              <Text style={styles.riskLabel}>RISK GUARDRAIL</Text>
            </View>
            <Text style={styles.riskText}>{question.rationale.operationalRisk}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

function DecisionRow({
  label,
  text,
  marker,
  emphasis,
}: {
  label: string;
  text: string;
  marker: string;
  emphasis: boolean;
}) {
  return (
    <View style={styles.decisionRow}>
      <View style={[styles.marker, emphasis ? styles.markerFilled : styles.markerOutline]}>
        <Text style={[styles.markerText, emphasis && styles.textInverted]}>{marker}</Text>
      </View>
      <View style={styles.decisionTextGroup}>
        <Text style={styles.decisionLabel}>{label}</Text>
        <Text style={[styles.decisionText, !emphasis && styles.decisionTextMuted]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginTop: 28,
  },
  sectionKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#8E8E93',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#3A3A3C',
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  stat: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F2F2F7',
  },
  statInverted: {
    backgroundColor: '#000000',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#000000',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 2,
  },
  statLabelInverted: {
    color: 'rgba(255,255,255,0.6)',
  },
  textInverted: {
    color: '#FFFFFF',
  },
  list: {
    gap: 10,
  },
  item: {
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  indexBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexBadgeAligned: {
    backgroundColor: '#000000',
  },
  indexBadgeDeviation: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  indexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    fontVariant: ['tabular-nums'],
  },
  itemHeaderText: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#8E8E93',
    marginBottom: 3,
  },
  itemQuestion: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.1,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
    color: '#8E8E93',
    fontWeight: '400',
    width: 14,
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  decisionRow: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
  },
  marker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  markerFilled: {
    backgroundColor: '#000000',
  },
  markerOutline: {
    borderWidth: 1.5,
    borderColor: '#8E8E93',
  },
  markerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E8E93',
  },
  decisionTextGroup: {
    flex: 1,
  },
  decisionLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#8E8E93',
    marginBottom: 3,
  },
  decisionText: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    color: '#000000',
  },
  decisionTextMuted: {
    color: '#636366',
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  insightBlock: {
    paddingHorizontal: 4,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: '#000000',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#3A3A3C',
  },
  riskBlock: {
    backgroundColor: '#000000',
    borderRadius: 14,
    padding: 14,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  riskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  riskLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#FFFFFF',
  },
  riskText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.82)',
  },
});
