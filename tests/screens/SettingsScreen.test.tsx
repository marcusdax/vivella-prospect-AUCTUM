import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../../app/settings';

const mockSetUseLiveGeo = jest.fn();
const mockSetMapStyle = jest.fn();

const mockUseDemoMode = {
  useLiveGeo: false,
  mapStyle: 'light',
  setUseLiveGeo: mockSetUseLiveGeo,
  setMapStyle: mockSetMapStyle,
};

jest.mock('../../src/hooks/useDemoMode', () => ({
  useDemoMode: () => mockUseDemoMode,
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    mockSetUseLiveGeo.mockClear();
    mockSetMapStyle.mockClear();
  });

  it('renders the title and subtitle', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Demo and display options.')).toBeTruthy();
  });

  it('renders the live geo switch with the current value', () => {
    render(<SettingsScreen />);

    const switchElement = screen.getByRole('switch');
    expect(switchElement.props.value).toBe(false);
  });

  it('calls setUseLiveGeo when the switch is toggled', () => {
    render(<SettingsScreen />);

    const switchElement = screen.getByRole('switch');
    fireEvent(switchElement, 'valueChange', true);

    expect(mockSetUseLiveGeo).toHaveBeenCalledWith(true);
  });

  it('calls setMapStyle when a map style button is pressed', () => {
    render(<SettingsScreen />);

    fireEvent.press(screen.getByText('Satellite'));
    expect(mockSetMapStyle).toHaveBeenCalledWith('satellite');
  });
});
