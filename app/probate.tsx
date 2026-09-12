import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../src/components/Card';
import { Badge } from '../src/components/Badge';
import { EmptyState } from '../src/components/EmptyState';

const mockCases = [
  { id: 'case-001', decedent: 'Eleanor Rigby', caseNumber: 'PR-2026-1847', status: 'pending' },
  { id: 'case-002', decedent: 'Maxwell Silver', caseNumber: 'PR-2026-2901', status: 'closed' },
];

export default function ProbateScreen() {
  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Probate Pipeline</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          Minimal probate case linking for the MVP.
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
        {mockCases.map((c) => (
          <Card key={c.id} className="mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-sans font-medium text-root-earth">{c.decedent}</Text>
              <Badge label={c.status} variant={c.status === 'closed' ? 'success' : 'warning'} />
            </View>
            <Text className="text-sm text-warm-stone font-sans mt-1">{c.caseNumber}</Text>
          </Card>
        ))}
        <EmptyState
          title="Probate tools are minimized"
          message="Full estate administration is out of scope for this MVP."
        />
      </ScrollView>
    </SafeAreaView>
  );
}
