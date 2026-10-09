import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';

import { Colors } from '@/constants/theme';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <Head><title>Maua Learn</title><meta name="description" content="Practical learning for teams working across time zones." /></Head>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
