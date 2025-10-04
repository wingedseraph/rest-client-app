import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import CodeView from '@/features/Codegen/CodeView';

import { screen } from '@testing-library/react';

const CodegenData = {
  language: 'curl',
  variant: 'curl',
  snippet: 'curl --location --request GET "https://dummyjson.com/test"',
} as const;

describe('CodeView', () => {
  test('should render CodeView component correctly with right data', () => {
    renderWithIntl(<CodeView data={CodegenData} error={null} />);

    expect(
      screen.getByText(
        'curl --location --request GET "https://dummyjson.com/test"',
      ),
    ).toBeInTheDocument();
  });
  test('should render CodeView component correctly with error data', () => {
    renderWithIntl(<CodeView data={null} error={'Error'} />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  test('should render CodeView component correctly with empty data', () => {
    renderWithIntl(<CodeView data={null} error={null} />);

    expect(
      screen.getByText('Select a language and click generate'),
    ).toBeInTheDocument();
  });
});
