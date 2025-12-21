import VariablesList from '@/features/Variables/VariablesList';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'Variables.delete-variable': 'Delete',
    };
    return translations[key] || 'Delete';
  },
}));

describe('VariablesList', () => {
  const mockDeleteVariable = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render variables correctly', () => {
    const variables = [
      { id: '1', key: 'API_URL', value: 'https://api.example.com' },
    ];

    render(
      <VariablesList
        variables={variables}
        deleteVariable={mockDeleteVariable}
      />,
    );

    expect(screen.getByText('API_URL')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com')).toBeInTheDocument();
  });

  it('should render multiple variables', () => {
    const variables = [
      { id: '1', key: 'VAR1', value: 'value1' },
      { id: '2', key: 'VAR2', value: 'value2' },
      { id: '3', key: 'VAR3', value: 'value3' },
    ];

    render(
      <VariablesList
        variables={variables}
        deleteVariable={mockDeleteVariable}
      />,
    );

    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons).toHaveLength(3);

    expect(screen.getByText('VAR1')).toBeInTheDocument();
    expect(screen.getByText('VAR2')).toBeInTheDocument();
    expect(screen.getByText('VAR3')).toBeInTheDocument();
  });
});
