export const GENERATOR_LANG = {
  curl: { language: 'curl', variant: 'cURL' },
  'javascript-fetch': { language: 'javascript', variant: 'Fetch' },
  'javascript-xhr': { language: 'javascript', variant: 'XHR' },
  nodejs: { language: 'nodejs', variant: 'Request' },
  python: { language: 'python', variant: 'Requests' },
  java: { language: 'java', variant: 'OkHttp' },
  csharp: { language: 'csharp', variant: 'HttpClient' },
  go: { language: 'go', variant: 'Native' },
} as const;

export type Lang = keyof typeof GENERATOR_LANG;
export type CodegenData = {
  language: string;
  variant: string;
  snippet: string;
};
