'use client';

import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { routes } from '@/lib/routes';
import { useUser } from '@/shared/hooks/useUser';
import { UnderlineText } from '@/shared/ui/Underline/underline';
import type { NavLink } from '@/widgets/layout/Header/Header';

import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Home');

  const { user } = useUser();
  const navLinks: NavLink[] = user
    ? [
        {
          label: t('client'),
          href: routes.private.REST_CLIENT,
        },
        {
          label: t('variables'),
          href: routes.private.VARIABLES,
        },
        {
          label: t('history'),
          href: routes.private.HISTORY,
        },
      ]
    : [
        { label: t('signIn'), href: routes.public.LOGIN },
        { label: t('signUp'), href: routes.public.REGISTER },
      ];

  return (
    <div className="flex flex-col gap-4 text-base text-foreground sm:text-kg lg:text-xl lg:leading-8">
      <div className="h-20 w-full bg-muted">
        <nav className="flex h-full w-full flex-col items-center justify-center gap-0 text-4xl sm:flex-row sm:gap-5">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex flex-col items-center justify-between sm:flex-row">
        <p className="text-center sm:text-left"> {t('project')}</p>
        <Image
          src="/bread-walk.jpg"
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
          src="/bread-green.jpg"
          alt="bread-hardtime"
          width={512}
          height={512}
          className="order-2 h-auto w-full max-w-sm sm:order-1 sm:max-w-md lg:max-w-lg"
          priority
        />
      </div>

      <div className="flex flex-col items-center justify-between sm:flex-row">
        <p className="text-center sm:text-left">
          {t.rich('developers', {
            underline: UnderlineText,
          })}
        </p>

        <Image
          src="/bread-team-cats.jpg"
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
