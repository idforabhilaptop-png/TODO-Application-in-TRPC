import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus : false,
        staleTime: 60 * 1000, // 1 min — avoids refetch on mount
      },
    },
  });
}