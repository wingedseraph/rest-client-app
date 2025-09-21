import type React from 'react';

import { vi } from 'vitest';

export const mockNextNavigation = () => {
  vi.mock('next/navigation', async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
      ...actual,
      useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
      }),
      usePathname: () => '/',
      useSearchParams: () => new URLSearchParams(),
      redirect: vi.fn(),
      Link: ({ children, ...props }: { children: React.ReactNode }) => (
        <a {...props}>{children}</a>
      ),
    };
  });
};
