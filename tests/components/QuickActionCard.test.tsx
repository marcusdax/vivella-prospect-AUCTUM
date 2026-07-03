import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { QuickActionCard } from '../../src/components/QuickActionCard';

describe('QuickActionCard', () => {
  it('renders title, subtitle, count, and responds to press', () => {
    const onPress = jest.fn();
    render(
      <QuickActionCard
        title="Scanner"
        subtitle="Review flagged properties"
        count={5}
        onPress={onPress}
      />
    );
    expect(screen.getByText('Scanner')).toBeTruthy();
    expect(screen.getByText('Review flagged properties')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    fireEvent.press(screen.getByText('Scanner'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders without count', () => {
    render(<QuickActionCard title="Alerts" subtitle="2 unread" onPress={jest.fn()} />);
    expect(screen.queryByText('2')).toBeNull();
  });
});
