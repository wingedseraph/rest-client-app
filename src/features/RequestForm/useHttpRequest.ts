import { type FormEvent, useState } from 'react';

import { useTranslations } from 'next-intl';

export type HttpRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  name?: string;
};

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
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

    if (
      ['POST', 'PUT', 'PATCH'].includes(method) &&
      body &&
      !isJsonString(body)
    ) {
      setError((prev) => ({ ...prev, body: t('error.wrongBody') }));
      return;
    }

    const encodedUrl = btoa(url);
    let apiUrl = `/api/${method}/${encodedUrl}`;

    if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const encodedBody = btoa(body);
      apiUrl += `/${encodedBody}`;
    }

    const queryParams = new URLSearchParams();
    Object.entries(request.headers || {}).forEach(([key, value]) => {
      queryParams.append(key, encodeURIComponent(value));
    });

    if (queryParams.toString()) {
      apiUrl += `?${queryParams.toString()}`;
    }

    const displayUrl = apiUrl.replace('/api', '');
    window.history.pushState({}, '', displayUrl);

    const modifiedRequest: HttpRequest = {
      url,
      method,
      headers: request.headers,
      body: body ? JSON.parse(body) : '',
      name: request.name || '',
    };

    try {
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: Object.fromEntries(
          Object.entries(request.headers || {}).map(([key, value]) => [
            key,
            value,
          ]),
        ),
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
