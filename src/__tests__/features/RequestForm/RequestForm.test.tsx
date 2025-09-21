import '@/__mocks__/firebaseAuth.mock';
import '@/__mocks__/firebaseFirestore.mock';

import { renderWithIntl } from '@/__mocks__/renderWithIntl';
import RequestForm from '@/features/RequestForm/RequestForm';
import type {
  HttpRequest,
  RequestError,
} from '@/features/RequestForm/useSharedRequest';

import { screen } from '@testing-library/react';
import { describe, test, vi } from 'vitest';

const mockRequest: HttpRequest = {
  url: 'https://example.com',
  method: 'GET',
  headers: {},
  body: '',
  size: 0,
  duration: 0,
  timestamp: new Date().toISOString(),
};

describe('RequestForm', () => {
  test('Should render without crashing', () => {
    renderWithIntl(
      <RequestForm
        request={mockRequest}
        currentMethod="GET"
        setCurrentMethod={vi.fn()}
        response={null}
        error={{} as RequestError}
        addHeader={vi.fn()}
        removeHeader={vi.fn()}
        updateRequest={vi.fn()}
        setRequestError={vi.fn()}
        setRequestResponse={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText(/url/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add header/i }),
    ).toBeInTheDocument();
  });
});
