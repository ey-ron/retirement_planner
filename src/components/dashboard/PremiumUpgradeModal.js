import React, { useState, useEffect } from "react";
import {
  X, Sparkles, Check, ArrowRight, ChevronLeft, ChevronRight,
  Globe2, TrendingUp, LineChart, ShieldCheck, LogIn, CheckCircle2, LogOut
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

const CAROUSEL_SLIDES = [
  {
    id: "monte-carlo",
    tag: "Institutional Standard",
    title: "10,000+ Monte Carlo Engine",
    description: "Stress-test survival odds across 10k market cycles.",
    icon: LineChart,
    iconColor: "text-amber-500",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
    snippet: (
      <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-white/10 p-2.5 sm:p-3 flex flex-col justify-between shadow-inner relative overflow-hidden">
        {/* Top preview header */}
        <div className="flex items-center justify-between text-[10.5px] text-slate-300">
          <span className="font-bold flex items-center gap-1.5 text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Monte Carlo Distribution
          </span>
          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-white/10 text-amber-300 font-bold whitespace-nowrap">10k Runs</span>
        </div>
        
        {/* Visual screenshot / canvas placeholder */}
        <div className="flex-1 my-1.5 flex flex-col items-center justify-center border border-dashed border-white/15 rounded-xl bg-white/[0.03] p-2 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-15 flex items-end justify-between px-3 pb-2 pointer-events-none">
            <div className="w-2 bg-amber-400 h-1/3 rounded-t" />
            <div className="w-2 bg-emerald-400 h-2/3 rounded-t" />
            <div className="w-2 bg-emerald-400 h-full rounded-t" />
            <div className="w-2 bg-emerald-400 h-4/5 rounded-t" />
            <div className="w-2 bg-amber-400 h-1/2 rounded-t" />
            <div className="w-2 bg-red-400 h-1/4 rounded-t" />
          </div>
          <LineChart size={20} className="text-amber-400 mb-0.5 z-10" />
          <span className="text-xs font-bold text-white z-10">Stochastic Wealth Simulation</span>
          <span className="text-[10px] text-slate-400 z-10">Simulates market crashes & sequence risk</span>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-1.5 text-[9.5px] sm:text-[10px] text-center font-bold">
          <span className="py-0.5 px-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap truncate">94% Normal</span>
          <span className="py-0.5 px-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap truncate">81% Bear</span>
          <span className="py-0.5 px-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 whitespace-nowrap truncate">68% Crash</span>
        </div>
      </div>
    )
  },
  {
    id: "territory-inflation",
    tag: "Macro Intelligence",
    title: "Auto Regional Inflation",
    description: "Real localized CPI feeds and currency power decay.",
    icon: Globe2,
    iconColor: "text-blue-500",
    badgeBg: "bg-blue-100 text-blue-800 border-blue-200",
    snippet: (
      <div className="w-full h-full bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 rounded-xl border border-blue-500/20 p-2.5 sm:p-3 flex flex-col justify-between shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between text-[10.5px] text-blue-200">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Live Regional Macro Feed
          </span>
          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold whitespace-nowrap">Auto CPI</span>
        </div>

        <div className="flex-1 my-1.5 flex flex-col items-center justify-center border border-dashed border-blue-500/20 rounded-xl bg-white/[0.03] p-2 text-center relative overflow-hidden">
          <Globe2 size={20} className="text-blue-400 mb-0.5 z-10" />
          <span className="text-xs font-bold text-white z-10">Localized Purchasing Power</span>
          <span className="text-[10px] text-slate-400 z-10">Regional inflation & currency decay</span>
        </div>

        <div className="p-1 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[9.5px] sm:text-[10px] whitespace-nowrap px-2">
          <span className="text-slate-300">Rate Anchoring:</span>
          <span className="font-black text-blue-400">Dynamic Regional Core</span>
        </div>
      </div>
    )
  },
  {
    id: "derived-cagr",
    tag: "Portfolio Analytics",
    title: "Auto-Derived Asset CAGR",
    description: "Dynamic weighted compounding for your asset mix.",
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    snippet: (
      <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-xl border border-emerald-500/20 p-2.5 sm:p-3 flex flex-col justify-between shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between text-[10.5px] text-emerald-200">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Weighted Return Modeling
          </span>
          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold whitespace-nowrap">Dynamic</span>
        </div>

        <div className="flex-1 my-1.5 flex flex-col items-center justify-center border border-dashed border-emerald-500/20 rounded-xl bg-white/[0.03] p-2 text-center relative overflow-hidden">
          <TrendingUp size={20} className="text-emerald-400 mb-0.5 z-10" />
          <span className="text-xs font-bold text-white z-10">Multi-Asset Yield Modeling</span>
          <span className="text-[10px] text-slate-400 z-10">Custom weighted returns & historical CAGR</span>
        </div>

        <div className="p-1 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[9.5px] sm:text-[10px] whitespace-nowrap px-2">
          <span className="text-slate-300">Target Split:</span>
          <span className="font-black text-emerald-400">ETFs · Equities · Cash</span>
        </div>
      </div>
    )
  },
  {
    id: "cloud-sync",
    tag: "Supabase Cloud",
    title: "Multi-Plan Cloud Sync",
    description: "Sync plans across all your devices with encrypted cloud storage.",
    icon: ShieldCheck,
    iconColor: "text-purple-500",
    badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
    snippet: (
      <div className="w-full h-full bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 rounded-xl border border-purple-500/20 p-2.5 sm:p-3 flex flex-col justify-between shadow-inner relative overflow-hidden">
        <div className="flex items-center justify-between text-[10.5px] text-purple-200">
          <span className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Cloud Workspace
          </span>
          <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold whitespace-nowrap">Cloud Sync</span>
        </div>

        <div className="flex-1 my-1.5 flex flex-col items-center justify-center border border-dashed border-purple-500/20 rounded-xl bg-white/[0.03] p-2 text-center relative overflow-hidden">
          <ShieldCheck size={20} className="text-purple-400 mb-0.5 z-10" />
          <span className="text-xs font-bold text-white z-10">Cross-Device Plan Vault</span>
          <span className="text-[10px] text-slate-400 z-10">Save and compare multiple scenarios</span>
        </div>

        <div className="p-1 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[9.5px] sm:text-[10px] text-emerald-300 font-bold whitespace-nowrap px-2">
          <div className="flex items-center gap-1">
            <Check size={11} className="stroke-[3]" /> Encrypted Cloud Backup
          </div>
          <span className="text-slate-400 font-normal">Active</span>
        </div>
      </div>
    )
  }
];

export default function PremiumUpgradeModal({ isOpen, onClose, onProActivated, isPro, onSignOut }) {
  const [view, setView] = useState("upgrade"); // 'upgrade' | 'login' | 'success'
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("retirement_pro_name") || "" : ""));
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const LEMON_SQUEEZY_CHECKOUT_URL = "https://zxero.lemonsqueezy.com/checkout/buy/d497d281-9bd9-4b5e-96e8-57e7bbf728fb?embed=1";

  // Initialize Lemon.js overlay SDK for seamless in-page checkout and instant Pro activation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const extractLemonAttributes = (evt) => {
      const root = evt?.data || evt || {};
      const attrs =
        root?.order?.data?.attributes ||
        root?.order?.attributes ||
        root?.data?.attributes ||
        root?.attributes ||
        root ||
        {};
      const email = (attrs.user_email || attrs.customer_email || attrs.email || "").trim();
      const name = (attrs.user_name || attrs.customer_name || attrs.name || attrs.first_name || "").trim();
      return { email, name, attrs };
    };

    const setupLemon = () => {
      console.log("🍋 [LemonSqueezy SDK] Setting up Lemon.js event listener...");
      if (window.createLemonSqueezy) {
        window.createLemonSqueezy();
      }
      if (window.LemonSqueezy?.Setup) {
        window.LemonSqueezy.Setup({
          eventHandler: (event) => {
            console.log("🍋 [LemonSqueezy Event Fired]:", event?.event || event);
            console.log("🍋 [LemonSqueezy Full Payload]:", JSON.stringify(event, null, 2));
            
            if (event.event === "Checkout.Success" || event === "Checkout.Success" || event?.data?.event === "Checkout.Success") {
              // 1. Instantly close & remove Lemon Squeezy overlay to skip third-party thank you receipt
              try {
                if (window.LemonSqueezy?.Url?.Close) {
                  window.LemonSqueezy.Url.Close();
                }
              } catch (e) {}

              try {
                const overlays = document.querySelectorAll(".lemonsqueezy-overlay, iframe[src*='lemonsqueezy']");
                overlays.forEach((el) => el.remove());
              } catch (e) {}

              // 2. Extract buyer email & full name across Lemon.js order.data.attributes hierarchy
              const { email: buyerEmail, name: buyerName, attrs } = extractLemonAttributes(event);
              console.log("🍋 [Extracted Buyer Info]:", { buyerEmail, buyerName, attrs });

              if (buyerEmail) {
                setEmail(buyerEmail);
                try {
                  localStorage.setItem("retirement_pro_email", buyerEmail);
                } catch (e) {}
              }
              if (buyerName) {
                setUserName(buyerName);
                try {
                  localStorage.setItem("retirement_pro_name", buyerName);
                } catch (e) {}
              }

              // 3. Unlock Pro instantly in local session
              try {
                localStorage.setItem("retirement_is_pro", "true");
              } catch (e) {}
              if (onProActivated) {
                onProActivated();
              }

              // 4. Immediately trigger Pro celebration pop-up
              setView("success");
            }
          }
        });
      }
    };

    // Global postMessage listener fallback for Lemon Squeezy checkout completion
    const handleGlobalMessage = (event) => {
      try {
        const rawData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (rawData?.event === "Checkout.Success" || rawData?.name === "Checkout.Success") {
          console.log("🍋 [postMessage Checkout.Success Detected]:", rawData);
          try {
            if (window.LemonSqueezy?.Url?.Close) {
              window.LemonSqueezy.Url.Close();
            }
          } catch (e) {}
          try {
            document.querySelectorAll(".lemonsqueezy-overlay, iframe[src*='lemonsqueezy']").forEach((el) => el.remove());
          } catch (e) {}
          
          const { email: buyerEmail, name: buyerName } = extractLemonAttributes(rawData);
          console.log("🍋 [postMessage Extracted]:", { buyerEmail, buyerName });

          if (buyerEmail) {
            setEmail(buyerEmail);
            try { localStorage.setItem("retirement_pro_email", buyerEmail); } catch (e) {}
          }
          if (buyerName) {
            setUserName(buyerName);
            try { localStorage.setItem("retirement_pro_name", buyerName); } catch (e) {}
          }
          try {
            localStorage.setItem("retirement_is_pro", "true");
          } catch (e) {}
          if (onProActivated) onProActivated();
          setView("success");
        }
      } catch (e) {}
    };

    window.addEventListener("message", handleGlobalMessage);

    if (!document.getElementById("lemon-squeezy-sdk")) {
      const script = document.createElement("script");
      script.id = "lemon-squeezy-sdk";
      script.src = "https://assets.lemonsqueezy.com/lemon.js";
      script.defer = true;
      script.onload = setupLemon;
      document.body.appendChild(script);
    } else {
      setupLemon();
    }

    return () => {
      window.removeEventListener("message", handleGlobalMessage);
    };
  }, [onProActivated]);

  // Auto-swipe carousel every 2 seconds when viewing features
  useEffect(() => {
    if (!isOpen || view !== "upgrade") return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [isOpen, view]);

  // Synchronize view and buyer details when opening modal
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== "undefined") {
      const storedIsPro = localStorage.getItem("retirement_is_pro") === "true";
      const storedEmail = localStorage.getItem("retirement_pro_email") || "";
      const storedName = localStorage.getItem("retirement_pro_name") || "";

      if (storedIsPro || isPro) {
        setView("success");
        if (storedEmail) setEmail(storedEmail);
        if (storedName) setUserName(storedName);
      } else {
        setView("upgrade");
      }
    }
  }, [isOpen, isPro]);

  if (!isOpen) return null;

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setStatusMsg("⚠️ Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setStatusMsg("");
    try {
      // 1. Call restore-pro endpoint
      const res = await fetch("/api/auth/restore-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();

      if (data.success && data.isPro) {
        try {
          localStorage.setItem("retirement_is_pro", "true");
          localStorage.setItem("retirement_pro_email", cleanEmail);
          if (data.name) {
            setUserName(data.name);
            localStorage.setItem("retirement_pro_name", data.name);
          }
        } catch (e) {}
        if (onProActivated) onProActivated();
        setStatusMsg("✅ Pro account activated successfully!");
        setTimeout(() => {
          setView("success");
        }, 400);
        return;
      }

      // If optional password was entered, also attempt Supabase auth
      if (password) {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });
        if (!error) {
          try {
            localStorage.setItem("retirement_is_pro", "true");
            localStorage.setItem("retirement_pro_email", cleanEmail);
          } catch (e) {}
          if (onProActivated) onProActivated();
          setView("success");
          return;
        }
      }

      setStatusMsg(data.message || "⚠️ Unable to restore Pro account. Please check your purchase email.");
    } catch (err) {
      // In case of network error, grant immediate fallback restore for the session
      try {
        localStorage.setItem("retirement_is_pro", "true");
        localStorage.setItem("retirement_pro_email", cleanEmail);
      } catch (e) {}
      if (onProActivated) onProActivated();
      setView("success");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    let url = LEMON_SQUEEZY_CHECKOUT_URL;
    if (userName && userName.trim()) {
      url += `&checkout[name]=${encodeURIComponent(userName.trim())}`;
    }
    if (email && email.trim()) {
      url += `&checkout[email]=${encodeURIComponent(email.trim())}`;
    }
    console.log("🍋 [handleCheckout Opening URL]:", url, "userName state:", userName, "email state:", email);
    // Open in-page modal checkout overlay
    if (typeof window !== "undefined" && window.LemonSqueezy?.Url?.Open) {
      window.LemonSqueezy.Url.Open(url);
    } else {
      window.open(url, "_blank");
    }
  };

  const handleFinishSuccess = () => {
    try {
      localStorage.setItem("retirement_is_pro", "true");
    } catch (e) {}
    if (onProActivated) onProActivated();
    if (onClose) onClose();
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("retirement_is_pro");
      localStorage.removeItem("retirement_pro_email");
      localStorage.removeItem("retirement_pro_name");
    } catch (e) {}

    try {
      await supabase.auth.signOut();
    } catch (e) {}

    setEmail("");
    setUserName("");
    setView("upgrade");
    if (onSignOut) {
      onSignOut();
    }
    if (onClose) {
      onClose();
    }
  };

  const slide = CAROUSEL_SLIDES[currentSlide];
  const IconComponent = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      {/* Compact Responsive Modal Box */}
      <div className={`relative w-full max-w-md ${
        view === "success" 
          ? "h-auto max-h-[90dvh]" 
          : view === "login" 
            ? "h-[430px] max-h-[90dvh]" 
            : "h-[485px] sm:h-[505px] max-h-[90dvh]"
      } bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-black/10 overflow-hidden flex flex-col justify-between transition-all duration-300`}>
        {/* Decorative Gold Glows */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Modal Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-black/5 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-gradient-to-tr from-[#C59A3F] to-[#E5C158] text-white shadow-sm">
              <Sparkles size={15} />
            </span>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm sm:text-base font-black text-[#1C1C1E] tracking-tight">
                {view === "upgrade" ? "Professional Wealth Engine" : view === "success" ? "Pro Activated" : "Restore Pro Access"}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* 2. Modal Middle Content */}
        <div className="flex-1 flex flex-col py-1.5 z-10 min-h-0 overflow-hidden">
          {view === "upgrade" ? (
            <div className="flex flex-col justify-between h-full min-h-0">
              {/* Carousel Top Navigation Bar */}
              <div className="flex items-center justify-between pb-1.5 shrink-0">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border whitespace-nowrap ${slide.badgeBg}`}>
                  {slide.tag}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    title="Previous feature"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex gap-1 px-1">
                    {CAROUSEL_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                          idx === currentSlide ? "w-5 bg-[#C59A3F]" : "w-1.5 bg-black/15 hover:bg-black/30"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
                    title="Next feature"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Active Slide Card */}
              <div className="p-2.5 sm:p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col justify-between flex-1 min-h-0 shadow-sm">
                <div className="flex flex-col gap-0.5 shrink-0 pb-1">
                  <div className="flex items-center gap-1.5">
                    <IconComponent size={15} className={slide.iconColor} />
                    <h4 className="text-sm font-black text-[#1C1C1E] tracking-tight">
                      {slide.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    {slide.description}
                  </p>
                </div>

                <div className="flex-1 w-full min-h-0 flex flex-col">
                  {slide.snippet}
                </div>
              </div>
            </div>
          ) : view === "success" ? (
            /* Compact Post-Payment Success Screen */
            <div className="flex flex-col items-center justify-center gap-3 text-center pt-3 pb-1 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 mt-1 rounded-full bg-gradient-to-tr from-[#C59A3F] to-[#E5C158] flex items-center justify-center text-white shadow-md shadow-amber-500/25 animate-bounce">
                <Sparkles size={24} />
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-base sm:text-lg font-black text-[#1C1C1E] tracking-tight">
                  {userName ? `Welcome ${userName}` : "Welcome"}
                </h4>
                <p className="text-[11.5px] text-gray-600 max-w-xs leading-snug">
                  Lifetime access is now active for <strong className="text-[#8A6414]">{email || "your device"}</strong>.
                </p>
              </div>

              <div className="w-full p-2.5 bg-[#F8F9FA] border border-black/5 rounded-2xl flex flex-col gap-1.5 text-left text-[11px] text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-[#1C1C1E]">10,000+ Monte Carlo Engine Unlocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-[#1C1C1E]">Comprehensive Advanced Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-[#1C1C1E]">Multi-Scenario Cloud Sync Ready</span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2 mt-0.5">
                <button
                  type="button"
                  onClick={handleFinishSuccess}
                  className="w-full py-2.5 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Enter Pro Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 active:scale-98 text-red-600 font-bold text-xs rounded-xl border border-red-200/60 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={13} className="text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Restore Pro View Form */
            <form onSubmit={handleLogin} className="flex flex-col justify-center gap-2.5 h-full">
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-[#1C1C1E]">Restore Pro Access</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Enter the email address you used at checkout to instantly restore your Pro account.
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10.5px] font-bold text-gray-600 uppercase">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Aaron"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    try { localStorage.setItem("retirement_pro_name", e.target.value); } catch (err) {}
                  }}
                  className="w-full py-2 px-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10.5px] font-bold text-gray-600 uppercase">Purchase Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white"
                />
              </div>

              {statusMsg && (
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl font-medium leading-snug border border-amber-200/60">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#1C1C1E] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-0.5 cursor-pointer"
              >
                <ShieldCheck size={14} className="text-[#E5C158]" />
                <span>{loading ? "Verifying..." : "Restore Pro Access"}</span>
              </button>
            </form>
          )}
        </div>

        {/* 3. Modal Bottom Actions */}
        {view !== "success" && (
          <div className="pt-2 border-t border-black/5 shrink-0 z-10 flex flex-col gap-2">
            {view === "upgrade" ? (
              <>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="lemonsqueezy-button w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Unlock Professional Suite · $4.00</span>
                  <ArrowRight size={14} />
                </button>

                {/* Single-line ultra-compact badge footer */}
                <div className="flex items-center justify-between text-[10px] text-gray-500 px-1 whitespace-nowrap overflow-hidden">
                  <span className="flex items-center gap-1 font-medium text-slate-500 truncate">
                    <Check size={11} className="text-emerald-600 stroke-[3] shrink-0" /> Instant Activation
                  </span>
                  <span className="text-gray-300 shrink-0 mx-1">•</span>
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="font-bold text-[#8A6414] hover:underline cursor-pointer shrink-0"
                  >
                    Already paid? Restore Pro
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setView("upgrade")}
                className="w-full py-2.5 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] font-bold text-xs rounded-xl transition-all text-center cursor-pointer"
              >
                ← Back to Features & Plans
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
