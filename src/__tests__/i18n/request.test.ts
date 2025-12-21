import requestConfig from '@/i18n/request';

import { describe, expect, test, vi } from 'vitest';

vi.mock('next-intl/server', () => ({
  getRequestConfig: vi.fn((callback) => callback),
}));

vi.mock('next-intl', () => ({
  hasLocale: vi.fn((locales, locale) => locales.includes(locale)),
}));

vi.mock('../../messages/en.json', () => ({
  default: { test: 'test message' },
}));

vi.mock('../../messages/ru.json', () => ({
  default: { test: 'тестовое сообщение' },
}));

describe('request config', () => {
  test('should be a function', () => {
    expect(typeof requestConfig).toBe('function');
  });

  test('should return correct config for valid locale', async () => {
    const mockRequestLocale = Promise.resolve('en');
    const result = await requestConfig({ requestLocale: mockRequestLocale });

    expect(result).toHaveProperty('locale');
    expect(result).toHaveProperty('messages');
    expect(result.locale).toBe('en');
    expect(result.messages).toBeDefined();
  });

  test('should return default locale for invalid locale', async () => {
    const mockRequestLocale = Promise.resolve('invalid');
    const result = await requestConfig({ requestLocale: mockRequestLocale });

    expect(result).toHaveProperty('locale');
    expect(result).toHaveProperty('messages');
    expect(result.locale).toBe('en');
    expect(result.messages).toBeDefined();
  });

  test('should return correct config for Russian locale', async () => {
    const mockRequestLocale = Promise.resolve('ru');
    const result = await requestConfig({ requestLocale: mockRequestLocale });

    expect(result).toHaveProperty('locale');
    expect(result).toHaveProperty('messages');
    expect(result.locale).toBe('ru');
    expect(result.messages).toBeDefined();
  });

  test('should handle undefined requestLocale', async () => {
    const mockRequestLocale = Promise.resolve(undefined);
    const result = await requestConfig({ requestLocale: mockRequestLocale });

    expect(result).toHaveProperty('locale');
    expect(result).toHaveProperty('messages');
    expect(result.locale).toBe('en');
    expect(result.messages).toBeDefined();
  });
});
