import { vi } from 'vitest';

export const mockAuthService = {
  logInWithEmailAndPassword: vi.fn(),
  registerWithEmailAndPassword: vi.fn(),
  sendPasswordReset: vi.fn(),
  logout: vi.fn(),
};
