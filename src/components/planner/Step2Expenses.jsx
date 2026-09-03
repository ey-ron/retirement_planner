'use client';

import React from 'react';
import { DollarSign, ChevronLeft, ArrowRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/calculations/retirement';

export default function Step2Expenses({
  expenseAmount,
  setExpenseAmount,
  expenseFrequency,
  setExpenseFrequency,
  currentAnnualExpense,
  canProceed,
  onBack,
  onNext,
}) {
  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5 whitespace-nowrap">
          <DollarSign className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Question 2 of 5</span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          How much is your present expense?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Enter your current living expenses. Toggle between monthly or yearly depending on your budgeting preference.
        </p>
      </div>

      {/* Main Expense Container */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-800 bg-zinc-950/60 space-y-3">
        {/* Toggle Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 whitespace-nowrap">
            Frequency:
          </span>
          <div className="inline-flex p-0.5 bg-zinc-900 border border-zinc-700/80 rounded-lg shrink-0">
            <button
              type="button"
              id="toggleMonthlyBtn"
              onClick={() => {
                if (expenseFrequency !== 'monthly') {
                  const current = parseFloat(expenseAmount) || 0;
                  setExpenseAmount(Math.round(current / 12).toString());
                  setExpenseFrequency('monthly');
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                expenseFrequency === 'monthly'
                  ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              id="toggleYearlyBtn"
              onClick={() => {
                if (expenseFrequency !== 'yearly') {
                  const current = parseFloat(expenseAmount) || 0;
                  setExpenseAmount(Math.round(current * 12).toString());
                  setExpenseFrequency('yearly');
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                expenseFrequency === 'yearly'
                  ? 'bg-emerald-500 text-black shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Currency Input */}
        <div className="relative flex items-center">
          <span className="absolute left-3 text-xl font-bold text-zinc-400">$</span>
          <input
            id="expenseInput"
            type="number"
            min="0"
            step="100"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-8 pr-3 py-2 text-xl sm:text-2xl font-extrabold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 font-mono transition-all"
          />
        </div>

        {/* Quick Add Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-500 mr-1 whitespace-nowrap">Quick Add:</span>
          {(expenseFrequency === 'monthly' ? [500, 1000, 2500, 5000] : [6000, 12000, 30000, 60000]).map((addAmt) => (
            <button
              key={addAmt}
              type="button"
              onClick={() => {
                const cur = parseFloat(expenseAmount) || 0;
                setExpenseAmount((cur + addAmt).toString());
              }}
              className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 bg-zinc-900/70 hover:border-emerald-500/40 text-zinc-300 whitespace-nowrap transition-colors"
            >
              +${formatNumber(addAmt)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setExpenseAmount('0')}
            className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-500 hover:text-zinc-400 whitespace-nowrap"
          >
            Reset
          </button>
        </div>

        {/* Live Conversion Summary */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-zinc-400 whitespace-nowrap">Annual Living Cost:</span>
          <span className="font-bold text-white font-mono whitespace-nowrap">
            {formatCurrency(currentAnnualExpense)} / yr
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl font-medium text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Back</span>
        </button>
        <button
          type="button"
          id="nextStep2Btn"
          onClick={onNext}
          disabled={!canProceed}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
            canProceed
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span className="whitespace-nowrap">Calculate Future Cost & Corpus</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
