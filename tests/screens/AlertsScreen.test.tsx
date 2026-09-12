import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AlertsScreen from '../../app/(tabs)/alerts';
import type { Alert } from '../../src/types';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockAlertsState = {
  alerts: [] as Alert[],
  markRead: jest.fn(),
  clearAll: jest.fn(),
};

jest.mock('../../src/hooks/useAlerts', () => ({
  useAlerts: () => mockAlertsState,
}));

const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'scanner',
    title: 'Roof issue found',
    message: 'Granule loss detected at 1847 Elm Street.',
    targetId: 'scan-prop-001',
    targetScreen: 'scanner',
    createdAt: new Date('2026-07-01T10:00:00Z').toISOString(),
    read: false,
  },
  {
    id: 'alert-2',
    type: 'render',
    title: 'Render completed',
    message: 'Full facade render ready for prop-002.',
    targetId: 'render-job-002',
    targetScreen: 'render',
    createdAt: new Date('2026-07-01T11:00:00Z').toISOString(),
    read: true,
  },
];

describe('AlertsScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockAlertsState.markRead.mockClear();
    mockAlertsState.clearAll.mockClear();
  });

  it('renders the title and unread count', () => {
    mockAlertsState.alerts = mockAlerts;
    render(<AlertsScreen />);

    expect(screen.getByText('Alerts')).toBeTruthy();
    expect(screen.getByText('1 unread')).toBeTruthy();
  });

  it('renders an alert item with badge, message, and timestamp', () => {
    mockAlertsState.alerts = mockAlerts;
    render(<AlertsScreen />);

    expect(screen.getByText('Roof issue found')).toBeTruthy();
    expect(screen.getByText('Granule loss detected at 1847 Elm Street.')).toBeTruthy();
    expect(screen.getByText(/7\/1\/2026/)).toBeTruthy();
    expect(screen.getByText('scanner')).toBeTruthy();
    expect(screen.getByText('completed')).toBeTruthy();
  });

  it('shows the clear button only when alerts exist', () => {
    mockAlertsState.alerts = mockAlerts;
    const { unmount } = render(<AlertsScreen />);

    expect(screen.getByRole('button', { name: 'Clear' })).toBeTruthy();

    mockAlertsState.alerts = [];
    unmount();
    render(<AlertsScreen />);

    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('shows an empty state when there are no alerts', () => {
    mockAlertsState.alerts = [];
    render(<AlertsScreen />);

    expect(screen.getByText('No alerts')).toBeTruthy();
    expect(
      screen.getByText('New scanner hits, renders, and prospect updates will appear here.')
    ).toBeTruthy();
  });

  it('marks an alert as read and navigates to scanner when pressed', async () => {
    mockAlertsState.alerts = mockAlerts;
    render(<AlertsScreen />);

    fireEvent.press(screen.getByText('Roof issue found'));

    await waitFor(() => {
      expect(mockAlertsState.markRead).toHaveBeenCalledWith('alert-1');
    });
    expect(mockPush).toHaveBeenCalledWith('/scanner/scan-prop-001');
  });
});
