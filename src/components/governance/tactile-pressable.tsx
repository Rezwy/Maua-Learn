import React, { useState } from 'react';
import {
  Animated,
  Pressable,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { hapticImpact, hapticSelection } from '@/utils/haptics';

type TactilePressableProps = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  /** Style merged in while the finger is down (e.g. background shift). */
  pressedStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode);
  /** Scale reached while pressed. Apple-style subtle default. */
  pressScale?: number;
  haptic?: 'selection' | 'light' | 'medium' | 'none';
};

/**
 * Pressable with a spring-driven scale and haptic tick on press-in — the tactile
 * baseline for every interactive surface in the governance engine.
 */
export function TactilePressable({
  style,
  pressedStyle,
  children,
  pressScale = 0.97,
  haptic = 'selection',
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: TactilePressableProps) {
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      speed: 40,
      bounciness: toValue === 1 ? 6 : 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = (e: GestureResponderEvent) => {
    animateTo(pressScale);
    if (haptic === 'selection') hapticSelection();
    else if (haptic === 'light' || haptic === 'medium') hapticImpact(haptic);
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    animateTo(1);
    onPressOut?.(e);
  };

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      {({ pressed }) => (
        <Animated.View style={[style, pressed && pressedStyle, { transform: [{ scale }] }]}>
          {typeof children === 'function' ? children({ pressed }) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}
