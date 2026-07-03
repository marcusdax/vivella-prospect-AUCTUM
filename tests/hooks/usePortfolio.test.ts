import { renderHook, act } from '@testing-library/react-native';
import { usePortfolio } from '../../src/hooks/usePortfolio';

describe('usePortfolio', () => {
  it('adds and removes a portfolio item', () => {
    const { result } = renderHook(() => usePortfolio());

    act(() => {
      result.current.addItem('prop-001', 'watchlist');
    });
    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem('prop-001');
    });
    expect(result.current.items).toHaveLength(0);
  });
});
