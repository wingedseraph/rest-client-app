'use client';
import { useState } from 'react';

import type { RequestData } from '@/app/api/request/schema';

export type HttpRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
} & RequestData;

export type RequestError = {
  api: string;
  body: string;
};

export function useSharedRequest() {
  const [request, setRequest] = useState<HttpRequest>({
    url: 'https://dummyjson.com/test',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: '',
  });
  const [currentMethod, setCurrentMethod] =
    useState<HttpRequest['method']>('GET');
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState<RequestError>({ api: '', body: '' });

  const updateRequest = (updates: Partial<HttpRequest>) => {
    setRequest((prev) => ({ ...prev, ...updates }));
  };

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

  const setRequestError = (error: RequestError) => {
    setError((prev) => ({ ...prev, ...error }));
  };

  const setRequestResponse = (response: unknown) => {
    setResponse(response);
  };

  return {
    request,
    currentMethod,
    setCurrentMethod,
    response,
    error,
    updateRequest,
    addHeader,
    removeHeader,
    setRequestError,
    setRequestResponse,
  };
}
