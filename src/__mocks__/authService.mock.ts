import { vi } from 'vitest';

export const AuthService = {
  logInWithEmailAndPassword: vi.fn(),
  registerWithEmailAndPassword: vi.fn(),
  sendPasswordReset: vi.fn(),
  logout: vi.fn(),
};
