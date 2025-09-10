import { ToastProvider } from "@/components/ToastProvider";
import "@/styles/globals.css";
// Mapbox GL styles (for MapboxMap component)
// Mapbox styles no longer needed after reverting to Google Street View
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true,
            staleTime: 5 * 60 * 1000,
            gcTime: 20 * 60 * 1000,
            retry: 2,
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Head>
          <title>Inda</title>
          <link rel="icon" href="/assets/images/favicon.png" />
        </Head>
        <Component {...pageProps} />
      </ToastProvider>
    </QueryClientProvider>
  );
}
