import { mockFirebaseAuth } from '@/__mocks__/firebaseAuth.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import Navigation from '@/shared/ui/Navigation/Navigation';

import { screen } from '@testing-library/react';

mockNextNavigation();
mockFirebaseAuth();

describe('Navigation', () => {
  test('should render navigation with all content', () => {
    renderWithIntl(<Navigation />);

    expect(screen.getByRole('link', { name: '/login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '/register' })).toBeInTheDocument();
  });
});
