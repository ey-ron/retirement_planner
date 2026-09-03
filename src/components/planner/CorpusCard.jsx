'use client';

import React from 'react';
import { ShieldCheck, TrendingUp, DollarSign, Calendar, Lock, Sparkles, HeartPulse } from 'lucide-react';
import { formatCurrency } from '@/lib/calculations/retirement';
import { DEFAULT_INFLATION_RATE } from '@/lib/constants/benchmarks';

export default function CorpusCard({
  currentAge,
  retirementAge,
  lifeExpectancy,
  yearsToRetirement,
  retirementDuration,
  currentAnnualExpense,
  futureAnnualExpense,
  requiredCorpus,
  inflationRate = DEFAULT_INFLATION_RATE,
}) {
  const futureMonthlyExpense = futureAnnualExpense / 12;
  const inflationMultiplier = currentAnnualExpense > 0 ? (futureAnnualExpense / currentAnnualExpense).toFixed(2) : '1.00';
  const targetYear = new Date().getFullYear() + Math.max(0, yearsToRetirement);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-zinc-900/95 via-zinc-900/80 to-zinc-950/95 p-3 sm:p-4 backdrop-blur-xl shadow-xl">
      {/* Ambient background glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full whitespace-nowrap">
            <Sparkles className="w-2.5 h-2.5 shrink-0" />
            <span className="whitespace-nowrap">Automated Analysis</span>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-2 py-0.5 rounded-full whitespace-nowrap">
            <Lock className="w-2.5 h-2.5 shrink-0" />
            <span className="whitespace-nowrap">Non-Editable</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-zinc-800/80 border border-zinc-700/80 rounded-lg px-2 py-0.5 shrink-0">
          <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="text-[11px] font-semibold text-white whitespace-nowrap">
            {yearsToRetirement} Yrs Compounding ({targetYear})
          </span>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 my-2">
        {/* Metric 1: Future Value of Expense */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-2.5 sm:p-3 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
              <TrendingUp className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">Future Living Cost</span>
            </span>
            <span className="text-[10px] bg-amber-400/10 text-amber-300 font-mono px-1.5 py-0.2 rounded border border-amber-400/20 whitespace-nowrap">
              {inflationMultiplier}× today
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight whitespace-nowrap">
            {formatCurrency(futureAnnualExpense)}
            <span className="text-[11px] font-normal text-zinc-400 ml-1 whitespace-nowrap">/ yr</span>
          </div>

          <div className="mt-1 text-[11px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800/60">
            <span className="whitespace-nowrap">Monthly equivalent:</span>
            <span className="text-zinc-200 font-semibold font-mono whitespace-nowrap">{formatCurrency(futureMonthlyExpense)}/mo</span>
          </div>
        </div>

        {/* Metric 2: Total Required Corpus */}
        <div className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-zinc-950/80 to-teal-950/30 p-2.5 sm:p-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 text-emerald-400 whitespace-nowrap">
              <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="whitespace-nowrap">Total Required Corpus</span>
            </span>
            <span className="text-[10px] bg-emerald-400/10 text-emerald-300 font-mono px-1.5 py-0.2 rounded border border-emerald-400/20 whitespace-nowrap">
              {retirementDuration} Yrs Funded
            </span>
          </div>

          <div className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 tracking-tight whitespace-nowrap">
            {formatCurrency(requiredCorpus)}
          </div>

          <div className="mt-1 text-[11px] text-zinc-400 flex items-center justify-between pt-1 border-t border-emerald-900/40">
            <span className="whitespace-nowrap">Retirement duration</span>
            <span className="text-emerald-300 font-semibold text-[11px] whitespace-nowrap">Age {retirementAge} to {lifeExpectancy}</span>
          </div>
        </div>
      </div>

      {/* Assumptions Bar */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-2 sm:p-2.5">
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-zinc-950/60 rounded-md p-1.5 border border-zinc-800/60">
            <div className="text-zinc-400 text-[9px] uppercase font-bold tracking-wider whitespace-nowrap">Inflation Standard</div>
            <div className="text-xs font-bold text-white whitespace-nowrap">{(inflationRate * 100).toFixed(1)}% / yr</div>
          </div>

          <div className="bg-zinc-950/60 rounded-md p-1.5 border border-zinc-800/60">
            <div className="text-zinc-400 text-[9px] uppercase font-bold tracking-wider whitespace-nowrap flex items-center justify-center gap-1">
              <HeartPulse className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span className="whitespace-nowrap">Life Expectancy</span>
            </div>
            <div className="text-xs font-bold text-white whitespace-nowrap">{lifeExpectancy} Yrs ({retirementDuration}y duration)</div>
          </div>

          <div className="bg-zinc-950/60 rounded-md p-1.5 border border-zinc-800/60">
            <div className="text-zinc-400 text-[9px] uppercase font-bold tracking-wider whitespace-nowrap">Compounding</div>
            <div className="text-xs font-bold text-white whitespace-nowrap">{yearsToRetirement} Years</div>
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-zinc-400">
          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="truncate">
            <strong className="text-zinc-300 whitespace-nowrap">Duration-Driven Corpus:</strong> Sized to fully fund living costs from retirement at age {retirementAge} through life expectancy of {lifeExpectancy}.
          </span>
        </div>
      </div>
    </div>
  );
}
