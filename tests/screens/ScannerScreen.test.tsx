import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScannerScreen from '../../app/(tabs)/scanner';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockScannerHitsState = {
  data: [] as any[],
  isLoading: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

jest.mock('../../src/hooks/useScannerHits', () => ({
  useScannerHits: () => mockScannerHitsState,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockHits = [
  {
    id: 'scan-prop-001',
    propertyId: 'prop-001',
    property: {
      id: 'prop-001',
      address: '1847 Elm Street',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      location: { lat: 30.2672, lon: -97.7431 },
    },
    detectedAt: new Date().toISOString(),
    issues: [
      {
        id: 'prop-001-issue-0',
        type: 'roof',
        severity: 'high',
        description: 'Visible granule loss and edge curling detected.',
        confidence: 0.82,
      },
    ],
    overallScore: 78,
  },
];

describe('ScannerScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockScannerHitsState.data = mockHits;
    mockScannerHitsState.isLoading = false;
    mockScannerHitsState.error = null;
  });

  it('renders title, filters, and scanner hits', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ScannerScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('Sentinel Scanner')).toBeTruthy();
    expect(screen.getByText('Roof')).toBeTruthy();
    expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    expect(screen.getByText('Austin, TX · Score 78')).toBeTruthy();
  });

  it('navigates to detail when a hit is pressed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ScannerScreen />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('1847 Elm Street'));
    expect(mockPush).toHaveBeenCalledWith('/scanner/scan-prop-001');
  });

  it('shows empty state when no hits match filters', () => {
    mockScannerHitsState.data = [];
    render(
      <QueryClientProvider client={queryClient}>
        <ScannerScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('No matches')).toBeTruthy();
    expect(screen.getByText('Try removing filters to see more properties.')).toBeTruthy();
  });
});
