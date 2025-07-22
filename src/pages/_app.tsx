import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Inda</title>
        <link rel="icon" href="/assets/images/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
