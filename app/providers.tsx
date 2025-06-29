"use client";

import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LoadingBarContainer } from "react-top-loading-bar";
import { NuqsAdapter } from "nuqs/adapters/next/app"; // 👈 a type-safe search params state manager for react
import { showErrorToast } from "@/lib/toast";
import { ApiError } from "@/lib/api";

function makeQueryClient(isClient: boolean = false) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (except 401 which might be token refreshable)
          if (
            error instanceof ApiError &&
            error.status >= 400 &&
            error.status < 500 &&
            error.status !== 401
          ) {
            return false;
          }
          // Retry others up to 2 times
          return failureCount < 2;
        },
        meta: {
          disableDefaultErrorToast: false,
        },
      },

      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
    queryCache: isClient
      ? new QueryCache({
          onError: (error, query) => {
            // Check if error toast is explicitly disabled
            if (query?.meta?.disableDefaultErrorToast === true) {
              return;
            }

            showErrorToast(error.message, {
              description: (query?.meta?.errorDescription as string) || "",
              closeButton: true,
            });
          },
        })
      : undefined,
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient(true);
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <LoadingBarContainer
          props={{
            color: "hsl(var(--primary))",
          }}
        >
          <QueryClientProvider client={queryClient}>
            <NuqsAdapter>{children}</NuqsAdapter>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </LoadingBarContainer>
      </ThemeProvider>
    </SessionProvider>
  );
}
