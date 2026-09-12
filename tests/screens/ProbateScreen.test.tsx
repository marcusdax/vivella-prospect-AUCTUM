import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ProbateScreen from '../../app/probate';

describe('ProbateScreen', () => {
  it('renders the title and subtitle', () => {
    render(<ProbateScreen />);

    expect(screen.getByText('Probate Pipeline')).toBeTruthy();
    expect(screen.getByText('Minimal probate case linking for the MVP.')).toBeTruthy();
  });

  it('renders the mock probate cases', () => {
    render(<ProbateScreen />);

    expect(screen.getByText('Eleanor Rigby')).toBeTruthy();
    expect(screen.getByText('PR-2026-1847')).toBeTruthy();
    expect(screen.getByText('Maxwell Silver')).toBeTruthy();
    expect(screen.getByText('PR-2026-2901')).toBeTruthy();
  });

  it('renders the minimized probate tools message', () => {
    render(<ProbateScreen />);

    expect(screen.getByText('Probate tools are minimized')).toBeTruthy();
    expect(
      screen.getByText('Full estate administration is out of scope for this MVP.')
    ).toBeTruthy();
  });
});
