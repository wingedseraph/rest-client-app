import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import LocaleHome from '@/app/[locale]/page';

import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('LocaleHome', () => {
  test('should render project description', () => {
    renderWithIntl(<LocaleHome />);
    expect(
      screen.getByText(/Our project is a minimalistic REST client/),
    ).toBeInTheDocument();
  });

  test('should render course description', () => {
    renderWithIntl(<LocaleHome />);
    expect(
      screen.getByText(
        /This project was built as part of a comprehensive React course/,
      ),
    ).toBeInTheDocument();
  });

  test('should render developers section with underlined names', () => {
    renderWithIntl(<LocaleHome />);
    expect(
      screen.getByText(/The project was developed by a talented team/),
    ).toBeInTheDocument();
    expect(screen.getByText('Nikolai')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
    expect(screen.getByText('Alexey')).toBeInTheDocument();
  });

  test('should render all three images with correct sources and alt text', () => {
    renderWithIntl(<LocaleHome />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);

    expect(images[0]).toHaveAttribute('alt', 'bread-walk');

    expect(images[1]).toHaveAttribute('alt', 'bread-hardtime');

    expect(images[2]).toHaveAttribute('alt', 'bread-team-cats');
  });

  test('should render all main content sections', () => {
    renderWithIntl(<LocaleHome />);
    expect(
      screen.getByText(/Our project is a minimalistic REST client/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /This project was built as part of a comprehensive React course/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The project was developed by a talented team/),
    ).toBeInTheDocument();

    expect(screen.getByAltText('bread-walk')).toBeInTheDocument();
    expect(screen.getByAltText('bread-hardtime')).toBeInTheDocument();
    expect(screen.getByAltText('bread-team-cats')).toBeInTheDocument();
  });
});
