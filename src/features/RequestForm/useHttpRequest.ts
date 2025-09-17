import { type FormEvent, useState } from 'react';

import { useLocalStorage } from '../Variables/useLocalStorage';
import { useTranslations } from 'next-intl';

export type HttpRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  name?: string;
};

export type Variable = {
  id: string;
  key: string;
  value: string;
};

export const LOCAL_STORAGE_KEY = 'REST::CLIENT::VARIABLES' as const;

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
};

const interpolateVariables = (text: string, variables: Variable[]): string => {
  return variables.reduce((acc, variable) => {
    const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');

    return acc.replace(regex, variable.value);
  }, text);
};

export const HTML_METHODS = {
  GET: { id: 1, value: 'GET' },
  POST: { id: 2, value: 'POST' },
  PUT: { id: 3, value: 'PUT' },
  PATCH: { id: 4, value: 'PATCH' },
  DELETE: { id: 5, value: 'DELETE' },
} as const;

export function useHttpRequest() {
  const t = useTranslations('RequestForm');
  const [variables] = useLocalStorage<Variable[]>(LOCAL_STORAGE_KEY, []);

  const [request, setRequest] = useState<HttpRequest>({
    url: 'https://dummyjson.com/test',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: '',
    name: '',
  });
  const [currentMethod, setCurrentMethod] =
    useState<HttpRequest['method']>('GET');
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState({ api: '', body: '' });

  const addHeader = (key: string, value: string) => {
    if (!key || !value) return;
    setRequest((prev) => ({
      ...prev,
      headers: { ...prev.headers, [key]: value },
    }));
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...(request.headers || {}) };
    delete newHeaders[key];
    setRequest((prev) => ({ ...prev, headers: newHeaders }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError({ api: '', body: '' });

    const form = new FormData(event.currentTarget);
    const url = (form.get('url') || '').toString().trim();
    const method = (
      form.get('method') || 'GET'
    ).toString() as HttpRequest['method'];

    const body = (form.get('body') || '').toString();

    const modifiedUrl = interpolateVariables(url, variables);
    const modifiedHeaders: HttpRequest['headers'] = {};
    const modifiedBody = interpolateVariables(body, variables);

    if (
      ['POST', 'PUT', 'PATCH'].includes(method) &&
      modifiedBody &&
      !isJsonString(modifiedBody)
    ) {
      setError((prev) => ({ ...prev, body: t('error.wrongBody') }));
      return;
    }

    const encodedUrl = btoa(modifiedUrl);
    let apiUrl = `/api/${method}/${encodedUrl}`;

    if (modifiedBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const encodedBody = btoa(modifiedBody);
      apiUrl += `/${encodedBody}`;
    }

    const queryParams = new URLSearchParams();
    Object.entries(request.headers || {}).forEach(([key, value]) => {
      const interpolateValue = interpolateVariables(value ?? '', variables);

      modifiedHeaders[key] = interpolateValue;
      queryParams.append(key, encodeURIComponent(interpolateValue));
    });

    if (queryParams.toString()) {
      apiUrl += `?${queryParams.toString()}`;
    }

    const displayUrl = apiUrl.replace('/api', '');
    window.history.pushState({}, '', displayUrl);

    const modifiedRequest: HttpRequest = {
      url: modifiedUrl,
      method,
      headers: modifiedHeaders,
      body: modifiedBody ? JSON.parse(modifiedBody) : '',
      name: request.name || '',
    };

    try {
      const interpolateHeaders = Object.fromEntries(
        Object.entries(request.headers || {}).map(([key, value]) => [
          key,
          interpolateVariables(value, variables),
        ]),
      );

      const response = await fetch('/api/request', {
        method: 'POST',
        headers: interpolateHeaders,
        body: JSON.stringify(modifiedRequest),
      });
      const data = await response.json();
      setResponse(data);
    } catch {
      setResponse({
        error: 'Wrong Request',
      });
    }
  };

  return {
    request,
    currentMethod,
    setCurrentMethod,
    response,
    error,
    addHeader,
    removeHeader,
    handleSubmit,
  };
}
