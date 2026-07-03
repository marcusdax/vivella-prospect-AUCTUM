import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('renders title and responds to press', () => {
    const onPress = jest.fn();
    render(<Button title="Tap me" onPress={onPress} />);
    fireEvent.press(screen.getByText('Tap me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not fire when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
