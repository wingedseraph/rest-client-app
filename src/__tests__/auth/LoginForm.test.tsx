import { AuthService } from '@/__mocks__/authService.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import { createMockUser } from '@/__mocks__/user.mock';
import Login from '@/app/[locale]/(auth)/login/page';
import { firebaseAuthService } from '@/services/authService';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import type { UserCredential } from 'firebase/auth';
import { vi } from 'vitest';

vi.mock('@/services/authService', () => ({
  firebaseAuthService: AuthService,
}));
mockNextNavigation();

describe('Login', () => {
  test('Should log in successfully', async () => {
    const mockUserCredential: UserCredential = {
      user: createMockUser({ uid: '123' }),
      providerId: 'password',
      operationType: 'signIn',
    };

    vi.mocked(firebaseAuthService.logInWithEmailAndPassword).mockResolvedValue(
      mockUserCredential,
    );

    renderWithIntl(<Login />);

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
});
