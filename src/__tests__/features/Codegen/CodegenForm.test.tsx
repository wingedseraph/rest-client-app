import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import CodegenForm from '@/features/Codegen/CodegenForm';
import type { HttpRequest } from '@/features/RequestForm/useSharedRequest';

import { screen } from '@testing-library/react';

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

const request: HttpRequest = {
  url: 'https://dummyjson.com/test',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  body: '',
  size: 0,
  duration: 0,
  timestamp: '',
};

describe('CodeForm', () => {
  test('should render CodeForm component correctly with right data', () => {
    renderWithIntl(<CodegenForm request={request} />);

    const button = screen.getByRole('button', { name: 'Generate new snippet' });

    expect(button).not.toHaveAttribute('disabled');
  });
  test('should render CodeForm component correctly with error data', () => {
    const emptyRequest = { ...request, url: '' };

    renderWithIntl(<CodegenForm request={emptyRequest} />);

    const button = screen.getByRole('button', { name: 'Generate new snippet' });

    expect(button).toHaveAttribute('disabled');
  });
});
