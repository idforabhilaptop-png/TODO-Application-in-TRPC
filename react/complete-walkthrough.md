Let me check the latest tRPC + TanStack Query docs first.Here's the complete end-to-end setup for **tRPC v11 + TanStack Query** with a standalone backend (React, not Next.js).

---

## Step 1 — Install packages

```bash
npm install @trpc/server @trpc/client @trpc/tanstack-react-query @tanstack/react-query zod
```

---

## Step 2 — `utils/trpc.ts` ✅ (you already have this)

```ts
import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { AppRouter } from '../server/router';

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
```

---

## Step 3 — `utils/query-client.ts`

Create a `QueryClient` factory with sensible defaults:

```ts
import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min — avoids refetch on mount
      },
    },
  });
}
```

---

## Step 4 — `main.tsx` — Wire up providers

```tsx
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/router';
import { TRPCProvider } from './utils/trpc';
import { makeQueryClient } from './utils/query-client';
import App from './App';

function Root() {
  // useState ensures each component tree gets its own client (important for SSR too)
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/trpc', // 👈 your standalone backend URL
          // Optional: attach auth headers
          // headers() {
          //   return { authorization: `Bearer ${getToken()}` };
          // },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <App />
      </TRPCProvider>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
```

---

## Step 5 — Using tRPC in components

### Query (GET data)
```tsx
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';

export function UserList() {
  const trpc = useTRPC();

  const { data, isLoading } = useQuery(trpc.user.list.queryOptions());

  if (isLoading) return <p>Loading...</p>;
  return <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Query with input
```tsx
const { data } = useQuery(trpc.user.byId.queryOptions({ id: '123' }));
```

### Mutation (POST/write data)
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '../utils/trpc';

export function CreateUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    trpc.user.create.mutationOptions({
      onSuccess: () => {
        // Invalidate & refetch the list after creating
        queryClient.invalidateQueries(trpc.user.list.queryFilter());
      },
    })
  );

  return (
    <button onClick={() => mutation.mutate({ name: 'Alice' })}>
      Create User
    </button>
  );
}
```

---

## Key things to note

| Concept | v11 new way |
|---|---|
| Query | `useQuery(trpc.x.queryOptions(...))` |
| Mutation | `useMutation(trpc.x.mutationOptions(...))` |
| Invalidation | `queryClient.invalidateQueries(trpc.x.queryFilter())` |
| Direct client | `useTRPCClient()` for imperative calls |

The big shift in v11 is that **tRPC no longer wraps `useQuery`/`useMutation`** — it instead provides `queryOptions()` and `mutationOptions()` factories that you pass directly into TanStack Query's own hooks. This makes it fully compatible with the React Compiler and standard TanStack Query patterns.




**explanation of the above providers**

## Code Explanation

This code sets up **tRPC** (TypeScript Remote Procedure Call) with **React Query** for type-safe API communication between your frontend and backend. Let me break it down piece by piece.

---

### 1. `query-client.ts` — React Query Client Factory

```ts
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min
      },
    },
  });
}
```

- `QueryClient` is the **cache manager** from React Query — it stores fetched data, handles background refetches, etc.
- `staleTime: 60000` means fetched data is considered "fresh" for 1 minute, so React Query **won't re-fetch** it if you revisit a component within that window.
- It's a **factory function** (not a singleton) so each render tree (e.g. in SSR) gets its own isolated client.

---

### 2. `trpc.ts` — tRPC Context Helpers

```ts
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();
```

- `createTRPCContext<AppRouter>()` wires tRPC to your backend's `AppRouter` type, enabling **end-to-end type safety**.
- It returns three things:

| Export | Purpose |
|---|---|
| `TRPCProvider` | React context provider that connects tRPC + React Query |
| `useTRPC` | Hook to call tRPC procedures in components (with React Query) |
| `useTRPCClient` | Hook to get the raw tRPC client (for manual calls) |

---

### 3. `Root` Component — Wiring Everything Together

```tsx
const [queryClient] = useState(() => makeQueryClient());
const [trpcClient] = useState(() => createTRPCClient<AppRouter>({ ... }));
```

- Both clients are created **inside `useState`** so they're created once per component mount and never recreated on re-renders. This also makes SSR safe.
- `createTRPCClient` configures **how** to talk to your backend:

```ts
httpBatchLink({
  url: 'http://localhost:3000/trpc',
})
```

`httpBatchLink` is smart — it **batches multiple API calls** made in the same render tick into a single HTTP request, reducing round trips.

```tsx
return (
  <QueryClientProvider client={queryClient}>      // ← React Query cache
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>  // ← tRPC layer
      <StrictMode>
        <App />
      </StrictMode>
    </TRPCProvider>
  </QueryClientProvider>
);
```

The **provider nesting order** matters:
1. `QueryClientProvider` sets up the React Query cache globally
2. `TRPCProvider` connects tRPC to that same cache, so tRPC queries are stored and managed by React Query
3. `App` (and all its children) can now use `useTRPC()` to call backend procedures

---

### The Big Picture

```
Backend (AppRouter)
      ↕  HTTP (batched)
  trpcClient  ←→  TRPCProvider
                      ↕
                 QueryClient  (caching, refetch, stale logic)
                      ↕
                  <App /> components
                  (use useTRPC() to call APIs)
```

When a component calls something like `useTRPC().user.getById.useQuery({ id: 1 })`, tRPC translates that into an HTTP call to `/trpc/user.getById`, and React Query handles caching, loading states, and background updates — all **fully type-safe** based on your `AppRouter`.