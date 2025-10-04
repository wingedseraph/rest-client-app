'use client';

import { memo } from 'react';

import VariablesInput from '@/features/Variables/VariablesInput';
import VariablesList from '@/features/Variables/VariablesList';

import { useVariables } from './useVariables';
import { useTranslations } from 'next-intl';

function VariablesView() {
  const t = useTranslations('Variables');
  const {
    newVariable,
    variables,
    errorVariable,
    handleInputChange,
    addVariable,
    deleteVariable,
  } = useVariables();

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h3 className="font-semibold text-xl">{t('header')}</h3>

      {variables.length > 0 && (
        <VariablesList variables={variables} deleteVariable={deleteVariable} />
      )}

      <VariablesInput
        addVariable={addVariable}
        errorVariable={errorVariable}
        handleInputChange={handleInputChange}
        newVariable={newVariable}
      />
    </div>
  );
}
export default memo(VariablesView);
