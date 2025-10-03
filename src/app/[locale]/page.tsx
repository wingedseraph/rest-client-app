import Image from 'next/image';

import { UnderlineText } from '@/shared/ui/Underline/underline';

import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('Home');

  return (
    <div className="flex flex-col gap-4 text-base text-foreground sm:text-kg lg:text-xl lg:leading-8">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <p className="text-center sm:text-left">{t('project')}</p>
        <Image
          src="/bread-walk.avif"
          alt="bread-walk"
          width={360}
          height={360}
          className="h-auto w-full max-w-sm sm:max-w-md lg:max-w-lg"
          priority
        />
      </div>

      <div className="flex flex-col items-center justify-end sm:flex-row sm:justify-center">
        <p className="order-1 sm:order-2">{t('course')}</p>
        <Image
          src="/bread-green.avif"
          alt="bread-hardtime"
          width={512}
          height={512}
          className="order-2 h-auto w-full max-w-sm sm:order-1 sm:max-w-md lg:max-w-lg"
          priority
        />
      </div>

      <div className="flex flex-col items-center justify-between sm:flex-row">
        <p className="text-center sm:text-left">
          {t.rich('developers', { underline: UnderlineText })}
        </p>

        <Image
          src="/bread-team-cats.avif"
          alt="bread-team-cats"
          width={512}
          height={512}
          className="h-auto w-full max-w-sm sm:max-w-md lg:max-w-lg"
          priority
        />
      </div>
    </div>
  );
}
