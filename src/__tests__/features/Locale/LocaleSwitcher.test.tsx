import { AuthService } from '@/__mocks__/authService.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import LocaleSwitcher from '@/features/Locale/LocaleSwitcher';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('@/services/authService', () => ({
  firebaseAuthService: AuthService,
}));
mockNextNavigation();

describe('LocaleSwitcher', () => {
  test('should render language switch', () => {
    renderWithIntl(<LocaleSwitcher />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    userEvent.click(screen.getByRole('combobox'));

    expect(screen.getByText('Russian')).toBeInTheDocument();
  });
});
