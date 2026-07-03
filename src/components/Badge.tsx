import React from 'react';
import { View, Text } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeVariant = 'critical' | 'high' | 'moderate' | 'low' | 'success' | 'warning' | 'info';

const variantStyles: Record<BadgeVariant, string> = {
  critical: 'bg-dawn-rose/30 text-deep-bark',
  high: 'bg-dawn-rose/20 text-deep-bark',
  moderate: 'bg-neural-amber/20 text-deep-bark',
  low: 'bg-soft-mist text-deep-bark',
  success: 'bg-flourish-green/20 text-deep-bark',
  warning: 'bg-dawn-rose/30 text-deep-bark',
  info: 'bg-soft-mist text-deep-bark',
};

export function Badge({ label, variant = 'info' }: { label: string; variant?: BadgeVariant }) {
  return (
    <View className={cn('px-2 py-1 rounded-full self-start', variantStyles[variant])}>
      <Text className="text-xs font-sans font-medium uppercase tracking-wider">{label}</Text>
    </View>
  );
}
