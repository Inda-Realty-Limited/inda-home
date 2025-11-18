import { Head, Html, Main, NextScript } from "next/document";

const CLARITY_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Microsoft Clarity */}
        {CLARITY_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
          `,
          }}
        />
        )}
        {/* Google Analytics */}
        {GA_ID && (
          <>
        <script
          async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
                  gtag('config', '${GA_ID}');
            `,
          }}
        />
          </>
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
