import BodyEditor from '@/features/RequestForm/BodyEditor';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('BodyEditor', () => {
  const onBodyChange = vi.fn();

  beforeEach(() => {
    onBodyChange.mockClear();
  });

  test('Should not render for GET and DELETE methods', () => {
    const { container } = render(
      <BodyEditor method="GET" defaultBody="" onBodyChange={onBodyChange} />,
    );
    expect(container.firstChild).toBeNull();
  });

  test('Should render for POST, PUT, PATCH methods', () => {
    render(
      <BodyEditor
        method="POST"
        defaultBody='{"a":1}'
        onBodyChange={onBodyChange}
      />,
    );
    expect(screen.getByLabelText('label.requestBody')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('{"a":1}');
    expect(
      screen.getByRole('button', { name: 'button.prettifyJson' }),
    ).toBeInTheDocument();
  });

  test('Should call onBodyChange when text changes', () => {
    render(
      <BodyEditor method="POST" defaultBody="{}" onBodyChange={onBodyChange} />,
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '{"test":123}' } });
    expect(onBodyChange).toHaveBeenCalledWith('{"test":123}');
  });

  test('Should prettify valid JSON when button clicked', () => {
    render(
      <BodyEditor
        method="POST"
        defaultBody='{"a":1}'
        onBodyChange={onBodyChange}
      />,
    );
    const button = screen.getByRole('button', { name: 'button.prettifyJson' });
    fireEvent.click(button);
    expect(onBodyChange).toHaveBeenCalledWith('{\n  "a": 1\n}');
    expect(screen.getByRole('textbox')).toHaveValue('{\n  "a": 1\n}');
  });

  test('Should not change invalid JSON when button clicked', () => {
    render(
      <BodyEditor
        method="POST"
        defaultBody="{a:1}"
        onBodyChange={onBodyChange}
      />,
    );
    const button = screen.getByRole('button', { name: 'button.prettifyJson' });
    fireEvent.click(button);
    expect(onBodyChange).toHaveBeenCalledTimes(0);
    expect(screen.getByRole('textbox')).toHaveValue('{a:1}');
  });

  test('Should display bodyError', () => {
    render(
      <BodyEditor
        method="POST"
        defaultBody="{}"
        onBodyChange={onBodyChange}
        bodyError="Error"
      />,
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  test('Should disable Prettify button if body is empty', () => {
    render(
      <BodyEditor method="POST" defaultBody="" onBodyChange={onBodyChange} />,
    );
    const button = screen.getByRole('button', { name: 'button.prettifyJson' });
    expect(button).toBeDisabled();
  });
});
