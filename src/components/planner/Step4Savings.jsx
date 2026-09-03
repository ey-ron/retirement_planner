'use client';

import React from 'react';
import { PiggyBank, ChevronLeft, ArrowRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/calculations/retirement';

export default function Step4Savings({
  currentSavings,
  setCurrentSavings,
  requiredCorpus,
  canProceed,
  onBack,
  onNext,
}) {
  return (
    <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5 whitespace-nowrap">
          <PiggyBank className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Question 4 of 5</span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          How much have you already saved or invested?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Include 401(k), IRAs, brokerage accounts, and other liquid investments designated for retirement.
        </p>
      </div>

      <div className="p-4 sm:p-5 rounded-xl border border-zinc-800 bg-zinc-950/60">
        <label htmlFor="savingsInput" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 whitespace-nowrap">
          Current Retirement Portfolio Balance
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-xl sm:text-2xl font-bold text-zinc-400">$</span>
          <input
            id="savingsInput"
            type="number"
            min="0"
            step="1000"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(e.target.value)}
            placeholder="0"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 sm:py-3 text-2xl sm:text-3xl font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60 font-mono transition-all"
          />
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-xs text-zinc-500 mr-1 whitespace-nowrap">Quick Select:</span>
          {[0, 25000, 50000, 100000, 250000, 500000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setCurrentSavings(preset.toString())}
              className={`text-xs px-2.5 py-1 rounded-md border whitespace-nowrap transition-colors ${
                parseFloat(currentSavings) === preset
                  ? 'bg-emerald-500 text-black font-semibold border-emerald-400'
                  : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {preset === 0 ? '$0 (Starting Fresh)' : `$${formatNumber(preset)}`}
            </button>
          ))}
        </div>

        {/* Target Corpus comparison */}
        <div className="mt-3.5 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-zinc-400 whitespace-nowrap">Your Target Corpus:</span>
          <span className="font-bold text-emerald-400 font-mono whitespace-nowrap">
            {formatCurrency(requiredCorpus)}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Back</span>
        </button>
        <button
          type="button"
          id="nextStep4Btn"
          onClick={onNext}
          disabled={!canProceed}
          className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
            canProceed
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span className="whitespace-nowrap">Continue to Monthly Savings</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
