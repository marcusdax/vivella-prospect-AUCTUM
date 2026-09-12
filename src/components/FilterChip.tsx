import React from 'react';
import { Pressable, Text } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'px-4 py-2 rounded-full border mr-2 mb-2',
        active
          ? 'bg-neural-amber border-neural-amber'
          : 'bg-parchment border-warm-stone/40'
      )}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        className={cn(
          'text-sm font-sans font-medium',
          active ? 'text-root-earth' : 'text-warm-stone'
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}