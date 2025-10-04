import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import RestClientPage from '@/app/[locale]/(rest-client)/rest-client/page';

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

describe('RestClientPage', () => {
  test('should RestClientPage with all content', () => {
    renderWithIntl(<RestClientPage />);

    const methodSelect = screen.getByRole('combobox', {
      name: 'method-select',
    });
    expect(methodSelect).toBeInTheDocument();
    //
    const languageSelect = screen.getByRole('combobox', {
      name: 'language-select',
    });
    expect(languageSelect).toBeInTheDocument();

    expect(screen.getByRole('option', { name: 'GET' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'POST' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'CURL' })).toBeInTheDocument();

    expect(screen.getByPlaceholderText('URL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('value')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Header' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Generate new snippet' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Select a language and click generate'),
    ).toBeInTheDocument();
  });
});
