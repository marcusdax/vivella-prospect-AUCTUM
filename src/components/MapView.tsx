import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, ActivityIndicator, Pressable } from 'react-native';
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
  geofenceActive?: boolean;
  onGeofenceSelect?: (bounds: { northEast: GeoPoint; southWest: GeoPoint }) => void;
}

export function MapView({
  center,
  zoom = 13,
  markers,
  onMarkerPress,
  geofenceActive,
  onGeofenceSelect,
}: MapViewProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const geofenceLayerRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapId] = useState(() => `map-${Math.random().toString(36).substr(2, 9)}`);

  // Load Leaflet resources dynamically on Web
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Check if Leaflet is already loaded
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Append CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Append JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Clean up tags if needed (optional, keeping loaded is fine for spa)
    };
  }, []);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (Platform.OS !== 'web' || !leafletLoaded || !containerRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Destroy existing map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Create map
    const map = L.map(mapId).setView([center.lat, center.lon], zoom);
    mapRef.current = map;

    // Add Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add Markers
    markers?.forEach((marker) => {
      const pinColor = marker.color || '#D4A24A';
      
      // Custom SVG Marker Icon matching VIVELLA theme
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: ${pinColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid #F5F0EB; box-shadow: 0 0 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const leafletMarker = L.marker([marker.coordinate.lat, marker.coordinate.lon], { icon: customIcon })
        .addTo(map);

      if (marker.title) {
        leafletMarker.bindPopup(`<b style="font-family: system-ui; color: #3D2B1F;">${marker.title}</b>`);
      }

      leafletMarker.on('click', () => {
        if (onMarkerPress) {
          onMarkerPress(marker.id);
        }
      });
    });

    // Handle initial Geofence bounding box overlay
    if (geofenceActive) {
      // Calculate a small geofenced rectangle centered around map center
      const offset = 0.008;
      const bounds = [
        [center.lat - offset, center.lon - offset],
        [center.lat + offset, center.lon + offset]
      ];
      
      const geofenceRect = L.rectangle(bounds, {
        color: '#D4A24A',
        weight: 2,
        fillColor: '#D4A24A',
        fillOpacity: 0.15,
        dashArray: '5, 5'
      }).addTo(map);

      geofenceLayerRef.current = geofenceRect;

      // Report initial geofence bounds
      if (onGeofenceSelect) {
        onGeofenceSelect({
          northEast: { lat: center.lat + offset, lon: center.lon + offset },
          southWest: { lat: center.lat - offset, lon: center.lon - offset }
        });
      }

      // Update geofence bounds on map move/drag
      map.on('moveend', () => {
        const currentCenter = map.getCenter();
        const newBounds = [
          [currentCenter.lat - offset, currentCenter.lng - offset],
          [currentCenter.lat + offset, currentCenter.lng + offset]
        ];
        
        geofenceRect.setBounds(newBounds);

        if (onGeofenceSelect) {
          onGeofenceSelect({
            northEast: { lat: currentCenter.lat + offset, lon: currentCenter.lng + offset },
            southWest: { lat: currentCenter.lat - offset, lon: currentCenter.lng - offset }
          });
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, center.lat, center.lon, markers, geofenceActive]);

  if (Platform.OS === 'web') {
    return (
      <View className="flex-1 bg-soft-mist relative">
        {!leafletLoaded && (
          <View className="absolute inset-0 items-center justify-center bg-soft-mist/50 z-10">
            <ActivityIndicator size="large" color="#3D2B1F" />
            <Text className="text-root-earth font-sans mt-2">Loading Map API...</Text>
          </View>
        )}
        <div 
          id={mapId} 
          ref={containerRef} 
          style={{ width: '100%', height: '100%' }}
        />
        {geofenceActive && (
          <View className="absolute bottom-4 left-4 right-4 bg-parchment/95 p-3 rounded-xl border border-neural-amber/30 shadow-md z-10">
            <Text className="text-xs font-sans font-medium text-root-earth text-center">
              📍 Bounding box geofence active. Drag map to adjust scanned area.
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Native Platform Mock Fallback
  return (
    <View className="flex-1 bg-soft-mist items-center justify-center p-6">
      <Text className="text-root-earth font-sans text-center font-medium">MapLibre GL Map (Native)</Text>
      <Text className="text-root-earth font-sans text-center mt-2 text-xs text-warm-stone">
        {markers?.length ?? 0} active markers rendered
      </Text>
      {geofenceActive && (
        <View className="mt-4 p-3 bg-parchment rounded-xl border border-neural-amber/25">
          <Text className="text-xs text-neural-amber font-sans font-medium">Mock Geofence active around center</Text>
        </View>
      )}
    </View>
  );
}
