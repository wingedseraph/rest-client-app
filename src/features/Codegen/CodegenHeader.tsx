import { Button } from '@/shared/ui/Button/button';

import { GENERATOR_LANG, type Lang } from './CodegenUtils';
import { useTranslations } from 'next-intl';

type Props = {
  selectedLang: Lang;
  onLanguageChangeAction: (lang: Lang) => void;
  onGenerateAction: () => void;
  isGenerateDisabled: boolean;
  isLoading: boolean;
};

export default function CodegenHeader({
  selectedLang,
  onLanguageChangeAction,
  onGenerateAction,
  isGenerateDisabled,
  isLoading,
}: Props) {
  const t = useTranslations('Codegen');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onLanguageChangeAction(event.target.value as Lang);
  };

  return (
    <div className="flex items-center justify-between border-b bg-muted p-4 text-sm">
      <div className="flex items-center gap-6">
        <select
          id="language-select"
          value={selectedLang}
          onChange={handleChange}
        >
          {Object.entries(GENERATOR_LANG).map(([key]) => (
            <option key={key} value={key}>
              {key.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      <Button
        onClick={onGenerateAction}
        type="button"
        disabled={isGenerateDisabled}
        variant="ghost"
        className="text-foreground text-sm no-underline hover:bg-foreground hover:text-background"
      >
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border-current border-b-2" />
            <p className="text-fg-muted">{t('generating')}</p>
          </div>
        )}
        {!isLoading && t('generate')}
      </Button>
    </div>
  );
}
