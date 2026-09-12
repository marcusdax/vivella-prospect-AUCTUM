import React, { useState } from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { Button } from './Button';

export function BeforeAfter({
  beforeUrl,
  afterUrl,
}: {
  beforeUrl: string;
  afterUrl?: string;
}) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <View className="rounded-2xl overflow-hidden bg-soft-mist">
      <Image
        source={{ uri: showAfter && afterUrl ? afterUrl : beforeUrl }}
        className="w-full h-64"
        resizeMode="cover"
        accessibilityLabel={showAfter ? 'After renovation' : 'Before renovation'}
      />
      <View className="flex-row p-2 gap-2">
        <Button
          title="Before"
          onPress={() => setShowAfter(false)}
          variant={!showAfter ? 'primary' : 'secondary'}
          size="sm"
          className="flex-1"
        />
        <Button
          title="After"
          onPress={() => setShowAfter(true)}
          variant={showAfter ? 'primary' : 'secondary'}
          size="sm"
          className="flex-1"
          disabled={!afterUrl}
        />
      </View>
      {afterUrl && (
        <Text className="text-center text-xs text-warm-stone font-sans pb-3">
          Tap labels to compare
        </Text>
      )}
    </View>
  );
}
