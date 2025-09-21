import { useUser } from '@/shared/hooks/useUser';

import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

const mockMutate = vi.fn();
const mockSWR = vi.fn();

vi.mock('swr', () => {
  return {
    default: () => mockSWR(),
  };
});

describe('useUser', () => {
  test('should load default data', () => {
    mockSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeUndefined();
    expect(result.current.mutateUser).toBe(mockMutate);
  });

  test('should be auth state when user data exists', () => {
    const mockUser = { id: 1, name: 'Jack' };
    mockSWR.mockReturnValue({
      data: { user: mockUser },
      error: undefined,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBe(mockUser);
  });

  test('should to be non-auth when data exists but without user', () => {
    mockSWR.mockReturnValue({
      data: { user: null },
      error: undefined,
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });

  test('should no load when error exists', () => {
    mockSWR.mockReturnValue({
      data: undefined,
      error: new Error('API Error'),
      mutate: mockMutate,
    });

    const { result } = renderHook(() => useUser());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  test('should initialize with correct parameters', () => {
    mockSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      mutate: mockMutate,
    });

    renderHook(() => useUser());

    expect(mockSWR).toHaveBeenCalled();
  });
});
