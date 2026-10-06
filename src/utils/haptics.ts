import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Fire-and-forget haptic helpers. No-ops on web and swallows unsupported-device errors so
 * tactile feedback can never crash a flow.
 */
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export function hapticSelection() {
  if (!isNative) return;
  Haptics.selectionAsync().catch(() => {});
}

export function hapticImpact(style: 'light' | 'medium' = 'light') {
  if (!isNative) return;
  Haptics.impactAsync(
    style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
  ).catch(() => {});
}

export function hapticNotify(type: 'success' | 'warning' | 'error') {
  if (!isNative) return;
  const map = {
    success: Haptics.NotificationFeedbackType.Success,
    warning: Haptics.NotificationFeedbackType.Warning,
    error: Haptics.NotificationFeedbackType.Error,
  } as const;
  Haptics.notificationAsync(map[type]).catch(() => {});
}
