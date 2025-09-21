import type { FormEvent } from 'react';

import { useHttpRequest } from '@/features/RequestForm/useHttpRequest';
import type { HttpRequest } from '@/features/RequestForm/useSharedRequest';

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

const originalFetch = global.fetch;
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  global.fetch = originalFetch;
});

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/shared/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn().mockReturnValue([
    [
      { id: '1', key: 'baseUrl', value: 'https://dummyjson.com/test' },
      { id: '2', key: 'apiKey', value: 'test-api-key' },
    ],
  ]),
}));

vi.mock('@/lib/interpolateVariables', () => ({
  interpolateData: vi.fn().mockImplementation((url, body, headers) => ({
    url,
    body,
    headers,
  })),
}));

const getMockProps = () => ({
  request: {
    url: 'https://dummyjson.com/test',
    method: 'GET',
    body: '',
  } as HttpRequest,
  updateRequest: vi.fn(),
  setRequestError: vi.fn(),
  setRequestResponse: vi.fn(),
});

const getMockEvent = () => {
  const mockForm = document.createElement('form');
  mockForm.innerHTML = `
    <input name="url" value="https://dummyjson.com/test" />
    <input name="method" value="GET" />
    <input name="body" value="" />
  `;

  return {
    preventDefault: vi.fn(),
    currentTarget: mockForm,
  } as unknown as FormEvent<HTMLFormElement>;
};

describe('useHttpRequest', () => {
  test('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Wrong Request'),
    );

    const mockProps = getMockProps();

    const { result } = renderHook(() => useHttpRequest(mockProps));

    const mockEvent = getMockEvent();

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockProps.setRequestError).toHaveBeenCalledWith({
      api: '',
      body: '',
    });
  });

  test('should handle successful request', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const mockProps = getMockProps();

    const { result } = renderHook(() => useHttpRequest(mockProps));

    const mockEvent = getMockEvent();

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(mockProps.setRequestResponse).toHaveBeenCalledWith({
      success: true,
    });
  });
});
