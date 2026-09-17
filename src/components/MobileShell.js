import React, { useState, useEffect, useMemo } from "react";
import RetirementCockpit from "./RetirementCockpit";
import PartnerAdBanner from "./PartnerAdBanner";
import AuthModal from "./AuthModal";
import { Sparkles, LogIn, Sliders, CheckCircle2, RotateCcw, Lock, ShieldCheck, Info, TrendingUp, Flame } from "lucide-react";
import {
  computeSimulationMetrics,
  formatAbbreviatedNumber,
  formatAbbreviatedParts,
  getCurrencySymbol
} from "../lib/retirementCalculations";

// Clean, perfectly calibrated CurrencyDisplay component
function CurrencyDisplay({
  value,
  symbol = "$",
  size = "text-[34px] sm:text-[40px] md:text-[44px]",
  sign = "",
  color = "text-white",
  suffixColor = "text-amber-200",
  hasStroke = false,
  symbolGap = "mr-1.5 sm:mr-2",
  symbolOffset = "-top-[0.52em]",
  symbolSize = "text-[0.52em]",
  className = ""
}) {
  const parts = formatAbbreviatedParts(value);
  return (
    <div
      className={`inline-flex items-baseline font-black tracking-tight leading-none ${size} ${color} ${className}`}
      style={hasStroke ? { WebkitTextStroke: "0.8px rgba(255,255,255,0.85)", paintOrder: "stroke fill" } : undefined}
    >
      {sign && <span className="mr-0.5">{sign}</span>}
      <sup className={`${symbolSize} font-extrabold select-none opacity-90 ${symbolGap} relative ${symbolOffset}`}>
        {symbol}
      </sup>
      <span className="whitespace-nowrap">
        {parts.value}
        {parts.suffix && (
          <span className={`text-[0.68em] ml-0.5 ${suffixColor}`}>
            {parts.suffix}
          </span>
        )}
      </span>
    </div>
  );
}

