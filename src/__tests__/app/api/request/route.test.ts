import { NextRequest } from 'next/server';

import { POST } from '@/app/api/request/route';

import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/api/request/fetch', () => ({
  fetchExternal: vi.fn(),
}));

vi.mock('@/app/api/request/schema', () => ({
  requestSchema: {
    parse: vi.fn(),
  },
}));

describe('/api/request', () => {
  it('should process valid request successfully', async () => {
    const { fetchExternal } = await import('@/app/api/request/fetch');
    const { requestSchema } = await import('@/app/api/request/schema');

    const mockData = {
      url: 'https://api.example.com/test',
      method: 'GET',
      headers: {},
      body: '',
      size: 0,
      duration: 0,
      timestamp: '2023-01-01T00:00:00.000Z',
    };

    const mockResult = {
      status: 200,
      statusText: 'OK',
      data: { message: 'success' },
      headers: {},
      responseTime: 100,
    };

    vi.mocked(requestSchema.parse).mockReturnValue(mockData);
    vi.mocked(fetchExternal).mockResolvedValue(mockResult);

    const request = new NextRequest('http://localhost/api/request', {
      method: 'POST',
      body: JSON.stringify(mockData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockResult);
    expect(fetchExternal).toHaveBeenCalledWith(mockData);
  });

  it('should handle validation error', async () => {
    const { requestSchema } = await import('@/app/api/request/schema');
    vi.mocked(requestSchema.parse).mockImplementation(() => {
      throw new Error('Invalid request data');
    });

    const request = new NextRequest('http://localhost/api/request', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Invalid request data' });
  });

  it('should handle fetch error', async () => {
    const { fetchExternal } = await import('@/app/api/request/fetch');
    const { requestSchema } = await import('@/app/api/request/schema');

    const mockData = {
      url: 'https://api.example.com/test',
      method: 'GET',
      headers: {},
      body: '',
      size: 0,
      duration: 0,
      timestamp: '2023-01-01T00:00:00.000Z',
    };

    vi.mocked(requestSchema.parse).mockReturnValue(mockData);
    vi.mocked(fetchExternal).mockRejectedValue(new Error('Network error'));

    const request = new NextRequest('http://localhost/api/request', {
      method: 'POST',
      body: JSON.stringify(mockData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Network error' });
  });

  it('should handle unknown error', async () => {
    const { requestSchema } = await import('@/app/api/request/schema');
    vi.mocked(requestSchema.parse).mockImplementation(() => {
      throw 'Unknown error type';
    });

    const request = new NextRequest('http://localhost/api/request', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Unknown error' });
  });
});
