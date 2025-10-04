import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import Variables from '@/features/Variables/Variables';

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

describe('VariablesView', () => {
  test('should render VariablesView with all content', () => {
    renderWithIntl(<Variables />);

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('Add new variable')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('value')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
});
