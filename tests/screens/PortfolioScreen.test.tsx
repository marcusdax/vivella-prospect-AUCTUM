import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import PortfolioScreen from '../../app/portfolio';
import type { PortfolioItemWithProperty } from '../../src/hooks/usePortfolio';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockPortfolioState = {
  items: [] as PortfolioItemWithProperty[],
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateNotes: jest.fn(),
};

jest.mock('../../src/hooks/usePortfolio', () => ({
  usePortfolio: () => mockPortfolioState,
}));

const mockItems: PortfolioItemWithProperty[] = [
  {
    propertyId: 'prop-001',
    type: 'owned',
    property: {
      id: 'prop-001',
      address: '1847 Elm Street',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      location: { lat: 30.2672, lon: -97.7431 },
    },
  },
];

describe('PortfolioScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the title and subtitle', () => {
    mockPortfolioState.items = mockItems;
    render(<PortfolioScreen />);

    expect(screen.getByText('Portfolio')).toBeTruthy();
    expect(screen.getByText('Properties you are tracking or own.')).toBeTruthy();
  });

  it('shows an empty state with a find deals action when there are no items', () => {
    mockPortfolioState.items = [];
    render(<PortfolioScreen />);

    expect(screen.getByText('No properties tracked')).toBeTruthy();
    expect(screen.getByText('Add deals from the Prospector to build your portfolio.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Find deals' })).toBeTruthy();
  });

  it('renders property cards with badges and view deal buttons', () => {
    mockPortfolioState.items = mockItems;
    render(<PortfolioScreen />);

    expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    expect(screen.getByText('owned')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'View deal' })).toBeTruthy();
  });

  it('navigates to the prospect detail when View deal is pressed', () => {
    mockPortfolioState.items = mockItems;
    render(<PortfolioScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'View deal' }));
    expect(mockPush).toHaveBeenCalledWith('/prospector/prop-001');
  });
});
