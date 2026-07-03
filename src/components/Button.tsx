import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
}: ButtonProps) {
  const base = 'rounded-lg items-center justify-center flex-row';
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-neural-amber',
    secondary: 'bg-soft-mist',
    ghost: 'bg-transparent',
  };
  const textColors: Record<ButtonVariant, string> = {
    primary: 'text-deep-bark',
    secondary: 'text-root-earth',
    ghost: 'text-root-earth',
  };
  const textSizes: Record<ButtonSize, string> = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        (disabled || loading) && 'opacity-50',
        className
      )}
      accessibilityRole="button"
    >
      {loading && <ActivityIndicator size="small" className="mr-2" color="#3D2B1F" />}
      <Text className={cn('font-sans font-medium', textSizes[size], textColors[variant])}>
        {title}
      </Text>
    </Pressable>
  );
}
