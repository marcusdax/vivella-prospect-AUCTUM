import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Bell, Search } from 'lucide-react-native';
import { colors } from '../design-system/colors';

export function Header({ alertCount = 0 }: { alertCount?: number }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-parchment border-b border-warm-stone/20">
      <Text className="text-xl font-sans font-semibold text-root-earth tracking-tight">
        VIVELLA
      </Text>
      <View className="flex-row items-center gap-4">
        <Pressable accessibilityRole="button" accessibilityLabel="Search">
          <Search size={24} color={colors.rootEarth} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Alerts">
          <View>
            <Bell size={24} color={colors.rootEarth} />
            {alertCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-dawn-rose rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
                <Text className="text-xs font-sans font-bold text-root-earth">{alertCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
}
