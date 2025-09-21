import { AuthService } from '@/__mocks__/authService.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import { createMockUser } from '@/__mocks__/user.mock';
import Register from '@/app/[locale]/(auth)/register/page';
import { firebaseAuthService } from '@/services/authService';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { FirebaseError } from 'firebase/app';
import { vi } from 'vitest';

vi.mock('@/services/authService', () => ({
  firebaseAuthService: AuthService,
}));
mockNextNavigation();

describe('Register', () => {
  beforeEach(() => {
    renderWithIntl(<Register />);
  });

  test('Should register successfully', async () => {
    const mockUser = createMockUser({ uid: '456' });

    vi.mocked(
      firebaseAuthService.registerWithEmailAndPassword,
    ).mockResolvedValue(mockUser);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(
        firebaseAuthService.registerWithEmailAndPassword,
      ).toHaveBeenCalledWith('John Doe', 'test@test.com', 'Password123'),
    );
  });

  test('Should show "email already in use" error', async () => {
    const error = new FirebaseError(
      'auth/email-already-in-use',
      'Email in use',
    );
    vi.mocked(
      firebaseAuthService.registerWithEmailAndPassword,
    ).mockRejectedValue(error);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existing@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(
        screen.getByText('User with such e-mail already exists'),
      ).toBeInTheDocument(),
    );
  });

  test('Should show "unknown" error for unexpected codes', async () => {
    const error = new FirebaseError('auth/unknown-error', 'Unknown');
    vi.mocked(
      firebaseAuthService.registerWithEmailAndPassword,
    ).mockRejectedValue(error);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(screen.getByText('Unknown error')).toBeInTheDocument(),
    );
  });

  test('Should show required field errors', async () => {
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/name should be more than 3 symbols/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('Should show password validation errors', async () => {
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Short1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/password should use more than 8 symbols/i),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/password should use at least 1 uppercase letter/i),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/password should use at least 1 numeric symbol/i),
      ).toBeInTheDocument(),
    );
  });
});
