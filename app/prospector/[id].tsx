import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProspect } from '../../src/hooks/useProspect';
import { usePortfolio } from '../../src/hooks/usePortfolio';
import { useAlertStore } from '../../src/stores/alertStore';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

function currency(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function ProspectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: prospect, isLoading, error } = useProspect(id);
  const { addItem, items } = usePortfolio();
  const addAlert = useAlertStore((s) => s.addAlert);
  const [notes, setNotes] = useState('');

  const tracked = items.some((i) => i.propertyId === prospect?.propertyId);

  const handleTrack = (type: 'watchlist' | 'owned') => {
    if (!prospect) return;
    addItem(prospect.propertyId, type);
    addAlert({
      type: 'prospect',
      title: type === 'owned' ? 'Added to portfolio' : 'Added to watchlist',
      message: prospect.property.address,
      targetId: prospect.propertyId,
      targetScreen: 'prospector',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-parchment items-center justify-center">
        <ActivityIndicator size="large" color={colors.rootEarth} />
      </SafeAreaView>
    );
  }

  if (error || !prospect) {
    return (
      <SafeAreaView className="flex-1 bg-parchment">
        <EmptyState
          title="Prospect not found"
          message="We couldn't load this deal."
          actionTitle="Go back"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <ScrollView className="flex-1 px-4 pt-4" contentContainerClassName="pb-8">
        <Text className="text-3xl font-sans font-medium text-root-earth">
          {prospect.property.address}
        </Text>
        <Text className="text-base text-root-earth font-sans mt-1">
          {prospect.property.city}, {prospect.property.state}
        </Text>
        <View className="flex-row mt-3">
          <Badge label={prospect.strategy.replace(/-/g, ' ')} variant="info" />
          <View className="ml-2">
            <Badge label={`Score ${prospect.score}`} variant="success" />
          </View>
        </View>

        <Card className="mt-6">
          <Text className="text-sm uppercase tracking-wider text-root-earth font-sans">
            Estimated ARV
          </Text>
          <Text className="text-3xl font-sans font-semibold text-root-earth mt-1">
            {currency(prospect.estimatedArv)}
          </Text>
        </Card>

        <Text className="text-xl font-sans font-medium text-root-earth mt-6 mb-3">
          Deal metrics
        </Text>
        <Card className="mb-3">
          <View className="flex-row justify-between mb-3">
            <Text className="text-root-earth font-sans">Estimated rehab</Text>
            <Text className="text-root-earth font-sans font-medium">
              {currency(prospect.estimatedRehabCost)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-root-earth font-sans">Estimated equity</Text>
            <Text className="text-flourish-green font-sans font-medium">
              {currency(prospect.estimatedEquity)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-root-earth font-sans">Cash-on-cash return</Text>
            <Text className="text-root-earth font-sans font-medium">
              {prospect.cashOnCashReturn}%
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-root-earth font-sans">Monthly cash flow</Text>
            <Text className="text-root-earth font-sans font-medium">
              {currency(prospect.monthlyCashFlow ?? 0)}
            </Text>
          </View>
        </Card>

        <Text className="text-sm text-root-earth font-sans mt-2">
          Comps and repair estimates are simulated for the MVP.
        </Text>

        {!tracked ? (
          <View className="flex-row mt-6 gap-3">
            <Button
              title="Watchlist"
              onPress={() => handleTrack('watchlist')}
              variant="secondary"
              className="flex-1"
            />
            <Button
              title="Mark owned"
              onPress={() => handleTrack('owned')}
              className="flex-1"
            />
          </View>
        ) : (
          <Card className="mt-6 bg-flourish-green/10">
            <Text className="text-root-earth font-sans font-medium">
              Tracked in portfolio
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes..."
              placeholderTextColor={colors.rootEarth}
              className="mt-3 p-3 bg-parchment rounded-lg text-root-earth font-sans"
              multiline
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
