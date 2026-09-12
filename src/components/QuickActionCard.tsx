import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../design-system/colors';

export function QuickActionCard({
  title,
  subtitle,
  count,
  onPress,
}: {
  title: string;
  subtitle: string;
  count?: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl p-4 mb-3 flex-row items-center justify-between active:bg-warm-stone/30"
      accessibilityRole="button"
    >
      <View className="flex-1">
        <Text className="text-lg font-sans font-medium text-root-earth">{title}</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">{subtitle}</Text>
      </View>
      {count !== undefined && (
        <View className="bg-neural-amber/20 rounded-full px-3 py-1 mr-3">
          <Text className="text-sm font-sans font-semibold text-root-earth">{count}</Text>
        </View>
      )}
      <ChevronRight size={20} color={colors.rootEarth} />
    </Pressable>
  );
}
