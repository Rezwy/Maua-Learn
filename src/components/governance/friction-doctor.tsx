import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AuditTier, MetricResult, ToneAudit } from '@/types/governance';
import { hapticNotify, hapticSelection } from '@/utils/haptics';
import { ANALYSIS_LATENCY_MS, FRICTION_SCENARIOS, analyzeMessage } from '@/utils/tone-doctor';
import { TactilePressable } from './tactile-pressable';

const MIN_WORDS = 6;

const PIPELINE_STEPS = [
  'Parsing intent & tone markers…',
  'Scoring cross-cultural safety…',
  'Validating actionable guardrails…',
];

export function FrictionDoctor({ onBack }: { onBack: () => void }) {
  const [scenarioId, setScenarioId] = useState(FRICTION_SCENARIOS[0].id);
  const [draft, setDraft] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [audit, setAudit] = useState<ToneAudit | null>(null);
  const [showReference, setShowReference] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const [resultAnim] = useState(() => new Animated.Value(0));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = FRICTION_SCENARIOS.find((s) => s.id === scenarioId) ?? FRICTION_SCENARIOS[0];
  const baseline = useMemo(() => analyzeMessage(scenario.message), [scenario.message]);
  const wordCount = draft.trim().match(/\S+/g)?.length ?? 0;
  const canAnalyze = wordCount >= MIN_WORDS && !isAnalyzing;

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const selectScenario = (id: string) => {
    if (id === scenarioId) return;
    setScenarioId(id);
    setDraft('');
    setAudit(null);
    setShowReference(false);
  };

  const runAnalysis = () => {
    if (!canAnalyze) return;
    setIsAnalyzing(true);
    setAudit(null);
    setPipelineStep(0);
    resultAnim.setValue(0);

    const stepMs = ANALYSIS_LATENCY_MS / PIPELINE_STEPS.length;
    timers.current.push(
      setTimeout(() => setPipelineStep(1), stepMs),
      setTimeout(() => setPipelineStep(2), stepMs * 2),
      setTimeout(() => {
        const result = analyzeMessage(draft, scenario.message);
        setAudit(result);
        setIsAnalyzing(false);
        hapticNotify(result.tier === 'STRONG' ? 'success' : result.tier === 'ADEQUATE' ? 'warning' : 'error');
        Animated.timing(resultAnim, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
        timers.current.push(setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80));
      }, ANALYSIS_LATENCY_MS)
    );
  };

  const resultTranslate = useMemo(
    () => resultAnim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }),
    [resultAnim]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.headerBar}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.dimmed]}
        >
          <Text style={styles.backChevron}>‹</Text>
          <Text style={styles.backText}>Today</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Governance Lab</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.kicker}>AI SIMULATION • MICRO-GOVERNANCE</Text>
          <Text style={styles.title}>Async Friction Doctor</Text>
          <Text style={styles.subtitle}>
            Rewrite a high-friction message so a teammate on the other side of the world can act on it —
            without a meeting and without feeling attacked.
          </Text>

          {/* Scenario switcher */}
          <View style={styles.segmented}>
            {FRICTION_SCENARIOS.map((s) => {
              const active = s.id === scenarioId;
              return (
                <TactilePressable
                  key={s.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => selectScenario(s.id)}
                  style={[styles.segment, active && styles.segmentActive]}
                  pressScale={0.95}
                >
                  <Text
                    numberOfLines={1}
                    style={[styles.segmentText, active && styles.segmentTextActive]}
                  >
                    {s.label}
                  </Text>
                </TactilePressable>
              );
            })}
          </View>

          {/* Incoming message */}
          <View style={styles.card}>
            <Text style={styles.cardKicker}>INCOMING • {scenario.channel}</Text>
            <View style={styles.senderRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {scenario.sender
                    .split(' ')
                    .map((p) => p[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.senderName}>
                  {scenario.sender} <Text style={styles.timestamp}>{scenario.timestamp}</Text>
                </Text>
                <Text style={styles.senderMeta}>
                  {scenario.senderRole} · {scenario.senderRegion}
                </Text>
              </View>
            </View>
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{scenario.message}</Text>
            </View>

            <View style={styles.baselineRow}>
              <Text style={styles.baselineLabel}>BASELINE GOVERNANCE SCORE</Text>
              <TierBadge tier={baseline.tier} label={`${baseline.overall}`} />
            </View>
            <View style={styles.chipWrap}>
              {baseline.frictionFlags.map((f) => (
                <View key={f} style={styles.flagChip}>
                  <Text style={styles.flagChipText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Context */}
          <View style={styles.card}>
            <Text style={styles.cardKicker}>CONTEXT YOU HAVE</Text>
            {scenario.context.map((c) => (
              <View key={c} style={styles.contextRow}>
                <View style={styles.contextDot} />
                <Text style={styles.contextText} selectable>
                  {c}
                </Text>
              </View>
            ))}
          </View>

          {/* Editor */}
          <View style={styles.card}>
            <View style={styles.editorHeader}>
              <Text style={[styles.cardKicker, styles.editorKicker]}>YOUR REWRITE • ALEX RIVERA</Text>
              <View style={styles.editorHeaderRight}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Try sample fix"
                  onPress={() => {
                    hapticSelection();
                    setDraft(scenario.exemplar);
                  }}
                  style={({ pressed }) => [styles.sampleButton, pressed && styles.sampleButtonPressed]}
                >
                  <Text style={styles.sampleButtonText}>Try Sample Fix ↗</Text>
                </Pressable>
                <Text style={styles.wordCount}>{wordCount} words</Text>
              </View>
            </View>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              placeholder="Rewrite with context, a clear ask, a time-boxed expectation and a fallback…"
              placeholderTextColor="#AEAEB2"
              style={styles.input}
              textAlignVertical="top"
              autoCorrect
              accessibilityLabel="Rewrite message"
            />
            {wordCount > 0 && wordCount < MIN_WORDS && (
              <Text style={styles.hint}>Add at least {MIN_WORDS - wordCount} more words to analyze.</Text>
            )}
          </View>

          <TactilePressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canAnalyze, busy: isAnalyzing }}
            disabled={!canAnalyze}
            onPress={runAnalysis}
            haptic="medium"
            style={[styles.primaryButton, !canAnalyze && !isAnalyzing && styles.primaryButtonDisabled]}
          >
            {isAnalyzing ? (
              <View style={styles.analyzingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.primaryButtonText}>{PIPELINE_STEPS[pipelineStep]}</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Analyze Governance Impact</Text>
            )}
          </TactilePressable>

          {audit && (
            <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultTranslate }] }}>
              <AuditCard audit={audit} baseline={baseline.overall} />

              <TactilePressable
                accessibilityRole="button"
                onPress={() => setShowReference((v) => !v)}
                style={styles.secondaryButton}
                pressScale={0.98}
              >
                <Text style={styles.secondaryButtonText}>
                  {showReference ? 'Hide reference rewrite' : 'Compare with reference rewrite'}
                </Text>
              </TactilePressable>

              {showReference && (
                <View style={[styles.card, styles.referenceCard]}>
                  <Text style={styles.cardKicker}>REFERENCE • SCORE {analyzeMessage(scenario.exemplar).overall}</Text>
                  <Text style={styles.referenceText} selectable>
                    {scenario.exemplar}
                  </Text>
                </View>
              )}
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Audit card                                                          */
/* ------------------------------------------------------------------ */

function AuditCard({ audit, baseline }: { audit: ToneAudit; baseline: number }) {
  const delta = audit.overall - baseline;
  return (
    <View style={styles.auditCard}>
      <Text style={styles.auditKicker}>GOVERNANCE AUDIT</Text>
      <View style={styles.auditScoreRow}>
        <Text style={styles.auditScore}>{audit.overall}</Text>
        <Text style={styles.auditScoreMax}>/100</Text>
        <View style={styles.flex} />
        <TierBadge tier={audit.tier} inverted />
      </View>
      <Text style={styles.auditDelta}>
        {delta >= 0 ? '+' : ''}
        {delta} vs. original message
      </Text>
      <Text style={styles.auditVerdict}>{audit.verdict}</Text>

      <View style={styles.metricList}>
        {audit.metrics.map((m, i) => (
          <MetricRow key={m.key} metric={m} delay={i * 90} />
        ))}
      </View>

      {audit.frictionFlags.length > 0 && (
        <View style={styles.residualBlock}>
          <Text style={styles.residualLabel}>RESIDUAL FRICTION</Text>
          <View style={styles.chipWrap}>
            {audit.frictionFlags.map((f) => (
              <View key={f} style={styles.residualChip}>
                <Text style={styles.residualChipText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

function MetricRow({ metric, delay }: { metric: MetricResult; delay: number }) {
  const [fill] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fill, {
      toValue: metric.score,
      duration: 650,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fill, metric.score, delay]);

  const width = useMemo(
    () => fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
    [fill]
  );

  return (
    <View style={styles.metric}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricLabel}>{metric.label}</Text>
        <View style={styles.metricRight}>
          <Text style={styles.metricScore}>{metric.score}</Text>
          <TierBadge tier={metric.tier} small />
        </View>
      </View>
      <View style={styles.metricTrack}>
        <Animated.View style={[styles.metricFill, { width }]} />
      </View>
      {metric.signals.length > 0 && (
        <View style={styles.chipWrap}>
          {metric.signals.map((s) => (
            <View key={s} style={styles.signalChip}>
              <Text style={styles.signalChipText}>✓ {s}</Text>
            </View>
          ))}
        </View>
      )}
      <Text style={styles.metricFeedback}>→ {metric.feedback}</Text>
    </View>
  );
}

function TierBadge({
  tier,
  label,
  inverted,
  small,
}: {
  tier: AuditTier;
  label?: string;
  inverted?: boolean;
  small?: boolean;
}) {
  // Monochrome encoding: STRONG = solid, ADEQUATE = outline, AT RISK = dashed outline.
  const solid = tier === 'STRONG';
  const base = inverted
    ? solid
      ? styles.badgeSolidInverted
      : styles.badgeOutlineInverted
    : solid
      ? styles.badgeSolid
      : styles.badgeOutline;
  const textColor = inverted ? (solid ? '#000000' : '#FFFFFF') : solid ? '#FFFFFF' : '#000000';

  return (
    <View
      style={[
        styles.badge,
        small && styles.badgeSmall,
        base,
        tier === 'AT RISK' && styles.badgeDashed,
      ]}
    >
      <Text style={[styles.badgeText, small && styles.badgeTextSmall, { color: textColor }]}>
        {label ? `${label} · ${tier}` : tier}
      </Text>
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#F2F2F7' },
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
  backButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingRight: 10, minWidth: 72 },
  dimmed: { opacity: 0.5 },
  backChevron: { fontSize: 26, lineHeight: 26, color: '#000000', marginRight: 4 },
  backText: { fontSize: 17, color: '#000000', fontWeight: '600', letterSpacing: -0.2 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#000000' },
  headerSpacer: { minWidth: 72 },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 48, gap: 14, ...webColumn },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: '#8E8E93' },
  title: { fontSize: 30, fontWeight: '700', letterSpacing: -0.5, color: '#000000', marginTop: -8 },
  subtitle: { fontSize: 14, lineHeight: 20, color: '#636366', marginTop: -6 },

  segmented: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    width: '100%',
    marginVertical: 16,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  segmentActive: {
    backgroundColor: '#000000',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  segmentTextActive: {
    fontWeight: '600',
    color: '#FFFFFF',
  },

  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, ...cardShadow },
  cardKicker: { fontSize: 11, fontWeight: '700', letterSpacing: 0.7, color: '#8E8E93', marginBottom: 12 },

  senderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
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
  timestamp: { fontSize: 12, fontWeight: '500', color: '#8E8E93' },
  senderMeta: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  bubble: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    borderTopLeftRadius: 4,
    padding: 14,
  },
  bubbleText: { fontSize: 15, lineHeight: 21, color: '#000000', fontWeight: '500' },
  baselineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  baselineLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.7, color: '#8E8E93' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  flagChip: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  flagChipText: { fontSize: 11, fontWeight: '600', color: '#3A3A3C' },

  contextRow: { flexDirection: 'row', gap: 10, marginBottom: 8, alignItems: 'flex-start' },
  contextDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#000000', marginTop: 7 },
  contextText: { flex: 1, fontSize: 13, lineHeight: 19, color: '#3A3A3C' },

  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editorKicker: {
    marginBottom: 0,
    flex: 1,
  },
  editorHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sampleButton: {
    backgroundColor: '#E5E5EA',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  sampleButtonPressed: {
    opacity: 0.7,
  },
  sampleButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000000',
  },
  wordCount: { fontSize: 11, fontWeight: '600', color: '#8E8E93', fontVariant: ['tabular-nums'] },
  input: {
    minHeight: 150,
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 14,
    paddingTop: 14,
    fontSize: 15,
    lineHeight: 21,
    color: '#000000',
  },
  hint: { fontSize: 12, color: '#8E8E93', marginTop: 8 },

  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  primaryButtonDisabled: { backgroundColor: '#C7C7CC' },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  analyzingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  secondaryButtonText: { color: '#000000', fontSize: 15, fontWeight: '600' },
  referenceCard: { marginTop: 14 },
  referenceText: { fontSize: 14, lineHeight: 21, color: '#000000' },

  auditCard: { backgroundColor: '#000000', borderRadius: 20, padding: 20 },
  auditKicker: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, color: 'rgba(255,255,255,0.55)' },
  auditScoreRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 6 },
  auditScore: { fontSize: 52, fontWeight: '700', letterSpacing: -1.5, color: '#FFFFFF', lineHeight: 56 },
  auditScoreMax: { fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.45)', marginBottom: 8, marginLeft: 4 },
  auditDelta: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  auditVerdict: { fontSize: 14, lineHeight: 20, color: '#FFFFFF', marginTop: 10 },

  metricList: { marginTop: 18, gap: 12 },
  metric: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { fontSize: 14, fontWeight: '700', color: '#000000' },
  metricRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metricScore: { fontSize: 15, fontWeight: '700', color: '#000000', fontVariant: ['tabular-nums'] },
  metricTrack: { height: 6, borderRadius: 3, backgroundColor: '#E5E5EA', marginTop: 10, overflow: 'hidden' },
  metricFill: { height: '100%', backgroundColor: '#000000', borderRadius: 3 },
  signalChip: { backgroundColor: '#F2F2F7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  signalChipText: { fontSize: 11, fontWeight: '600', color: '#000000' },
  metricFeedback: { fontSize: 13, lineHeight: 19, color: '#3A3A3C', marginTop: 10 },

  residualBlock: { marginTop: 16 },
  residualLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: 'rgba(255,255,255,0.55)' },
  residualChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  residualChipText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },

  badge: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4, borderWidth: 1.5 },
  badgeSmall: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  badgeSolid: { backgroundColor: '#000000', borderColor: '#000000' },
  badgeOutline: { backgroundColor: 'transparent', borderColor: '#000000' },
  badgeSolidInverted: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  badgeOutlineInverted: { backgroundColor: 'transparent', borderColor: '#FFFFFF' },
  badgeDashed: { borderStyle: 'dashed' },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  badgeTextSmall: { fontSize: 9 },
});
