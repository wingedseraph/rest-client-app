import { type ChangeEvent, memo } from 'react';

import type { Variable } from '@/features/RequestForm/useHttpRequest';
import { Button } from '@/shared/ui/Button/button';

import { useTranslations } from 'next-intl';

function VariablesInput({
  newVariable,
  errorVariable,
  handleInputChange,
  addVariable,
}: {
  newVariable: Variable;
  errorVariable: string;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement>,
    field: 'key' | 'value',
  ) => void;
  addVariable: () => false | undefined;
}) {
  const t = useTranslations('Variables');

  return (
    <div className="w-full max-w-2xl space-y-3 rounded border p-4">
      <h3 className="font-medium text-lg">{t('add-new-variable')}</h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="key"
          value={newVariable.key}
          onChange={(event) => handleInputChange(event, 'key')}
          className="my-4 w-full flex-1 rounded border border-gray-300 px-2 py-1 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground sm:w-auto"
        />
        <input
          type="text"
          placeholder="value"
          value={newVariable.value}
          onChange={(event) => handleInputChange(event, 'value')}
          className="my-4 w-full flex-1 rounded border border-gray-300 px-2 py-1 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground sm:w-auto"
        />
        <Button
          type="button"
          onClick={addVariable}
          variant="ghost"
          className="text-foreground text-sm no-underline hover:bg-foreground hover:text-background"
          disabled={!newVariable.key.trim() || !newVariable.value.trim()}
        >
          {t('add-variable')}
        </Button>
      </div>
      {errorVariable && <p>{errorVariable}</p>}
    </div>
  );
}
export default memo(VariablesInput);
