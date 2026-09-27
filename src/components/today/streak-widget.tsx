import { StyleSheet, Text, View } from 'react-native';

import { Colors, Typography } from '@/constants/theme';

type StreakWidgetProps = {
  days: number;
};

export function StreakWidget({ days }: StreakWidgetProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Streak</Text>
      <Text style={styles.value}>{days} Days Active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.separator,
  },
  label: {
    ...Typography.body,
    color: Colors.label,
    fontWeight: '600',
  },
  value: {
    ...Typography.footnote,
  },
});
