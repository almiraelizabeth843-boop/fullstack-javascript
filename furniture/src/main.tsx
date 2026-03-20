import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom";

import './index.css'
import { router } from './routes.tsx';

import { QueryClient, QueryClientProvider, MutationCache, QueryCache } from "@tanstack/react-query";

import { Toaster, toast } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: Error) => {
      toast.error("An error occurred", {
        description: error.message || "Connection failed",
      });
    }
  }),
  queryCache: new QueryCache({
    onError: (error: Error) => {
      toast.error("Connection Error", {
        description: error.message || "Unable to reach the server",
      });
    }
  })
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="bottom-right" richColors closeButton />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
