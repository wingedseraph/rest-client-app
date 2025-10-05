import { mockFirebaseAuth } from '@/__mocks__/firebaseAuth.mock';
import { mockNextNavigation } from '@/__mocks__/nextNavigation.mock';
import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import Variables from '@/features/Variables/Variables';

import { screen } from '@testing-library/react';

mockNextNavigation();
mockFirebaseAuth();

describe('VariablesView', () => {
  test('should render VariablesView with all content', () => {
    renderWithIntl(<Variables />);

    expect(screen.getByText('Variables')).toBeInTheDocument();
    expect(screen.getByText('Add new variable')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('value')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });
});
