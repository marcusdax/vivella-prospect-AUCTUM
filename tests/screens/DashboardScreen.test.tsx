import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardScreen from '../../app/(tabs)/index';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('../../src/hooks/useScannerHits', () => ({
  useScannerHits: () => ({ data: [], isLoading: false, error: null }),
}));

jest.mock('../../src/hooks/useRenderJobs', () => ({
  useRenderJobs: () => ({ data: [], isLoading: false, error: null }),
}));

jest.mock('../../src/hooks/useProspects', () => ({
  useProspects: () => ({ data: [], isLoading: false, error: null }),
}));

jest.mock('../../src/hooks/usePortfolio', () => ({
  usePortfolio: () => ({ items: [] }),
}));

jest.mock('../../src/hooks/useAlerts', () => ({
  useAlerts: () => ({ alerts: [] }),
}));

describe('DashboardScreen', () => {
  it('renders the dashboard title and quick actions', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardScreen />
      </QueryClientProvider>
    );
    expect(screen.getByText('Property Intelligence')).toBeTruthy();
    await waitFor(() => {
      expect(screen.getByText('Sentinel Scanner')).toBeTruthy();
    });
    expect(screen.getByText('Alter Rendering')).toBeTruthy();
    expect(screen.getByText('Real Estate Prospector')).toBeTruthy();
    expect(screen.getByText('Open Settings')).toBeTruthy();
  });
});
