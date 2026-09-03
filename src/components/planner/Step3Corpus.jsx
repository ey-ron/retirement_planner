'use client';

import React from 'react';
import { TrendingUp, ChevronLeft, ArrowRight } from 'lucide-react';
import CorpusCard from './CorpusCard';

export default function Step3Corpus({
  currentAge,
  retirementAge,
  lifeExpectancy,
  yearsToRetirement,
  retirementDuration,
  currentAnnualExpense,
  futureAnnualExpense,
  requiredCorpus,
  onBack,
  onNext,
}) {
  return (
    <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5 whitespace-nowrap">
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Question 3 of 5</span>
        </div>
        <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
          Your Duration-Driven Retirement Corpus
        </h2>
        <p className="text-[11px] sm:text-xs text-zinc-400">
          Calculated using 3.0% standard inflation and sized to sustain {retirementDuration} years of retirement (age {retirementAge} to {lifeExpectancy}).
        </p>
      </div>

      {/* Non-editable Analysis Card */}
      <CorpusCard
        currentAge={currentAge}
        retirementAge={retirementAge}
        lifeExpectancy={lifeExpectancy}
        yearsToRetirement={yearsToRetirement}
        retirementDuration={retirementDuration}
        currentAnnualExpense={currentAnnualExpense}
        futureAnnualExpense={futureAnnualExpense}
        requiredCorpus={requiredCorpus}
      />

      {/* Navigation Buttons */}
      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Back</span>
        </button>
        <button
          type="button"
          id="nextStep3Btn"
          onClick={onNext}
          className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all cursor-pointer whitespace-nowrap"
        >
          <span className="whitespace-nowrap">Assess Current Savings</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
