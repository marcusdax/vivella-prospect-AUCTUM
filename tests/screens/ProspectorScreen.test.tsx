import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProspectorScreen from '../../app/(tabs)/prospector';
import type { Prospect } from '../../src/types';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockProspectsState = {
  data: [] as Prospect[],
  isLoading: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

jest.mock('../../src/hooks/useProspects', () => ({
  useProspects: () => mockProspectsState,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockProspects: Prospect[] = [
  {
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
  },
];

describe('ProspectorScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockProspectsState.data = mockProspects;
    mockProspectsState.isLoading = false;
    mockProspectsState.error = null;
  });

  it('renders title, strategy filters, and prospect cards', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProspectorScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('Real Estate Prospector')).toBeTruthy();
    expect(screen.getByText('Fix & Flip')).toBeTruthy();
    expect(screen.getByText('Buy & Hold')).toBeTruthy();
    expect(screen.getByText('Wholesale')).toBeTruthy();
    expect(screen.getByText('1847 Elm Street')).toBeTruthy();
  });

  it('navigates to detail when a prospect is pressed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProspectorScreen />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('1847 Elm Street'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/prospector/[id]',
      params: { id: 'prospect-prop-001' },
    });
  });

  it('shows empty state when no prospects match filters', () => {
    mockProspectsState.data = [];
    render(
      <QueryClientProvider client={queryClient}>
        <ProspectorScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('No prospects')).toBeTruthy();
    expect(screen.getByText('Try a different strategy or relax filters.')).toBeTruthy();
  });
});
