import { use } from 'react';

import { type Locale, useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);

  const t = useTranslations('Hello');

  return <p>{t('title')}</p>;
}
