import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { RenderCard } from '../../src/components/RenderCard';
import type { RenderJob } from '../../src/types';

const job: RenderJob = {
  id: 'render-1',
  propertyId: 'prop-001',
  property: {
    id: 'prop-001',
    address: '1847 Elm Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    location: { lat: 30, lon: -97 },
  },
  preset: 'paint',
  status: 'completed',
  beforeImageUrl: 'https://example.com/before.jpg',
  afterImageUrl: 'https://example.com/after.jpg',
  createdAt: new Date().toISOString(),
};

describe('RenderCard', () => {
  it('renders job info and responds to press', () => {
    const onPress = jest.fn();
    render(<RenderCard job={job} onPress={onPress} />);
    expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    expect(screen.getByText('paint')).toBeTruthy();
    fireEvent.press(screen.getByText('1847 Elm Street'));
    expect(onPress).toHaveBeenCalled();
  });
});
