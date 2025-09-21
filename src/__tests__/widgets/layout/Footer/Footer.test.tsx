import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import Footer from '@/widgets/layout/Footer/Footer';

import { screen } from '@testing-library/react';

mockNextNavigation();

describe('Footer', () => {
  test('should render footer with all content', () => {
    renderWithIntl(<Footer />);

    const logoLink = screen.getByRole('link', { name: 'logo of rs school' });
    const logoImage = screen.getByRole('img', { name: 'logo of rs school' });

    expect(screen.getByRole('link', { name: '/client' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '/variables' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '/history' })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: '/wing...' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '/rob...' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '/rusty...' })).toBeInTheDocument();

    expect(logoLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs',
    );

    expect(logoImage).toHaveAttribute('alt', 'logo of rs school');
    expect(screen.getByText('/2025')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '{ RESTfulAPI }' }),
    ).toBeInTheDocument();
  });
});
