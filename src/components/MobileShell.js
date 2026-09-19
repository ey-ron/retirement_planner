import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import RetirementCockpit from "./RetirementCockpit";
import PartnerAdBanner from "./PartnerAdBanner";
import AuthModal from "./AuthModal";
import { 
  Sparkles, LogIn, Sliders, CheckCircle2, RotateCcw, Lock, ShieldCheck, 
  Info, TrendingUp, Flame, X, Plus, Trash2, Edit3, Check, ArrowRight, 
  ArrowLeft, ChevronRight, ChevronLeft, Loader2, PieChart, RefreshCw
} from "lucide-react";
import {
  computeSimulationMetrics,
  formatAbbreviatedNumber,
  formatAbbreviatedParts,
  getCurrencySymbol,
  getCountryInfo,
  computeUniversalInflation,
  computeMultiAssetPortfolio,
  computeCustomPortfolioMetrics,
  getScenarioExplanationRows,
  getScenarioExplanationText,
  INSTITUTIONAL_ASSETS
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

  const [customInvestments, setCustomInvestments] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("retirement_custom_investments");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return [];
  });


  const [liveInflationRate, setLiveInflationRate] = useState(null);
  const [activeDerivationModal, setActiveDerivationModal] = useState(null); // 'cagr' | 'inflation' | null
  const [isClosingDerivationModal, setIsClosingDerivationModal] = useState(false);
  const [cagrModalTab, setCagrModalTab] = useState("derivation"); // 'derivation' | 'investments'

  // Investment Setup Form State
  const [editingHoldingId, setEditingHoldingId] = useState(null);
  const [formSymbol, setFormSymbol] = useState("");
  const [formUnits, setFormUnits] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [isFetchingTicker, setIsFetchingTicker] = useState(false);
  const [tickerFeedback, setTickerFeedback] = useState(null);

  // Swipe gesture tracking refs for smooth horizontal touch navigation
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || !e.changedTouches || !e.changedTouches[0]) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartYRef.current || 0);
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Detect horizontal swipe if deltaX is dominant (>40px threshold and >1.3x vertical movement)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0 && cagrModalTab === "derivation") {
        // Swiped Left -> go to investments
        setCagrModalTab("investments");
      } else if (deltaX > 0 && cagrModalTab === "investments") {
        // Swiped Right -> return to derivation
        setCagrModalTab("derivation");
      }
    }
  };

  const handleSaveInvestments = useCallback((newInvestments) => {
    setCustomInvestments(newInvestments);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("retirement_custom_investments", JSON.stringify(newInvestments));
      } catch (e) {}
    }
  }, []);

  const handleFetchTickerInfo = useCallback(async (symToFetch) => {
    const symbol = (symToFetch || formSymbol).trim().toUpperCase();
    if (!symbol || symbol.length < 2) return null;
    setIsFetchingTicker(true);
    setTickerFeedback(null);
    try {
      const res = await fetch(`/api/market/cagr?symbol=${encodeURIComponent(symbol)}`);
      const data = await res.json();
      if (data && data.success) {
        if (data.price !== undefined && data.price !== null) {
          setFormPrice(data.price.toString());
        }
        setTickerFeedback({
          success: true,
          text: `Live Price: $${data.price} • ${data.periodLabel}: ${data.cagr}% CAGR`,
          data
        });
        return data;
      } else {
        setTickerFeedback({ success: false, text: data?.message || "Ticker not found on live market." });
      }
    } catch (err) {
      setTickerFeedback({ success: false, text: "Unable to query live market." });
    } finally {
      setIsFetchingTicker(false);
    }
    return null;
  }, [formSymbol]);

  // Automatically fetch live price and 20-yr CAGR when user types a symbol (500ms debounce)
  useEffect(() => {
    const sym = formSymbol.trim().toUpperCase();
    if (!sym || sym.length < 2) {
      setIsFetchingTicker(false);
      return;
    }

    const timer = setTimeout(() => {
      handleFetchTickerInfo(sym);
    }, 500);

    return () => clearTimeout(timer);
  }, [formSymbol, handleFetchTickerInfo]);


  const handleAddOrUpdateHolding = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const symbol = formSymbol.trim().toUpperCase();
    const units = parseFloat(formUnits);
    const price = parseFloat(formPrice);
    if (!symbol || isNaN(units) || units <= 0 || isNaN(price) || price <= 0) return;

    let tickerData = tickerFeedback?.data;
    if (!tickerData || tickerData.symbol !== symbol) {
      tickerData = await handleFetchTickerInfo(symbol);
    }

    const cagr = typeof tickerData?.cagr === "number" ? tickerData.cagr : 8.8;
    const sigma = typeof tickerData?.sigma === "number" ? tickerData.sigma : 16.0;
    const name = tickerData?.name || `${symbol} Holding`;
    const yearsTracked = typeof tickerData?.yearsTracked === "number" ? tickerData.yearsTracked : 20.0;

    if (editingHoldingId) {
      const updated = customInvestments.map(inv =>
        inv.id === editingHoldingId
          ? { ...inv, symbol, units, price, cagr, sigma, name, yearsTracked }
          : inv
      );
      handleSaveInvestments(updated);
      setEditingHoldingId(null);
    } else {
      const newHolding = {
        id: `inv-${Date.now()}`,
        symbol,
        units,
        price,
        cagr,
        sigma,
        name,
        yearsTracked
      };
      handleSaveInvestments([...customInvestments, newHolding]);
    }

    setFormSymbol("");
    setFormUnits("");
    setFormPrice("");
    setTickerFeedback(null);
  }, [formSymbol, formUnits, formPrice, tickerFeedback, editingHoldingId, customInvestments, handleFetchTickerInfo, handleSaveInvestments]);

  const handleStartEditHolding = (holding) => {
    setEditingHoldingId(holding.id);
    setFormSymbol(holding.symbol);
    setFormUnits(holding.units.toString());
    setFormPrice(holding.price.toString());
    setTickerFeedback(null);
  };

  const handleCancelEdit = () => {
    setEditingHoldingId(null);
    setFormSymbol("");
    setFormUnits("");
    setFormPrice("");
    setTickerFeedback(null);
  };

  const handleDeleteHolding = (id) => {
    const updated = customInvestments.filter(inv => inv.id !== id);
    handleSaveInvestments(updated);
    if (editingHoldingId === id) {
      handleCancelEdit();
    }
  };

  const handleResetToDefaultInvestments = () => {
    handleSaveInvestments([
      { id: "inv-1", symbol: "VWRA", name: "Vanguard FTSE All-World UCITS", units: 80, price: 191.66, cagr: 12.92, sigma: 15.02, yearsTracked: 7.2 },
      { id: "inv-2", symbol: "CNDX", name: "iShares NASDAQ 100 UCITS", units: 20, price: 1692.20, cagr: 19.14, sigma: 16.72, yearsTracked: 16.0 }
    ]);
    handleCancelEdit();
  };

  const [formExpenseInput, setFormExpenseInput] = useState(() => (simulationData?.monthlyExpense || 3000).toString());

  useEffect(() => {
    if (simulationData?.monthlyExpense) {
      setFormExpenseInput(simulationData.monthlyExpense.toString());
    }
  }, [simulationData?.monthlyExpense]);

  const handleCloseDerivationModal = useCallback(() => {
    if (isClosingDerivationModal) return;
    setIsClosingDerivationModal(true);
    setTimeout(() => {
      setActiveDerivationModal(null);
      setIsClosingDerivationModal(false);
      setCagrModalTab("derivation");
    }, 220);
  }, [isClosingDerivationModal]);

  const handleOpenDerivationModal = useCallback((type) => {
    setIsClosingDerivationModal(false);
    setActiveDerivationModal(type);
    setCagrModalTab("derivation");
    if (type === "fvExp") {
      setFormExpenseInput((simulationData?.monthlyExpense || 3000).toString());
    }
  }, [simulationData?.monthlyExpense]);

  const handleSaveMonthlyExpense = useCallback((e) => {
    if (e && e.preventDefault) e.preventDefault();
    const val = parseFloat(formExpenseInput);
    if (!isNaN(val) && val > 0) {
      if (onUpdateParam) {
        onUpdateParam("monthlyExpense", val);
      }
      handleCloseDerivationModal();
    }
  }, [formExpenseInput, onUpdateParam, handleCloseDerivationModal]);


  // Fetch live territory-specific inflation rate from World Bank API when unlocked
  useEffect(() => {
    const isTerritoryUnlocked = unlocks?.unlock_2 === "Unlocked";
    if (isTerritoryUnlocked && userCountry) {
      const countryInfo = getCountryInfo(userCountry);
      setLiveInflationRate(countryInfo.defaultInflation);

      fetch(`/api/market/inflation?country=${encodeURIComponent(userCountry)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && typeof data.inflation === "number") {
            setLiveInflationRate(data.inflation);
          }
        })
        .catch(() => {});
    }
  }, [userCountry, unlocks?.unlock_2]);

  // Dynamically derived custom portfolio metrics
  const customPortfolioMetrics = useMemo(() => {
    return computeCustomPortfolioMetrics(customInvestments, monteCarloScenario);
  }, [customInvestments, monteCarloScenario]);

  // Dynamic CAGR & Inflation parameters synchronized with the active Monte Carlo scenario
  // Decoupled, universally binding inflation and multi-asset covariance drag
  const scenarioParams = useMemo(() => {
    const isTerritoryUnlocked = unlocks?.unlock_2 === "Unlocked";
    const isCagrUnlocked = unlocks?.unlock_3 === "Unlocked";
    const countryInfo = getCountryInfo(userCountry);
    const wbInflation = typeof liveInflationRate === "number" ? liveInflationRate : countryInfo.defaultInflation;

    // Universal Inflation Spread Binding: pi_effective(s) = pi_base + delta_pi(s)
    const universalInf = computeUniversalInflation(monteCarloScenario, isTerritoryUnlocked, wbInflation);

    // Multi-Asset / Custom Growth Formula with Covariance Drag (unlock_3)
    let cagrValue = 8.0;
    let cagrTag = "Expected Real Growth";
    let allocationTag = null;

    if (isCagrUnlocked) {
      if (customInvestments && customInvestments.length > 0) {
        cagrValue = customPortfolioMetrics.cagrPercent;
        cagrTag = monteCarloScenario === "conservative"
          ? "Defensive Custom Drag"
          : (monteCarloScenario === "chaotic" ? "Crash Shock Custom Yield" : "Dynamic Covariance Drag");
        allocationTag = `Portfolio: ${customInvestments.length} Asset${customInvestments.length > 1 ? "s" : ""}`;
      } else {
        const multiAsset = computeMultiAssetPortfolio([0.60, 0.25, 0.10, 0.05], monteCarloScenario);
        cagrValue = multiAsset.cagrPercent;
        cagrTag = monteCarloScenario === "conservative"
          ? "Defensive Asset Drag"
          : (monteCarloScenario === "chaotic" ? "Crash Shock Yield" : "Multi-Asset Covariance Drag");
        allocationTag = "Model: Institutional";
      }
    } else {
      if (monteCarloScenario === "conservative") {
        cagrValue = 6.0;
        cagrTag = "Defensive Yield";
      } else if (monteCarloScenario === "chaotic") {
        cagrValue = 4.0;
        cagrTag = "Crash Shock Yield";
      } else {
        cagrValue = 8.0;
        cagrTag = "Benchmark 8.0% Yield";
      }
    }

    const inflationTag = isTerritoryUnlocked
      ? "10-Year Historical Drag"
      : (monteCarloScenario === "conservative"
        ? "Prudent Cost Buffer"
        : (monteCarloScenario === "chaotic" ? "Stagflation CPI" : "Annual Cost Drag"));

    return {
      cagr: cagrValue,
      inflation: universalInf.effectivePercent,
      cagrTag,
      allocationTag,
      inflationTag,
      territoryTag: isTerritoryUnlocked ? `Territory: ${countryInfo.name}` : null,
      isCagrUnlocked,
      isTerritoryUnlocked
    };
  }, [monteCarloScenario, unlocks?.unlock_2, unlocks?.unlock_3, userCountry, liveInflationRate, customInvestments, customPortfolioMetrics]);


  // Compute metrics for the Member Hero Card dynamically based on the active Monte Carlo scenario
  const memberMetrics = useMemo(() => {
    return computeSimulationMetrics({
      ...simulationData,
      cagr: scenarioParams.cagr,
      inflation: scenarioParams.inflation
    });
  }, [simulationData, scenarioParams]);

  // Live preview of FV monthly expense when editing in FV Exp modal
  const previewFvExpense = useMemo(() => {
    const exp = parseFloat(formExpenseInput) || 0;
    const currentAge = memberMetrics.currentAge || 30;
    const retireAge = memberMetrics.retireAge || 50;
    const yearsToRetire = Math.max(1, retireAge - currentAge);
    const monthsToRetire = yearsToRetire * 12;
    const monthlyInf = (scenarioParams.inflation || 3.5) / 100 / 12;
    return exp * Math.pow(1 + monthlyInf, monthsToRetire);
  }, [formExpenseInput, memberMetrics.currentAge, memberMetrics.retireAge, scenarioParams.inflation]);


  // Compute impactful scenario explanation reflecting on-track or warning risk state
  const explanationText = useMemo(() => {
    return getScenarioExplanationText({
      scenario: monteCarloScenario,
      isOnTrack: memberMetrics.isOnTrack
    });
  }, [monteCarloScenario, memberMetrics.isOnTrack]);

  const explanationContainerRef = useRef(null);
  const explanationTextRef = useRef(null);

  // Dynamic on-the-fly auto-fitting calculation for scenario explanation text
  useEffect(() => {
    const container = explanationContainerRef.current;
    const textEl = explanationTextRef.current;
    if (!container || !textEl) return;

    const adjustExplanationSize = () => {
      if (!container || !textEl) return;
      // Reset inline properties to let media queries establish initial baseline size
      textEl.style.removeProperty("font-size");
      textEl.style.removeProperty("line-height");

      const availableHeight = container.clientHeight;
      if (availableHeight <= 0) return;

      let currentSize = parseFloat(window.getComputedStyle(textEl).fontSize) || 12;
      const minSize = 8.5; // Legible floor threshold

      // If text overflows available container height, iteratively scale down font size & line height
      while (textEl.scrollHeight > availableHeight && currentSize > minSize) {
        currentSize -= 0.25;
        const currentLeading = Math.round(currentSize * 1.38 * 10) / 10;
        textEl.style.setProperty("font-size", `${currentSize}px`, "important");
        textEl.style.setProperty("line-height", `${currentLeading}px`, "important");
      }
    };

    // Run adjustment immediately
    adjustExplanationSize();

    // Re-calculate on container resize or viewport resize
    const observer = new ResizeObserver(() => {
      adjustExplanationSize();
    });
    observer.observe(container);
    window.addEventListener("resize", adjustExplanationSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", adjustExplanationSize);
    };
  }, [explanationText, monteCarloScenario, unlocks?.unlock_1]);

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
      <div className="w-full max-w-2xl mx-auto pt-1 sm:pt-2 md:pt-3 px-3 sm:px-4 shrink-0 z-30">
        <header className="w-full h-[58px] sm:h-[66px] md:h-[72px] app-header bg-white/90 backdrop-blur-xl border border-black/8 rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-3.5 sm:px-5 md:px-6 flex items-center justify-between transition-all select-none">
          <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4 min-w-0">
            <img
              src="/icon-192x192.png"
              alt="Retirement Simulator Icon"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 app-header-icon rounded-xl sm:rounded-2xl object-contain shadow-[0_2px_8px_rgba(0,0,0,0.08)] select-none shrink-0"
            />
            {isPro ? (
              <div className="flex flex-col min-w-0 justify-center leading-tight">
                <span className="text-xs sm:text-base md:text-lg app-header-title font-black tracking-tight text-[#1C1C1E] truncate">
                  {proName || "Pro Member"}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm app-header-sub font-semibold text-[#8A6414] tracking-tight truncate">
                  Retirement Journey
                </span>
              </div>
            ) : (
              <span className="text-[13px] sm:text-base md:text-lg app-header-title font-black tracking-tight text-[#1C1C1E] truncate">
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
      <main className="w-full max-w-2xl mx-auto px-3.5 sm:px-5 md:px-6 pt-1.5 sm:pt-2 pb-1.5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {isPro ? (
          /* Container for Hero Card, Extension Card & Metric Cards */
          <div className="w-full h-full flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
            {/* 1. Member Hero Card */}
            <div
              className="w-full shrink-0 relative text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 app-hero overflow-hidden shadow-lg flex items-center justify-between gap-2.5 sm:gap-4 z-20 select-none border border-amber-300/20"
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
                    size="text-[32px] sm:text-[38px] md:text-[44px] app-hero-corpus"
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
                <div className="w-[54%] max-w-[240px] bg-black/25 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 app-hero-panel border border-white/12 flex flex-col gap-2 relative z-10 shrink-0 shadow-inner">
                  {/* Row 1: Target Year & Age */}
                  <div className="flex items-center justify-between text-[11px] sm:text-[12.5px] app-hero-panel-row leading-none">
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
                  <div className="flex items-center justify-between text-[11px] sm:text-[12.5px] app-hero-panel-row leading-none">
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
                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10.5px] sm:text-[11.5px] app-hero-panel-row leading-none">
                    <button
                      type="button"
                      onClick={() => handleOpenDerivationModal("fvExp")}
                      className="flex items-center gap-1 cursor-pointer hover:opacity-90 active:scale-95 transition-all text-left group bg-transparent border-0 p-0"
                      title="Click to view & edit Future Monthly Expense"
                    >
                      <span className="text-white/60 text-[8.5px] sm:text-[9.5px] font-medium uppercase leading-none group-hover:text-amber-200 transition-colors">
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
                      <Edit3 className="w-2.5 h-2.5 text-white/40 group-hover:text-amber-200 ml-0.5 transition-colors" />
                    </button>


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
              <div className="w-full flex-1 min-h-0 -mt-3.5 sm:-mt-4.5 pt-6 sm:pt-7 pb-2.5 px-3.5 sm:px-5 app-mc-container bg-white/90 backdrop-blur-xl border border-black/8 rounded-b-2xl sm:rounded-b-3xl rounded-t-xl sm:rounded-t-2xl shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col justify-between text-center relative z-10 transition-none transform-none overflow-hidden">
                {/* Top Section: Header, Monte Carlo 3-Tab Selector & Risk Percentage */}
                <div className="w-full flex flex-col items-center pt-0.5 shrink-0">
                  {/* Header in Clearance */}
                  <span className="text-[9.5px] sm:text-[10.5px] app-mc-main-header font-black uppercase tracking-[0.16em] text-[#8A6414] mb-2">
                    Monte Carlo Stochastic Probability
                  </span>

                  {/* 3 Selector Tabs: Standard, Conservative, Chaotic */}
                  <div className="w-full max-w-sm bg-[#E5E5EA]/70 p-1 app-mc-tabs rounded-xl flex items-center gap-1 border border-black/5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setMonteCarloScenario("standard")}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs app-mc-tab-btn font-black cursor-pointer select-none transition-none active:scale-100 touch-manipulation ${
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
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs app-mc-tab-btn font-black cursor-pointer select-none transition-none active:scale-100 touch-manipulation ${
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
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs app-mc-tab-btn font-black cursor-pointer select-none transition-none active:scale-100 touch-manipulation ${
                        monteCarloScenario === "chaotic"
                          ? "bg-white text-[#1C1C1E] shadow-sm border border-black/5"
                          : "text-gray-500 hover:text-gray-900 border border-transparent"
                      }`}
                    >
                      Chaotic
                    </button>
                  </div>

                  {/* Risk Percentage Bar & Metrics */}
                  <div className="w-full max-w-sm mt-2.5 px-1 flex flex-col gap-1.5 app-mc-risk">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs app-mc-risk-text">
                      <span className="font-bold text-gray-500">
                        Risk Percentage:
                      </span>
                      <span
                        className={`font-black flex items-center gap-1 text-[12px] sm:text-[13px] app-mc-risk-pct ${
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
                <div className="w-full flex-1 min-h-0 my-1.5 sm:my-2 flex flex-col justify-between bg-white/70 backdrop-blur-md rounded-xl p-3 sm:p-4 app-mc-content-box border border-black/6 shadow-sm text-left overflow-hidden">
                  <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] shrink-0 border border-amber-500/20">
                        <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#8A6414] stroke-[2.2]" />
                      </div>
                      <div className="flex flex-col justify-center leading-tight">
                        <span className="text-[11.5px] sm:text-[12.5px] app-mc-scenario-title font-black text-[#1C1C1E]">
                          {monteCarloScenario === "conservative" && "Conservative"}
                          {monteCarloScenario === "standard" && "50-Year Market"}
                          {monteCarloScenario === "chaotic" && "Chaotic Stagflation"}
                        </span>
                        <span className="text-[9.5px] sm:text-[10.5px] app-mc-scenario-sub font-bold text-gray-500 tracking-tight">
                          {monteCarloScenario === "conservative" && "Lower Yield Drag"}
                          {monteCarloScenario === "standard" && "Benchmark Growth"}
                          {monteCarloScenario === "chaotic" && "& Crash Shock"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center leading-tight shrink-0 pl-2">
                      <span className="text-[12px] sm:text-[13px] font-black text-[#1C1C1E] tracking-tight">
                        {unlocks?.unlock_1 === "Unlocked" ? "10,000" : "1,000"}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                        {unlocks?.unlock_1 === "Unlocked" ? "Simulations" : "Baseline Runs"}
                      </span>
                    </div>
                  </div>

                  {/* Impactful Scenario Assessment (On Track vs Risk Warning) - Vertically Centered & Auto-Fitting */}
                  <div ref={explanationContainerRef} className="flex-1 flex flex-col justify-center min-h-0 my-auto overflow-hidden">
                    <p ref={explanationTextRef} className="app-mc-explanation text-[10.5px] sm:text-[11.5px] text-gray-700 leading-[17.5px] sm:leading-[19px] my-auto text-left font-normal">
                      {explanationText}
                    </p>
                  </div>

                  {/* Unlock Professional Standard Clickable CTA (Hidden when already unlocked) */}
                  {unlocks?.unlock_1 !== "Unlocked" && (
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

              {/* 3. Side-by-Side Metric Cards: CAGR & Inflation Rate */}
              <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3.5 mt-2 shrink-0 select-none">
                {/* Left Card: CAGR (Clickable when Unlocked) */}
                <div
                  onClick={() => {
                    if (scenarioParams.isCagrUnlocked) {
                      handleOpenDerivationModal("cagr");
                    }
                  }}
                  className={`bg-white/90 backdrop-blur-xl border ${
                    scenarioParams.isCagrUnlocked
                      ? "border-amber-500/25 hover:border-amber-500/50 cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
                      : "border-black/8"
                  } rounded-2xl sm:rounded-3xl app-metric-card ${
                    unlocks?.unlock_1 === "Unlocked"
                      ? "min-h-[88px] sm:min-h-[96px] py-2 sm:py-2.5"
                      : "min-h-[80px] sm:min-h-[88px] py-1.5 sm:py-2"
                  } px-3 sm:px-3.5 shadow-sm flex flex-col justify-between transition-all`}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-[#8A6414]">
                        CAGR Return
                      </span>
                      <div className="w-5.5 h-5.5 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] border border-amber-500/15">
                        <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-0.5 my-0.5">
                      <span className="text-[21px] sm:text-[24px] app-metric-value font-black text-[#1C1C1E] tracking-tight leading-none">
                        {scenarioParams.isCagrUnlocked ? scenarioParams.cagr.toFixed(2) : scenarioParams.cagr.toFixed(1)}
                      </span>
                      <span className="text-[12.5px] sm:text-[14px] font-black text-[#8A6414] leading-none">
                        %
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      {scenarioParams.allocationTag && (
                        <span className="text-[8.5px] sm:text-[9.5px] app-metric-tag-1 font-bold text-[#8A6414] truncate block leading-tight">
                          {scenarioParams.allocationTag}
                        </span>
                      )}
                      <span className="text-[8px] sm:text-[9px] app-metric-tag-2 font-bold text-gray-500 block truncate leading-tight">
                        {scenarioParams.cagrTag}
                      </span>
                    </div>
                  </div>

                  {/* Unlock Weighted Growth Callout (Hidden when unlocked) */}
                  {!scenarioParams.isCagrUnlocked && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAuthModalOpen(true);
                      }}
                      className="pt-1 mt-1 border-t border-black/5 flex items-center justify-center gap-1 text-[8.5px] sm:text-[9px] font-black text-[#8A6414] hover:text-[#684b0f] transition-colors cursor-pointer select-none truncate group"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#8A6414] shrink-0 group-hover:rotate-12 transition-transform" />
                      <span className="hover:underline underline-offset-2 truncate">
                        Unlock Weighted Growth →
                      </span>
                    </button>
                  )}
                </div>

                {/* Right Card: Inflation Rate (Clickable when Unlocked) */}
                <div
                  onClick={() => {
                    if (scenarioParams.isTerritoryUnlocked) {
                      handleOpenDerivationModal("inflation");
                    }
                  }}
                  className={`bg-white/90 backdrop-blur-xl border ${
                    scenarioParams.isTerritoryUnlocked
                      ? "border-amber-500/25 hover:border-amber-500/50 cursor-pointer active:scale-95 shadow-sm hover:shadow-md"
                      : "border-black/8"
                  } rounded-2xl sm:rounded-3xl app-metric-card ${
                    unlocks?.unlock_1 === "Unlocked"
                      ? "min-h-[88px] sm:min-h-[96px] py-2 sm:py-2.5"
                      : "min-h-[80px] sm:min-h-[88px] py-1.5 sm:py-2"
                  } px-3 sm:px-3.5 shadow-sm flex flex-col justify-between transition-all`}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-[#8A6414]">
                        Inflation Rate
                      </span>
                      <div className="w-5.5 h-5.5 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] border border-amber-500/15">
                        <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="flex items-baseline gap-0.5 my-0.5">
                      <span className="text-[21px] sm:text-[24px] app-metric-value font-black text-[#1C1C1E] tracking-tight leading-none">
                        {scenarioParams.isTerritoryUnlocked ? scenarioParams.inflation.toFixed(2) : scenarioParams.inflation.toFixed(1)}
                      </span>
                      <span className="text-[12.5px] sm:text-[14px] font-black text-[#8A6414] leading-none">
                        %
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5 min-w-0">
                      {scenarioParams.territoryTag && (
                        <span className="text-[8.5px] sm:text-[9.5px] app-metric-tag-1 font-bold text-[#8A6414] truncate block leading-tight">
                          {scenarioParams.territoryTag}
                        </span>
                      )}
                      <span className="text-[8px] sm:text-[9px] app-metric-tag-2 font-bold text-gray-500 block truncate leading-tight">
                        {scenarioParams.inflationTag}
                      </span>
                    </div>
                  </div>

                  {/* Unlock Territory Based Callout (Hidden when unlocked) */}
                  {!scenarioParams.isTerritoryUnlocked && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAuthModalOpen(true);
                      }}
                      className="pt-1 mt-1 border-t border-black/5 flex items-center justify-center gap-1 text-[8.5px] sm:text-[9px] font-black text-[#8A6414] hover:text-[#684b0f] transition-colors cursor-pointer select-none truncate group"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#8A6414] shrink-0 group-hover:rotate-12 transition-transform" />
                      <span className="hover:underline underline-offset-2 truncate">
                        Unlock Territory Based →
                      </span>
                    </button>
                  )}
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

      {/* Vertically Centered 3/4-Screen Explanation Modal for Unlocked CAGR & Inflation */}
      {activeDerivationModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 ${
            isClosingDerivationModal ? "animate-modal-backdrop-out pointer-events-none" : "animate-modal-backdrop"
          }`}
          onClick={handleCloseDerivationModal}
        >
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`w-[94%] sm:w-[85%] max-w-sm ${
              activeDerivationModal === "cagr" && cagrModalTab === "investments"
                ? "h-[80vh] max-h-[580px]"
                : "h-auto max-h-[85vh]"
            } bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-black/10 flex flex-col text-left select-none overflow-hidden ${
              isClosingDerivationModal ? "animate-modal-pop-out" : "animate-modal-pop"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {activeDerivationModal === "cagr" && (
              <div className={`${cagrModalTab === "investments" ? "h-full justify-between" : ""} flex flex-col overflow-hidden`}>
                {/* Modal Navigation Pill Switcher */}
                <div className="shrink-0 flex items-center justify-between gap-1 p-0.5 bg-[#F2F2F7] rounded-xl mb-2 border border-black/5">
                  <button
                    type="button"
                    onClick={() => setCagrModalTab("derivation")}
                    className={`flex-1 py-1 px-2 rounded-lg text-[9.5px] sm:text-[10px] font-black transition-all cursor-pointer ${
                      cagrModalTab === "derivation"
                        ? "bg-white text-[#1C1C1E] shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Derivation Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setCagrModalTab("investments")}
                    className={`flex-1 py-1 px-2 rounded-lg text-[9.5px] sm:text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      cagrModalTab === "investments"
                        ? "bg-white text-[#8A6414] shadow-sm"
                        : "text-gray-500 hover:text-[#8A6414]"
                    }`}
                  >
                    <PieChart className="w-3 h-3" />
                    <span>Setup Investments {customInvestments.length > 0 ? `(${customInvestments.length})` : ""}</span>
                  </button>
                </div>

                {/* VIEW 1: Derivation Overview */}
                {cagrModalTab === "derivation" && (
                  <div className="h-full flex flex-col justify-between overflow-hidden">
                    {/* Modal Header */}
                    <div className="shrink-0 flex items-start justify-between pb-1.5 mb-1.5 border-b border-black/5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] border border-amber-500/20 shrink-0">
                          <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div className="leading-tight">
                          <h3 className="text-xs sm:text-sm font-black text-[#1C1C1E]">
                            Weighted Growth CAGR
                          </h3>
                          <p className="text-[9px] sm:text-[10px] font-bold text-[#8A6414]">
                            {customInvestments.length > 0 ? "Dynamic Multi-Holding Covariance Drag" : "Institutional Covariance Drag Derivation"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseDerivationModal}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Body Content - Scrollable if needed */}
                    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-2 pr-0.5 text-left text-gray-700">
                      <p className="text-[9.5px] sm:text-[10.5px] leading-snug text-gray-800">
                        Compound annual growth models geometric accumulation over 20–40 years, deducting <strong>volatility drag</strong> that erodes multi-decade wealth.
                      </p>

                      {/* Mathematical Formulation */}
                      <div className="bg-[#F8F8FA] border border-black/5 rounded-xl p-2">
                        <div className="font-mono text-[10px] sm:text-[11px] text-gray-900 bg-white py-1 px-2 rounded-lg border border-black/5 overflow-x-auto text-center font-black">
                          R_portfolio ≈ wᵀμ - ½ wᵀΣw
                        </div>
                        <p className="text-[8.5px] sm:text-[9px] text-gray-500 mt-1 leading-tight">
                          <strong>wᵀμ</strong> is arithmetic return ({customPortfolioMetrics.arithmeticPercent}%), minus covariance drag (-{customPortfolioMetrics.varianceDragPercent}%) deducted to project true geometric growth.
                        </p>
                      </div>

                      {/* Dynamic Asset Allocation Breakdown List */}
                      <div className="space-y-1">
                        {customPortfolioMetrics.investments && customPortfolioMetrics.investments.length > 0 ? (
                          customPortfolioMetrics.investments.map((asset, idx) => (
                            <div key={asset.id || idx} className="flex items-center justify-between text-[9px] sm:text-[10px] bg-gray-50 px-2 py-1 rounded-lg border border-black/5">
                              <div className="flex items-center gap-1.5 truncate pr-2">
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-[#8A6414] font-black text-[8.5px]">
                                  {asset.symbol}
                                </span>
                                <span className="font-bold text-gray-800 truncate">{asset.name || asset.symbol}</span>
                              </div>
                              <span className="font-mono font-black text-[#8A6414] shrink-0 text-right">
                                {asset.weightPercent}% <span className="text-gray-400 font-normal">(μ: {asset.cagr.toFixed(1)}%)</span>
                              </span>
                            </div>
                          ))
                        ) : (
                          INSTITUTIONAL_ASSETS.map((asset, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[9px] sm:text-[10px] bg-gray-50 px-2 py-0.5 rounded-lg border border-black/5">
                              <span className="font-bold text-gray-800 truncate pr-2">{asset.name}</span>
                              <span className="font-mono font-black text-[#8A6414] shrink-0">
                                {(asset.defaultWeight * 100).toFixed(0)}% (μ: {(asset.mu * 100).toFixed(1)}%)
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Telemetry Summary */}
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-2 flex items-center justify-between">
                        <div>
                          <span className="text-[8px] font-bold text-gray-500 block uppercase tracking-wider">
                            Realized Compound CAGR
                          </span>
                          <span className="text-[15px] sm:text-[17px] font-black text-[#1C1C1E] leading-none">
                            {scenarioParams.isCagrUnlocked ? scenarioParams.cagr.toFixed(2) : scenarioParams.cagr.toFixed(1)}% / yr
                          </span>
                        </div>
                        <span className="text-[8px] sm:text-[8.5px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Drag Deducted (-{customPortfolioMetrics.varianceDragPercent}%)
                        </span>
                      </div>
                    </div>

                    {/* Fixed Pinned Footer: Footnote & Close Button */}
                    <div className="shrink-0 pt-2 border-t border-black/5 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setCagrModalTab("investments")}
                        className="w-full p-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/15 border border-amber-500/25 flex items-center justify-between text-[#8A6414] hover:border-amber-500/40 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[11px]">👈</span>
                          <div className="text-left leading-tight min-w-0">
                            <p className="text-[9.5px] sm:text-[10px] font-black text-[#1C1C1E] truncate">
                              Swipe left to setup investment
                            </p>
                            <p className="text-[8px] sm:text-[8.5px] font-medium text-gray-500 truncate">
                              Add, edit & delete holdings with live 20-yr CAGR
                            </p>
                          </div>
                        </div>
                        <span className="text-[8.5px] font-black flex items-center gap-1 bg-[#8A6414] text-white px-2 py-0.5 rounded-lg shrink-0 group-hover:scale-105 transition-transform">
                          Setup →
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCloseDerivationModal}
                        className="w-full py-2 rounded-xl bg-[#1C1C1E] text-white text-xs font-black hover:bg-black transition-colors cursor-pointer"
                      >
                        Close Derivation
                      </button>
                    </div>
                  </div>
                )}

                {/* VIEW 2: Custom Investment Setup */}
                {cagrModalTab === "investments" && (
                  <div className="h-full flex flex-col justify-between overflow-hidden">
                    {/* Fixed Header */}
                    <div className="shrink-0 flex items-start justify-between pb-1.5 mb-1.5 border-b border-black/5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCagrModalTab("derivation")}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors cursor-pointer shrink-0"
                          title="Back to Derivation Overview"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="leading-tight">
                          <h3 className="text-xs sm:text-sm font-black text-[#1C1C1E]">
                            Setup Investments
                          </h3>
                          <p className="text-[9px] sm:text-[10px] font-bold text-[#8A6414]">
                            Holdings & Allocation Breakdown
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCloseDerivationModal}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Fixed Add / Edit Holding Form */}
                    <div className="shrink-0 mb-1.5">
                      <form onSubmit={handleAddOrUpdateHolding} className="bg-[#F8F8FA] border border-black/5 rounded-2xl p-2 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] sm:text-[9.5px] font-black text-[#1C1C1E] uppercase tracking-wider">
                            {editingHoldingId ? "Edit Holding" : "Add Investment Holding"}
                          </span>
                          {editingHoldingId && (
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="text-[8.5px] font-bold text-gray-500 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {/* Input Row: Symbol, Units, Price */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div>
                            <label className="text-[7.5px] font-bold text-gray-500 block mb-0.5">
                              Symbol
                            </label>
                            <input
                              type="text"
                              value={formSymbol}
                              onChange={(e) => {
                                setFormSymbol(e.target.value.toUpperCase());
                                setTickerFeedback(null);
                              }}
                              onBlur={() => {
                                if (formSymbol.trim()) handleFetchTickerInfo(formSymbol);
                              }}
                              placeholder="e.g. VWRA"
                              className="w-full bg-white border border-black/10 rounded-lg px-2 py-1 text-[10px] font-black text-[#1C1C1E] focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[7.5px] font-bold text-gray-500 block mb-0.5">
                              Units
                            </label>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              value={formUnits}
                              onChange={(e) => setFormUnits(e.target.value)}
                              placeholder="e.g. 80"
                              className="w-full bg-white border border-black/10 rounded-lg px-2 py-1 text-[10px] font-black text-[#1C1C1E] focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[7.5px] font-bold text-gray-500 block mb-0.5">
                              Price ($)
                            </label>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              value={formPrice}
                              onChange={(e) => setFormPrice(e.target.value)}
                              placeholder="e.g. 191.66"
                              className="w-full bg-white border border-black/10 rounded-lg px-2 py-1 text-[10px] font-black text-[#1C1C1E] focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        {/* Live Ticker Feedback Badge */}
                        {isFetchingTicker && (
                          <div className="flex items-center gap-1 text-[8px] text-[#8A6414] font-bold">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Fetching live 20-yr historical market CAGR...</span>
                          </div>
                        )}
                        {tickerFeedback && (
                          <div className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${tickerFeedback.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700"}`}>
                            {tickerFeedback.text}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={!formSymbol || !formUnits || !formPrice}
                          className="w-full py-1.5 rounded-xl bg-[#8A6414] text-white text-[10px] font-black hover:bg-[#684b0f] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          {editingHoldingId ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Update Holding</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Investment Holding</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Fixed Portfolio Allocation Breakdown Header & Visual Bar */}
                    {customPortfolioMetrics.investments && customPortfolioMetrics.investments.length > 0 && (
                      <div className="shrink-0 space-y-1 mb-1">
                        <div className="flex items-center justify-between text-[8.5px] font-black text-gray-600">
                          <span>Portfolio Allocation Breakdown</span>
                          <span className="font-mono text-[#8A6414]">
                            Total: ${customPortfolioMetrics.totalPortfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="w-full h-2.5 rounded-full overflow-hidden bg-gray-200 flex border border-black/5">
                          {customPortfolioMetrics.investments.map((asset, idx) => {
                            const colors = [
                              "bg-amber-500",
                              "bg-sky-500",
                              "bg-emerald-500",
                              "bg-purple-500",
                              "bg-rose-500",
                              "bg-indigo-500"
                            ];
                            const colorClass = colors[idx % colors.length];
                            return (
                              <div
                                key={asset.id || idx}
                                style={{ width: `${asset.weightPercent}%` }}
                                className={`${colorClass} h-full transition-all`}
                                title={`${asset.symbol}: ${asset.weightPercent}%`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ONLY SCROLLABLE REGION: Holdings List Content Cards */}
                    <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-1.5 pr-0.5">
                      {customPortfolioMetrics.investments && customPortfolioMetrics.investments.length > 0 ? (
                        customPortfolioMetrics.investments.map((asset, idx) => {
                          const colors = ["text-amber-600", "text-sky-600", "text-emerald-600", "text-purple-600", "text-rose-600"];
                          const colorClass = colors[idx % colors.length];
                          return (
                            <div
                              key={asset.id || idx}
                              className="bg-white p-2 rounded-xl border border-black/8 shadow-xs flex items-center justify-between gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className={`font-black text-[10.5px] ${colorClass}`}>
                                    {asset.symbol}
                                  </span>
                                  <span className="text-[7.5px] font-black px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                                    {asset.weightPercent}%
                                  </span>
                                  <span className="text-[7.5px] font-bold text-gray-400 truncate">
                                    {asset.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[8.5px] font-bold text-gray-500 font-mono">
                                  <span>{asset.units} units @ ${asset.price.toFixed(2)}</span>
                                  <span className="text-gray-900 font-black">
                                    = ${asset.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                                <div className="text-[7.5px] font-bold text-[#8A6414] mt-0.5">
                                  20-Yr Benchmark CAGR: {asset.cagr.toFixed(1)}% (σ: {(asset.sigma * 100).toFixed(1)}%)
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditHolding(asset)}
                                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                                  title="Edit holding"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteHolding(asset.id)}
                                  className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Delete holding"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-4 px-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                          <p className="text-[10px] font-black text-gray-700">No Investments Configured Yet</p>
                          <p className="text-[8.5px] font-bold text-gray-400 mt-0.5">Enter a symbol (e.g. VWRA, CNDX), units and price above to calculate your allocation breakdown.</p>
                        </div>
                      )}
                    </div>

                    {/* Fixed Pinned Footer: Portfolio Summary & Action Button */}
                    <div className="shrink-0 pt-1.5 border-t border-black/5 space-y-1.5">
                      {/* Portfolio Summary Card */}
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-1.5 flex items-center justify-between">
                        <div>
                          <span className="text-[7.5px] font-bold text-gray-500 block uppercase tracking-wider">
                            Realized Portfolio CAGR
                          </span>
                          <span className="text-[14px] sm:text-[16px] font-black text-[#1C1C1E] leading-none">
                            {customPortfolioMetrics.cagrPercent}% / yr
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[7.5px] font-bold text-gray-500 block">
                            Arithmetic μ: {customPortfolioMetrics.arithmeticPercent}%
                          </span>
                          <span className="text-[7.5px] font-bold text-emerald-700">
                            Drag: -{customPortfolioMetrics.varianceDragPercent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[8px] font-bold text-gray-400">
                        {customInvestments.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleSaveInvestments([])}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                            <span>Clear all holdings</span>
                          </button>
                        )}
                        <span className="ml-auto">
                          👉 Swipe right for Derivation Overview
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCagrModalTab("derivation")}
                        className="w-full py-2 rounded-xl bg-[#1C1C1E] text-white text-xs font-black hover:bg-black transition-colors cursor-pointer"
                      >
                        Done & View Derivation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeDerivationModal === "inflation" && (
              <div>
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-2 mb-2 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] border border-amber-500/20 shrink-0">
                      <Flame className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="leading-tight">
                      <h3 className="text-xs sm:text-sm font-black text-[#1C1C1E]">
                        Territory Inflation Rate
                      </h3>
                      <p className="text-[9.5px] sm:text-[10.5px] font-bold text-[#8A6414]">
                        World Bank 10-Year Rolling Compound CPI
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseDerivationModal}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="space-y-2 text-left text-gray-700">
                  <p className="text-[10px] sm:text-[11px] leading-snug text-gray-800">
                    Represents purchasing power erosion for <strong>{userCountry}</strong>. Living costs compound in nominal dollars independently of market drawdowns.
                  </p>

                  {/* Universal Formula */}
                  <div className="bg-[#F8F8FA] border border-black/5 rounded-xl p-2 sm:p-2.5">
                    <div className="font-mono text-[10.5px] sm:text-[11.5px] text-gray-900 bg-white py-1 px-2 rounded-lg border border-black/5 overflow-x-auto text-center font-black">
                      π_effective(s) = π_base × M(s)
                    </div>
                    <div className="mt-1.5 space-y-0.5 text-[9.5px] text-gray-600">
                      <div className="flex justify-between">
                        <span>World Bank 10-Yr (π_base):</span>
                        <strong className="font-mono text-gray-900">{(liveInflationRate ?? getCountryInfo(userCountry).defaultInflation).toFixed(2)}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Scenario Multiplier M(s):</span>
                        <strong className="font-mono text-[#8A6414]">
                          {monteCarloScenario === "chaotic" ? "1.35x (+35% Shock)" : (monteCarloScenario === "conservative" ? "1.15x (+15% Stress)" : "1.00x (Standard)")}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Why 10-Year Rolling Mean */}
                  <div className="p-2 bg-amber-500/5 rounded-xl border border-amber-500/15">
                    <p className="text-[9px] sm:text-[9.5px] text-gray-700 leading-snug">
                      Single-year CPI spot data fluctuates erratically. Projections spanning 30+ years require a 10-year rolling compound average to avoid underfunding living costs.
                    </p>
                  </div>

                  {/* Telemetry Summary */}
                  <div className="bg-white border border-black/10 rounded-xl p-2 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[8.5px] font-bold text-gray-500 block uppercase tracking-wider">
                        Effective Annual Cost Drag
                      </span>
                      <span className="text-[16px] sm:text-[18px] font-black text-[#1C1C1E] leading-none">
                        {scenarioParams.isTerritoryUnlocked ? scenarioParams.inflation.toFixed(2) : scenarioParams.inflation.toFixed(1)}% / yr
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[8.5px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-[#8A6414] border border-amber-200">
                      Live Regional Feed
                    </span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-2 mt-2 border-t border-black/5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleCloseDerivationModal}
                    className="w-full py-2 rounded-xl bg-[#1C1C1E] text-white text-xs font-black hover:bg-black transition-colors cursor-pointer"
                  >
                    Close Derivation
                  </button>
                </div>
              </div>
            )}

            {activeDerivationModal === "fvExp" && (
              <div className="flex flex-col gap-2 overflow-hidden">
                {/* Modal Header */}
                <div className="shrink-0 flex items-start justify-between pb-1.5 mb-0.5 border-b border-black/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-[#8A6414] border border-amber-500/20 shrink-0">
                      <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="leading-tight">
                      <h3 className="text-xs sm:text-sm font-black text-[#1C1C1E]">
                        Future Monthly Expense (FV Exp)
                      </h3>
                      <p className="text-[9px] sm:text-[10px] font-bold text-[#8A6414]">
                        Inflation-Compounded Living Cost
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseDerivationModal}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="space-y-2 pr-0.5 text-left text-gray-700">
                  <p className="text-[9.5px] sm:text-[10.5px] leading-snug text-gray-800">
                    <strong>FV Exp</strong> projects your required monthly living cost when you retire at age <strong>{memberMetrics.retireAge}</strong> ({memberMetrics.retireYear}), accounting for compounding inflation over your accumulation years.
                  </p>

                  {/* Mathematical Compounding Formula */}
                  <div className="bg-[#F8F8FA] border border-black/5 rounded-xl p-2">
                    <div className="font-mono text-[10px] sm:text-[11px] text-gray-900 bg-white py-1 px-2 rounded-lg border border-black/5 overflow-x-auto text-center font-black">
                      FV = C_0 × (1 + π_monthly)^m
                    </div>
                    <p className="text-[8.5px] sm:text-[9px] text-gray-500 mt-1 leading-tight">
                      Compounds today&apos;s expenses forward over <strong>{Math.max(1, memberMetrics.retireAge - memberMetrics.currentAge)} years</strong> ({Math.max(1, memberMetrics.retireAge - memberMetrics.currentAge) * 12} months) at <strong>{scenarioParams.inflation.toFixed(1)}% annual inflation</strong>.
                    </p>
                  </div>

                  {/* Interactive Monthly Expense Edit Form */}
                  <form onSubmit={handleSaveMonthlyExpense} className="bg-white border border-black/10 rounded-2xl p-2.5 shadow-xs space-y-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[8.5px] font-bold text-gray-600 block uppercase tracking-wider">
                          Current Monthly Expense ({currencySymbol})
                        </label>
                        <span className="text-[8.5px] font-bold text-[#8A6414]">
                          Age {memberMetrics.currentAge} living cost
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          step="50"
                          min="100"
                          value={formExpenseInput}
                          onChange={(e) => setFormExpenseInput(e.target.value)}
                          className="w-full bg-[#F8F8FA] border border-black/10 rounded-xl pl-6 pr-3 py-1.5 text-xs sm:text-sm font-black text-[#1C1C1E] focus:outline-none focus:border-amber-500"
                          placeholder="e.g. 3000"
                        />
                      </div>
                    </div>

                    {/* Quick delta buttons */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-bold text-gray-400">Quick adjust:</span>
                      {[-500, -200, +200, +500].map((delta) => (
                        <button
                          key={delta}
                          type="button"
                          onClick={() => {
                            const curr = parseFloat(formExpenseInput) || 3000;
                            setFormExpenseInput(Math.max(100, curr + delta).toString());
                          }}
                          className="px-1.5 py-0.5 rounded-md bg-gray-100 hover:bg-amber-50 hover:text-[#8A6414] text-[8.5px] font-bold text-gray-600 transition-colors cursor-pointer border border-black/5"
                        >
                          {delta > 0 ? `+${delta}` : delta}
                        </button>
                      ))}
                    </div>
                  </form>

                  {/* Impact Summary Comparison */}
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-2 flex items-center justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-gray-500 block uppercase tracking-wider">
                        Projected FV Expense
                      </span>
                      <span className="text-[15px] sm:text-[17px] font-black text-[#1C1C1E] leading-none">
                        {currencySymbol}{Math.round(previewFvExpense).toLocaleString()} <span className="text-[9px] font-bold text-gray-500">/ mo</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-[#8A6414] border border-amber-300">
                        {((previewFvExpense / (Math.max(1, parseFloat(formExpenseInput) || 1)))).toFixed(2)}x Inflation Drag
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fixed Pinned Footer: Save & Close Buttons */}
                <div className="shrink-0 pt-2 border-t border-black/5 space-y-1.5">
                  <button
                    type="button"
                    onClick={handleSaveMonthlyExpense}
                    className="w-full py-2 rounded-xl bg-[#8A6414] text-white text-xs font-black hover:bg-[#684b0f] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & Update Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseDerivationModal}
                    className="w-full py-1.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-black hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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