'use client';

import LocaleSwitcher from '@/features/Locale/LocaleSwitcher';
import { Link, useRouter } from '@/i18n/navigation';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { firebaseAuthService } from '@/services/authService';
import useScroll from '@/shared/hooks/useScroll';
import { useUser } from '@/shared/hooks/useUser';

import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Header');
  const router = useRouter();
  const { user, mutateUser } = useUser();

  const handleLogout = async () => {
    await firebaseAuthService.logout();
    mutateUser(null, { revalidate: false });
    router.push(routes.public.LOGIN);
  };

  const navLinks: NavLink[] = user
    ? [
        {
          label: t('logout'),
          href: routes.public.LOGIN,
          onClick: handleLogout,
        },
      ]
    : [
        { label: t('signIn'), href: routes.public.LOGIN },
        { label: t('signUp'), href: routes.public.REGISTER },
      ];

  const { sticky, headerRef } = useScroll<HTMLDivElement>();

  return (
    <header
      ref={headerRef}
      className={cn(
        'flex w-full flex-row items-center justify-between space-x-12 border-muted-foreground border-b-1 text-base tracking-tight transition-all sm:text-lg md:space-x-24',
        sticky.isSticky && 'fixed top-0 z-50 animate-slideDown bg-background',
      )}
    >
      <div className="flex flex-row items-center">
        <Link href={routes.public.HOME} className="flex flex-row items-center">
          <p>
            &#123; REST<span className="font-serif italic">ful</span>API &#125;
          </p>
        </Link>
      </div>

      <nav className="flex flex-col gap-0 text-end sm:flex-row sm:gap-5">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={link.onClick}>
            {link.label}
          </Link>
        ))}

        <LocaleSwitcher />
      </nav>
    </header>
  );
}

type NavLink = {
  label: string;
  href: string;
  onClick?: () => void | Promise<void>;
};
