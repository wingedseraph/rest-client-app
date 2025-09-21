import { routing } from '@/i18n/routing';
import { privateRoutes, publicRoutes } from '@/lib/routes';
import { isLocale, isPrivateRoute, isPublicRoute } from '@/lib/typeguards';

import { describe, expect, test } from 'vitest';

describe('route utils', () => {
  test('isLocale returns true for valid locale', () => {
    const locale = routing.locales[0];
    expect(isLocale(locale)).toBe(true);
  });

  test('isLocale returns false for invalid locale', () => {
    expect(isLocale('not-a-locale')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  test('isPublicRoute returns true for public route', () => {
    const route = publicRoutes[0];
    expect(isPublicRoute(route)).toBe(true);
  });

  test('isPublicRoute returns false for non-public route', () => {
    expect(isPublicRoute('/not-public')).toBe(false);
  });

  test('isPrivateRoute returns true for private route', () => {
    const route = privateRoutes[0];
    expect(isPrivateRoute(route)).toBe(true);
  });

  test('isPrivateRoute returns false for non-private route', () => {
    expect(isPrivateRoute('/not-private')).toBe(false);
  });
});
