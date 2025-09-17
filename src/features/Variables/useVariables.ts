import { type ChangeEvent, useCallback, useMemo, useState } from 'react';

import {
  LOCAL_STORAGE_KEY,
  type Variable,
} from '@/features/RequestForm/useHttpRequest';

import { useLocalStorage } from './useLocalStorage';
import { useTranslations } from 'next-intl';

export function useVariables() {
  const t = useTranslations('Variables');
  const [errorVariable, setErrorVariable] = useState('');
  const [newVariable, setNewVariable] = useState<Variable>({
    id: crypto.randomUUID(),
    key: '',
    value: '',
  });
  const [variables, setVariables] = useLocalStorage<Variable[]>(
    LOCAL_STORAGE_KEY,
    [],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, field: 'key' | 'value') => {
      const { value } = event.target;
      setNewVariable((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const addVariable = useCallback(() => {
    if (!newVariable.key.trim() || !newVariable.value.trim()) return;

    const keyExists = variables.some(
      (variable) => variable.key === newVariable.key,
    );
    if (keyExists) {
      setErrorVariable(t('error'));
      return false;
    }

    setVariables((prev) => [...prev, newVariable]);
    setNewVariable({
      id: crypto.randomUUID(),
      key: '',
      value: '',
    });
  }, [newVariable, variables, setVariables, t]);

  const deleteVariable = useCallback(
    (id: string) => {
      setVariables((prev) => prev.filter((variable) => variable.id !== id));
    },
    [setVariables],
  );

  return useMemo(
    () => ({
      newVariable,
      variables,
      errorVariable,
      handleInputChange,
      addVariable,
      deleteVariable,
    }),
    [
      newVariable,
      variables,
      errorVariable,
      handleInputChange,
      addVariable,
      deleteVariable,
    ],
  );
}
