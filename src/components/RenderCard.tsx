import React from 'react';
import { Pressable, Text, View, Image } from 'react-native';
import { Badge } from './Badge';
import type { RenderJob } from '../types';

export function RenderCard({ job, onPress }: { job: RenderJob; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-soft-mist rounded-2xl overflow-hidden mb-4 active:opacity-80"
      accessibilityRole="button"
    >
      <Image
        source={{ uri: job.beforeImageUrl }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-base font-sans font-medium text-root-earth">
          {job.property.address}
        </Text>
        <Text className="text-sm text-root-earth font-sans mt-1 capitalize">
          {job.preset.replace('-', ' ')}
        </Text>
        <View className="mt-2">
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
      </View>
    </Pressable>
  );
}
