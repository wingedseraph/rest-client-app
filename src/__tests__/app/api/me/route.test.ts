import { GET } from '@/app/api/me/route';

import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('/api/me', () => {
  it('should return user data when token exists', async () => {
    const { cookies } = await import('next/headers');
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: 'token' }),
    } as unknown as ReturnType<typeof cookies>);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      user: { token: 'token' },
      info: 'User is authenticated',
    });
  });

  it('should return null user when no token', async () => {
    const { cookies } = await import('next/headers');
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    } as unknown as ReturnType<typeof cookies>);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      user: null,
      info: 'User is not authenticated',
    });
  });

  it('should return null user when token is empty', async () => {
    const { cookies } = await import('next/headers');
    vi.mocked(cookies).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: '' }),
    } as unknown as ReturnType<typeof cookies>);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      user: null,
      info: 'User is not authenticated',
    });
  });
});
