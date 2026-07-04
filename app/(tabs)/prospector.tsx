import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProspects } from '../../src/hooks/useProspects';
import { ProspectCard } from '../../src/components/ProspectCard';
import { FilterChip } from '../../src/components/FilterChip';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';
import type { InvestmentStrategy, Prospect } from '../../src/types';

const strategies: { key: InvestmentStrategy; label: string }[] = [
  { key: 'fix-and-flip', label: 'Fix & Flip' },
  { key: 'buy-and-hold', label: 'Buy & Hold' },
  { key: 'wholesale', label: 'Wholesale' },
];

export default function ProspectorScreen() {
  const router = useRouter();
  const [strategy, setStrategy] = useState<InvestmentStrategy>('fix-and-flip');
  const { data, isLoading, error, refetch } = useProspects({ strategy });

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">
          Real Estate Prospector
        </Text>
        <Text className="text-sm text-root-earth font-sans mt-1">
          Off-market opportunities ranked by investment strategy.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        contentContainerClassName="pb-2"
      >
        {strategies.map((s) => (
          <FilterChip
            key={s.key}
            label={s.label}
            active={strategy === s.key}
            onPress={() => setStrategy(s.key)}
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.rootEarth} className="mt-12" />
      ) : error ? (
        <EmptyState
          title="Could not load prospects"
          message={error.message}
          actionTitle="Retry"
          onAction={() => refetch()}
        />
      ) : data?.length === 0 ? (
        <EmptyState title="No prospects" message="Try a different strategy or relax filters." />
      ) : (
        <ScrollView className="flex-1 px-4 mt-2" contentContainerClassName="pb-8">
          {data?.map((prospect: Prospect) => (
            <ProspectCard
              key={prospect.id}
              prospect={prospect}
              onPress={() => router.push({ pathname: '/prospector/[id]', params: { id: prospect.id } })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
