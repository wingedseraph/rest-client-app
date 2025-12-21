import { POST } from '@/app/api/unset-token/route';

import { describe, expect, it } from 'vitest';

describe('/api/unset-token', () => {
  it('should unset auth token cookie', async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: 'Token unset' });

    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toContain('authToken=');
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('Path=/');
    expect(setCookieHeader).toContain('Max-Age=0');
  });

  it('should return success message', async () => {
    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Token unset');
  });
});
