import { routing } from '@/i18n/routing';

import { describe, expect, test } from 'vitest';

describe('routing', () => {
  test('should have correct locales', () => {
    expect(routing.locales).toEqual(['en', 'ru']);
  });

  test('should have correct default locale', () => {
    expect(routing.defaultLocale).toBe('en');
  });

  test('should have locales as readonly array', () => {
    expect(routing.locales).toHaveLength(2);
    expect(routing.locales[0]).toBe('en');
    expect(routing.locales[1]).toBe('ru');
  });

  test('should have defaultLocale as readonly string', () => {
    expect(typeof routing.defaultLocale).toBe('string');
    expect(routing.defaultLocale).toBe('en');
  });
});
