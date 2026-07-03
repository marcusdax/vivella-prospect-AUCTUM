import React from 'react';
import { View, Text } from 'react-native';
import { Platform } from 'react-native';
import type { GeoPoint } from '../types';

export interface MapMarkerData {
  id: string;
  coordinate: GeoPoint;
  color?: string;
  title?: string;
}

export interface MapViewProps {
  center: GeoPoint;
  zoom?: number;
  markers?: MapMarkerData[];
  onMarkerPress?: (id: string) => void;
}

export function MapView({ center, markers, onMarkerPress }: MapViewProps) {
  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 bg-soft-mist items-center justify-center p-6">
        <Text className="text-root-earth font-sans text-center">
          Map placeholder: center {center.lat.toFixed(4)}, {center.lon.toFixed(4)}
        </Text>
        <Text className="text-root-earth font-sans text-center mt-2">
          {markers?.length ?? 0} markers
        </Text>
        {markers?.map((m) => (
          <Text
            key={m.id}
            className="text-neural-amber font-sans text-sm mt-1"
            onPress={() => onMarkerPress?.(m.id)}
          >
            {m.title ?? m.id}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-soft-mist items-center justify-center p-6">
      <Text className="text-root-earth font-sans text-center">MapLibre map placeholder</Text>
      <Text className="text-root-earth font-sans text-center mt-2">
        {markers?.length ?? 0} markers
      </Text>
    </View>
  );
}
