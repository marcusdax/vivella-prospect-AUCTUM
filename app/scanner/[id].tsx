import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScannerHit } from '../../src/hooks/useScannerHit';
import type { ConditionIssue } from '../../src/types';
import { Card } from '../../src/components/Card';
import { Badge } from '../../src/components/Badge';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

export default function ScannerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: hit, isLoading, error } = useScannerHit(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-parchment items-center justify-center">
        <ActivityIndicator size="large" color={colors.rootEarth} />
      </SafeAreaView>
    );
  }

  if (error || !hit) {
    return (
      <SafeAreaView className="flex-1 bg-parchment">
        <EmptyState
          title="Property not found"
          message="We couldn't load this scanner hit."
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
          {hit.property.address}
        </Text>
        <Text className="text-base text-root-earth font-sans mt-1">
          {hit.property.city}, {hit.property.state} {hit.property.zip}
        </Text>

        <Card className="mt-6">
          <Text className="text-sm uppercase tracking-wider text-root-earth font-sans">
            Condition score
          </Text>
          <Text className="text-4xl font-sans font-semibold text-root-earth mt-1">
            {hit.overallScore}
          </Text>
        </Card>

        <Text className="text-xl font-sans font-medium text-root-earth mt-6 mb-3">
          Detected issues
        </Text>
        {hit.issues.map((issue: ConditionIssue) => (
          <Card key={issue.id} className="mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-sans font-medium text-root-earth capitalize">
                {issue.type}
              </Text>
              <Badge label={issue.severity} variant={issue.severity} />
            </View>
            <Text className="text-sm text-root-earth font-sans mt-2">{issue.description}</Text>
            <Text className="text-xs text-root-earth font-sans mt-2">
              Confidence {(issue.confidence * 100).toFixed(0)}%
            </Text>
          </Card>
        ))}

        <Button
          title="Generate renovation render"
          onPress={() => router.push(`/render?propertyId=${hit.propertyId}`)}
          className="mt-4"
        />
        <Button
          title="View as investment prospect"
          onPress={() => router.push(`/prospector/${hit.propertyId}`)}
          variant="secondary"
          className="mt-3"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
