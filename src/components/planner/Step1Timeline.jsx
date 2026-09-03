'use client';

import React from 'react';
import { Calendar, ArrowRight, HeartPulse } from 'lucide-react';

export default function Step1Timeline({
  birthDate,
  setBirthDate,
  currentAge,
  retirementAge,
  setRetirementAge,
  lifeExpectancy,
  setLifeExpectancy,
  yearsToRetirement,
  retirementDuration,
  canProceed,
  onNext,
}) {
  const currentYear = new Date().getFullYear();
  const targetYear = currentYear + yearsToRetirement;

  return (
    <div className="space-y-3 sm:space-y-3.5 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5 whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">Question 1 of 5</span>
        </div>
        <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
          Your Life & Retirement Timeline
        </h2>
        <p className="text-[11px] sm:text-xs text-zinc-400">
          We use your birth date, target retirement age, and life expectancy to calculate your exact retirement duration.
        </p>
      </div>

      {/* 3 Input Cards: Birth Date, Retirement Age, Life Expectancy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
        {/* 1. Birth Date */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-2.5 sm:p-3 flex flex-col justify-between">
          <div>
            <label htmlFor="birthDateInput" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 whitespace-nowrap">
              1. Birth Date
            </label>
            <input
              id="birthDateInput"
              type="date"
              value={birthDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-white font-medium text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 whitespace-nowrap">Current Age:</span>
            <span className="font-bold text-emerald-400 font-mono whitespace-nowrap bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
              {currentAge} yrs
            </span>
          </div>
        </div>

        {/* 2. Target Retirement Age */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-2.5 sm:p-3 flex flex-col justify-between">
          <div>
            <label htmlFor="retireAgeInput" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 whitespace-nowrap">
              2. Retirement Age
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="retireAgeInput"
                type="number"
                min={currentAge + 1}
                max={lifeExpectancy - 1}
                value={retirementAge}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || currentAge + 1;
                  setRetirementAge(Math.min(lifeExpectancy - 1, Math.max(currentAge + 1, val)));
                }}
                className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-center text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <div className="flex gap-1 overflow-x-auto">
                {[55, 60, 65].map((age) => (
                  <button
                    key={age}
                    type="button"
                    disabled={age <= currentAge || age >= lifeExpectancy}
                    onClick={() => setRetirementAge(age)}
                    className={`text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap transition-colors ${
                      retirementAge === age
                        ? 'bg-emerald-500 text-black font-bold border-emerald-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 whitespace-nowrap">Compounding:</span>
            <span className="font-bold text-cyan-400 font-mono whitespace-nowrap bg-cyan-950/40 px-1.5 py-0.2 rounded border border-cyan-500/30">
              {yearsToRetirement} yrs ({targetYear})
            </span>
          </div>
        </div>

        {/* 3. Life Expectancy */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-2.5 sm:p-3 flex flex-col justify-between">
          <div>
            <label htmlFor="lifeExpectancyInput" className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 whitespace-nowrap flex items-center gap-1">
              <HeartPulse className="w-3 h-3 text-rose-400 shrink-0" />
              <span>3. Life Expectancy</span>
            </label>
            <div className="flex items-center gap-1.5">
              <input
                id="lifeExpectancyInput"
                type="number"
                min={retirementAge + 1}
                max={110}
                value={lifeExpectancy}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || retirementAge + 1;
                  setLifeExpectancy(Math.max(retirementAge + 1, val));
                }}
                className="w-16 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-center text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <div className="flex gap-1 overflow-x-auto">
                {[80, 85, 90, 95].map((age) => (
                  <button
                    key={age}
                    type="button"
                    disabled={age <= retirementAge}
                    onClick={() => setLifeExpectancy(age)}
                    className={`text-[10px] px-1.5 py-0.5 rounded border whitespace-nowrap transition-colors ${
                      lifeExpectancy === age
                        ? 'bg-rose-500 text-white font-bold border-rose-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 whitespace-nowrap">Retirement Duration:</span>
            <span className="font-bold text-rose-400 font-mono whitespace-nowrap bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-500/30">
              {retirementDuration} yrs in retirement
            </span>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-[11px] text-zinc-300">
        <span className="text-zinc-400 whitespace-nowrap">Calculated Duration:</span>
        <span className="font-semibold whitespace-nowrap">
          Age <strong className="text-white">{currentAge}</strong> → Retire at <strong className="text-emerald-400">{retirementAge}</strong> → Plan to age <strong className="text-rose-400">{lifeExpectancy}</strong> ({retirementDuration} years of living)
        </span>
      </div>

      {/* Navigation Button */}
      <div className="pt-1 flex justify-end">
        <button
          type="button"
          id="nextStep1Btn"
          onClick={onNext}
          disabled={!canProceed}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${
            canProceed
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          <span className="whitespace-nowrap">Continue to Expenses</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
}
