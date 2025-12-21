import GlobalNotFound from '@/app/not-found';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

vi.mock('next/error', () => ({
  default: ({ statusCode }: { statusCode: number }) => (
    <div data-testid="next-error" data-status={statusCode}>
      Error {statusCode}
    </div>
  ),
}));

describe('GlobalNotFound', () => {
  test('should render 404 error page', () => {
    render(<GlobalNotFound />);

    expect(screen.getByTestId('next-error')).toBeInTheDocument();
    expect(screen.getByTestId('next-error')).toHaveAttribute(
      'data-status',
      '404',
    );
    expect(screen.getByText('Error 404')).toBeInTheDocument();
  });

  test('should have proper HTML structure', () => {
    render(<GlobalNotFound />);

    const html = document.querySelector('html');
    const body = document.querySelector('body');

    expect(html).toBeInTheDocument();
    expect(html).toHaveAttribute('lang', 'en');
    expect(body).toBeInTheDocument();
  });
});
