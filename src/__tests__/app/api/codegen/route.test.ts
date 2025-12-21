import { NextRequest } from 'next/server';

import { POST } from '@/app/api/codegen/route';

import { describe, expect, it, vi } from 'vitest';

vi.mock('postman-code-generators', () => ({
  convert: vi.fn(),
}));

vi.mock('postman-collection', () => ({
  Request: vi.fn().mockImplementation(() => ({
    addHeader: vi.fn(),
  })),
  HeaderList: vi.fn(),
}));

describe('/api/codegen', () => {
  it('should generate code snippet successfully', async () => {
    const { convert } = await import('postman-code-generators');
    vi.mocked(convert).mockImplementation(
      (_language, _variant, _request, _options, callback) => {
        callback(null, 'console.log("test");');
      },
    );

    const requestData = {
      url: 'https://dummyjson.com/test',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: '{"test": "data"}',
      language: 'javascript',
      variant: 'fetch',
    };

    const request = new NextRequest('http://localhost/api/codegen', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      language: 'javascript',
      variant: 'fetch',
      snippet: 'console.log("test");',
    });
  });

  it('should handle conversion error', async () => {
    const { convert } = await import('postman-code-generators');
    vi.mocked(convert).mockImplementation(
      (_language, _variant, _request, _options, callback) => {
        callback(new Error('Conversion failed'), '');
      },
    );

    const requestData = {
      url: 'https://dummyjson.com/test',
      method: 'GET',
      headers: {},
      body: '',
      language: 'invalid',
      variant: 'invalid',
    };

    const request = new NextRequest('http://localhost/api/codegen', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Conversion failed' });
  });

  it('should use default values when data is missing', async () => {
    const { convert } = await import('postman-code-generators');
    vi.mocked(convert).mockImplementation(
      (_language, _variant, _request, _options, callback) => {
        callback(null, 'default snippet');
      },
    );

    const requestData = {
      language: 'javascript',
      variant: 'fetch',
    };

    const request = new NextRequest('http://localhost/api/codegen', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.snippet).toBe('default snippet');
  });
});
