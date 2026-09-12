import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScannerHits } from '../../src/hooks/useScannerHits';
import { ScannerHitItem } from '../../src/components/ScannerHitItem';
import { FilterChip } from '../../src/components/FilterChip';
import type { ScannerHit, GeoPoint, ConditionIssue } from '../../src/types';
import { MapView } from '../../src/components/MapView';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { colors } from '../../src/design-system/colors';
import { useAlertStore } from '../../src/stores/alertStore';

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

  // Geofenced Scanner States
  const [geofenceActive, setGeofenceActive] = useState(false);
  const [geofenceBounds, setGeofenceBounds] = useState<{ northEast: GeoPoint; southWest: GeoPoint } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);
  const addAlert = useAlertStore((s) => s.addAlert);

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

  const handleStartScan = () => {
    if (!geofenceBounds) return;
    setIsScanning(true);
    setScanProgress(0);
    setScanLog(['🌐 Connecting to Google Street View API...', '📍 Geofencing coordinate nodes...']);
  };

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + 10;
        if (next === 30) {
          setScanLog((log) => [...log, '📸 Downloading panoramic frames for geofenced region...', '🤖 Parsing street perspective camera angles...']);
        }
        if (next === 60) {
          setScanLog((log) => [...log, '🧠 Loading Gemini 2.5 Flash VLM model endpoint...', '🔍 Sweeping structures for paint wear, window rot & roof rust...']);
        }
        if (next === 85) {
          setScanLog((log) => [...log, '⚠️ Potential defects identified at 1849 Elm Street & 9204 Maple Ave.', '📊 Evaluating parts-aware segmentation confidence scores...']);
        }
        if (next >= 100) {
          clearInterval(interval);
          handleScanComplete();
          return 100;
        }
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleScanComplete = () => {
    // Reset and refetch
    setTimeout(() => {
      setIsScanning(false);
      setGeofenceActive(false);
      setViewMode('list');
      refetch();
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-sans font-medium text-root-earth">Sentinel Scanner</Text>
          <Text className="text-sm text-root-earth/70 font-sans mt-1">
            Properties flagged by visual condition signals.
          </Text>
        </View>
        {!isScanning && (
          <Button
            title={geofenceActive ? 'Cancel Geofence' : 'Geofence Scan'}
            onPress={() => {
              setGeofenceActive(!geofenceActive);
              if (!geofenceActive) setViewMode('map');
            }}
            variant={geofenceActive ? 'secondary' : 'primary'}
            size="sm"
          />
        )}
      </View>

      <View className="flex-row px-4 mt-4">
        <Button
          title="List"
          onPress={() => setViewMode('list')}
          disabled={geofenceActive}
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

      {!geofenceActive && (
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
      )}

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
        <View className="flex-1 relative mt-4">
          <MapView
            center={{ lat: 30.2672, lon: -97.7431 }}
            markers={markers}
            onMarkerPress={(id) => router.push(`/scanner/${id}`)}
            geofenceActive={geofenceActive}
            onGeofenceSelect={setGeofenceBounds}
          />
          {geofenceActive && !isScanning && (
            <View className="absolute bottom-16 left-4 right-4 bg-parchment p-4 rounded-2xl border border-neural-amber shadow-lg z-20">
              <Text className="text-sm font-sans font-semibold text-root-earth">
                Adjust the geofence by dragging/zooming the map.
              </Text>
              <Text className="text-xs text-warm-stone mt-1 mb-3">
                VLM will automatically retrieve and scan Google Street View images inside the highlighted boundaries.
              </Text>
              <Button
                title="Scan geofenced area"
                onPress={handleStartScan}
              />
            </View>
          )}
        </View>
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
              onPress={() => router.push(`/scanner/${hit.id}`)}
            />
          ))}
        </ScrollView>
      )}

      {/* Geofence VLM Scanner Simulator Modal */}
      {isScanning && (
        <View className="absolute inset-0 bg-deep-bark/85 items-center justify-center p-6 z-50">
          <View className="bg-parchment w-full max-w-md p-6 rounded-3xl border border-neural-amber shadow-xl">
            <Text className="text-lg font-sans font-semibold text-root-earth text-center">
              Google Street View VLM Scan
            </Text>
            <Text className="text-xs text-center text-warm-stone mt-1">
              Analyzing geofenced area: {geofenceBounds?.southWest.lat.toFixed(4)}, {geofenceBounds?.southWest.lon.toFixed(4)} to {geofenceBounds?.northEast.lat.toFixed(4)}, {geofenceBounds?.northEast.lon.toFixed(4)}
            </Text>
            
            {/* Progress bar */}
            <View className="w-full h-2 bg-soft-mist rounded-full overflow-hidden mt-6">
              <View 
                style={{ width: `${scanProgress}%` }}
                className="h-full bg-neural-amber"
              />
            </View>
            <Text className="text-right text-xs font-sans font-bold text-neural-amber mt-1.5">
              {scanProgress}%
            </Text>

            {/* VLM Terminal Output */}
            <View className="bg-deep-bark rounded-xl p-3 h-40 mt-4 border border-warm-stone/20">
              <ScrollView 
                ref={(r) => r?.scrollToEnd({ animated: true })}
                contentContainerStyle={{ paddingBottom: 10 }}
              >
                {scanLog.map((line, idx) => (
                  <Text key={idx} className="text-[11px] font-mono text-flourish-green mb-1.5">
                    {line}
                  </Text>
                ))}
                {scanProgress < 100 && (
                  <ActivityIndicator size="small" color="#7A8B6F" className="self-start mt-2" />
                )}
              </ScrollView>
            </View>
            <Text className="text-[10px] text-center text-warm-stone mt-3 font-sans">
              Scanning powered by Gemini 2.5 Flash
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
