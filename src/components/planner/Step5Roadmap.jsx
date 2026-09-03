'use client';

import React from 'react';
import {
  Target,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/calculations/retirement';
import AdvancedMonitoringCTA from './AdvancedMonitoringCTA';

export default function Step5Roadmap({
  monthlyContribution,
  setMonthlyContribution,
  retirementAge,
  requiredCorpus,
  projectedWealth,
  requiredMonthlySavings,
  shortfallOrSurplus,
  isTargetAchieved,
  progressPercent,
  onBack,
  onRestart,
}) {
  return (
    <div className="space-y-3.5 sm:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5 whitespace-nowrap">
          <Target className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Question 5 of 5</span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          How much can you save each month?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Enter your planned monthly investment to generate your complete roadmap.
        </p>
      </div>

      {/* Input Row & Presets */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <label htmlFor="contributionInput" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 whitespace-nowrap">
            Monthly Savings Contribution
          </label>
          <div className="relative flex items-center max-w-xs">
            <span className="absolute left-3 text-lg font-bold text-zinc-400">$</span>
            <input
              id="contributionInput"
              type="number"
              min="0"
              step="100"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="0"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 sm:py-2 text-xl sm:text-2xl font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60 font-mono transition-all"
            />
            <span className="text-xs text-zinc-400 ml-2 whitespace-nowrap">/ month</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-500 mr-1 whitespace-nowrap">Quick:</span>
          {[250, 500, 1000, 1500, 2500].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setMonthlyContribution(amt.toString())}
              className={`text-xs px-2.5 py-1 rounded-md border whitespace-nowrap transition-colors ${
                parseFloat(monthlyContribution) === amt
                  ? 'bg-emerald-500 text-black font-semibold border-emerald-400'
                  : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              ${formatNumber(amt)}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap & Verdict Card */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 sm:p-5">
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-white whitespace-nowrap">
              Retirement Readiness Roadmap
            </h3>
          </div>
          <span
            className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
              isTargetAchieved
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {isTargetAchieved ? '✓ On Track' : '! Gap Identified'}
          </span>
        </div>

        {/* Verdict Banner */}
        {isTargetAchieved ? (
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-300 leading-tight">
              <strong>On Track!</strong> Projected nest egg of <strong className="text-white whitespace-nowrap">{formatCurrency(projectedWealth)}</strong> meets target corpus of <strong className="text-white whitespace-nowrap">{formatCurrency(requiredCorpus)}</strong> (+{formatCurrency(shortfallOrSurplus)}).
            </p>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-start gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-tight">
              <strong className="text-amber-300">Gap: {formatCurrency(Math.abs(shortfallOrSurplus))}.</strong> Save <strong className="text-emerald-400 font-mono font-bold whitespace-nowrap">{formatCurrency(requiredMonthlySavings)}/mo</strong> to hit 100% of your target corpus by age {retirementAge}.
            </p>
          </div>
        )}

        {/* Coverage Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[11px] text-zinc-400 mb-1 whitespace-nowrap">
            <span className="whitespace-nowrap">Target Corpus Coverage</span>
            <span className="font-bold text-white whitespace-nowrap">{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isTargetAchieved
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-amber-500 to-emerald-400'
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Summary 3-Col Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <span className="text-zinc-400 text-[10px] block uppercase font-bold tracking-wider whitespace-nowrap">Target Corpus</span>
            <span className="text-xs sm:text-base font-bold text-white font-mono whitespace-nowrap block mt-0.5">{formatCurrency(requiredCorpus)}</span>
          </div>

          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <span className="text-zinc-400 text-[10px] block uppercase font-bold tracking-wider whitespace-nowrap">Projected Wealth</span>
            <span className="text-xs sm:text-base font-bold text-emerald-400 font-mono whitespace-nowrap block mt-0.5">{formatCurrency(projectedWealth)}</span>
          </div>

          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <span className="text-zinc-400 text-[10px] block uppercase font-bold tracking-wider whitespace-nowrap">Required Monthly</span>
            <span className="text-xs sm:text-base font-bold text-cyan-400 font-mono whitespace-nowrap block mt-0.5">{formatCurrency(requiredMonthlySavings)}</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Back</span>
        </button>
        <button
          type="button"
          id="restartPlanBtn"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm border border-zinc-700 bg-zinc-900 hover:border-emerald-500/50 text-zinc-200 hover:text-white transition-all cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Restart / Recalculate</span>
        </button>
      </div>

      {/* Advanced Monitoring Promotion */}
      <AdvancedMonitoringCTA />
    </div>
  );
}
