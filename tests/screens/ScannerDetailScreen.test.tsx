import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScannerDetailScreen from '../../app/scanner/[id]';

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: 'scan-prop-001' }),
  useRouter: () => ({ push: mockPush, back: mockBack }),
}));

const mockScannerHitState = {
  data: null as any,
  isLoading: true,
  error: null as Error | null,
};

jest.mock('../../src/hooks/useScannerHit', () => ({
  useScannerHit: () => mockScannerHitState,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockHit = {
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
};

describe('ScannerDetailScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockScannerHitState.data = mockHit;
    mockScannerHitState.isLoading = false;
    mockScannerHitState.error = null;
  });

  it('renders property address and condition score', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ScannerDetailScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('1847 Elm Street')).toBeTruthy();
    expect(screen.getByText('Austin, TX 78701')).toBeTruthy();
    expect(screen.getByText('78')).toBeTruthy();
    expect(screen.getByText('roof')).toBeTruthy();
    expect(screen.getByText('high')).toBeTruthy();
    expect(screen.getByText('Confidence 82%')).toBeTruthy();
  });

  it('links to render and prospector screens', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ScannerDetailScreen />
      </QueryClientProvider>
    );

    fireEvent.press(screen.getByText('Generate renovation render'));
    expect(mockPush).toHaveBeenCalledWith('/render?propertyId=prop-001');

    fireEvent.press(screen.getByText('View as investment prospect'));
    expect(mockPush).toHaveBeenCalledWith('/prospector/prop-001');
  });

  it('shows empty state when hit is not found', () => {
    mockScannerHitState.data = null;
    render(
      <QueryClientProvider client={queryClient}>
        <ScannerDetailScreen />
      </QueryClientProvider>
    );

    expect(screen.getByText('Property not found')).toBeTruthy();
  });
});
