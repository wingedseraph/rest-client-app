import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';
import { routes } from '@/lib/routes';
import { isLocale, isPrivateRoute, isPublicRoute } from '@/lib/typeguards';

import type { Locale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware(routing);

function parsePathname(pathname: string, requestLocale?: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return {
      locale: isLocale(requestLocale) ? requestLocale : routing.defaultLocale,
      cleanPath: '/',
    };
  }

  const firstSegment = segments[0];
  const isLocaleSegment = isLocale(firstSegment);
  const localeFromRequest = isLocale(requestLocale)
    ? requestLocale
    : routing.defaultLocale;
  const locale: Locale = isLocaleSegment ? firstSegment : localeFromRequest;
  const segmentsWithoutLocale = isLocaleSegment ? segments.slice(1) : segments;
  const cleanPath = `/${segmentsWithoutLocale.join('/')}`;

  return { locale, cleanPath };
}

export default function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  if (intlResponse.headers.get('location')) {
    return intlResponse;
  }

  const token = request.cookies.get('authToken')?.value;
  const { pathname, locale: nextUrlLocale } = request.nextUrl;

  const { locale: currentLocale, cleanPath } = parsePathname(
    pathname,
    nextUrlLocale,
  );

  if (isPublicRoute(cleanPath) && token) {
    const targetUrl = new URL(
      `/${currentLocale}${routes.private.REST_CLIENT}`,
      request.url,
    );

    if (request.nextUrl.pathname !== targetUrl.pathname) {
      return NextResponse.redirect(targetUrl);
    }
  }

  if (isPrivateRoute(cleanPath) && !token) {
    const targetUrl = new URL(
      `/${currentLocale}${routes.public.LOGIN}`,
      request.url,
    );

    if (request.nextUrl.pathname !== targetUrl.pathname) {
      return NextResponse.redirect(targetUrl);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
