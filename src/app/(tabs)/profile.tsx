import { useGlobalLessonStore } from '@/utils/lesson-store';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const IOS = {
  groupedBackground: '#F2F2F7',
  card: '#FFFFFF',
  label: '#000000',
  secondary: '#8E8E93',
  separator: '#E5E5EA',
  chevron: '#C7C7CC',
  accentGreen: '#34C759',
  destructive: '#FF3B30',
  systemBlue: '#007AFF',
} as const;

export default function ProfileScreen() {
  const [offlineCache, setOfflineCache] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [frameworkModalVisible, setFrameworkModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [profileDetailVisible, setProfileDetailVisible] = useState(false);

  const { completedCount, resetAllProgress } = useGlobalLessonStore();

  const handleExecuteReset = () => {
    resetAllProgress();
    setOfflineCache(true);
    setRemindersEnabled(false);
    setConfirmModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.kicker}>ACCOUNT</Text>
        <Text style={styles.title}>Profile</Text>

        {/* User Card Interactive */}
        <Pressable
          accessibilityRole="button"
          onPress={() => setProfileDetailVisible(true)}
          style={({ pressed }) => [
            styles.userCard,
            pressed && styles.userCardPressed,
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.initials}>AR</Text>
          </View>
          <View style={styles.userCopy}>
            <Text style={styles.userName}>Alex Rivera</Text>
            <Text style={styles.userMeta}>Global Operations • Maua</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* Learning Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LEARNING PROGRESS</Text>
          <View style={styles.group}>
            <View style={styles.row}>
              <View style={[styles.rowInner, styles.rowDivider]}>
                <Text style={styles.rowLabel}>Active Streak</Text>
                <Text style={styles.rowValue}>4 Days</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.rowInner, styles.rowDivider]}>
                <Text style={styles.rowLabel}>Completed Lessons</Text>
                <Text style={styles.rowValue}>{completedCount}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowInner}>
                <Text style={styles.rowLabel}>Weekly Alignment</Text>
                <Text style={styles.rowValue}>80%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Organization & Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES & POLICIES</Text>
          <View style={styles.group}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setFrameworkModalVisible(true)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={[styles.rowInner, styles.rowDivider]}>
                <Text style={styles.rowLabel}>Global Team Frameworks</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Pressable>

            <View style={styles.row}>
              <View style={[styles.rowInner, styles.rowDivider]}>
                <Text style={styles.rowLabel}>Offline Sync Cache</Text>
                <Switch
                  value={offlineCache}
                  onValueChange={setOfflineCache}
                  trackColor={{ false: '#E5E5EA', true: IOS.accentGreen }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.rowInner}>
                <Text style={styles.rowLabel}>Daily Focus Reminders</Text>
                <Switch
                  value={remindersEnabled}
                  onValueChange={setRemindersEnabled}
                  trackColor={{ false: '#E5E5EA', true: IOS.accentGreen }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Prototype Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROTOTYPE CONTROLS</Text>
          <View style={styles.group}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmModalVisible(true)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowInner}>
                <Text style={[styles.rowLabel, { color: IOS.destructive }]}>
                  Reset Completed Lessons Counter
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footer}>Maua Learn v1.0 • Global Workforce Spec</Text>
      </ScrollView>

      {/* 1. Profile Detail Modal */}
      <Modal
        visible={profileDetailVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setProfileDetailVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setProfileDetailVisible(false)}
        >
          <Pressable style={styles.profileCardModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.profileModalHeader}>
              <View style={styles.profileModalAvatar}>
                <Text style={styles.profileModalInitials}>AR</Text>
              </View>
              <Text style={styles.profileModalName}>Alex Rivera</Text>
              <Text style={styles.profileModalRole}>Remote Team Lead • Operations</Text>
              <View style={styles.profilePill}>
                <View style={styles.profileStatusDot} />
                <Text style={styles.profilePillText}>Maua Global Core</Text>
              </View>
            </View>

            <View style={styles.detailBox}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>alex.rivera@maua.global</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Timezone</Text>
                <Text style={styles.detailValue}>UTC-5 (EST) • Distributed</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Sprint Track</Text>
                <Text style={styles.detailValue}>Async Trust & Governance</Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ID Benchmark</Text>
                <Text style={styles.detailValue}>MAUA-GL-8821</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              activeOpacity={0.8}
              onPress={() => setProfileDetailVisible(false)}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 2. Custom Apple System Alert Dialog */}
      <Modal
        visible={confirmModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setConfirmModalVisible(false)}
        >
          <Pressable style={styles.alertCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Reset All Progress?</Text>
              <Text style={styles.alertMessage}>
                This will clear all completed modules and quiz scores. This action cannot be undone.
              </Text>
            </View>

            <View style={styles.alertActionRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.alertButton,
                  pressed && styles.alertButtonPressed,
                ]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.alertCancelText}>Cancel</Text>
              </Pressable>

              <View style={styles.alertDividerVertical} />

              <Pressable
                style={({ pressed }) => [
                  styles.alertButton,
                  pressed && styles.alertButtonPressed,
                ]}
                onPress={handleExecuteReset}
              >
                <Text style={styles.alertDestructiveText}>Reset</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 3. Global Team Frameworks Modal */}
      <Modal
        visible={frameworkModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setFrameworkModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFrameworkModalVisible(false)}
        >
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Global Team Frameworks</Text>
            <Text style={styles.modalSubtitle}>
              Core principles designed for Maua distributed teams.
            </Text>

            <View style={styles.frameworkList}>
              <View style={styles.frameworkItem}>
                <Text style={styles.frameworkItemNum}>01</Text>
                <View style={styles.frameworkItemCopy}>
                  <Text style={styles.frameworkItemTitle}>Asynchronous Default</Text>
                  <Text style={styles.frameworkItemDesc}>
                    Document decisions clearly in writing before requesting synchronous calls.
                  </Text>
                </View>
              </View>

              <View style={styles.frameworkItem}>
                <Text style={styles.frameworkItemNum}>02</Text>
                <View style={styles.frameworkItemCopy}>
                  <Text style={styles.frameworkItemTitle}>Cross-Cultural Humility</Text>
                  <Text style={styles.frameworkItemDesc}>
                    Adapt communication styles to non-native speakers with patience and clarity.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              activeOpacity={0.8}
              onPress={() => setFrameworkModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: IOS.groupedBackground,
  },
  scroll: {
    flex: 1,
    backgroundColor: IOS.groupedBackground,
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
    fontWeight: '700',
    letterSpacing: 0.8,
    color: IOS.secondary,
  },
  title: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: IOS.label,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: IOS.card,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  userCardPressed: {
    backgroundColor: '#E5E5EA',
    opacity: 0.9,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: IOS.label,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: IOS.card,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  userCopy: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    color: IOS.label,
  },
  userMeta: {
    fontSize: 14,
    lineHeight: 18,
    color: IOS.secondary,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 14,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: IOS.secondary,
  },
  group: {
    backgroundColor: IOS.card,
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    backgroundColor: IOS.card,
  },
  rowPressed: {
    backgroundColor: '#E5E5EA',
  },
  rowInner: {
    minHeight: 48,
    marginLeft: 16,
    paddingRight: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: IOS.separator,
  },
  rowLabel: {
    fontSize: 16,
    color: IOS.label,
  },
  rowValue: {
    fontSize: 16,
    color: IOS.secondary,
  },
  chevron: {
    fontSize: 22,
    color: IOS.chevron,
    fontWeight: '400',
  },
  footer: {
    marginTop: 28,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: IOS.secondary,
  },

  /* Overlay Base */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  /* Profile Detail Modal Card */
  profileCardModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.18,
        shadowRadius: 28,
      },
      web: {
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.18)',
      },
    }),
  },
  profileModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileModalAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileModalInitials: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  profileModalName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
  },
  profileModalRole: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
    marginBottom: 10,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  profileStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
  },
  profilePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#34C759',
  },
  detailBox: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '600',
  },
  detailDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
  },

  /* Alert Card (270pt) */
  alertCard: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  alertContent: {
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  alertMessage: {
    fontSize: 13,
    lineHeight: 18,
    color: '#3C3C43',
    textAlign: 'center',
    marginTop: 6,
  },
  alertActionRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
    height: 44,
  },
  alertButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertButtonPressed: {
    backgroundColor: '#E5E5EA',
  },
  alertDividerVertical: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    height: '100%',
  },
  alertCancelText: {
    fontSize: 17,
    color: IOS.systemBlue,
    fontWeight: '400',
  },
  alertDestructiveText: {
    fontSize: 17,
    color: IOS.destructive,
    fontWeight: '600',
  },

  /* Framework Large Card Modal */
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.16,
        shadowRadius: 28,
      },
      web: {
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.16)',
      },
    }),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  frameworkList: {
    gap: 16,
    marginBottom: 24,
  },
  frameworkItem: {
    flexDirection: 'row',
    gap: 14,
  },
  frameworkItemNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    marginTop: 2,
  },
  frameworkItemCopy: {
    flex: 1,
  },
  frameworkItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  frameworkItemDesc: {
    fontSize: 13,
    color: '#3C3C43',
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});