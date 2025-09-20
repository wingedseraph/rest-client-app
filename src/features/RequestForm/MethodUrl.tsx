import { Button } from '@/shared/ui/button';

import { HTML_METHODS } from './useHttpRequest';
import type { HttpRequest } from './useSharedRequest';
import { useTranslations } from 'next-intl';

type Props = {
  method: HttpRequest['method'];
  onMethodChange: (method: HttpRequest['method']) => void;
  defaultUrl: string;
  onUrlChange: (url: string) => void;
  isLoading: boolean;
};

export default function MethodUrl({
  method,
  onMethodChange,
  defaultUrl,
  onUrlChange,
  isLoading,
}: Props) {
  const t = useTranslations('RequestForm');
  return (
    <div className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:p-0">
      <select
        name="method"
        defaultValue={method}
        onChange={(e) =>
          onMethodChange(e.target.value as HttpRequest['method'])
        }
      >
        {Object.values(HTML_METHODS).map((method) => (
          <option key={method.id} value={method.value}>
            {method.value}
          </option>
        ))}
      </select>
      <input
        name="url"
        type="text"
        required
        className="my-4 w-full flex-1 rounded border border-gray-300 px-2 py-1 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-foreground sm:w-auto"
        defaultValue={defaultUrl}
        placeholder={t('url')}
        onChange={(e) => onUrlChange(e.target.value)}
      />
      <Button
        type="submit"
        variant="ghost"
        className="text-foreground text-sm no-underline hover:bg-foreground hover:text-background"
      >
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border-current border-b-2" />
            <p className="text-fg-muted">{t('button.request-loading')}</p>
          </div>
        )}
        {!isLoading && t('button.request')}
      </Button>
    </div>
  );
}
