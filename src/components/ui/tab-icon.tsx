import { type ColorValue } from 'react-native';
import { SymbolView, type SFSymbol } from 'expo-symbols';

type TabIconProps = {
  ios: SFSymbol;
  material: 'calendar_today' | 'person';
  color: ColorValue;
  focused: boolean;
};

export function TabIcon({ ios, material, color, focused }: TabIconProps) {
  return (
    <SymbolView
      name={{ ios, android: material, web: material }}
      tintColor={color}
      size={26}
      weight={focused ? 'semibold' : 'regular'}
    />
  );
}
