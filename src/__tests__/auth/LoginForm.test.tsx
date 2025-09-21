import { AuthService } from '@/__mocks__/authService.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import { createMockUser } from '@/__mocks__/user.mock';
import Login from '@/app/[locale]/(auth)/login/page';
import { firebaseAuthService } from '@/services/authService';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { FirebaseError } from 'firebase/app';
import type { UserCredential } from 'firebase/auth';
import { vi } from 'vitest';

vi.mock('@/services/authService', () => ({
  firebaseAuthService: AuthService,
}));
mockNextNavigation();

describe('Login', () => {
  beforeEach(() => {
    renderWithIntl(<Login />);
  });

  test('Should log in successfully', async () => {
    const mockUserCredential: UserCredential = {
      user: createMockUser({ uid: '123' }),
      providerId: 'password',
      operationType: 'signIn',
    };

    vi.mocked(firebaseAuthService.logInWithEmailAndPassword).mockResolvedValue(
      mockUserCredential,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(
        firebaseAuthService.logInWithEmailAndPassword,
      ).toHaveBeenCalledWith('test@test.com', 'Password123'),
    );
  });

  test('Should show "user not found" error', async () => {
    const error = new FirebaseError('auth/user-not-found', 'No user');
    vi.mocked(firebaseAuthService.logInWithEmailAndPassword).mockRejectedValue(
      error,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'missing@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(
        screen.getByText('There is no user with such e-mail'),
      ).toBeInTheDocument(),
    );
  });

  test('Should show "wrong password" error', async () => {
    const error = new FirebaseError('auth/wrong-password', 'Wrong password');
    vi.mocked(firebaseAuthService.logInWithEmailAndPassword).mockRejectedValue(
      error,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'WrongPass123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText('Wrong password')).toBeInTheDocument(),
    );
  });

  test('Should show "unknown" error for unexpected codes', async () => {
    const error = new FirebaseError('auth/unknown-error', 'Unknown');
    vi.mocked(firebaseAuthService.logInWithEmailAndPassword).mockRejectedValue(
      error,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText('Unknown error')).toBeInTheDocument(),
    );
  });

  test('Should show required field errors', async () => {
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
