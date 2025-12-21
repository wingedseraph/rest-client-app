'use client';

import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/navigation';
import { routes } from '@/lib/routes';
import { useUser } from '@/shared/hooks/useUser';
import type { NavLink } from '@/widgets/layout/Header/Header';

import { useTranslations } from 'next-intl';

export default function Navigation() {
  const t = useTranslations('Home');
  const { user } = useUser();
  const pathname = usePathname();
  const isMainPage = pathname === '/' || pathname.match(/^\/[a-z]{2}$/);

  const appLinks = [
    { label: t('client'), href: routes.private.REST_CLIENT },
    { label: t('variables'), href: routes.private.VARIABLES },
    { label: t('history'), href: routes.private.HISTORY },
  ];

  const authLinks = [
    { label: t('signIn'), href: routes.public.LOGIN },
    { label: t('signUp'), href: routes.public.REGISTER },
  ];

  const navLinks: NavLink[] = isMainPage && !user ? authLinks : appLinks;

  return (
    <nav className="flex h-full w-full flex-row items-center justify-center gap-5 text-lg sm:text-2xl">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
