import Head from "next/head";
import React, { useState, useEffect } from "react";
import HomeDashboard from "../components/dashboard/HomeDashboard";

// Default visitor profile
const defaultOfflineUser = {
  id: "visitor",
  email: "visitor@local",
  user_metadata: {
    full_name: "Visitor",
    birth_date: "1995-01-01"
  }
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch (e) {}
    }
  }, []);

  return (
    <>
      <Head>
        <title>Retirement Simulator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/icon-512x512.png" key="favicon" />
        <link rel="apple-touch-icon" href="/icon-512x512.png" key="apple" />
      </Head>

      <div className="w-full min-h-screen bg-[#F2F2F7] text-[#1C1C1E] font-sans antialiased" suppressHydrationWarning>
        {mounted && <HomeDashboard user={defaultOfflineUser} />}
      </div>
    </>
  );
}