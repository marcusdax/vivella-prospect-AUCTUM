import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProspectDetailScreen from '../../app/prospector/[id]';
import type { Prospect } from '../../src/types';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'prospect-prop-001' }),
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

const mockProspectState = {
  data: null as Prospect | null,
  isLoading: false,
  error: null as Error | null,
};

jest.mock('../../src/hooks/useProspect', () => ({
  useProspect: () => mockProspectState,
}));

const mockPortfolioState = {
  items: [] as { propertyId: string; type: string }[],
  addItem: jest.fn(),
};

jest.mock('../../src/hooks/usePortfolio', () => ({
  usePortfolio: () => mockPortfolioState,
}));

const mockAddAlert = jest.fn();

jest.mock('../../src/stores/alertStore', () => ({
  useAlertStore: (selector: (s: { addAlert: typeof mockAddAlert }) => typeof mockAddAlert) =>
    selector({ addAlert: mockAddAlert }),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockProspect: Prospect = {
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

describe('ProspectDetailScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockPortfolioState.addItem.mockClear();
    mockPortfolioState.items = [];
    mockAddAlert.mockClear();
    mockProspectState.data = mockProspect;
    mockProspectState.isLoading = false;
    mockProspectState.error = null;
  });

  it('renders property address, metrics, and track buttons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProspectDetailScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    expect(screen.getByText('Austin, TX')).toBeTruthy();
    expect(screen.getByText('fix and flip')).toBeTruthy();
    expect(screen.getByText('Score 92')).toBeTruthy();
    expect(screen.getByText('$540,000')).toBeTruthy();
    expect(screen.getByText('Watchlist')).toBeTruthy();
    expect(screen.getByText('Mark owned')).toBeTruthy();
  });

  it('adds to watchlist and creates an alert', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProspectDetailScreen />
      </QueryClientProvider>
    );

    fireEvent.press(screen.getByText('Watchlist'));

    await waitFor(() => {
      expect(mockPortfolioState.addItem).toHaveBeenCalledWith('prop-001', 'watchlist');
    });

    expect(mockAddAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'prospect',
        title: 'Added to watchlist',
        targetId: 'prop-001',
        targetScreen: 'prospector',
      })
    );
  });

  it('adds to owned portfolio and creates an alert', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProspectDetailScreen />
      </QueryClientProvider>
    );

    fireEvent.press(screen.getByText('Mark owned'));

    await waitFor(() => {
      expect(mockPortfolioState.addItem).toHaveBeenCalledWith('prop-001', 'owned');
    });

    expect(mockAddAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'prospect',
        title: 'Added to portfolio',
        targetId: 'prop-001',
        targetScreen: 'prospector',
      })
    );
  });

  it('shows tracked state when property is already in portfolio', () => {
    mockPortfolioState.items = [{ propertyId: 'prop-001', type: 'watchlist' }];

    render(
      <QueryClientProvider client={queryClient}>
        <ProspectDetailScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('Tracked in portfolio')).toBeTruthy();
  });

  it('shows empty state when prospect is not found', () => {
    mockProspectState.data = null;
    render(
      <QueryClientProvider client={queryClient}>
        <ProspectDetailScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('Prospect not found')).toBeTruthy();
  });
});
