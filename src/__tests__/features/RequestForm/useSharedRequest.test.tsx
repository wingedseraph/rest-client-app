import { useSharedRequest } from '@/features/RequestForm/useSharedRequest';

import { act, renderHook } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('useSharedRequest', () => {
  test('should be by with default values', () => {
    const { result } = renderHook(() => useSharedRequest());

    expect(result.current.request).toEqual({
      url: 'https://dummyjson.com/test',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: '',
      size: 0,
      duration: 0,
      timestamp: '',
    });
    expect(result.current.currentMethod).toBe('GET');
    expect(result.current.response).toBeNull();
    expect(result.current.error).toEqual({ api: '', body: '' });
  });

  test('should update request', () => {
    const { result } = renderHook(() => useSharedRequest());

    act(() => {
      result.current.updateRequest({
        url: 'https://dummyjson.com/test',
        method: 'POST',
      });
    });

    expect(result.current.request.url).toBe('https://dummyjson.com/test');
    expect(result.current.request.method).toBe('POST');
    expect(result.current.request.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  test('should add header', () => {
    const { result } = renderHook(() => useSharedRequest());

    act(() => {
      result.current.addHeader('Authorization', 'token');
    });

    expect(result.current.request.headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: 'token',
    });
  });

  test('should not add header with empty key or value', () => {
    const { result } = renderHook(() => useSharedRequest());

    act(() => {
      result.current.addHeader('', 'value');
    });

    act(() => {
      result.current.addHeader('key', '');
    });

    expect(result.current.request.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  test('should remove header', () => {
    const { result } = renderHook(() => useSharedRequest());

    act(() => {
      result.current.addHeader('Authorization', 'Bearer token123');
    });

    act(() => {
      result.current.removeHeader('Authorization');
    });

    expect(result.current.request.headers).toEqual({
      'Content-Type': 'application/json',
    });
  });

  test('should set current method', () => {
    const { result } = renderHook(() => useSharedRequest());

    act(() => {
      result.current.setCurrentMethod('POST');
    });

    expect(result.current.currentMethod).toBe('POST');
  });

  test('should set request error', () => {
    const { result } = renderHook(() => useSharedRequest());

    act(() => {
      result.current.setRequestError({
        api: 'API Error',
        body: 'Body Error',
      });
    });

    expect(result.current.error).toEqual({
      api: 'API Error',
      body: 'Body Error',
    });
  });

  test('should set request response', () => {
    const { result } = renderHook(() => useSharedRequest());

    const mockResponse = { data: 'test response' };

    act(() => {
      result.current.setRequestResponse(mockResponse);
    });

    expect(result.current.response).toEqual(mockResponse);
  });
});
