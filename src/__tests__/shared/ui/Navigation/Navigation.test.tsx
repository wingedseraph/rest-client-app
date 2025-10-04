import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import Navigation from '@/shared/ui/Navigation/Navigation';

import { screen } from '@testing-library/react';

mockNextNavigation();

vi.mock('firebase/auth', async () => {
  const actual =
    await vi.importActual<typeof import('firebase/auth')>('firebase/auth');
  return {
    ...actual,
    getAuth: vi.fn(() => ({
      currentUser: null,
      onAuthStateChanged: vi.fn(() => () => {}),
    })),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    signOut: vi.fn(),
  };
});

describe('Navigation', () => {
  test('should render navigation with all content', () => {
    renderWithIntl(<Navigation />);

    expect(screen.getByRole('link', { name: '/login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '/register' })).toBeInTheDocument();
  });
});
