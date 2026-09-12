import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRenderJobs } from '../../src/hooks/useRenderJobs';
import { createRenderJob } from '../../src/services/renderer/mockRendererAdapter';
import { RenderCard } from '../../src/components/RenderCard';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { Card } from '../../src/components/Card';
import { useAlertStore } from '../../src/stores/alertStore';
import { colors } from '../../src/design-system/colors';
import type { RenderJob, RenderPreset } from '../../src/types';
import { mockProperties } from '../../src/services/properties/mockProperties';

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
  const [targetPropId, setTargetPropId] = useState<string>('prop-001');

  const handleCreate = async () => {
    setCreating(true);
    try {
      const job = await createRenderJob(targetPropId, selectedPreset);

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
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        <View className="px-4 pt-4">
          <Text className="text-2xl font-sans font-medium text-root-earth">Alter Rendering</Text>
          <Text className="text-sm text-root-earth/70 font-sans mt-1">
            Generate photorealistic before/after renovation visuals.
          </Text>
        </View>

        {/* Renovation visualizer workspace panel */}
        <Card className="m-4 border border-neural-amber/20 bg-soft-mist/40">
          <Text className="text-base font-sans font-semibold text-root-earth mb-3">
            Renovation Visualizer Canvas
          </Text>
          
          {/* Target property selector */}
          <Text className="text-xs uppercase tracking-wider text-warm-stone font-sans mb-1">
            Target Property
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {mockProperties.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setTargetPropId(p.id)}
                className={`px-3 py-2 rounded-lg border ${
                  targetPropId === p.id 
                    ? 'bg-neural-amber/15 border-neural-amber' 
                    : 'bg-parchment border-warm-stone/20'
                }`}
              >
                <Text className="text-xs font-sans font-medium text-root-earth">
                  {p.address.split(',')[0]}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Preset list selection */}
          <Text className="text-xs uppercase tracking-wider text-warm-stone font-sans mb-2">
            Preset Intervention
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {presets.map((p) => (
              <Pressable
                key={p.key}
                onPress={() => setSelectedPreset(p.key)}
                className={`px-3 py-1.5 rounded-full ${
                  selectedPreset === p.key 
                    ? 'bg-root-earth text-white' 
                    : 'bg-parchment'
                }`}
              >
                <Text className={`text-xs font-sans font-medium ${
                  selectedPreset === p.key ? 'text-white' : 'text-root-earth'
                }`}>
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Button
            title={creating ? 'Queueing Render...' : 'Generate Renovation Render'}
            onPress={handleCreate}
            loading={creating}
          />
        </Card>

        {/* Existing renders gallery */}
        <View className="px-4 mt-4">
          <Text className="text-lg font-sans font-semibold text-root-earth mb-3">
            Renders Gallery
          </Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.rootEarth} className="mt-12" />
        ) : jobs?.length === 0 ? (
          <EmptyState
            title="No renders yet"
            message="Apply a preset to generate a mockup."
          />
        ) : (
          <View className="px-4">
            {jobs?.map((job: RenderJob) => (
              <RenderCard
                key={job.id}
                job={job}
                onPress={() => router.push({ pathname: '/render/[id]', params: { id: job.id } })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}