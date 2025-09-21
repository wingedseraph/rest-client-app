import { memo } from 'react';

import type { Variable } from '@/features/RequestForm/useHttpRequest';
import { Button } from '@/shared/ui/Button/button';
import Spinner from '@/shared/ui/Spinner/spinner';

import { useTranslations } from 'next-intl';

function VariablesList({
  variables,
  deleteVariable,
}: {
  variables: Variable[];
  deleteVariable: (id: string) => void;
}) {
  const t = useTranslations('Variables');

  return (
    <div className="w-full max-w-2xl space-y-2 border-1 border-border p-4">
      {variables.length === 0 && <Spinner />}

      {variables.map((variable) => (
        <div
          key={variable.id}
          className="flex flex-wrap items-center justify-between gap-4 text-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-1 font-mono">
              {variable.key}
            </span>

            <span className="mx-2 text-gray-600">:</span>
            <span className="rounded bg-gray-100 px-2 py-1 font-mono">
              {variable.value}
            </span>
          </div>
          <Button
            type="button"
            onClick={() => deleteVariable(variable.id)}
            variant="ghost"
            className="text-foreground text-sm no-underline hover:bg-foreground hover:text-background"
          >
            {t('delete-variable')}
          </Button>
        </div>
      ))}
    </div>
  );
}

export default memo(VariablesList);
