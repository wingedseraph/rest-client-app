import { getFirebaseErrorMessageKey } from '@/lib/errorHelper';

import { describe, expect, test } from 'vitest';

describe('getFirebaseErrorMessageKey', () => {
  test('Should return the same key for known Firebase error codes', () => {
    const knownCodes = [
      'auth/user-not-found',
      'auth/email-already-in-use',
      'auth/wrong-password',
      'auth/invalid-email',
      'auth/invalid-credential',
      'auth/too-many-requests',
      'auth/user-disabled',
    ];

    knownCodes.forEach((code) => {
      expect(getFirebaseErrorMessageKey(code)).toBe(code);
    });
  });

  test('Should return "unknown" for unknown error codes', () => {
    expect(getFirebaseErrorMessageKey('auth/some-new-error')).toBe('unknown');
    expect(getFirebaseErrorMessageKey('')).toBe('unknown');
    expect(getFirebaseErrorMessageKey('random-string')).toBe('unknown');
  });
});
