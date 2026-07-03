import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRenderJobs } from '../../src/hooks/useRenderJobs';
import { createRenderJob } from '../../src/services/renderer/mockRendererAdapter';
import { RenderCard } from '../../src/components/RenderCard';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChip } from '../../src/components/FilterChip';
import { useAlertStore } from '../../src/stores/alertStore';
import { colors } from '../../src/design-system/colors';
import type { RenderJob, RenderPreset } from '../../src/types';

const presets: { key: RenderPreset; label: string }[] = [
  { key: 'paint', label: 'Paint' },
  { key: 'roof', label: 'Roof' },
  { key: 'windows', label: 'Windows' },
  { key: 'landscaping', label: 'Landscaping' },
  { key: 'full-facade', label: 'Full Facade' },
];

export default function RenderScreen() {
  const router = useRouter();
  const { data: jobs, isLoading, refetch } = useRenderJobs();
  const addAlert = useAlertStore((s) => s.addAlert);
  const [creating, setCreating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<RenderPreset>('paint');

  const handleCreate = async () => {
    setCreating(true);
    try {
      const job = await createRenderJob('prop-001', selectedPreset);
      addAlert({
        type: 'render',
        title: 'Render queued',
        message: `${job.property.address} — ${selectedPreset}`,
        targetId: job.id,
        targetScreen: 'render',
      });
      refetch();
      router.push({ pathname: '/render/[id]', params: { id: job.id } });
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Alter Rendering</Text>
        <Text className="text-sm text-root-earth font-sans mt-1">
          Generate photorealistic before/after renovation visuals.
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        contentContainerClassName="pb-2"
      >
        {presets.map((preset) => (
          <FilterChip
            key={preset.key}
            label={preset.label}
            active={selectedPreset === preset.key}
            onPress={() => setSelectedPreset(preset.key)}
          />
        ))}
      </ScrollView>

      <View className="px-4 mt-2">
        <Button
          title={creating ? 'Queueing...' : 'Create demo render'}
          onPress={handleCreate}
          loading={creating}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.rootEarth} className="mt-12" />
      ) : jobs?.length === 0 ? (
        <EmptyState
          title="No renders yet"
          message="Create your first renovation visualization to see it here."
          actionTitle="Create render"
          onAction={handleCreate}
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
          {jobs?.map((job: RenderJob) => (
            <RenderCard
              key={job.id}
              job={job}
              onPress={() => router.push({ pathname: '/render/[id]', params: { id: job.id } })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
