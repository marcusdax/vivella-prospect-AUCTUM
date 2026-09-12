import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '../design-system/colors';
import { Badge } from './Badge';
import type { ScannerHit } from '../types';

export function ScannerHitItem({ hit, onPress }: { hit: ScannerHit; onPress: () => void }) {
  const topIssue = hit.issues[0];
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl p-4 mb-3 flex-row items-center active:bg-warm-stone/20"
      accessibilityRole="button"
    >
      <View className="flex-1">
        <Text className="text-base font-sans font-medium text-root-earth">
          {hit.property.address}
        </Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          {hit.property.city}, {hit.property.state} · Score {hit.overallScore}
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {topIssue && <Badge label={topIssue.type} variant={topIssue.severity} />}
          {hit.issues.slice(1, 3).map((issue) => (
            <View key={issue.id} className="ml-2">
              <Badge label={issue.type} variant={issue.severity} />
            </View>
          ))}
        </View>
      </View>
      <ChevronRight size={20} color={colors.rootEarth} />
    </Pressable>
  );
}
