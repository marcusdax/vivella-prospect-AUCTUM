import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { BeforeAfter } from '../../src/components/BeforeAfter';

describe('BeforeAfter', () => {
  it('starts on before and toggles to after', () => {
    render(<BeforeAfter beforeUrl="https://example.com/before.jpg" afterUrl="https://example.com/after.jpg" />);
    expect(screen.getByLabelText('Before renovation')).toBeTruthy();
    fireEvent.press(screen.getByText('After'));
    expect(screen.getByLabelText('After renovation')).toBeTruthy();
    fireEvent.press(screen.getByText('Before'));
    expect(screen.getByLabelText('Before renovation')).toBeTruthy();
  });

  it('disables after button when no afterUrl', () => {
    render(<BeforeAfter beforeUrl="https://example.com/before.jpg" />);
    const afterButton = screen.getByRole('button', { name: 'After' });
    expect(afterButton.props.accessibilityState.disabled).toBe(true);
  });
});
