import VariablesInput from '@/features/Variables/VariablesInput';

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Variables.add-new-variable': 'Add New Variable',
      'Variables.add-variable': 'Add',
    };
    return translations[key] || 'Add';
  },
}));

describe('VariablesInput', () => {
  const mockHandleInputChange = vi.fn();
  const mockAddVariable = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input fields and add button', () => {
    const newVariable = { id: '1', key: '', value: '' };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();

    expect(screen.getByPlaceholderText('key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('value')).toBeInTheDocument();
  });

  it('should call handleInputChange when key input changes', () => {
    const newVariable = { id: '1', key: '', value: '' };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    const keyInput = screen.getByPlaceholderText('key');
    fireEvent.change(keyInput, { target: { value: 'API_URL' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith(
      expect.any(Object),
      'key',
    );
  });

  it('should call handleInputChange when value input changes', () => {
    const newVariable = { id: '1', key: '', value: '' };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    const valueInput = screen.getByPlaceholderText('value');
    fireEvent.change(valueInput, {
      target: { value: 'https://api.example.com' },
    });

    expect(mockHandleInputChange).toHaveBeenCalledWith(
      expect.any(Object),
      'value',
    );
  });

  it('should call addVariable when add button is clicked', () => {
    const newVariable = {
      id: '1',
      key: 'API_URL',
      value: 'https://api.example.com',
    };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    const addButton = screen.getByRole('button', { name: 'Add' });
    fireEvent.click(addButton);

    expect(mockAddVariable).toHaveBeenCalled();
  });

  it('should disable add button when key is empty', () => {
    const newVariable = { id: '1', key: '', value: 'some-value' };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    const addButton = screen.getByRole('button', { name: 'Add' });
    expect(addButton).toBeDisabled();
  });

  it('should disable add button when value is empty', () => {
    const newVariable = { id: '1', key: 'some-key', value: '' };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    const addButton = screen.getByRole('button', { name: 'Add' });
    expect(addButton).toBeDisabled();
  });

  it('should enable add button when both key and value are filled', () => {
    const newVariable = {
      id: '1',
      key: 'API_URL',
      value: 'https://api.example.com',
    };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    const addButton = screen.getByRole('button', { name: 'Add' });
    expect(addButton).not.toBeDisabled();
  });

  it('should display error message when errorVariable is provided', () => {
    const newVariable = { id: '1', key: '', value: '' };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable="Variable already exists"
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    expect(screen.getByText('Variable already exists')).toBeInTheDocument();
  });

  it('should handle whitespace-only values as empty', () => {
    const newVariable = { id: '1', key: '   ', value: '   ' };

    render(
      <VariablesInput
        newVariable={newVariable}
        errorVariable=""
        handleInputChange={mockHandleInputChange}
        addVariable={mockAddVariable}
      />,
    );

    const addButton = screen.getByRole('button', { name: 'Add' });
    expect(addButton).toBeDisabled();
  });
});
