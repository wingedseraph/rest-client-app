'use client';

import { useState } from 'react';

import {
  LOCAL_STORAGE_KEY,
  type Variable,
} from '@/features/RequestForm/useHttpRequest';
import type { HttpRequest } from '@/features/RequestForm/useSharedRequest';
import { interpolateData } from '@/lib/interpolateVariables';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

import CodegenHeader from './CodegenHeader';
import { type CodegenData, GENERATOR_LANG, type Lang } from './CodegenUtils';
import CodeView from './CodeView';
import { useTranslations } from 'next-intl';

export default function CodegenForm({ request }: { request: HttpRequest }) {
  const t = useTranslations('Codegen');

  const [data, setData] = useState<CodegenData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedLang, setSelectedLang] = useState<Lang>('curl');
  const [variables] = useLocalStorage<Variable[]>(LOCAL_STORAGE_KEY, []);

  const {
    url: finalUrl,
    body: finalBody,
    headers: finalHeaders,
  } = interpolateData(
    request.url,
    request.body,
    request.headers || {},
    variables,
  );

  const handleLanguageChange = (lang: Lang) => {
    setSelectedLang(lang);
  };

  const fetchGenerate = async () => {
    if (!request.url?.trim()) {
      setError(t('no-url-generate'));
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const res = await fetch('/api/codegen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: request.method,
          url: finalUrl,
          headers: finalHeaders,
          body: finalBody,
          language: GENERATOR_LANG[selectedLang].language,
          variant: GENERATOR_LANG[selectedLang].variant,
        }),
      });

      const json = await res.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-2">
      <div className="rounded border-1 border-border">
        <CodegenHeader
          selectedLang={selectedLang}
          onLanguageChangeAction={handleLanguageChange}
          onGenerateAction={fetchGenerate}
          isGenerateDisabled={!request.url?.trim() || isLoading}
          isLoading={isLoading}
        />

        <div className="mt-2 p-4">
          <CodeView data={data} error={error} />
        </div>
      </div>
    </section>
  );
}
