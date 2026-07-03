import React from 'react';
import { View } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View
      className={cn(
        'bg-soft-mist rounded-2xl p-4 shadow-sm border border-warm-stone/20',
        className
      )}
    >
      {children}
    </View>
  );
}
