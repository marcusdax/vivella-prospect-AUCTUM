import React from 'react';
import { View, Text } from 'react-native';

export function KPIStat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 min-w-[120px]">
      <Text className="text-2xl font-sans font-semibold text-root-earth">{value}</Text>
      <Text className="text-sm text-warm-stone font-sans mt-1">{label}</Text>
    </View>
  );
}
