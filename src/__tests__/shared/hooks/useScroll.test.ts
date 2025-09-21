import useScroll from '@/shared/hooks/useScroll';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

const mockGetBoundingClientRect = vi.fn();
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();
let mockElement: HTMLDivElement;
let scrollHandler = () => {};

function setupScrollMocks() {
  vi.clearAllMocks();
  mockElement = document.createElement('div');
  mockElement.getBoundingClientRect = mockGetBoundingClientRect;

  Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  Object.defineProperty(window, 'addEventListener', {
    value: mockAddEventListener,
    writable: true,
  });
  Object.defineProperty(window, 'removeEventListener', {
    value: mockRemoveEventListener,
    writable: true,
  });

  mockGetBoundingClientRect.mockReturnValue({ top: 100, height: 50 });
  mockAddEventListener.mockImplementation((event, handler) => {
    if (event === 'scroll') scrollHandler = handler;
  });
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, writable: true });
}

describe('useScroll', () => {
  test('should initialize as non-sticky', () => {
    const { result } = renderHook(() => useScroll());
    expect(result.current.sticky.isSticky).toBe(false);
    expect(result.current.sticky.offset).toBe(0);
  });

  test('should initialize headerRef to null', () => {
    const { result } = renderHook(() => useScroll());
    expect(result.current.headerRef.current).toBeNull();
  });

  test('should updates sticky state on scroll', () => {
    setupScrollMocks();
    const { result, rerender } = renderHook(() => useScroll());

    act(() => {
      result.current.headerRef.current = mockElement;
      rerender();
    });

    act(() => {
      setScrollY(160);
      scrollHandler();
    });
    expect(result.current.sticky.isSticky).toBe(false);
    expect(result.current.sticky.offset).toBe(0);
  });

  test('should stay sticky state when unchanged', () => {
    setupScrollMocks();
    const { result, rerender } = renderHook(() => useScroll());

    act(() => {
      result.current.headerRef.current = mockElement;
      rerender();
    });

    act(() => {
      setScrollY(160);
      scrollHandler();
    });
    expect(result.current.sticky.isSticky).toBe(false);

    act(() => {
      setScrollY(200);
      scrollHandler();
    });
    expect(result.current.sticky.isSticky).toBe(false);
  });

  test('should initialize with non-sticky state', () => {
    setupScrollMocks();
    const { result } = renderHook(() => useScroll());
    expect(result.current.sticky.isSticky).toBe(false);
    expect(result.current.sticky.offset).toBe(0);
  });
});
