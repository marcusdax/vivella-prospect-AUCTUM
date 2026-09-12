import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePortfolio } from '../src/hooks/usePortfolio';
import { Card } from '../src/components/Card';
import { Button } from '../src/components/Button';
import { Badge } from '../src/components/Badge';
import { EmptyState } from '../src/components/EmptyState';

export default function PortfolioScreen() {
  const router = useRouter();
  const { items } = usePortfolio();

  return (
    <SafeAreaView className="flex-1 bg-parchment">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-sans font-medium text-root-earth">Portfolio</Text>
        <Text className="text-sm text-warm-stone font-sans mt-1">
          Properties you are tracking or own.
        </Text>
      </View>

      {items.length === 0 ? (
        <EmptyState
          title="No properties tracked"
          message="Add deals from the Prospector to build your portfolio."
          actionTitle="Find deals"
          onPress={() => router.push('/prospector')}
        />
      ) : (
        <ScrollView className="flex-1 px-4 mt-4" contentContainerClassName="pb-8">
          {items.map((item) => (
            <Card key={item.propertyId} className="mb-3">
              <Text className="text-base font-sans font-medium text-root-earth">
                {item.property?.address}
              </Text>
              <View className="mt-2">
                <Badge label={item.type} variant={item.type === 'owned' ? 'success' : 'info'} />
              </View>
              <Button
                title="View deal"
                onPress={() => router.push(`/prospector/${item.propertyId}`)}
                variant="secondary"
                size="sm"
                className="mt-3"
              />
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
