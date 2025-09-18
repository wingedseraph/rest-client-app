import { type FormEvent, useState } from 'react';

import type { HttpRequest, RequestError } from './useSharedRequest';
import { useTranslations } from 'next-intl';

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

type Props = {
  request: HttpRequest;
  updateRequest: (updates: Partial<HttpRequest>) => void;
  setRequestError: (error: RequestError) => void;
  setRequestResponse: (response: unknown) => void;
};

export function useHttpRequest({
  request,
  updateRequest,
  setRequestError,
  setRequestResponse,
}: Props) {
  const t = useTranslations('RequestForm');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setRequestError({ api: '', body: '' });

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
      setRequestError({ api: '', body: t('error.wrongBody') });
      return;
    }

    updateRequest({ url, method, body });

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
    };

    try {
      setIsLoading(true);
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
      setRequestResponse(data);
    } catch {
      setRequestResponse({
        error: 'Wrong Request',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
  };
}
