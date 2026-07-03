import React from 'react';
import { View } from 'react-native';
import { colors } from '../design-system/colors';

export function TabIcon({
  Icon,
  focused,
}: {
  Icon: React.ComponentType<{ size: number; color: string }>;
  focused: boolean;
}) {
  return (
    <View
      className={`items-center justify-center p-2 rounded-full ${
        focused ? 'bg-neural-amber/20' : ''
      }`}
    >
      <Icon size={24} color={focused ? colors.rootEarth : colors.warmStone} />
    </View>
  );
}
