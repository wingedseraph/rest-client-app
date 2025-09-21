import {
  type CodegenData,
  GENERATOR_LANG,
  type Lang,
} from '@/features/Codegen/CodegenUtils';

import { describe, expect, it } from 'vitest';

describe('CodegenUtils', () => {
  describe('GENERATOR_LANG', () => {
    it('should contain all expected language configurations', () => {
      expect(GENERATOR_LANG).toEqual({
        curl: { language: 'curl', variant: 'cURL' },
        'javascript-fetch': { language: 'javascript', variant: 'Fetch' },
        'javascript-xhr': { language: 'javascript', variant: 'XHR' },
        nodejs: { language: 'nodejs', variant: 'Request' },
        python: { language: 'python', variant: 'Requests' },
        java: { language: 'java', variant: 'OkHttp' },
        csharp: { language: 'csharp', variant: 'HttpClient' },
        go: { language: 'go', variant: 'Native' },
      });
    });

    it('should have correct language property for each key', () => {
      const expectedLanguages = [
        'curl',
        'javascript',
        'javascript',
        'nodejs',
        'python',
        'java',
        'csharp',
        'go',
      ];

      Object.values(GENERATOR_LANG).forEach((config, index) => {
        expect(config.language).toBe(expectedLanguages[index]);
      });
    });

    it('should have correct variant property for each key', () => {
      const expectedVariants = [
        'cURL',
        'Fetch',
        'XHR',
        'Request',
        'Requests',
        'OkHttp',
        'HttpClient',
        'Native',
      ];

      Object.values(GENERATOR_LANG).forEach((config, index) => {
        expect(config.variant).toBe(expectedVariants[index]);
      });
    });
  });

  describe('types', () => {
    it('should accept valid Lang keys', () => {
      const validKeys: Lang[] = [
        'curl',
        'javascript-fetch',
        'javascript-xhr',
        'nodejs',
        'python',
        'java',
        'csharp',
        'go',
      ];

      validKeys.forEach((key) => {
        expect(GENERATOR_LANG[key]).toBeDefined();
      });
    });

    it('should create valid CodegenData object', () => {
      const codegenData: CodegenData = {
        language: 'javascript',
        variant: 'Fetch',
        snippet: 'fetch("url")',
      };

      expect(codegenData.language).toBe('javascript');
      expect(codegenData.variant).toBe('Fetch');
      expect(codegenData.snippet).toBe('fetch("url")');
    });
  });
});
