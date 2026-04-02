import { StrictMode, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import type { AppRouter } from "../../server/index"
import { makeQueryClient } from "../utils/query-client.ts"
import { TRPCProvider } from '../utils/trpc.ts'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

export function Root() {
  const [queryClient] = useState(() => makeQueryClient())
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000',
          async headers() {
            return {
              authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        }),
      ],
    })
  )

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </TRPCProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Root />)
