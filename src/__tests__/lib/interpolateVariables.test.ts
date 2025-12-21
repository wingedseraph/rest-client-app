import {
  interpolateData,
  interpolateVariables,
  type Variable,
} from '@/lib/interpolateVariables';

import { describe, expect, test } from 'vitest';

describe('interpolateVariables', () => {
  test('replaces single variable', () => {
    const text = 'Hello, {{name}}!';
    const variables: Variable[] = [{ id: '1', key: 'name', value: 'Alice' }];
    expect(interpolateVariables(text, variables)).toBe('Hello, Alice!');
  });

  test('replaces multiple variables', () => {
    const text = 'Hello, {{name}}! Your ID is {{id}}.';
    const variables: Variable[] = [
      { id: '1', key: 'name', value: 'Alice' },
      { id: '2', key: 'id', value: '123' },
    ];
    expect(interpolateVariables(text, variables)).toBe(
      'Hello, Alice! Your ID is 123.',
    );
  });

  test('handles repeated variables', () => {
    const text = '{{name}} and {{name}}';
    const variables: Variable[] = [{ id: '1', key: 'name', value: 'Bob' }];
    expect(interpolateVariables(text, variables)).toBe('Bob and Bob');
  });

  test('leaves unknown variables intact', () => {
    const text = 'Hello, {{unknown}}!';
    const variables: Variable[] = [{ id: '1', key: 'name', value: 'Alice' }];
    expect(interpolateVariables(text, variables)).toBe('Hello, {{unknown}}!');
  });

  test('returns original text if variables array is empty', () => {
    expect(interpolateVariables('Test', [])).toBe('Test');
  });
});

describe('interpolateData', () => {
  const variables: Variable[] = [
    { id: '1', key: 'name', value: 'Alice' },
    { id: '2', key: 'id', value: '123' },
  ];

  test('interpolates url, body, and headers', () => {
    const url = '/user/{{id}}';
    const body = '{"name": "{{name}}"}';
    const headers = { Authorization: 'Bearer {{id}}' };

    const result = interpolateData(url, body, headers, variables);

    expect(result.url).toBe('/user/123');
    expect(result.body).toBe('{"name": "Alice"}');
    expect(result.headers.Authorization).toBe('Bearer 123');
  });

  test('handles empty url, body, and headers', () => {
    const result = interpolateData('', '', {}, variables);
    expect(result.url).toBe('');
    expect(result.body).toBe('');
    expect(result.headers).toEqual({});
  });

  test('handles undefined header values', () => {
    const headers = { 'X-Test': undefined };
    const result = interpolateData('', '', headers, variables);
    expect(result.headers['X-Test']).toBe('');
  });

  test('leaves placeholders not in variables intact', () => {
    const url = '/user/{{unknown}}';
    const body = 'Hello {{unknown}}';
    const headers = { 'X-Test': 'Value {{unknown}}' };

    const result = interpolateData(url, body, headers, variables);

    expect(result.url).toBe('/user/{{unknown}}');
    expect(result.body).toBe('Hello {{unknown}}');
    expect(result.headers['X-Test']).toBe('Value {{unknown}}');
  });
});
