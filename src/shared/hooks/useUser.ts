import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser() {
  const { data, error, mutate } = useSWR('/api/me', fetcher);

  return {
    isAuthenticated: !!data?.user,
    loading: !error && !data,
    user: data?.user,
    mutateUser: mutate,
  };
}
