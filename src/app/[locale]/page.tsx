import { use } from 'react';
import Image from 'next/image';

import { type Locale, useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);

  const t = useTranslations('Home');

  return (
    <div className="flex flex-col gap-4 text-foreground text-lg sm:text-2xl lg:text-3xl">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center sm:text-left"> {t('project')}</p>
        <Image
          src="/bread-walk.jpg"
          alt="bread-walk image"
          width={600}
          height={100}
          className="h-auto w-full max-w-sm sm:max-w-md lg:max-w-lg"
        />
      </div>
      <div className="flex flex-col items-center justify-end gap-4 sm:flex-row sm:justify-center">
        <Image
          src="/bread-green.jpg"
          alt="bread-hardtime image"
          width={600}
          height={100}
          className="h-auto w-full max-w-sm sm:order-none sm:max-w-md lg:max-w-lg"
        />
        <p className="sm:order-none sm:text-right"> {t('course')}</p>
      </div>
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-center sm:text-left"> {t('developers')}</p>
        <Image
          src="/bread-team-cats.jpg"
          alt="bread-team-cats image"
          width={900}
          height={100}
          className="h-auto w-full max-w-sm sm:max-w-md lg:max-w-lg"
        />
      </div>
    </div>
  );
}
