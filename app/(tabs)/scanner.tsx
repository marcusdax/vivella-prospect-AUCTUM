import React, { useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScannerHits } from '../../src/hooks/useScannerHits';
import { ScannerHitItem } from '../../src/components/ScannerHitItem';
import { FilterChip } from '../../src/components/FilterChip';
import type { ScannerHit } from '../../src/types';
import { MapView } from '../../src/components/MapView';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';

const issueTypes = [
  { key: 'roof', label: 'Roof' },
  { key: 'paint', label: 'Paint' },
  { key: 'windows', label: 'Windows' },
  { key: 'structural', label: 'Structural' },
  { key: 'landscaping', label: 'Landscaping' },
];

export default function ScannerScreen() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const { data, isLoading, error, refetch } = useScannerHits({
    issueTypes: selectedTypes.length ? selectedTypes : undefined,
  });

  const toggleType = (key: string) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const markers = data?.map((hit: ScannerHit) => ({
    id: hit.id,
    coordinate: hit.property.location,
    title: hit.property.address,
    color: hit.overallScore >= 75 ? '#E8B4B4' : '#D4A24A',
  }));

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Sentinel Scanner</Text>
        <Text className="text-sm text-root-earth font-sans mt-1">
          Properties flagged by visual condition signals.
        </Text>
      </View>

      <View className="flex-row px-4 mt-4">
        <Button
          title="List"
          onPress={() => setViewMode('list')}
          variant={viewMode === 'list' ? 'primary' : 'secondary'}
          size="sm"
          className="mr-2"
        />
        <Button
          title="Map"
          onPress={() => setViewMode('map')}
          variant={viewMode === 'map' ? 'primary' : 'secondary'}
          size="sm"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4 px-4"
        contentContainerClassName="pb-2"
      >
        {issueTypes.map((type) => (
          <FilterChip
            key={type.key}
            label={type.label}
            active={selectedTypes.includes(type.key)}
            onPress={() => toggleType(type.key)}
          />
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.rootEarth} className="mt-12" />
      ) : error ? (
        <EmptyState
          title="Could not load scanner"
          message={error.message}
          actionTitle="Retry"
          onAction={() => refetch()}
        />
      ) : viewMode === 'map' ? (
        <MapView
          center={{ lat: 30.2672, lon: -97.7431 }}
          markers={markers}
          onMarkerPress={(id) => router.push({ pathname: '/scanner/[id]', params: { id } })}
        />
      ) : data?.length === 0 ? (
        <EmptyState
          title="No matches"
          message="Try removing filters to see more properties."
          actionTitle="Clear filters"
          onAction={() => setSelectedTypes([])}
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-2" contentContainerClassName="pb-8">
          {data?.map((hit: ScannerHit) => (
            <ScannerHitItem
              key={hit.id}
              hit={hit}
              onPress={() => router.push({ pathname: '/scanner/[id]', params: { id: hit.id } })}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
