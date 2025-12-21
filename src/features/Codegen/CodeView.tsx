'use client';

import type { CodegenData } from './CodegenUtils';
import { useTranslations } from 'next-intl';

type Props = {
  data: CodegenData | null;
  error: string | null;
};

export default function CodeView({ data, error }: Props) {
  const t = useTranslations('Codegen');

  if (error) {
    return (
      <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (data) {
    return (
      <div className="space-y-4">
        <pre className="max-h-[70vh] max-w-full overflow-auto whitespace-pre-wrap break-words break-all rounded p-2 text-sm">
          {data.snippet}
        </pre>
      </div>
    );
  }

  return (
    <div className="flex max-h-[70vh] space-y-4">
      <p className="text-sm">{t('no-generated-code')}</p>
    </div>
  );
}
