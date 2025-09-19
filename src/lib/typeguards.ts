import { routing } from '@/i18n/routing';
import {
  type PrivateRoutes,
  type PublicRoutes,
  privateRoutes,
  publicRoutes,
} from '@/lib/routes';

import type { Locale } from 'next-intl';

export function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}

export function isPublicRoute(path: string): path is PublicRoutes {
  return publicRoutes.includes(path as PublicRoutes);
}

export function isPrivateRoute(path: string): path is PrivateRoutes {
  return privateRoutes.includes(path as PrivateRoutes);
}
