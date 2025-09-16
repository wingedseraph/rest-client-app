import { useCallback, useState } from 'react';

import { Button } from '@/shared/ui/button';

import type { HttpRequest } from './useHttpRequest';
import { useTranslations } from 'next-intl';

type Props = {
  method: HttpRequest['method'];
  defaultBody: string;
  bodyError?: string;
};

export default function BodyEditor({ method, defaultBody, bodyError }: Props) {
  const t = useTranslations('RequestForm');
  const [body, setBody] = useState(defaultBody);

  const prettifyJson = useCallback(() => {
    if (!body) return;
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
    } catch {}
  }, [body]);

  if (!['POST', 'PUT', 'PATCH'].includes(method)) return null;
  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center justify-between">
        <label
          htmlFor="request-body"
          className="font-medium text-gray-700 text-sm"
        >
          {t('label.requestBody')}
        </label>
        <Button
          onClick={prettifyJson}
          type="button"
          variant="ghost"
          disabled={!body}
          className="text-foreground text-sm no-underline hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          {t('button.prettifyJson')}
        </Button>
      </div>
      <textarea
        id="request-body"
        name="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        rows={8}
        placeholder='{"key": "value"}'
      />
      {bodyError && (
        <span className="w-fit bg-foreground text-background">{bodyError}</span>
      )}
    </div>
  );
}
