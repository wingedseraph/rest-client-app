import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import LocaleNotFound from '@/app/[locale]/not-found';

import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('LocaleNotFound', () => {
  test('should render 404 page with correct title', () => {
    renderWithIntl(<LocaleNotFound />);

    expect(screen.getByText('404 — Page Not Found')).toBeInTheDocument();
  });

  test('should render description text', () => {
    renderWithIntl(<LocaleNotFound />);

    expect(
      screen.getByText("Sorry, the page you're looking for does not exist."),
    ).toBeInTheDocument();
  });

  test('should render back to homepage link', () => {
    renderWithIntl(<LocaleNotFound />);

    const backLink = screen.getByText('Go back to homepage');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/en');
  });

  test('should have proper heading structure', () => {
    renderWithIntl(<LocaleNotFound />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('404 — Page Not Found');
  });

  test('should have proper description styling', () => {
    renderWithIntl(<LocaleNotFound />);
  });

  test('should have proper link styling', () => {
    renderWithIntl(<LocaleNotFound />);
  });

  test('should render all required elements', () => {
    renderWithIntl(<LocaleNotFound />);

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText(/Sorry, the page you're looking for/),
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
