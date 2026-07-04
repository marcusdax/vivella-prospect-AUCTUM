import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator, TextInput, Image, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRenderJobs } from '../../src/hooks/useRenderJobs';
import { createRenderJob } from '../../src/services/renderer/mockRendererAdapter';
import { RenderCard } from '../../src/components/RenderCard';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterChip } from '../../src/components/FilterChip';
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
  
  // Custom Render states
  const [creating, setCreating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<RenderPreset>('paint');
  const [targetPropId, setTargetPropId] = useState<string>('prop-001');
  const [upgradesText, setUpgradesText] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: any) => {
    if (Platform.OS === 'web') {
      const file = event.target.files?.[0];
      if (file) {
        const localUrl = URL.createObjectURL(file);
        setUploadedImage(localUrl);
      }
    } else {
      // Mock upload for native
      setUploadedImage('https://placehold.co/600x400/5C3D2E/F5F0EB?text=Mock+Upload');
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const activePropId = targetPropId === 'custom' ? 'custom' : targetPropId;
      const job = await createRenderJob(
        activePropId, 
        selectedPreset, 
        uploadedImage || undefined, 
        upgradesText || undefined
      );

      addAlert({
        type: 'render',
        title: 'Render queued',
        message: `${job.property.address} — ${upgradesText ? upgradesText.substring(0, 20) + '...' : selectedPreset}`,
        targetId: job.id,
        targetScreen: 'render',
      });
      
      // Clear inputs
      setUpgradesText('');
      setUploadedImage(null);
      
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
                onPress={() => {
                  setTargetPropId(p.id);
                  setUploadedImage(null);
                }}
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
            <Pressable
              onPress={() => setTargetPropId('custom')}
              className={`px-3 py-2 rounded-lg border ${
                targetPropId === 'custom' 
                  ? 'bg-neural-amber/15 border-neural-amber' 
                  : 'bg-parchment border-warm-stone/20'
              }`}
            >
              <Text className="text-xs font-sans font-medium text-root-earth">
                📁 Upload Custom Photo
              </Text>
            </Pressable>
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

          {/* Custom Image upload dropzone */}
          {targetPropId === 'custom' && (
            <View className="mb-4">
              <Text className="text-xs uppercase tracking-wider text-warm-stone font-sans mb-1.5">
                Upload Before Image
              </Text>
              {uploadedImage ? (
                <View className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-100">
                  <Image source={{ uri: uploadedImage }} className="w-full h-full object-cover" />
                  <Pressable 
                    onPress={() => setUploadedImage(null)}
                    className="absolute top-2 right-2 bg-deep-bark/80 rounded-full px-2 py-1"
                  >
                    <Text className="text-white text-[10px] font-sans">Clear</Text>
                  </Pressable>
                </View>
              ) : (
                <View className="border border-dashed border-warm-stone/40 bg-parchment rounded-xl h-32 items-center justify-center p-4">
                  {Platform.OS === 'web' ? (
                    <label className="cursor-pointer items-center justify-center flex flex-col w-full h-full">
                      <span className="text-sm font-sans font-medium text-root-earth">
                        Click to select photo
                      </span>
                      <span className="text-[10px] text-warm-stone mt-1">
                        PNG, JPG up to 10MB
                      </span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  ) : (
                    <Pressable onPress={handleImageUpload} className="items-center">
                      <Text className="text-sm font-sans font-medium text-root-earth">Select Image</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Upgrades Multiline Textbox */}
          <Text className="text-xs uppercase tracking-wider text-warm-stone font-sans mb-1.5">
            Custom Renovation Upgrades
          </Text>
          <TextInput
            value={upgradesText}
            onChangeText={setUpgradesText}
            placeholder="e.g. Change siding to slate gray, add warm oak porch accents, replace shingles..."
            placeholderTextColor={colors.warmStone}
            multiline
            numberOfLines={3}
            className="w-full bg-parchment rounded-xl p-3 text-sm text-root-earth font-sans border border-warm-stone/20 mb-4 h-20"
          />

          <Button
            title={creating ? 'Queueing Render...' : 'Generate Renovation Render'}
            onPress={handleCreate}
            loading={creating}
            disabled={targetPropId === 'custom' && !uploadedImage}
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
            message="Apply a preset or customize an image upload to generate a mockup."
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
