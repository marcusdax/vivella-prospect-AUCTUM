import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ProspectCard } from '../../src/components/ProspectCard';
import type { Prospect } from '../../src/types';

const prospect: Prospect = {
  id: 'prospect-prop-001',
  propertyId: 'prop-001',
  property: {
    id: 'prop-001',
    address: '1847 Elm Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    location: { lat: 30.2672, lon: -97.7431 },
  },
  strategy: 'fix-and-flip',
  estimatedArv: 540000,
  estimatedRehabCost: 75000,
  estimatedEquity: 65000,
  cashOnCashReturn: 87,
  monthlyCashFlow: 4050,
  score: 92,
};

describe('ProspectCard', () => {
  it('renders address, strategy, score, and key metrics', () => {
    render(<ProspectCard prospect={prospect} onPress={jest.fn()} />);

    expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    expect(screen.getByText('Austin, TX')).toBeTruthy();
    expect(screen.getByText('fix and flip')).toBeTruthy();
    expect(screen.getByText('Score 92')).toBeTruthy();
    expect(screen.getByText('$540k')).toBeTruthy();
    expect(screen.getByText('$75k')).toBeTruthy();
    expect(screen.getByText('$65k')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<ProspectCard prospect={prospect} onPress={onPress} />);

    fireEvent.press(screen.getByText('1847 Elm Street'));
    expect(onPress).toHaveBeenCalled();
  });
});
