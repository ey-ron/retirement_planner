import "@/styles/globals.css";
import { Montserrat } from "next/font/google";
import Head from "next/head";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-mont", display: "swap", preload: false });

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" key="favicon"/>
        <link rel="apple-touch-icon" href="/favicon.ico" key="apple" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main className={montserrat.className} suppressHydrationWarning>
        <Component {...pageProps} />
      </main>
    </>
  );
}
