import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import Head from "next/head";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-mont", display: "swap", preload: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#F2F2F7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" key="favicon"/>
        <link rel="apple-touch-icon" href="/favicon.ico" key="apple" />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
      </Head>
      <main className={`${montserrat.className} w-full h-full h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col fixed inset-0 overscroll-none`} suppressHydrationWarning>
        <Component {...pageProps} />
      </main>
    </>
  );
}
