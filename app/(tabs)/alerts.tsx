import React from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAlerts } from '../../src/hooks/useAlerts';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';
import { EmptyState } from '../../src/components/EmptyState';
import type { Alert } from '../../src/types';

function AlertItem({ alert, onPress }: { alert: Alert; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-soft-mist rounded-2xl p-4 mb-3 ${!alert.read ? 'border-l-4 border-neural-amber' : ''}`}
      accessibilityRole="button"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-sans font-medium text-root-earth">{alert.title}</Text>
        <Badge
          label={alert.type}
          variant={alert.type === 'scanner' ? 'warning' : alert.type === 'render' ? 'success' : 'info'}
        />
      </View>
      <Text className="text-sm text-warm-stone font-sans mt-1">{alert.message}</Text>
      <Text className="text-xs text-warm-stone font-sans mt-2">
        {new Date(alert.createdAt).toLocaleString()}
      </Text>
    </Pressable>
  );
}

export default function AlertsScreen() {
  const router = useRouter();
  const { alerts, markRead, clearAll } = useAlerts();

  const handlePress = (alert: Alert) => {
    markRead(alert.id);
    if (alert.targetScreen === 'scanner') router.push(`/scanner/${alert.targetId}`);
    if (alert.targetScreen === 'render') router.push(`/render/${alert.targetId}`);
    if (alert.targetScreen === 'prospector') router.push(`/prospector/${alert.targetId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-sans font-medium text-root-earth">Alerts</Text>
          <Text className="text-sm text-warm-stone font-sans mt-1">
            {alerts.filter((a) => !a.read).length} unread
          </Text>
        </View>
        {alerts.length > 0 && (
          <Button title="Clear" onPress={clearAll} variant="ghost" size="sm" />
        )}
      </View>

      {alerts.length === 0 ? (
        <EmptyState
          title="No alerts"
          message="New scanner hits, renders, and prospect updates will appear here."
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
          {alerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} onPress={() => handlePress(alert)} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
