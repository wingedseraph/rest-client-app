import { Providers } from '@/app/providers';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('Providers', () => {
  test('should render children', () => {
    render(
      <Providers>
        <div data-testid="test-childen">Test Content</div>
      </Providers>,
    );

    expect(screen.getByTestId('test-childen')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('should render multiple children', () => {
    render(
      <Providers>
        <div data-testid="childen-1">Childen 1</div>
        <div data-testid="childen-2">Childen 2</div>
      </Providers>,
    );

    expect(screen.getByTestId('childen-1')).toBeInTheDocument();
    expect(screen.getByTestId('childen-2')).toBeInTheDocument();
  });
});
