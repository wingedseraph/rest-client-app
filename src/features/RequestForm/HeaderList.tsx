import { Button } from '@/shared/ui/Button/button';

import { useTranslations } from 'next-intl';

type Props = {
  headers: Record<PropertyKey, string> | undefined;
  onRemove: (key: string) => void;
};

export default function HeaderList({ headers, onRemove }: Props) {
  const t = useTranslations('RequestForm');
  return (
    <>
      {Object.entries(headers || {}).map(([key, value]) => (
        <div key={key} className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded bg-gray-100 px-2 py-1 font-mono">{key}</span>
          <span className="text-gray-600">:</span>
          <span className="flex-1 rounded bg-gray-100 px-2 py-1 font-mono">
            {value}
          </span>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onRemove(key)}
            className="text-foreground text-sm no-underline hover:bg-foreground hover:text-background"
          >
            {t('button.remove')}
          </Button>
        </div>
      ))}
    </>
  );
}
