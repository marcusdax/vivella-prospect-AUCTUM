import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../design-system/colors';
import { Badge } from './Badge';
import type { Prospect } from '../types';

export function ProspectCard({ prospect, onPress }: { prospect: Prospect; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl p-4 mb-3 active:bg-warm-stone/20"
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-sans font-medium text-root-earth flex-1">
          {prospect.property.address}
        </Text>
        <ChevronRight size={20} color={colors.rootEarth} />
      </View>
      <Text className="text-sm text-warm-stone font-sans mt-1">
        {prospect.property.city}, {prospect.property.state}
      </Text>
      <View className="flex-row flex-wrap mt-3">
        <Badge label={prospect.strategy.replace(/-/g, ' ')} variant="info" />
        <View className="ml-2">
          <Badge label={`Score ${prospect.score}`} variant="success" />
        </View>
      </View>
      <View className="flex-row mt-3 gap-4">
        <View>
          <Text className="text-xs text-warm-stone uppercase tracking-wider">ARV</Text>
          <Text className="text-base font-sans font-semibold text-root-earth">
            ${(prospect.estimatedArv / 1000).toFixed(0)}k
          </Text>
        </View>
        <View>
          <Text className="text-xs text-warm-stone uppercase tracking-wider">Rehab</Text>
          <Text className="text-base font-sans font-semibold text-root-earth">
            ${(prospect.estimatedRehabCost / 1000).toFixed(0)}k
          </Text>
        </View>
        <View>
          <Text className="text-xs text-warm-stone uppercase tracking-wider">Equity</Text>
          <Text className="text-base font-sans font-semibold text-flourish-green">
            ${(prospect.estimatedEquity / 1000).toFixed(0)}k
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
