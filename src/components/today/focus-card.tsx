import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Colors, Layout, Typography } from '@/constants/theme';
import type { Lesson } from '@/constants/lesson';

type FocusCardProps = {
  lesson: Lesson;
  onStart: () => void;
};

export function FocusCard({ lesson, onStart }: FocusCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.badge}>{lesson.durationLabel}</Text>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {lesson.description}
      </Text>
      <PrimaryButton label="Start Lesson" onPress={onStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.groupedBackground,
    borderRadius: Layout.cardRadius,
    padding: Layout.cardPadding,
    gap: 12,
  },
  badge: {
    ...Typography.badge,
  },
  title: {
    ...Typography.title,
  },
  description: {
    ...Typography.body,
    marginBottom: 8,
  },
});
