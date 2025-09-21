import { NextRequest } from 'next/server';

import { POST } from '@/app/api/set-token/route';

import { describe, expect, it } from 'vitest';

describe('/api/set-token', () => {
  it('should set auth token cookie', async () => {
    const request = new NextRequest('http://localhost/api/set-token', {
      method: 'POST',
      body: JSON.stringify({ token: 'test-token-123' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });

    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('authToken=test-token-123');
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('Path=/');
  });

  it('should handle empty token', async () => {
    const request = new NextRequest('http://localhost/api/set-token', {
      method: 'POST',
      body: JSON.stringify({ token: '' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });

    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('authToken=');
  });

  it('should handle missing token', async () => {
    const request = new NextRequest('http://localhost/api/set-token', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });

    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('authToken=; Path=/; HttpOnly');
  });
});
