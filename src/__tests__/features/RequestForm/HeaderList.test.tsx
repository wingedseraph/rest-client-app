import HeaderList from '@/features/RequestForm/HeaderList';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('HeaderList', () => {
  test('Should render without crashing', () => {
    render(<HeaderList headers={{}} onRemove={vi.fn()} />);
    expect(screen.queryByText(/:/)).not.toBeInTheDocument();
  });

  test('Should render header items correctly', () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'token',
    };
    render(<HeaderList headers={headers} onRemove={vi.fn()} />);

    expect(screen.getByText('Content-Type')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
    expect(screen.getByText('Authorization')).toBeInTheDocument();
    expect(screen.getByText('token')).toBeInTheDocument();
    expect(screen.getAllByText('button.remove')).toHaveLength(2);
  });

  test('Should call onRemove when remove button is clicked', () => {
    const headers = { 'X-Test': 'value' };
    const onRemove = vi.fn();
    render(<HeaderList headers={headers} onRemove={onRemove} />);

    const removeButton = screen.getByText('button.remove');
    fireEvent.click(removeButton);

    expect(onRemove).toHaveBeenCalledWith('X-Test');
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
