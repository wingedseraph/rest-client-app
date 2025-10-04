import ResponseViewer from '@/features/RequestForm/ResponseViewer';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'RequestForm.status.status': 'Status',
      'RequestForm.status.statusText': 'Status Text',
      'RequestForm.status.responseTime': 'Response Time',
      'RequestForm.error.requestUnknown': 'Unknown',
    };
    return translations[key] || key;
  },
}));

describe('ResponseViewer', () => {
  it('should render null when response is null', () => {
    const { container } = render(<ResponseViewer response={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null when response is undefined', () => {
    const { container } = render(<ResponseViewer response={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render valid response data', () => {
    const response = {
      status: 200,
      statusText: 'OK',
      responseTime: 150,
      data: { message: 'success' },
      headers: { 'content-type': 'application/json' },
    };

    render(<ResponseViewer response={response} />);

    expect(screen.getByText(/"status":\s*200/)).toBeInTheDocument();
    expect(screen.getByText(/"statusText":\s*"OK"/)).toBeInTheDocument();
    expect(screen.getByText(/"responseTime":\s*150/)).toBeInTheDocument();
    expect(screen.getByText(/"message":\s*"success"/)).toBeInTheDocument();

    const jsonPre = screen.getByText(/message.*success/);
    expect(jsonPre).toBeInTheDocument();
  });

  it('should handle invalid response data', () => {
    const invalidResponse = {
      invalidField: 'test',
    };

    render(<ResponseViewer response={invalidResponse} />);

    expect(
      screen.getByText(/status\.status\s*:\s*error\.requestUnknown/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/status\.statusText\s*:\s*error\.requestUnknown/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/status\.responseTime\s*:\s*0\s*ms/i),
    ).toBeInTheDocument();
  });

  it('should handle different status codes', () => {
    const response = {
      status: 404,
      statusText: 'Not Found',
      responseTime: 50,
      data: { error: 'Resource not found' },
    };

    render(<ResponseViewer response={response} />);

    expect(screen.getByText(/"status":\s*404/)).toBeInTheDocument();
  });

  it('should handle server error responses', () => {
    const response = {
      status: 500,
      statusText: 'Internal Server Error',
      responseTime: 3000,
      data: { error: 'Something went wrong' },
    };

    render(<ResponseViewer response={response} />);

    expect(screen.getByText(/"status":\s*500/)).toBeInTheDocument();
  });
});
