import { UnderlineText } from '@/shared/ui/Underline/underline';

import { render, screen } from '@testing-library/react';

describe('UnderlineText', () => {
  test('should render string chunk correctly', () => {
    render(<div>{UnderlineText('Example Content')}</div>);

    expect(screen.getByText('Example Content')).toBeInTheDocument();

    const svg = screen.getByTitle('Underline');
    expect(svg).toBeInTheDocument();
  });

  test('should render JSX chunk correctly', () => {
    const chunk = <strong>Bold</strong>;
    render(<div>{UnderlineText(chunk)}</div>);

    const boldElement = screen.getByText('Bold');
    expect(boldElement.tagName).toBe('STRONG');

    const svg = screen.getByTitle('Underline');
    expect(svg).toBeInTheDocument();
  });
});
