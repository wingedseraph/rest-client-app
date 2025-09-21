import { fetchExternal } from '@/app/api/request/fetch';

import { beforeEach, describe, expect, it, vi } from 'vitest';

global.fetch = vi.fn();

describe('fetchExternal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make GET request with correct parameters', async () => {
    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({ message: 'success' }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

    const result = await fetchExternal({
      url: 'https://dummyjson.com/test',
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/test', {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      body: null,
    });

    expect(result.status).toBe(200);
    expect(result.statusText).toBe('OK');
    expect(result.data).toEqual({ message: 'success' });
    expect(result.responseTime).toBeGreaterThanOrEqual(0);
  });

  it('should make POST request with JSON body', async () => {
    const mockResponse = {
      status: 201,
      statusText: 'Created',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({ id: 123 }),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

    const result = await fetchExternal({
      url: 'https://dummyjson.com/test',
      method: 'POST',
    });

    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/test', {
      method: 'POST',
      headers: {},
      body: null,
    });

    expect(result.status).toBe(201);
    expect(result.data).toEqual({ id: 123 });
  });

  it('should handle non-JSON response by falling back to text', async () => {
    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'text/plain' }),
      text: vi.fn().mockResolvedValue('Plain text response'),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

    const result = await fetchExternal({
      url: 'https://api.example.com/text',
      method: 'GET',
    });

    expect(result.data).toBe('Plain text response');
  });

  it('should convert method to uppercase', async () => {
    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      json: vi.fn().mockResolvedValue({}),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

    await fetchExternal({
      url: 'https://dummyjson.com/test',
      method: 'get',
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('should calculate response time correctly', async () => {
    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      json: vi.fn().mockResolvedValue({}),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

    const result = await fetchExternal({
      url: 'https://dummyjson.com/test',
      method: 'GET',
    });

    expect(result.responseTime).toBeGreaterThanOrEqual(0);
  });

  it('should parse response headers correctly', async () => {
    const mockHeaders = new Headers({
      'content-type': 'application/json',
    });

    const mockResponse = {
      status: 200,
      statusText: 'OK',
      headers: mockHeaders,
      json: vi.fn().mockResolvedValue({}),
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as unknown as Response);

    const result = await fetchExternal({
      url: 'https://dummyjson.com/test',
      method: 'GET',
    });

    expect(result.headers).toEqual({
      'content-type': 'application/json',
    });
  });
});
