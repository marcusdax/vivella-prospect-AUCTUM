import React from 'react';
import { View, Text } from 'react-native';
import { Button } from './Button';

export function EmptyState({
  title,
  message,
  actionTitle,
  onAction,
}: {
  title: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
}) {
  return (
    <View className="items-center justify-center py-12 px-6">
      <Text className="text-xl font-sans font-medium text-root-earth text-center">{title}</Text>
      <Text className="text-base text-warm-stone font-serif text-center mt-2 leading-relaxed">
        {message}
      </Text>
      {actionTitle && onAction && (
        <Button title={actionTitle} onPress={onAction} variant="secondary" className="mt-6" />
      )}
    </View>
  );
}
