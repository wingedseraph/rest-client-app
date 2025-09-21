import Spinner from '@/shared/ui/Spinner/spinner';

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

describe('Spinner', () => {
  test('should render spinner', () => {
    render(<Spinner />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
