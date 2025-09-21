import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setState(JSON.parse(item));
      }
      setIsLoaded(true);
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Error loading from localStorage:', error.message);
      }
      setIsLoaded(true);
    }
  }, [key, isClient]);

  useEffect(() => {
    if (!isClient || !isLoaded) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      if (error instanceof Error) {
        console.warn('Error saving to localStorage:', error.message);
      }
    }
  }, [key, state, isClient, isLoaded]);

  return [state, setState];
}
