import type { User, UserCredential } from 'firebase/auth';

export const createMockUser = (overrides: Partial<User> = {}): User =>
  ({
    uid: '123',
    email: 'test@test.com',
    emailVerified: false,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: vi.fn(),
    getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
    getIdTokenResult: vi.fn(),
    reload: vi.fn(),
    toJSON: vi.fn(),
    ...overrides,
  }) as unknown as User;

export const createMockUserCredential = (
  overrides: Partial<UserCredential> = {},
): UserCredential => {
  const user = createMockUser();

  return {
    user,
    providerId: 'password',
    operationType: 'signIn',
    ...overrides,
  } as UserCredential;
};
