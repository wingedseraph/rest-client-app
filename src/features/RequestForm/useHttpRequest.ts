import { type FormEvent, useState } from 'react';

import type { RequestError } from '@/features/RequestForm/useSharedRequest';
import { auth } from '@/lib/firebase/client';
import { interpolateData } from '@/lib/interpolateVariables';
import { firebaseAuthService } from '@/services/authService';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';

import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';

export type HttpRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string | undefined | Record<string, never>;
  name?: string;
  size: number;
  duration: number;
  timestamp: string;
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

export const LOCAL_STORAGE_KEY = 'REST::CLIENT::VARIABLES' as const;

export type Variable = {
  id: string;
  key: string;
  value: string;
};

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
  const [user] = useAuthState(auth);

  const getStringSizeInBytes = (str: string): number => {
    return new Blob([str]).size;
  };

  const [variables] = useLocalStorage<Variable[]>(LOCAL_STORAGE_KEY, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const start = Date.now();
    const date = new Date(start);
    const localeString = date.toLocaleString();

    setRequestError({ api: '', body: '' });

    const form = new FormData(event.currentTarget);
    const url = (form.get('url') || '').toString().trim();
    const method = (
      form.get('method') || 'GET'
    ).toString() as HttpRequest['method'];
    const body = (form.get('body') || '').toString();

    const requestPayloadSize = getStringSizeInBytes(body);
    if (
      ['POST', 'PUT', 'PATCH'].includes(method) &&
      body &&
      !isJsonString(body)
    ) {
      setRequestError({ api: '', body: t('error.wrongBody') });
      return;
    }

    updateRequest({ url, method, body });

    const {
      url: finalUrl,
      body: finalBody,
      headers: finalHeaders,
    } = interpolateData(url, body, request.headers || {}, variables);

    const encodedUrl = btoa(finalUrl);
    let apiUrl = `/api/${method}/${encodedUrl}`;

    if (finalBody && ['POST', 'PUT', 'PATCH'].includes(method)) {
      const encodedBody = btoa(finalBody);
      apiUrl += `/${encodedBody}`;
    }

    const queryParams = new URLSearchParams();
    Object.entries(finalHeaders).forEach(([key, value]) => {
      queryParams.append(key, encodeURIComponent(value));
    });

    if (queryParams.toString()) {
      apiUrl += `?${queryParams.toString()}`;
    }

    const displayUrl = apiUrl.replace('/api', '');
    window.history.pushState({}, '', displayUrl);

    try {
      const duration = Date.now() - start;
      const modifiedRequest: HttpRequest = {
        url: finalUrl,
        method,
        headers: finalHeaders,
        body: finalBody ? JSON.parse(finalBody) : '',
        size: requestPayloadSize,
        duration,
        timestamp: localeString,
      };
      setIsLoading(true);
      const response = await fetch('/api/request', {
        method: 'POST',
        headers: finalHeaders,
        body: JSON.stringify(modifiedRequest),
      });
      const data = await response.json();
      setRequestResponse(data);
      if (user) {
        await firebaseAuthService.saveUserRequest(user.uid, modifiedRequest);
      }
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
