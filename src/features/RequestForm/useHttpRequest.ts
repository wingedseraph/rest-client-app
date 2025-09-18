import { type FormEvent, useState } from 'react';

import { auth } from '@/lib/firebase/client';
import { firebaseAuthService } from '@/services/authService';

import { useTranslations } from 'next-intl';
import { useAuthState } from 'react-firebase-hooks/auth';

export type HttpRequest = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
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

export function useHttpRequest() {
  const t = useTranslations('RequestForm');
  const [user] = useAuthState(auth);

  const [request, setRequest] = useState<HttpRequest>({
    url: 'https://dummyjson.com/test',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: '',
    name: '',
    size: 0,
    duration: 0,
    timestamp: '',
  });
  const [currentMethod, setCurrentMethod] =
    useState<HttpRequest['method']>('GET');
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState({ api: '', body: '' });
  //  const [currentUser, setCurrentUser] = useState<unknown>(null);

  //  useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setCurrentUser(user);
  //   });

  //   return () => unsubscribe();
  // }, []);

  const getStringSizeInBytes = (str: string): number => {
    return new Blob([str]).size;
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const start = Date.now();
    const date = new Date(start);
    const localeString = date.toLocaleString();

    setError({ api: '', body: '' });

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

    // const modifiedRequest: HttpRequest = {
    //   url,
    //   method,
    //   headers: request.headers,
    //   body: body ? JSON.parse(body) : '',
    //   name: request.name || '',
    //   size: requestPayloadSize
    // };

    try {
      const duration = Date.now() - start;
      const modifiedRequest: HttpRequest = {
        url,
        method,
        headers: request.headers,
        body: body ? JSON.parse(body) : '',
        name: request.name || '',
        size: requestPayloadSize,
        duration,
        timestamp: localeString,
      };
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
      if (user) {
        await firebaseAuthService.saveUserRequest(user.uid, modifiedRequest);
      }
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
