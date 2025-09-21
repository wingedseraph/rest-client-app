import '@/__mocks__/firebaseAuth.mock';
import '@/__mocks__/firebaseFirestore.mock';

import { createMockUser } from '@/__mocks__/user.mock';
import { auth, db } from '@/lib/firebase/client';
import { firebaseAuthService } from '@/services/authService';

import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth';
import {
  type DocumentData,
  type DocumentReference,
  doc,
  setDoc,
} from 'firebase/firestore';
import { describe, expect, test, vi } from 'vitest';

global.fetch = vi.fn();

describe('firebaseAuthService', () => {
  test('Should log in successfully', async () => {
    const mockUser = createMockUser({ uid: '123', email: 'test@test.com' });
    const mockUserCredential: UserCredential = {
      user: mockUser as User,
      providerId: 'password',
      operationType: 'signIn',
    };

    vi.mocked(signInWithEmailAndPassword).mockResolvedValue(mockUserCredential);

    const result = await firebaseAuthService.logInWithEmailAndPassword(
      'test@test.com',
      'Password123',
    );

    expect(result.user.uid).toBe('123');
  });

  test('Should throw FirebaseError on login', async () => {
    const error = new FirebaseError('auth/invalid-credentials', 'Invalid');
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(error);

    await expect(
      firebaseAuthService.logInWithEmailAndPassword('bad@test.com', 'wrong'),
    ).rejects.toBe(error);
  });

  test('Should wrap generic Error on login', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(
      new Error('Generic login error'),
    );

    await expect(
      firebaseAuthService.logInWithEmailAndPassword('bad@test.com', 'wrong'),
    ).rejects.toThrow(/Login failed: Generic login error/);
  });

  test('Should wrap unknown error on login', async () => {
    vi.mocked(signInWithEmailAndPassword).mockRejectedValue(123);

    await expect(
      firebaseAuthService.logInWithEmailAndPassword('bad@test.com', 'wrong'),
    ).rejects.toThrow(/Login failed: Unknown error/);
  });

  test('Should register successfully', async () => {
    const mockUser = createMockUser({ uid: '456', email: 'new@test.com' });
    const mockUserCredential: UserCredential = {
      user: mockUser as User,
      providerId: 'password',
      operationType: 'signIn',
    };

    vi.mocked(createUserWithEmailAndPassword).mockResolvedValue(
      mockUserCredential,
    );
    vi.mocked(doc).mockReturnValue({} as DocumentReference<DocumentData>);
    vi.mocked(setDoc).mockResolvedValue(undefined);

    const result = await firebaseAuthService.registerWithEmailAndPassword(
      'Tester',
      'new@test.com',
      'Password123',
    );

    expect(result.uid).toBe('456');
  });

  test('Should throw FirebaseError on register', async () => {
    const error = new FirebaseError('auth/email-already-in-use', 'Exists');
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(error);

    await expect(
      firebaseAuthService.registerWithEmailAndPassword(
        'Tester',
        'new@test.com',
        'Password123',
      ),
    ).rejects.toBe(error);
  });

  test('Should wrap generic Error on register', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue(
      new Error('Generic registration error'),
    );

    await expect(
      firebaseAuthService.registerWithEmailAndPassword(
        'Tester',
        'new@test.com',
        'Password123',
      ),
    ).rejects.toThrow(/Registration failed: Generic registration error/);
  });

  test('Should wrap unknown error on register', async () => {
    vi.mocked(createUserWithEmailAndPassword).mockRejectedValue('oops');

    await expect(
      firebaseAuthService.registerWithEmailAndPassword(
        'Tester',
        'new@test.com',
        'Password123',
      ),
    ).rejects.toThrow(/Registration failed: Unknown error/);
  });

  test('Should send password reset email', async () => {
    vi.mocked(sendPasswordResetEmail).mockResolvedValue(undefined);

    await firebaseAuthService.sendPasswordReset('reset@test.com');

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, 'reset@test.com');
  });

  test('Should throw FirebaseError on reset', async () => {
    const error = new FirebaseError('auth/user-not-found', 'Missing');
    vi.mocked(sendPasswordResetEmail).mockRejectedValue(error);

    await expect(
      firebaseAuthService.sendPasswordReset('missing@test.com'),
    ).rejects.toBe(error);
  });

  test('Should wrap generic Error on reset', async () => {
    vi.mocked(sendPasswordResetEmail).mockRejectedValue(
      new Error('Generic reset error'),
    );

    await expect(
      firebaseAuthService.sendPasswordReset('missing@test.com'),
    ).rejects.toThrow(/Password reset failed: Generic reset error/);
  });

  test('Should wrap unknown error on reset', async () => {
    vi.mocked(sendPasswordResetEmail).mockRejectedValue(42);

    await expect(
      firebaseAuthService.sendPasswordReset('missing@test.com'),
    ).rejects.toThrow(/Password reset failed: Unknown error/);
  });

  test('Should log out', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    await firebaseAuthService.logout();

    expect(signOut).toHaveBeenCalledWith(auth);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/unset-token',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  test('Should throw FirebaseError on logout', async () => {
    const error = new FirebaseError('auth/internal-error', 'Logout failed');
    vi.mocked(signOut).mockRejectedValue(error);

    await expect(firebaseAuthService.logout()).rejects.toBe(error);
  });

  test('Should wrap generic Error on logout', async () => {
    vi.mocked(signOut).mockRejectedValue(new Error('Generic logout error'));

    await expect(firebaseAuthService.logout()).rejects.toThrow(
      /Logout failed: Generic logout error/,
    );
  });

  test('Should wrap unknown error on logout', async () => {
    vi.mocked(signOut).mockRejectedValue('x');

    await expect(firebaseAuthService.logout()).rejects.toThrow(
      /Logout failed: Unknown error/,
    );
  });

  test('Should return auth instance', () => {
    expect(firebaseAuthService.getAuthInstance()).toBe(auth);
  });

  test('Should return firestore instance', () => {
    expect(firebaseAuthService.getFirestoreInstance()).toBe(db);
  });

  test('Should return current user', () => {
    expect(firebaseAuthService.getCurrentUser()).toBeNull();
  });
});
