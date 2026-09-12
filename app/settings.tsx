import React from 'react';
import { ScrollView, Text, View, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDemoMode } from '../src/hooks/useDemoMode';
import { Card } from '../src/components/Card';
import { colors } from '../src/design-system/colors';

export default function SettingsScreen() {
  const { useLiveGeo, mapStyle, setUseLiveGeo, setMapStyle } = useDemoMode();

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Settings</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">Demo and display options.</Text>
      </View>

      <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
        <Card className="mb-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-base font-sans font-medium text-root-earth">Use live geo data</Text>
              <Text className="text-xs text-warm-stone font-sans mt-1">
                Load building footprints from Overpass when available.
              </Text>
            </View>
            <Switch
              value={useLiveGeo}
              onValueChange={setUseLiveGeo}
              trackColor={{ false: colors.warmStone, true: colors.neuralAmber }}
              thumbColor={useLiveGeo ? colors.rootEarth : colors.parchment}
            />
          </View>
        </Card>

        <Card className="mb-3">
          <Text className="text-base font-sans font-medium text-root-earth mb-2">Map style</Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setMapStyle('light')}
              className={`flex-1 p-3 rounded-lg items-center ${
                mapStyle === 'light' ? 'bg-neural-amber/20' : 'bg-parchment'
              }`}
            >
              <Text className="text-root-earth font-sans">Light</Text>
            </Pressable>
            <Pressable
              onPress={() => setMapStyle('satellite')}
              className={`flex-1 p-3 rounded-lg items-center ${
                mapStyle === 'satellite' ? 'bg-neural-amber/20' : 'bg-parchment'
              }`}
            >
              <Text className="text-root-earth font-sans">Satellite</Text>
            </Pressable>
          </View>
        </Card>

        <Text className="text-xs text-warm-stone font-sans mt-4 text-center">
          VIVELLA PROSPECT MVP · Built with Expo
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
