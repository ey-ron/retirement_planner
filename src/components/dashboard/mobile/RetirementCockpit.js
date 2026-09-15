import React, { useState, useMemo, useEffect } from "react";
import {
  TrendingUp, Shield, Sparkles, Sliders, Calendar,
  ArrowUpRight, ArrowDownRight, Target, Clock, Coins, CheckCircle2, AlertCircle, AlertTriangle, RefreshCw,
  ChevronRight, ChevronLeft, X, DollarSign
} from "lucide-react";

/**
 * Calculates exact age in full years given a birth date string (YYYY-MM-DD)
 */
export function calculateAge(birthDateStr) {
  if (!birthDateStr) return 30;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return 30;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(1, Math.min(100, age));
}

/**
 * Format a number or numeric string with thousand separators (e.g. 10000 -> "10,000")
 */
function formatNumberWithCommas(value) {
  if (value === null || value === undefined || value === "") return "";
  const clean = String(value).replace(/[^0-9]/g, "");
  if (!clean) return "";
  return Number(clean).toLocaleString("en-US");
}

function parseNumberClean(str) {
  if (!str) return 0;
  const clean = String(str).replace(/[^0-9]/g, "");
  return clean ? parseInt(clean, 10) : 0;
}

export default function RetirementCockpit({
  simulationData,
  hasEnteredInfo,
  onUpdateParam,
  onUpdateFullPlan,
  onResetInfo
}) {
  const [isEnteringSteps, setIsEnteringSteps] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    birthDate: initialBirthDate = "1995-01-01",
    monthlyExpense: initialMonthlyExpense = 3000,
    retireAge: initialRetireAge = 50,
    lifeExpectancy: initialLifeExpectancy = 85,
    currentNestEgg: initialCurrentNestEgg = 20000,
    monthlyInvestment: initialMonthlyInvestment = 800,
    cagr: initialCagr = 8.0,
    inflation: initialInflation = 3.5
  } = simulationData || {};

  // Form Step State (managed inside RetirementCockpit)
  const [formBirthDate, setFormBirthDate] = useState(initialBirthDate);
  const [formMonthlyExpense, setFormMonthlyExpense] = useState(initialMonthlyExpense);
  const [formRetireAge, setFormRetireAge] = useState(initialRetireAge);
  const [formLifeExpectancy, setFormLifeExpectancy] = useState(initialLifeExpectancy);
  const [formCurrentNestEgg, setFormCurrentNestEgg] = useState(initialCurrentNestEgg);
  const [formMonthlyInvestment, setFormMonthlyInvestment] = useState(initialMonthlyInvestment);
  const [formCagr, setFormCagr] = useState(initialCagr);
  const [formInflation, setFormInflation] = useState(initialInflation);

  // Sync state whenever entering steps
  useEffect(() => {
    if (isEnteringSteps) {
      setStep(1);
      setErrorMsg("");
      setFormBirthDate(initialBirthDate);
      setFormMonthlyExpense(initialMonthlyExpense);
      setFormRetireAge(initialRetireAge);
      setFormLifeExpectancy(initialLifeExpectancy);
      setFormCurrentNestEgg(initialCurrentNestEgg);
      setFormMonthlyInvestment(initialMonthlyInvestment);
      setFormCagr(initialCagr);
      setFormInflation(initialInflation);
    }
  }, [isEnteringSteps, initialBirthDate, initialMonthlyExpense, initialRetireAge, initialLifeExpectancy, initialCurrentNestEgg, initialMonthlyInvestment, initialCagr, initialInflation]);

  const formAge = useMemo(() => calculateAge(formBirthDate), [formBirthDate]);

  // Ensure formRetireAge is above formAge
  useEffect(() => {
    if (formRetireAge <= formAge) {
      setFormRetireAge(formAge + 1);
    }
  }, [formAge, formRetireAge]);

  // Ensure formLifeExpectancy is above formRetireAge
  useEffect(() => {
    if (formLifeExpectancy <= formRetireAge) {
      setFormLifeExpectancy(formRetireAge + 5);
    }
  }, [formRetireAge, formLifeExpectancy]);

  // Step 6 / Form summary simulation calculations
  const stepSimulation = useMemo(() => {
    const yearsToRetire = Math.max(0, formRetireAge - formAge);
    const monthsToRetire = yearsToRetire * 12;
    const retirementYears = Math.max(1, formLifeExpectancy - formRetireAge);
    const retirementMonths = retirementYears * 12;

    const monthlyInflationRate = formInflation / 100 / 12;
    const monthlyNominalReturn = formCagr / 100 / 12;

    const futureMonthlyExpense = formMonthlyExpense * Math.pow(1 + monthlyInflationRate, monthsToRetire);

    let requiredCorpus = 0;
    for (let m = retirementMonths - 1; m >= 0; m--) {
      const monthCost = futureMonthlyExpense * Math.pow(1 + monthlyInflationRate, m);
      requiredCorpus = (requiredCorpus + monthCost) / (1 + monthlyNominalReturn);
    }

    let projectedNestEgg = formCurrentNestEgg * Math.pow(1 + monthlyNominalReturn, monthsToRetire);
    for (let i = 0; i < monthsToRetire; i++) {
      projectedNestEgg += formMonthlyInvestment * Math.pow(1 + monthlyNominalReturn, monthsToRetire - 1 - i);
    }

    const shortfall = requiredCorpus - projectedNestEgg;
    const isOnTrack = shortfall <= 0;
    const fundedPct = requiredCorpus > 0 ? Math.min(250, (projectedNestEgg / requiredCorpus) * 100) : 100;

    return {
      futureMonthlyExpense,
      requiredCorpus,
      projectedNestEgg,
      shortfall,
      isOnTrack,
      fundedPct
    };
  }, [formAge, formRetireAge, formLifeExpectancy, formMonthlyExpense, formCurrentNestEgg, formMonthlyInvestment, formCagr, formInflation]);

  const handleStepNext = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!formBirthDate) {
        setErrorMsg("Please select a valid birth date.");
        return;
      }
    } else if (step === 2) {
      if (isNaN(formMonthlyExpense) || formMonthlyExpense <= 0) {
        setErrorMsg("Please enter a valid monthly expense amount.");
        return;
      }
    } else if (step === 3) {
      if (formRetireAge <= formAge) {
        setErrorMsg("Retirement age must be greater than your current age.");
        return;
      }
    }
    setStep(s => Math.min(6, s + 1));
  };

  const handleApplySteps = () => {
    if (onUpdateFullPlan) {
      onUpdateFullPlan({
        birthDate: formBirthDate,
        monthlyExpense: parseFloat(formMonthlyExpense) || 0,
        retireAge: parseInt(formRetireAge, 10),
        lifeExpectancy: parseInt(formLifeExpectancy, 10),
        currentNestEgg: parseFloat(formCurrentNestEgg) || 0,
        monthlyInvestment: parseFloat(formMonthlyInvestment) || 0,
        cagr: parseFloat(formCagr),
        inflation: parseFloat(formInflation)
      });
    }
    setIsEnteringSteps(false);
  };

  // Main cockpit calculations
  const activeAge = useMemo(() => calculateAge(initialBirthDate), [initialBirthDate]);
  const currentYear = new Date().getFullYear();
  const retireYear = currentYear + Math.max(0, initialRetireAge - activeAge);

  const sim = useMemo(() => {
    const yearsToRetire = Math.max(1, initialRetireAge - activeAge);
    const monthsToRetire = yearsToRetire * 12;
    const retirementYears = Math.max(1, initialLifeExpectancy - initialRetireAge);
    const retirementMonths = retirementYears * 12;

    const monthlyInflationRate = (initialInflation || 3.5) / 100 / 12;
    const monthlyNominalReturn = (initialCagr || 8.0) / 100 / 12;

    const futureMonthlyExpense = (initialMonthlyExpense || 3000) * Math.pow(1 + monthlyInflationRate, monthsToRetire);

    let requiredCorpus = 0;
    for (let m = retirementMonths - 1; m >= 0; m--) {
      const monthCost = futureMonthlyExpense * Math.pow(1 + monthlyInflationRate, m);
      requiredCorpus = (requiredCorpus + monthCost) / (1 + monthlyNominalReturn);
    }

    let projectedNestEgg = (initialCurrentNestEgg || 0) * Math.pow(1 + monthlyNominalReturn, monthsToRetire);
    for (let i = 0; i < monthsToRetire; i++) {
      projectedNestEgg += (initialMonthlyInvestment || 0) * Math.pow(1 + monthlyNominalReturn, monthsToRetire - 1 - i);
    }

    const shortfall = requiredCorpus - projectedNestEgg;
    const isOnTrack = shortfall <= 0;
    const fundedPct = requiredCorpus > 0 ? (projectedNestEgg / requiredCorpus) * 100 : 100;

    const trajectoryPoints = [];
    let balance = initialCurrentNestEgg || 0;

    for (let y = activeAge; y <= initialLifeExpectancy; y++) {
      if (y === activeAge) {
        trajectoryPoints.push({ age: y, balance: Math.round(balance) });
      } else if (y <= initialRetireAge) {
        for (let m = 0; m < 12; m++) {
          balance = (balance + initialMonthlyInvestment) * (1 + monthlyNominalReturn);
        }
        trajectoryPoints.push({ age: y, balance: Math.round(balance) });
      } else {
        const yearOffset = y - initialRetireAge;
        const currentYearAnnualExpense = (futureMonthlyExpense * 12) * Math.pow(1 + (initialInflation / 100), yearOffset);
        balance = Math.max(0, (balance * (1 + (initialCagr / 100))) - currentYearAnnualExpense);
        trajectoryPoints.push({ age: y, balance: Math.round(balance) });
      }
    }

    const maxBalance = Math.max(...trajectoryPoints.map(p => p.balance), requiredCorpus, 10000);

    return {
      yearsToRetire,
      retirementYears,
      futureMonthlyExpense,
      requiredCorpus,
      projectedNestEgg,
      shortfall,
      isOnTrack,
      fundedPct,
      trajectoryPoints,
      maxBalance
    };
  }, [activeAge, initialRetireAge, initialLifeExpectancy, initialMonthlyExpense, initialCurrentNestEgg, initialMonthlyInvestment, initialCagr, initialInflation]);

  const { chartPath, chartAreaPath, milestones, zeroDepletionAge, zeroDepletionPct } = useMemo(() => {
    if (!sim.trajectoryPoints.length) return { chartPath: "", chartAreaPath: "", milestones: [], zeroDepletionAge: null, zeroDepletionPct: null };
    const width = 340;
    const height = 110;
    const paddingX = 8;
    const paddingTop = 12;
    const paddingBottom = 12;
    const availableWidth = width - paddingX * 2;
    const availableHeight = height - paddingTop - paddingBottom;

    // Highest point in this person's trajectory
    const peakTrajectoryBalance = Math.max(...sim.trajectoryPoints.map(p => p.balance), 1);

    // Scale purely against the trajectory peak so the apex reaches 50% of the canvas height
    const points = sim.trajectoryPoints.map((p, index) => {
      const x = paddingX + (index / (sim.trajectoryPoints.length - 1)) * availableWidth;
      const normalizedRatio = Math.max(0, p.balance / peakTrajectoryBalance);
      // Apex reaches exactly 50% of the available chart height
      const y = height - paddingBottom - (normalizedRatio * availableHeight * 0.50);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathString = `M ${points.join(" L ")}`;

    // Closed area for subtle golden gradient beneath the curve
    const firstX = points[0].split(",")[0];
    const lastX = points[points.length - 1].split(",")[0];
    const baselineY = (height - paddingBottom).toFixed(1);
    const areaString = `${pathString} L ${lastX},${baselineY} L ${firstX},${baselineY} Z`;

    // Calculate prominent milestone ages for the bottom axis
    const totalSpan = Math.max(1, initialLifeExpectancy - activeAge);
    const milestones = [];

    // Start age (Current Age)
    milestones.push({
      age: activeAge,
      label: `${activeAge}`,
      isKey: false,
      pct: 0
    });

    // Intermediate accumulation milestone if gap is at least 12 years
    if (initialRetireAge - activeAge >= 12) {
      const midAccumAge = Math.round(activeAge + (initialRetireAge - activeAge) / 2);
      milestones.push({
        age: midAccumAge,
        label: `${midAccumAge}`,
        isKey: false,
        pct: ((midAccumAge - activeAge) / totalSpan) * 100
      });
    }

    // Key milestone: Retirement Age (parenthesis only, no 'Retire' word)
    milestones.push({
      age: initialRetireAge,
      label: `(${initialRetireAge})`,
      isKey: true,
      pct: ((initialRetireAge - activeAge) / totalSpan) * 100
    });

    // Check if portfolio runs down to zero after retirement
    const zeroDepletionPoint = sim.trajectoryPoints.find(p => p.age > initialRetireAge && p.balance <= 0);

    if (zeroDepletionPoint && zeroDepletionPoint.age < initialLifeExpectancy) {
      // Add red depletion age milestone where balance hits 0
      milestones.push({
        age: zeroDepletionPoint.age,
        label: `${zeroDepletionPoint.age}`,
        isZero: true,
        pct: ((zeroDepletionPoint.age - activeAge) / totalSpan) * 100
      });
    } else if (initialLifeExpectancy - initialRetireAge >= 16) {
      // Intermediate distribution milestone if horizon after retirement is at least 16 years and doesn't deplete early
      const midDistAge = Math.round(initialRetireAge + (initialLifeExpectancy - initialRetireAge) / 2);
      milestones.push({
        age: midDistAge,
        label: `${midDistAge}`,
        isKey: false,
        pct: ((midDistAge - activeAge) / totalSpan) * 100
      });
    }

    // End milestone: Life Horizon
    milestones.push({
      age: initialLifeExpectancy,
      label: `${initialLifeExpectancy}`,
      isKey: false,
      pct: 100
    });

    return {
      chartPath: pathString,
      chartAreaPath: areaString,
      milestones,
      zeroDepletionAge: zeroDepletionPoint ? zeroDepletionPoint.age : null,
      zeroDepletionPct: zeroDepletionPoint ? ((zeroDepletionPoint.age - activeAge) / totalSpan) * 100 : null
    };
  }, [sim.trajectoryPoints, activeAge, initialRetireAge, initialLifeExpectancy]);

  // UNENTERED VIEW OR DIRECT INLINE STEPS INSIDE THE RETIREMENT TRAJECTORY CARD
  // The card height is locked using flex-1 with balanced spacing, matching the exact height of the initial card.
  if (!hasEnteredInfo || isEnteringSteps) {
    return (
      <div className="w-full flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
        <div className="w-full h-full flex-1 p-5 sm:p-6 bg-white text-[#1C1C1E] rounded-3xl relative overflow-hidden border border-black/10 shadow-[0_8px_25px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#C59A3F]/8 rounded-full blur-[45px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#C59A3F]/5 rounded-full blur-[45px] pointer-events-none" />

          {/* VIEW A: Initial Landing inside Card */}
          {!isEnteringSteps ? (
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto my-auto animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C59A3F] to-[#8A6414] rounded-full flex items-center justify-center mb-5 shadow-[0_6px_22px_rgba(197,154,63,0.3)] border border-[#C59A3F]/30 animate-pulse">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>

              <h3 className="text-2xl font-black tracking-tight mb-2.5 text-[#1C1C1E]">Retirement Trajectory</h3>
              <p className="text-sm font-medium text-[#3C3C43]/80 leading-relaxed mb-8 max-w-sm">
                To calculate your personalized retirement trajectory and analyze your financial safety net, we need a baseline of your expected monthly costs. Let us guide you through setting this up in detail.
              </p>

              <button
                type="button"
                onClick={() => setIsEnteringSteps(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-95 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_6px_20px_rgba(197,154,63,0.28)] transition-all duration-200 cursor-pointer"
              >
                Enter Information
              </button>
            </div>
          ) : (
            /* VIEW B: 6 Steps Embedded directly inside the EXACT Trajectory Card */
            <div className="relative z-10 flex-1 flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
              {/* Card Top: Title & Stepper Progress */}
              <div className="shrink-0">
                <div className="flex justify-between items-center pb-2.5 border-b border-black/8">
                  <div className="flex flex-col">
                    <span className="text-base font-black tracking-tight text-[#1C1C1E]">Retirement Trajectory</span>
                    <span className="text-[11px] font-bold text-[#8A6414] uppercase tracking-wider mt-0.5">
                      Step {step} of 6 · {
                        step === 1 ? "Birth Date & Age" :
                          step === 2 ? "Monthly Lifestyle" :
                            step === 3 ? "Retirement Horizon" :
                              step === 4 ? "Nest Egg & Savings" :
                                step === 5 ? "Returns & Inflation" : "Trajectory Forecast"
                      }
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEnteringSteps(false)}
                    className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-gray-500 hover:text-[#1C1C1E] transition-colors cursor-pointer"
                    title="Close steps"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Progress bar dots */}
                <div className="flex gap-1.5 pt-2.5 pb-1.5">
                  {[1, 2, 3, 4, 5, 6].map(s => (
                    <div
                      key={s}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s === step ? 'bg-[#C59A3F] shadow-[0_0_8px_rgba(197,154,63,0.45)]' : s < step ? 'bg-[#C59A3F]/55' : 'bg-black/10'
                        }`}
                    />
                  ))}
                </div>

                {errorMsg && (
                  <div className="mt-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-xs font-semibold">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Step Dynamic Content Area: Generously spaced using flex-1 with prominent typography */}
              <div className="flex-1 flex flex-col justify-center py-2 sm:py-3 overflow-hidden">
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="flex flex-col gap-3 sm:gap-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-[#1C1C1E]">When were you born?</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                        Your birth date anchors your exact age, accumulation horizon, and milestone timeline.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#8A6414]" />
                        Date of Birth
                      </label>
                      <div className="grid grid-cols-3 gap-2.5 w-full">
                        <select
                          value={formBirthDate ? formBirthDate.split("-")[1] : "01"}
                          onChange={e => {
                            const parts = (formBirthDate || "1995-01-01").split("-");
                            setFormBirthDate(`${parts[0] || "1995"}-${e.target.value}-${parts[2] || "01"}`);
                          }}
                          className="w-full py-3 px-2 bg-[#F2F2F7] border border-black/10 rounded-2xl font-bold text-[#1C1C1E] text-xs sm:text-sm outline-none focus:border-[#C59A3F] focus:bg-white text-center cursor-pointer shadow-sm"
                        >
                          {[
                            { val: "01", name: "Jan" }, { val: "02", name: "Feb" }, { val: "03", name: "Mar" },
                            { val: "04", name: "Apr" }, { val: "05", name: "May" }, { val: "06", name: "Jun" },
                            { val: "07", name: "Jul" }, { val: "08", name: "Aug" }, { val: "09", name: "Sep" },
                            { val: "10", name: "Oct" }, { val: "11", name: "Nov" }, { val: "12", name: "Dec" }
                          ].map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
                        </select>

                        <select
                          value={formBirthDate ? formBirthDate.split("-")[2] : "01"}
                          onChange={e => {
                            const parts = (formBirthDate || "1995-01-01").split("-");
                            setFormBirthDate(`${parts[0] || "1995"}-${parts[1] || "01"}-${e.target.value}`);
                          }}
                          className="w-full py-3 px-2 bg-[#F2F2F7] border border-black/10 rounded-2xl font-bold text-[#1C1C1E] text-xs sm:text-sm outline-none focus:border-[#C59A3F] focus:bg-white text-center cursor-pointer shadow-sm"
                        >
                          {Array.from({ length: 31 }, (_, i) => {
                            const day = String(i + 1).padStart(2, "0");
                            return <option key={day} value={day}>{day}</option>;
                          })}
                        </select>

                        <select
                          value={formBirthDate ? formBirthDate.split("-")[0] : "1995"}
                          onChange={e => {
                            const parts = (formBirthDate || "1995-01-01").split("-");
                            setFormBirthDate(`${e.target.value}-${parts[1] || "01"}-${parts[2] || "01"}`);
                          }}
                          className="w-full py-3 px-2 bg-[#F2F2F7] border border-black/10 rounded-2xl font-bold text-[#1C1C1E] text-xs sm:text-sm outline-none focus:border-[#C59A3F] focus:bg-white text-center cursor-pointer shadow-sm"
                        >
                          {Array.from({ length: 80 }, (_, i) => {
                            const year = String(new Date().getFullYear() - 18 - i);
                            return <option key={year} value={year}>{year}</option>;
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="p-3 sm:p-3.5 bg-[#F8F9FA] border border-black/5 rounded-2xl flex items-center justify-between shadow-sm whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-gray-700">Calculated Age</span>
                        <span className="text-[10px] text-gray-500 font-medium">Actuarial Baseline</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 shrink-0">
                        <span className="text-xl sm:text-2xl font-black text-[#8A6414]">{formAge}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">years old</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="flex flex-col gap-3 sm:gap-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-[#1C1C1E]">Current Monthly Expenses</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                        Estimated living costs today, compounded for inflation through retirement.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        Monthly Living Cost Today:
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="3,000"
                          value={formatNumberWithCommas(formMonthlyExpense)}
                          onChange={e => setFormMonthlyExpense(parseNumberClean(e.target.value))}
                          className="w-full py-3.5 pl-10 pr-4 bg-[#F2F2F7] border border-black/10 rounded-2xl font-black text-[#1C1C1E] text-base sm:text-lg outline-none focus:border-[#C59A3F] focus:bg-white shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {[2000, 3000, 5000, 8000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormMonthlyExpense(amt)}
                          className={`flex-1 py-2 sm:py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer shadow-sm ${Number(formMonthlyExpense) === amt
                            ? 'bg-[#C59A3F]/15 border-[#C59A3F] text-[#8A6414] font-black'
                            : 'bg-[#F2F2F7] border-black/5 text-gray-600 hover:text-[#1C1C1E]'
                            }`}
                        >
                          ${amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="flex flex-col gap-3 sm:gap-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-[#1C1C1E]">Target Age & Life Horizon</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                        When you plan to stop working and your planned life horizon.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#F8F9FA] border border-black/5 rounded-2xl flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Retire Age</label>
                          <span className="text-sm font-black text-[#8A6414]">{formRetireAge} <span className="text-[10px] font-normal text-gray-400">yrs</span></span>
                        </div>
                        <input
                          type="range"
                          min={formAge + 1}
                          max="80"
                          step="1"
                          value={formRetireAge}
                          onChange={e => setFormRetireAge(parseInt(e.target.value, 10))}
                          className="w-full accent-[#C59A3F] cursor-pointer"
                        />
                        <span className="text-[10px] text-gray-500 font-medium">
                          {Math.max(0, formRetireAge - formAge)} yrs from now
                        </span>
                      </div>

                      <div className="p-3 bg-[#F8F9FA] border border-black/5 rounded-2xl flex flex-col gap-2 shadow-sm">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Horizon</label>
                          <span className="text-sm font-black text-[#2E7D32]">{formLifeExpectancy} <span className="text-[10px] font-normal text-gray-400">yrs</span></span>
                        </div>
                        <input
                          type="range"
                          min={formRetireAge + 1}
                          max="105"
                          step="1"
                          value={formLifeExpectancy}
                          onChange={e => setFormLifeExpectancy(parseInt(e.target.value, 10))}
                          className="w-full accent-[#2E7D32] cursor-pointer"
                        />
                        <span className="text-[10px] text-gray-500 font-medium">
                          {Math.max(0, formLifeExpectancy - formRetireAge)} retirement yrs
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 sm:p-3 bg-[#C59A3F]/10 border border-[#C59A3F]/20 rounded-2xl flex items-center gap-2.5">
                      <Clock size={16} className="text-[#8A6414] shrink-0" />
                      <span className="text-xs text-gray-700 leading-snug">
                        Drawdown window: <strong>{Math.max(0, formLifeExpectancy - formRetireAge)} years</strong> starting at age <strong>{formRetireAge}</strong>.
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div className="flex flex-col gap-3 sm:gap-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-[#1C1C1E]">Nest Egg & Monthly Savings</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                        Your starting capital and ongoing monthly contribution.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Current Starting Nest Egg:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">$</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="20,000"
                            value={formatNumberWithCommas(formCurrentNestEgg)}
                            onChange={e => setFormCurrentNestEgg(parseNumberClean(e.target.value))}
                            className="w-full py-3 pl-9 pr-4 bg-[#F2F2F7] border border-black/10 rounded-2xl font-black text-[#1C1C1E] text-base outline-none focus:border-[#C59A3F] focus:bg-white shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Planned Monthly Contribution:
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-gray-400">$</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="800"
                            value={formatNumberWithCommas(formMonthlyInvestment)}
                            onChange={e => setFormMonthlyInvestment(parseNumberClean(e.target.value))}
                            className="w-full py-3 pl-9 pr-4 bg-[#F2F2F7] border border-black/10 rounded-2xl font-black text-[#1C1C1E] text-base outline-none focus:border-[#C59A3F] focus:bg-white shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5 */}
                {step === 5 && (
                  <div className="flex flex-col gap-3 sm:gap-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="text-lg sm:text-xl font-black text-[#1C1C1E]">Expected Returns & Inflation</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                        Set annual compounding returns and long-term inflation rate.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#F8F9FA] border border-black/5 rounded-2xl flex flex-col gap-1.5 shadow-sm">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Growth (CAGR)</label>
                          <span className="text-sm font-black text-[#2E7D32]">{Number(formCagr).toFixed(1)}%</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="15"
                          step="0.5"
                          value={formCagr}
                          onChange={e => setFormCagr(parseFloat(e.target.value))}
                          className="w-full accent-[#2E7D32] cursor-pointer"
                        />
                      </div>

                      <div className="p-3 bg-[#F8F9FA] border border-black/5 rounded-2xl flex flex-col gap-1.5 shadow-sm">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            Inflation <span className="normal-case font-medium text-[9.5px] text-gray-400">(Estimated)</span>
                          </label>
                          <span className="text-sm font-black text-[#D32F2F]">{Number(formInflation).toFixed(1)}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="8"
                          step="0.5"
                          value={formInflation}
                          onChange={e => setFormInflation(parseFloat(e.target.value))}
                          className="w-full accent-[#D32F2F] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="px-3.5 py-2.5 bg-[#F8F9FA] border border-black/5 rounded-2xl flex justify-between items-center text-xs shadow-sm">
                      <span className="text-gray-500 font-semibold">Net Real Growth Rate:</span>
                      <span className="font-black text-[#8A6414] text-sm">
                        {(Number(formCagr) - Number(formInflation)).toFixed(1)}% / yr
                      </span>
                    </div>
                  </div>
                )}

                {/* STEP 6 */}
                {step === 6 && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg sm:text-xl font-black text-[#1C1C1E]">Simulation Forecast</h4>
                      {stepSimulation.isOnTrack ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-800 border border-green-300 flex items-center gap-1 shadow-sm">
                          <CheckCircle2 size={12} /> ON TRACK
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1 shadow-sm">
                          <AlertCircle size={12} /> SHORTFALL
                        </span>
                      )}
                    </div>

                    <div className="p-3.5 bg-[#F8F9FA] border border-black/5 rounded-2xl flex flex-col gap-2 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Future Monthly Burn (Age {formRetireAge}):</span>
                        <span className="font-black text-[#1C1C1E] text-sm flex items-baseline">
                          <span className="text-[10px] font-bold text-gray-500 relative -top-[2px] mr-0.5">$</span>
                          <span>{Math.round(stepSimulation.futureMonthlyExpense).toLocaleString()}</span>
                          <span className="text-[11px] font-semibold text-gray-500 ml-0.5">/mo</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Required Target Corpus:</span>
                        <span className="font-black text-[#8A6414] text-base flex items-baseline">
                          <span className="text-[11px] font-bold text-[#8A6414]/75 relative -top-[3px] mr-0.5">$</span>
                          <span>{Math.round(stepSimulation.requiredCorpus).toLocaleString()}</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Projected Nest Egg:</span>
                        <span className={`font-black text-base flex items-baseline ${stepSimulation.isOnTrack ? 'text-[#2E7D32]' : 'text-orange-600'}`}>
                          <span className={`text-[11px] font-bold relative -top-[3px] mr-0.5 ${stepSimulation.isOnTrack ? 'text-[#2E7D32]/75' : 'text-orange-600/75'}`}>$</span>
                          <span>{Math.round(stepSimulation.projectedNestEgg).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed">
                      {stepSimulation.isOnTrack ? (
                        "🎉 Excellent! Based on your parameters, you are projected to fully meet your retirement nest egg goal."
                      ) : (
                        `⚠️ Estimated gap of $${Math.round(stepSimulation.shortfall).toLocaleString()}. You can increase monthly contributions or extend retirement age.`
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="shrink-0 pt-2.5 border-t border-black/8 flex items-center gap-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    className="px-4 py-3 bg-white hover:bg-black/5 border border-black/10 rounded-2xl text-xs font-bold text-gray-700 flex items-center gap-1.5 active:scale-95 shadow-sm cursor-pointer transition-all"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                )}

                {step < 6 ? (
                  <button
                    type="button"
                    onClick={handleStepNext}
                    className="flex-1 py-3 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-98 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplySteps}
                    className="flex-1 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] active:scale-98 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={16} />
                    <span>Apply to Simulation</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Once information is entered, display the full Retirement Cockpit design fitted exactly to the available space
  return (
    <div className="w-full h-full flex-1 flex flex-col gap-[6px] overflow-hidden text-[#1C1C1E] animate-in fade-in duration-300">
      {/* 1. Full Hero Card (Corpus Goal Section - comfortably sized) */}
      <div
        onClick={() => setIsEnteringSteps(true)}
        className="w-full shrink-0 relative text-white rounded-2xl py-2.5 px-3.5 sm:px-4 overflow-hidden shadow-md flex flex-col justify-between z-20 select-none border border-black/5 cursor-pointer active:scale-[0.99] transition-all"
        style={{
          background: 'linear-gradient(135deg, #C59A3F 0%, #3E2B00 100%)'
        }}
        title="Tap to edit retirement assumptions"
      >
        {/* Ambient subtle light glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/15 rounded-full blur-[35px] pointer-events-none" />

        {/* Top Header: Retire Year & Age */}
        <div className="flex items-center justify-between relative z-10 pb-1.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[8.5px] font-black uppercase tracking-[0.18em] text-white/65">
              Retire Year
            </span>
            <span className="text-[13px] font-black text-white leading-none">
              {retireYear}
            </span>
            <span className="text-white/40 text-[10px]">•</span>
            <span className="text-[8.5px] font-black uppercase tracking-[0.18em] text-white/65">
              Age
            </span>
            <span className="text-[13px] font-black text-white leading-none">
              {initialRetireAge}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className={`text-[11px] font-black leading-none px-1.5 py-0.5 rounded ${sim.isOnTrack ? 'bg-[#85E394]/20 text-[#85E394]' : 'bg-orange-400/20 text-orange-200'}`}>
              {sim.fundedPct.toFixed(0)}% Funded
            </span>
          </div>
        </div>

        {/* Comparison Rows: Labels on Left, Amounts on Right */}
        <div className="flex flex-col gap-1.5 pt-2 relative z-10">
          {/* Row 1: Target Corpus */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/75">
              Target Corpus
            </span>
            <span className="text-[15px] sm:text-[16px] font-black tracking-tight text-white leading-none flex items-baseline">
              <span className="text-[10px] sm:text-[11px] font-bold text-white/80 relative -top-[3px] mr-0.5">$</span>
              <span>{Math.round(sim.requiredCorpus).toLocaleString()}</span>
            </span>
          </div>

          {/* Row 2: Projected Savings */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/75">
              Projected Savings
            </span>
            <span className={`text-[15px] sm:text-[16px] font-black tracking-tight leading-none flex items-baseline ${sim.isOnTrack ? 'text-[#85E394]' : 'text-orange-200'}`}>
              <span className={`text-[10px] sm:text-[11px] font-bold relative -top-[3px] mr-0.5 ${sim.isOnTrack ? 'text-[#85E394]/80' : 'text-orange-200/80'}`}>$</span>
              <span>{Math.round(sim.projectedNestEgg).toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Trajectory Interactive Sparkline Chart (expands to fill all remaining vertical room) */}
      <div className="w-full flex-1 min-h-0 bg-white p-3 sm:p-3.5 rounded-2xl border border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-1.5 overflow-hidden">
        <div className="flex justify-between items-center shrink-0">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-500">
            Portfolio Trajectory
          </span>
          <span className="text-[10.5px] font-bold text-[#8A6414]">
            Age {activeAge} → {initialLifeExpectancy}
          </span>
        </div>

        <div className="w-full flex-1 min-h-0 relative bg-[#F9F9FB] rounded-xl border border-black/5 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full p-1 pb-0.5" viewBox="0 0 340 110" preserveAspectRatio="none">
            <defs>
              <linearGradient id="trajectoryGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C59A3F" stopOpacity="0.28" />
                <stop offset="60%" stopColor="#C59A3F" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#C59A3F" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Gradient area beneath the curve */}
            {chartAreaPath && (
              <path
                d={chartAreaPath}
                fill="url(#trajectoryGlow)"
              />
            )}

            {/* Main trajectory stroke */}
            <path
              d={chartPath}
              fill="none"
              stroke="#C59A3F"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div
            className="absolute top-1 bottom-1 w-0.5 border-r border-dashed border-[#8A6414]/40 flex items-center justify-center"
            style={{
              left: `${Math.max(5, Math.min(95, ((initialRetireAge - activeAge) / (initialLifeExpectancy - activeAge)) * 100))}%`
            }}
          >
            <span className="absolute -top-1.5 h-[18px] bg-[#8A6414] text-[9.5px] font-black tracking-wide text-white px-1.5 flex items-center justify-center leading-none rounded shadow-sm whitespace-nowrap">
              Retire
            </span>
          </div>

          {/* Red depletion indicator if balance hits $0 before life horizon */}
          {zeroDepletionPct !== null && (
            <div
              className="absolute top-1 bottom-1 w-0.5 border-r border-dashed border-red-500/50 flex items-center justify-center"
              style={{
                left: `${Math.max(5, Math.min(95, zeroDepletionPct))}%`
              }}
            >
              <span className="absolute -top-1.5 h-[18px] bg-red-600 text-[9.5px] font-black tracking-wide text-white px-1.5 flex items-center justify-center leading-none rounded shadow-sm whitespace-nowrap">
                $0
              </span>
            </div>
          )}
        </div>

        {/* Bottom Age Timeline Axis showing key milestone ages */}
        <div className="w-full relative h-3.5 px-2 mt-0.5 shrink-0 flex items-center select-none">
          {milestones && milestones.map((m, idx) => (
            <div
              key={idx}
              className="absolute -translate-x-1/2 flex flex-col items-center"
              style={{
                left: `${m.pct === 0 ? 3 : m.pct === 100 ? 97 : m.pct}%`
              }}
            >
              <span className={`text-[8.5px] sm:text-[9px] leading-none whitespace-nowrap font-bold ${m.isZero
                ? 'text-red-600 font-black'
                : m.isKey
                  ? 'text-[#8A6414] font-black'
                  : 'text-gray-400'
                }`}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Risk Warning & Realism Teaser Card */}
      <div className="w-full flex-1 min-h-0 bg-white p-3 sm:p-3.5 rounded-2xl border border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-[9.5px] font-black tracking-wider uppercase text-amber-700">
              RISK WARNING
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-400">
            Linear vs. Reality
          </span>
        </div>

        <div className="my-auto flex flex-col gap-1 sm:gap-1.5">
          <h4 className="text-[13px] sm:text-[14px] font-black text-[#1C1C1E] tracking-tight leading-tight">
            Markets don't move in a straight line.
          </h4>
          <p className="text-[10.5px] sm:text-[11px] text-gray-600 leading-snug">
            A linear {initialCagr}% return looks safe on paper, until an early bear market cuts your retirement years in half. Unlock Professional Standards and Monte Carlo stress-testing to see how your nest egg survives actual market downturns.
          </p>
        </div>

        <div className="pt-1 border-t border-black/5 flex items-center justify-between shrink-0">
          <span className="text-[9.5px] font-bold text-[#8A6414]">
            10,000+ Market Simulations
          </span>
          <span className="text-[9.5px] font-semibold text-gray-400">
            Available in Premium
          </span>
        </div>
      </div>

      {/* 4. Premium Button & Reset */}
      <div className="flex gap-2 shrink-0 h-12 sm:h-13">
        <button
          type="button"
          onClick={() => { }}
          className="flex-1 h-full px-4 bg-gradient-to-r from-[#C59A3F] to-[#A37B2C] hover:from-[#A37B2C] hover:to-[#825F1D] active:scale-98 text-white font-black uppercase tracking-wider text-xs rounded-xl sm:rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles size={16} />
          <span>Premium</span>
        </button>

        <button
          type="button"
          onClick={onResetInfo}
          className="w-12 sm:w-13 h-full bg-white hover:bg-black/5 border border-black/10 rounded-xl sm:rounded-2xl text-gray-500 hover:text-[#1C1C1E] transition-all active:scale-95 shadow-sm flex items-center justify-center cursor-pointer"
          title="Reset to initial card"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}
