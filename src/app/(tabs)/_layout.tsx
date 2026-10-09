import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { TabIcon } from '@/components/ui/tab-icon';
import { Colors, Typography } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.label,
        tabBarInactiveTintColor: Colors.secondaryLabel,
        tabBarLabelStyle: Typography.tabLabel,
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon ios="sun.max" material="calendar_today" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My learning',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon ios="person" material="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background,
    borderTopColor: Colors.separator,
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    shadowOpacity: 0,
  },
});
