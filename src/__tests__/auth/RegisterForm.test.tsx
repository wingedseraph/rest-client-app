import { AuthService } from '@/__mocks__/authService.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import { createMockUser } from '@/__mocks__/user.mock';
import Register from '@/app/[locale]/(auth)/register/page';
import { firebaseAuthService } from '@/services/authService';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/services/authService', () => ({
  firebaseAuthService: AuthService,
}));
mockNextNavigation();

describe('Register', () => {
  test('Should register successfully', async () => {
    const mockUser = createMockUser({ uid: '456' });

    vi.mocked(
      firebaseAuthService.registerWithEmailAndPassword,
    ).mockResolvedValue(mockUser);

    renderWithIntl(<Register />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() =>
      expect(
        firebaseAuthService.registerWithEmailAndPassword,
      ).toHaveBeenCalledWith('John Doe', 'john@test.com', 'Password123'),
    );
  });
});
