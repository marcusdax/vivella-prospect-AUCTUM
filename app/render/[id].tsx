import React from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRenderJob } from '../../src/hooks/useRenderJob';
import { BeforeAfter } from '../../src/components/BeforeAfter';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

export default function RenderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: job, isLoading, error } = useRenderJob(id);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-parchment items-center justify-center">
        <ActivityIndicator size="large" color={colors.rootEarth} />
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView className="flex-1 bg-parchment">
        <EmptyState
          title="Render not found"
          message="We couldn't load this render job."
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
          {job.property.address}
        </Text>
        <Text className="text-base text-root-earth font-sans mt-1 capitalize">
          {job.preset.replace('-', ' ')}
        </Text>
        <View className="mt-2 self-start">
          <Badge
            label={job.status}
            variant={
              job.status === 'completed'
                ? 'success'
                : job.status === 'failed'
                ? 'critical'
                : 'info'
            }
          />
        </View>

        <View className="mt-6">
          <BeforeAfter beforeUrl={job.beforeImageUrl} afterUrl={job.afterImageUrl} />
        </View>

        {job.status === 'completed' && (
          <Button
            title="Share render"
            onPress={() => {}}
            variant="secondary"
            className="mt-6"
          />
        )}
        <Button
          title="View property prospect"
          onPress={() => router.push({ pathname: '/prospector', params: { propertyId: job.propertyId } })}
          variant="ghost"
          className="mt-3"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
