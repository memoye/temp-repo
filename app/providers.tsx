"use client";

import { showErrorToast } from "@/lib/toast";
import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { LoadingBarContainer } from "react-top-loading-bar";

function makeQueryClient(isClient: boolean = false) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 2,
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

            const axiosError = error as any;
            const errorMessage =
              axiosError.response?.data?.message ||
              query?.meta?.errorMessage ||
              axiosError.response?.data?.errors?.[0] ||
              axiosError.message ||
              "Something went wrong!";

            showErrorToast(errorMessage as string, {
              description: query?.meta?.errorDescription as string,
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
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
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
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </LoadingBarContainer>
      </ThemeProvider>
    </SessionProvider>
  );
}
