import { ToastProvider } from "@/components/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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
      }),
  );

  // Capture ref query param (e.g. ?ref=masterclass) and persist to localStorage
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const ref = router.query.ref;
    if (typeof ref === "string" && ref.trim()) {
      localStorage.setItem("inda_ref", ref.trim());
    }
  }, [router.isReady, router.query.ref]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <Head>
              <title>Inda</title>
              <link rel="icon" href="/assets/images/favicon.png" />
            </Head>
            <Component {...pageProps} />
          </ToastProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
