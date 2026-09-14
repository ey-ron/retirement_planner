import Head from "next/head";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <main className="min-h-screen w-full bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-6xl font-black text-[#D4AF37] mb-2">404</h1>
        <p className="text-lg text-white/60 mb-6">Page not found.</p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black font-bold text-sm active:scale-95 transition-transform"
        >
          Return to Dashboard
        </Link>
      </main>
    </>
  );
};

export default NotFound;
