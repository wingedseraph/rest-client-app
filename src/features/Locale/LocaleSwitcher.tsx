'use client';

import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/navigation';

import { useLocale, useTranslations } from 'next-intl';

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const pathname = usePathname();

  const otherLocale = locale === 'en' ? 'ru' : 'en';
  const pathWithoutLocale = pathname.replace(/^\/(en|ru)/, '') || '/';

  return (
    <Link href={pathWithoutLocale} locale={otherLocale}>
      {t('switchLocale', { locale: otherLocale })}
    </Link>
  );
}
