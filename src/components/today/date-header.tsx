import { StyleSheet, Text, View } from 'react-native';

import { Typography } from '@/constants/theme';
import { formatTodayHeader } from '@/utils/format-date';

export function DateHeader() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.date}>{formatTodayHeader()}</Text>
      <Text style={styles.title}>Daily Focus</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  date: {
    ...Typography.date,
    marginBottom: 4,
  },
  title: {
    ...Typography.largeTitle,
  },
});
