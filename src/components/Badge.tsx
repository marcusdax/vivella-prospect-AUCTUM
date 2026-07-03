import React from 'react';
import { View, Text } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeVariant = 'critical' | 'high' | 'moderate' | 'low' | 'success' | 'warning' | 'info';

const backgroundStyles: Record<BadgeVariant, string> = {
  critical: 'bg-dawn-rose/30',
  high: 'bg-dawn-rose/20',
  moderate: 'bg-neural-amber/20',
  low: 'bg-soft-mist',
  success: 'bg-flourish-green/20',
  warning: 'bg-dawn-rose/30',
  info: 'bg-soft-mist',
};

export function Badge({ label, variant = 'info' }: { label: string; variant?: BadgeVariant }) {
  return (
    <View className={cn('px-2 py-1 rounded-full self-start', backgroundStyles[variant])}>
      <Text className="text-xs font-sans font-medium uppercase tracking-wider text-deep-bark">
        {label}
      </Text>
    </View>
  );
}