export default function MobileShell({
  user,
  simulationData,
  hasEnteredInfo,
  onUpdateParam,
  onUpdateFullPlan,
  onResetInfo
}) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [proName, setProName] = useState("");
  const [userCountry, setUserCountry] = useState("Singapore");
  const [monteCarloScenario, setMonteCarloScenario] = useState("standard");
  const [unlocks, setUnlocks] = useState({
    unlock_1: "Locked",
    unlock_2: "Locked",
    unlock_3: "Locked",
    unlock_4: "Locked",
    unlock_5: "Locked",
    unlock_6: "Locked",
    unlock_7: "Locked"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsPro(localStorage.getItem("retirement_is_pro") === "true");
      setProName(localStorage.getItem("retirement_pro_name") || "");
      setUserCountry(localStorage.getItem("retirement_user_country") || "Singapore");

      try {
        const savedUnlocks = localStorage.getItem("retirement_unlocks");
        if (savedUnlocks) setUnlocks(JSON.parse(savedUnlocks));
      } catch (e) { }

      // Sync latest cloud profile & unlock states directly from Supabase
      const savedEmail = localStorage.getItem("retirement_pro_email");
      if (savedEmail) {
        fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: savedEmail })
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && data.success && data.unlocks) {
              setUnlocks(data.unlocks);
              localStorage.setItem("retirement_unlocks", JSON.stringify(data.unlocks));
              if (data.name) setProName(data.name);
              if (data.country) setUserCountry(data.country);
            }
          })
          .catch(() => {});
      }

      // If registered member has a saved plan, load it
      try {
        const savedPlan = localStorage.getItem("retirement_saved_plan");
        if (savedPlan && onUpdateFullPlan) {
          const parsed = JSON.parse(savedPlan);
          if (parsed && parsed.monthlyExpense) {
            onUpdateFullPlan(parsed);
          }
        }
      } catch (e) { }
    }
  }, []);

  // Detect mobile virtual keyboard via visualViewport resize or input focus
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleFocusIn = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea" && activeTag !== "select") {
          setIsKeyboardOpen(false);
        }
      }, 100);
    };

    const handleViewportResize = () => {
      if (!window.visualViewport) return;
      const isKeyboard = window.innerHeight - window.visualViewport.height > 150;
      setIsKeyboardOpen(isKeyboard);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
    }

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
      }
    };
  }, []);

  // Dynamic CAGR & Inflation parameters synchronized with the active Monte Carlo scenario
  // When unlock_1 is Locked (simplified rule-of-thumb baseline), simplified static parameters are used
  const scenarioParams = useMemo(() => {
    const isUnlock1Locked = unlocks?.unlock_1 !== "Unlocked";

    if (monteCarloScenario === "conservative") {
      return {
        cagr: 6.0,
        inflation: 3.0,
        cagrTag: "Defensive Yield",
        inflationTag: "Low-Risk CPI"
      };
    }
    if (monteCarloScenario === "chaotic") {
      return {
        cagr: 4.0,
        inflation: 5.0,
        cagrTag: "Crash Shock Yield",
        inflationTag: "Stagflation CPI"
      };
    }
    // Standard baseline (simplified retail rule of thumb: 8.0% CAGR, 3.5% Inflation)
    return {
      cagr: 8.0,
      inflation: 3.5,
      cagrTag: "Expected Real Growth",
      inflationTag: "Annual Cost Drag"
    };
  }, [monteCarloScenario, unlocks?.unlock_1]);

  // Compute metrics for the Member Hero Card dynamically based on the active Monte Carlo scenario
  const memberMetrics = useMemo(() => {
    return computeSimulationMetrics({
      ...simulationData,
      cagr: scenarioParams.cagr,
      inflation: scenarioParams.inflation
    });
  }, [simulationData, scenarioParams]);

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(userCountry);
  }, [userCountry]);

  const tierBadge = useMemo(() => {
    const unlockedCount = ["unlock_1", "unlock_2", "unlock_3"].filter(
      (id) => unlocks?.[id] === "Unlocked"
    ).length;

    if (unlockedCount >= 3) {
      return {
        label: "Pro",
        badgeBg: "bg-gradient-to-r from-amber-50 to-emerald-50 border-amber-300 text-amber-900",
        iconColor: "text-[#C59A3F]"
      };
    }
    if (unlockedCount === 2) {
      return {
        label: "Tier 2",
        badgeBg: "bg-emerald-50 border-emerald-300 text-emerald-850",
        iconColor: "text-emerald-600"
      };
    }
    if (unlockedCount === 1) {
      return {
        label: "Tier 1",
        badgeBg: "bg-emerald-50 border-emerald-300 text-emerald-800",
        iconColor: "text-emerald-600"
      };
    }
    return {
      label: "Basic",
      badgeBg: "bg-slate-50 border-slate-300 text-slate-700",
      iconColor: "text-slate-500"
    };
  }, [unlocks]);

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] bg-[#F2F2F7] text-[#1C1C1E] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
      {/* Floating Header */}
      <div className="w-full max-w-2xl mx-auto pt-2 sm:pt-3 px-4 shrink-0 z-30">
        <header className="w-full h-[58px] sm:h-[70px] md:h-[76px] bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-3.5 sm:px-5 md:px-6 flex items-center justify-between transition-all select-none">
          <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4 min-w-0">
            <img
              src="/icon-192x192.png"
              alt="Retirement Simulator Icon"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl object-contain shadow-[0_2px_8px_rgba(0,0,0,0.08)] select-none shrink-0"
            />
            {isPro ? (
              <div className="flex flex-col min-w-0 justify-center leading-tight">
                <span className="text-xs sm:text-base md:text-lg font-black tracking-tight text-[#1C1C1E] truncate">
                  {proName || "Pro Member"}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#8A6414] tracking-tight truncate">
                  Retirement Journey
                </span>
              </div>
            ) : (
              <span className="text-[13px] sm:text-base md:text-lg font-black tracking-tight text-[#1C1C1E] truncate">
                Retirement Simulator
              </span>
            )}
          </div>

          {/* Header Action: Member Badge or Log In CTA */}
          {isPro ? (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl border font-black text-[11px] sm:text-xs md:text-sm shadow-sm cursor-pointer shrink-0 transition-all ${tierBadge.badgeBg}`}
            >
              <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 ${tierBadge.iconColor}`} />
              <span>{tierBadge.label}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-95 text-white font-black text-[11px] sm:text-xs md:text-sm shadow-sm transition-all cursor-pointer shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 text-amber-200 stroke-[2.5]" />
              <span>Log In</span>
            </button>
          )}
        </header>
      </div>

      {/* Main Viewport */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-2 pb-1.5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {isPro ? (
          /* Container for Hero Card, Extension Card & Metric Cards */
          <div className="w-full h-full flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            {/* 1. Member Hero Card */}
            <div
              className="w-full shrink-0 relative text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 overflow-hidden shadow-lg flex items-center justify-between gap-2.5 sm:gap-4 z-20 select-none border border-amber-300/20"
                style={{
                  background: "linear-gradient(135deg, #C59A3F 0%, #3E2B00 100%)"
                }}
              >
                {/* Subtle ambient lighting */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/15 rounded-full blur-[35px] pointer-events-none" />

                {/* Left Column: Big Retire Corpus Anchor */}
                <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10 pl-0.5">
                  <span className="text-[10px] sm:text-[11.5px] font-black uppercase tracking-[0.16em] text-amber-200 mb-0.5">
                    Retire Corpus
                  </span>
                  <CurrencyDisplay
                    value={memberMetrics.requiredCorpus}
                    symbol={currencySymbol}
                    size="text-[34px] sm:text-[40px] md:text-[44px]"
                    hasStroke={true}
                    symbolOffset="-top-[0.52em]"
                    symbolSize="text-[0.52em]"
                    symbolGap="mr-1.5 sm:mr-2"
                    className="[text-shadow:0_2px_4px_rgba(0,0,0,0.35)]"
                  />
                  <span className="text-[10px] sm:text-[11.5px] font-bold text-white/70 mt-1">
                    Target Nest Egg
                  </span>
                </div>

                {/* Right Column: Expanded Structured Frosted Glass Panel (~54% width) */}
                <div className="w-[54%] max-w-[240px] bg-black/25 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-white/12 flex flex-col gap-2 relative z-10 shrink-0 shadow-inner">
                  {/* Row 1: Target Year & Age */}
                  <div className="flex items-center justify-between text-[11px] sm:text-[12.5px] leading-none">
                    <span className="text-white/60 font-semibold text-[9px] sm:text-[10.5px] uppercase tracking-wider">
                      Retire Target
                    </span>
                    <span className="font-black text-white flex items-baseline gap-1">
                      <span>{memberMetrics.retireYear}</span>
                      <span className="text-white/40 text-[9.5px]">·</span>
                      <span className="text-amber-200 text-[11px] sm:text-[12.5px]">
                        {memberMetrics.retireAge}yo
                      </span>
                    </span>
                  </div>

                  {/* Row 2: Surplus / Shortfall + Amount */}
                  <div className="flex items-center justify-between text-[11px] sm:text-[12.5px] leading-none">
                    <span
                      className={`font-black text-[9px] sm:text-[10.5px] uppercase tracking-wider ${
                        memberMetrics.isOnTrack ? "text-[#85E394]" : "text-orange-300"
                      }`}
                    >
                      {memberMetrics.isOnTrack ? "Surplus" : "Shortfall"}
                    </span>
                    <CurrencyDisplay
                      value={Math.abs(memberMetrics.shortfall)}
                      symbol={currencySymbol}
                      sign={memberMetrics.isOnTrack ? "+" : "-"}
                      size="text-[11px] sm:text-[12.5px]"
                      color={memberMetrics.isOnTrack ? "text-[#85E394]" : "text-orange-200"}
                      suffixColor={memberMetrics.isOnTrack ? "text-[#85E394]" : "text-orange-200"}
                      symbolOffset="-top-[0.30em]"
                      symbolSize="text-[0.62em]"
                      symbolGap="mr-0.5"
                    />
                  </div>

                  {/* Row 3: Est. Future Expense & Funded Pill */}
                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10.5px] sm:text-[11.5px] leading-none">
                    <div className="flex items-center gap-1">
                      <span className="text-white/60 text-[8.5px] sm:text-[9.5px] font-medium uppercase leading-none">
                        FV Exp:
                      </span>
                      <CurrencyDisplay
                        value={memberMetrics.futureMonthlyExpense}
                        symbol={currencySymbol}
                        size="text-[10.5px] sm:text-[11.5px]"
                        color="text-white/95"
                        suffixColor="text-amber-200/90"
                        symbolOffset="-top-[0.30em]"
                        symbolSize="text-[0.62em]"
                        symbolGap="mr-0.5"
                      />
                      <span className="text-[8.5px] text-white/60 font-normal leading-none">/mo</span>
                    </div>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[8.5px] sm:text-[9.5px] font-black leading-none ${
                        memberMetrics.isOnTrack
                          ? "bg-[#85E394]/25 text-[#85E394]"
                          : "bg-orange-400/25 text-orange-200"
                      }`}
                    >
                      {memberMetrics.fundedPct.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Extension Card (Starts from where Hero Card corners round) */}
              <div className="w-full flex-1 min-h-0 -mt-3.5 sm:-mt-4.5 pt-6 sm:pt-7 pb-2.5 px-3.5 sm:px-5 bg-white/90 backdrop-blur-xl border border-black/8 rounded-b-2xl sm:rounded-b-3xl rounded-t-xl sm:rounded-t-2xl shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col justify-between text-center relative z-10 transition-none transform-none overflow-hidden">
                {/* Top Section: Header, Monte Carlo 3-Tab Selector & Risk Percentage */}
                <div className="w-full flex flex-col items-center pt-0.5 shrink-0">
                  {/* Header in Clearance */}
                  <span className="text-[9.5px] sm:text-[10.5px] font-black uppercase tracking-[0.16em] text-[#8A6414] mb-2">
                    Monte Carlo Stochastic Probability
                  </span>

                  {/* 3 Selector Tabs: Standard, Conservative, Chaotic */}
                  <div className="w-full max-w-sm bg-[#E5E5EA]/70 p-1 rounded-xl flex items-center gap-1 border border-black/5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setMonteCarloScenario("standard")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-black cursor-pointer select-none transition-none active:scale-100 touch-manipulation ${
                        monteCarloScenario === "standard"
                          ? "bg-white text-[#1C1C1E] shadow-sm border border-black/5"
                          : "text-gray-500 hover:text-gray-900 border border-transparent"
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonteCarloScenario("conservative")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-black cursor-pointer select-none transition-none active:scale-100 touch-manipulation ${
                        monteCarloScenario === "conservative"
                          ? "bg-white text-[#1C1C1E] shadow-sm border border-black/5"
                          : "text-gray-500 hover:text-gray-900 border border-transparent"
                      }`}
                    >
                      Conservative
                    </button>
                    <button
                      type="button"
                      onClick={() => setMonteCarloScenario("chaotic")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-black cursor-pointer select-none transition-none active:scale-100 touch-manipulation ${
                        monteCarloScenario === "chaotic"
                          ? "bg-white text-[#1C1C1E] shadow-sm border border-black/5"
                          : "text-gray-500 hover:text-gray-900 border border-transparent"
                      }`}
                    >
                      Chaotic
                    </button>
                  </div>

                  {/* Risk Percentage Bar & Metrics */}
                  <div className="w-full max-w-sm mt-2.5 px-1 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs">
                      <span className="font-bold text-gray-500">
                        Risk Percentage:
                      </span>
                      <span
                        className={`font-black flex items-center gap-1 text-[12px] sm:text-[13px] ${
                          monteCarloScenario === "standard"
                            ? "text-emerald-600"
                            : monteCarloScenario === "conservative"
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {monteCarloScenario === "standard" && "15% (85% Success Rate)"}
                        {monteCarloScenario === "conservative" && "30% (70% Success Rate)"}
                        {monteCarloScenario === "chaotic" && "50% (50% Success Rate)"}
                      </span>
                    </div>

                    {/* Visual Risk Gauge Progress Bar */}
                    <div className="w-full h-2 bg-gray-200/80 rounded-full overflow-hidden p-0.5 flex">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${
                          monteCarloScenario === "standard"
                            ? "w-[15%] bg-emerald-500"
                            : monteCarloScenario === "conservative"
                            ? "w-[30%] bg-amber-500"
                            : "w-[50%] bg-rose-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Middle Content: Scenario Breakdown & Simulation Meaning */}
                <div className="w-full flex-1 min-h-0 my-1.5 sm:my-2 flex flex-col justify-between bg-white/70 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-black/6 shadow-sm text-left overflow-hidden">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] shrink-0 border border-amber-500/20">
                        <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8A6414] stroke-[2.2]" />
                      </div>
                      <div className="flex flex-col justify-center leading-tight">
                        <span className="text-[11.5px] sm:text-[12.5px] font-black text-[#1C1C1E]">
                          {monteCarloScenario === "conservative" && "Conservative"}
                          {monteCarloScenario === "standard" && "50-Year Market"}
                          {monteCarloScenario === "chaotic" && "Chaotic Stagflation"}
                        </span>
                        <span className="text-[9.5px] sm:text-[10.5px] font-bold text-gray-500 tracking-tight">
                          {monteCarloScenario === "conservative" && "Lower Yield Drag"}
                          {monteCarloScenario === "standard" && "Benchmark Growth"}
                          {monteCarloScenario === "chaotic" && "& Crash Shock"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center leading-tight shrink-0 pl-2">
                      <span className="text-[12px] sm:text-[13px] font-black text-[#1C1C1E] tracking-tight">
                        1,000
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                        Baseline Runs
                      </span>
                    </div>
                  </div>

                  <p className="text-[10.5px] sm:text-[11.5px] text-gray-600 leading-[1.45] my-1 text-left">
                    {monteCarloScenario === "standard" && (
                      <>
                        Models baseline 8.0% historical market returns and steady inflation. Across 1,000 randomized lifespans, <strong className="text-emerald-700 font-black">85% of simulated futures</strong> comfortably sustain retirement, powered by steady long-term compounding growth.
                      </>
                    )}
                    {monteCarloScenario === "conservative" && (
                      <>
                        Simulates a defensive 6.0% lower-growth market. Slower portfolio accumulation means <strong className="text-amber-800 font-black">70% of simulated futures</strong> reach retirement safely, leaving a 30% risk gap due to lower compounding yield.
                      </>
                    )}
                    {monteCarloScenario === "chaotic" && (
                      <>
                        Stress-tests severe early market crashes (2008-style) paired with 5%+ inflation shocks. Across 1,000 randomized lifespans, a <strong className="text-rose-700 font-black">50% early depletion risk</strong> indicates your portfolio requires sequence-of-returns protection.
                      </>
                    )}
                  </p>

                  {/* Unlock Professional Standard Clickable Label / Active Status */}
                  {unlocks?.unlock_1 === "Unlocked" ? (
                    <div className="w-full pt-2 border-t border-emerald-500/20 flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-black text-emerald-700 select-none truncate shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">Professional Institutional Standard Active</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full pt-2 border-t border-black/5 flex items-center justify-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-black text-[#8A6414] hover:text-[#684b0f] transition-colors cursor-pointer select-none group truncate shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#8A6414] shrink-0 group-hover:rotate-12 transition-transform" />
                      <span className="hover:underline underline-offset-2">
                        Unlock Professional Institutional Standard →
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Side-by-Side Metric Cards: CAGR & Inflation Rate (Decreased by 4px) */}
              <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3.5 mt-2 shrink-0 select-none">
                {/* Left Card: CAGR */}
                <div className="bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl sm:rounded-3xl py-1.5 sm:py-2 px-3 sm:px-3.5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-[#8A6414]">
                        CAGR Return
                      </span>
                      <div className="w-5.5 h-5.5 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] border border-amber-500/15">
                        <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-0.5 my-0.5">
                      <span className="text-[20px] sm:text-[24px] font-black text-[#1C1C1E] tracking-tight leading-none">
                        {scenarioParams.cagr.toFixed(1)}
                      </span>
                      <span className="text-[12px] sm:text-[14px] font-black text-[#8A6414] leading-none">
                        %
                      </span>
                    </div>

                    <span className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-500 block truncate">
                      {scenarioParams.cagrTag}
                    </span>
                  </div>

                  {/* Unlock Weighted Growth Callout */}
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="pt-1 mt-1 border-t border-black/5 flex items-center justify-center gap-1 text-[8.5px] sm:text-[9px] font-black text-[#8A6414] hover:text-[#684b0f] transition-colors cursor-pointer select-none truncate group"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#8A6414] shrink-0 group-hover:rotate-12 transition-transform" />
                    <span className="hover:underline underline-offset-2 truncate">
                      Unlock Weighted Growth →
                    </span>
                  </button>
                </div>

                {/* Right Card: Inflation Rate */}
                <div className="bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl sm:rounded-3xl py-1.5 sm:py-2 px-3 sm:px-3.5 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-[#8A6414]">
                        Inflation Rate
                      </span>
                      <div className="w-5.5 h-5.5 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] border border-amber-500/15">
                        <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-0.5 my-0.5">
                      <span className="text-[20px] sm:text-[24px] font-black text-[#1C1C1E] tracking-tight leading-none">
                        {scenarioParams.inflation.toFixed(1)}
                      </span>
                      <span className="text-[12px] sm:text-[14px] font-black text-[#8A6414] leading-none">
                        %
                      </span>
                    </div>

                    <span className="text-[8.5px] sm:text-[9.5px] font-bold text-gray-500 block truncate">
                      {scenarioParams.inflationTag}
                    </span>
                  </div>

                  {/* Unlock Territory Based Callout */}
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="pt-1 mt-1 border-t border-black/5 flex items-center justify-center gap-1 text-[8.5px] sm:text-[9px] font-black text-[#8A6414] hover:text-[#684b0f] transition-colors cursor-pointer select-none truncate group"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#8A6414] shrink-0 group-hover:rotate-12 transition-transform" />
                    <span className="hover:underline underline-offset-2 truncate">
                      Unlock Territory Based →
                    </span>
                  </button>
                </div>
              </div>
            </div>
        ) : (
          <RetirementCockpit
            simulationData={simulationData}
            hasEnteredInfo={hasEnteredInfo}
            onUpdateParam={onUpdateParam}
            onUpdateFullPlan={onUpdateFullPlan}
            onResetInfo={onResetInfo}
          />
        )}
      </main>

      {/* Auth Modal (Log In primary, Register secondary with Country Dropdown) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        isPro={isPro}
        proName={proName}
        userCountry={userCountry}
        currentPlan={simulationData}
        unlocks={unlocks}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={({ name, country: newCountry, planData: newPlan, unlocks: newUnlocks }) => {
          setIsPro(true);
          setProName(name);
          if (newCountry) setUserCountry(newCountry);
          if (newUnlocks) setUnlocks(newUnlocks);
          if (newPlan && onUpdateFullPlan) {
            onUpdateFullPlan(newPlan);
          }
        }}
        onSignOut={() => {
          setIsPro(false);
          setProName("");
        }}
      />

      {/* Compact Bottom Partner Ad Banner */}
      {!isKeyboardOpen && (
        <div className="w-full shrink-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/8 px-4 py-2 flex items-center justify-center shadow-[0_-4px_16px_rgba(0,0,0,0.04)] animate-in fade-in duration-150">
          <div className="w-full max-w-2xl mx-auto flex items-center justify-center">
            <PartnerAdBanner referralUrl="https://ibkr.com/referral/aaron6369" />
          </div>
        </div>
      )}
    </div>
  );
}