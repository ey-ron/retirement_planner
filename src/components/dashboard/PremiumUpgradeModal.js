import React, { useState } from "react";
import {
  X, Sparkles, Check, ArrowRight, ShieldAlert,
  Globe2, TrendingUp, BarChart3, LineChart, Cpu, LogIn
} from "lucide-react";

export default function PremiumUpgradeModal({ isOpen, onClose }) {
  const [view, setView] = useState("upgrade"); // 'upgrade' | 'login'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    // Placeholder Supabase auth logic
    setTimeout(() => {
      setLoading(false);
      setStatusMsg("Logging in with Supabase...");
    }, 800);
  };

  const handleCheckout = () => {
    // Replace with Stripe / LemonSqueezy link
    window.open("https://buy.stripe.com/example", "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-black/10 overflow-hidden flex flex-col max-h-[92dvh]">
        {/* Subtle decorative gold glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-[#C59A3F] to-[#E5C158] text-white shadow-sm">
              <Sparkles size={16} />
            </span>
            <div className="flex flex-col">
              <h3 className="text-base font-black text-[#1C1C1E] tracking-tight leading-none">
                {view === "upgrade" ? "Professional Wealth Engine" : "Sign In to Pro"}
              </h3>
              <span className="text-[10px] font-bold text-[#8A6414] uppercase tracking-wider mt-0.5">
                {view === "upgrade" ? "Institutional Standard vs. Linear Illusion" : "Supabase Cloud Account"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="py-3 flex-1 overflow-y-auto z-10 pr-0.5">
          {view === "upgrade" ? (
            <div className="flex flex-col gap-4">
              {/* Headline */}
              <div className="text-center pt-1 pb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 px-2.5 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 inline-block shadow-sm">
                  Full Quantitative Tier
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1E] mt-2 tracking-tight">
                  Stress-Test Against Reality
                </h2>
                <p className="text-xs text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Linear projections hide the risk of early market crashes. Pro unlocks full volatility modeling, dynamic territory inflation, and auto-derived investment CAGR.
                </p>
              </div>

              {/* Visual Feature Previews / Snippets */}
              <div className="flex flex-col gap-2.5">
                {/* 1. Monte Carlo Standard, Conservative & Chaotic */}
                <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#1C1C1E] flex items-center gap-1.5">
                      <LineChart size={15} className="text-[#8A6414]" />
                      10,000+ Monte Carlo Simulations
                    </span>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                      Standard · Conservative · Chaotic
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    Simulates thousands of randomized market paths to calculate your exact historical probability of survival during severe bear runs and stagflation.
                  </p>
                  {/* Interactive Visual Mini Snippet */}
                  <div className="p-2.5 bg-white rounded-xl border border-black/5 flex items-center justify-between text-[10.5px]">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      94% Standard
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-amber-700">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      81% Conservative
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-red-700">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      68% Chaotic Stress
                    </div>
                  </div>
                </div>

                {/* 2. Automatic Territory Inflation */}
                <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#1C1C1E] flex items-center gap-1.5">
                      <Globe2 size={15} className="text-blue-600" />
                      Auto Territory Inflation Rate
                    </span>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                      Live Macro Data
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    Automatically anchors accurate localized inflation and purchasing power decay based on your country & currency instead of static guesses.
                  </p>
                </div>

                {/* 3. Automatic Derived Investment CAGR */}
                <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#1C1C1E] flex items-center gap-1.5">
                      <TrendingUp size={15} className="text-emerald-600" />
                      Auto-Derived Asset Allocation CAGR
                    </span>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Dynamic Weighted
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-snug">
                    Dynamically derives true compound annual growth rates across your custom ETF, equity, cash, and bond split rather than a hardcoded single number.
                  </p>
                </div>

                {/* 4. Multi-Scenario & Cloud Save */}
                <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center justify-between text-xs font-semibold text-gray-700 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 stroke-[3]" />
                    <span>Unlimited Scenarios & Supabase Cloud Sync</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">100% Ad-Free</span>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Unlock Professional Suite</span>
                  <ArrowRight size={14} />
                </button>
                <span className="text-[10px] text-center text-gray-400 font-medium">
                  Instant activation via Supabase · One-time investment
                </span>
              </div>

              {/* Log In Toggle */}
              <div className="pt-2.5 border-t border-black/5 text-center">
                <span className="text-xs text-gray-500">Already purchased Pro? </span>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-xs font-bold text-[#8A6414] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Login View */
            <form onSubmit={handleLogin} className="flex flex-col gap-3 pt-1">
              <p className="text-xs text-gray-500 mb-1">
                Enter the email address you used when purchasing Pro.
              </p>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-600 uppercase">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-gray-600 uppercase">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2.5 px-3 bg-[#F2F2F7] border border-black/10 rounded-xl font-medium text-xs text-[#1C1C1E] outline-none focus:border-[#C59A3F] focus:bg-white"
                />
              </div>

              {statusMsg && (
                <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg font-medium">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#1C1C1E] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <LogIn size={14} />
                <span>{loading ? "Signing in..." : "Sign In to Pro"}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setView("upgrade")}
                  className="text-xs font-bold text-[#8A6414] hover:underline cursor-pointer"
                >
                  ← Back to Plans
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
