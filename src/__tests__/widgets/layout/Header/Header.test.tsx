import { mockFirebaseAuth } from '@/__mocks__/firebaseAuth.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import Header from '@/widgets/layout/Header/Header';

import { screen } from '@testing-library/react';

mockNextNavigation();

mockFirebaseAuth();

describe('Header', () => {
  test('should render header with all content', () => {
    renderWithIntl(<Header />);

    expect(
      screen.getByRole('link', { name: '{ RESTfulAPI }' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });
});
