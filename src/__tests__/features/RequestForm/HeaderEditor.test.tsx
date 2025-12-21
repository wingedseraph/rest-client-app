import HeaderEditor from '@/features/RequestForm/HeaderEditor';

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('HeaderEditor', () => {
  const onAdd = vi.fn();

  beforeEach(() => {
    onAdd.mockClear();
  });

  test('Should render inputs and button', () => {
    render(<HeaderEditor onAdd={onAdd} />);
    expect(screen.getByPlaceholderText('key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('value')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'button.addHeader' }),
    ).toBeInTheDocument();
  });

  test('Should show error if key is empty', () => {
    render(<HeaderEditor onAdd={onAdd} />);
    const button = screen.getByRole('button', { name: 'button.addHeader' });
    fireEvent.click(button);
    expect(screen.getByText('error.wrongHeader')).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('Should show error if value is empty', () => {
    render(<HeaderEditor onAdd={onAdd} />);
    const keyInput = screen.getByPlaceholderText('key');
    fireEvent.change(keyInput, { target: { value: 'Authorization' } });
    const button = screen.getByRole('button', { name: 'button.addHeader' });
    fireEvent.click(button);
    expect(screen.getByText('error.wrongHeader')).toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  test('Should call onAdd with key and value and reset inputs on valid submission', () => {
    render(<HeaderEditor onAdd={onAdd} />);
    const keyInput = screen.getByPlaceholderText('key');
    const valueInput = screen.getByPlaceholderText('value');
    const button = screen.getByRole('button', { name: 'button.addHeader' });

    fireEvent.change(keyInput, { target: { value: 'Authorization' } });
    fireEvent.change(valueInput, { target: { value: 'Bearer token' } });
    fireEvent.click(button);

    expect(onAdd).toHaveBeenCalledWith('Authorization', 'Bearer token');
    expect(keyInput).toHaveValue('');
    expect(valueInput).toHaveValue('');
    expect(screen.queryByText('error.wrongHeader')).toBeNull();
  });

  test('Should update key and value inputs on change', () => {
    render(<HeaderEditor onAdd={onAdd} />);
    const keyInput = screen.getByPlaceholderText('key');
    const valueInput = screen.getByPlaceholderText('value');

    fireEvent.change(keyInput, { target: { value: 'X-Test' } });
    fireEvent.change(valueInput, { target: { value: '123' } });

    expect(keyInput).toHaveValue('X-Test');
    expect(valueInput).toHaveValue('123');
  });
});
