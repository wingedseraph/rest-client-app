import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

import { act, renderHook, waitFor } from '@testing-library/react';

describe('useLocalStorage', () => {
  const key = 'test-key';

  beforeEach(() => {
    globalThis.localStorage.clear();
    vi.restoreAllMocks();
  });

  test('should initialize with initial value', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  test('should read value from localStorage', () => {
    globalThis.localStorage.setItem(key, JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));
    act(() => {});
    expect(result.current[0]).toBe('stored-value');
  });

  test('should update localStorage when state changes', () => {
    const { result } = renderHook(() => useLocalStorage(key, 'initial'));
    act(() => {
      result.current[1]('new-value');
    });
    expect(globalThis.localStorage.getItem(key)).toBe(
      JSON.stringify('new-value'),
    );
    expect(result.current[0]).toBe('new-value');
  });

  test('should handle localStorage getItem error gracefully', async () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('getItem error');
      });
    vi.spyOn(globalThis.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('getItem error');
    });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    renderHook(() => useLocalStorage(key, 'initial'));

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error loading from localStorage:',
        'getItem error',
      );
    });

    getItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  test('Should handle localStorage setItem error gracefully', async () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('setItem error');
      });

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage(key, 'init'));

    act(() => {
      result.current[1]('newVal');
    });

    await waitFor(() =>
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Error saving to localStorage:',
        'setItem error',
      ),
    );

    setItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});
