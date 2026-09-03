'use client';

import React from 'react';
import { Check } from 'lucide-react';

export default function Stepper({ steps, currentStep, onStepClick }) {
  const progressPercent = Math.round(((currentStep - 1) / (steps.length - 1)) * 100);

  return (
    <div className="w-full mb-3 sm:mb-4 shrink-0">
      {/* Top progress bar header */}
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 whitespace-nowrap">
        <span className="whitespace-nowrap">Question {currentStep} of {steps.length}</span>
        <span className="text-emerald-400 font-mono whitespace-nowrap">{progressPercent}% Completed</span>
      </div>

      <div className="w-full bg-zinc-800/80 h-1 rounded-full overflow-hidden mb-2.5 sm:mb-3">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Pills */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick && isCompleted && onStepClick(stepNum)}
              disabled={!isCompleted && !isCurrent}
              type="button"
              className={`group relative flex items-center gap-1.5 p-1.5 sm:p-2 rounded-lg border text-left transition-all duration-200 overflow-hidden ${
                isCurrent
                  ? 'bg-emerald-950/50 border-emerald-500/70 shadow-[0_0_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                  : isCompleted
                  ? 'bg-zinc-900/70 border-zinc-700/60 hover:border-emerald-500/50 cursor-pointer'
                  : 'bg-zinc-900/30 border-zinc-800/40 opacity-50 cursor-not-allowed'
              }`}
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500 text-black'
                    : isCurrent
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : stepNum}
              </span>

              <span
                className={`text-[11px] font-medium whitespace-nowrap truncate hidden sm:inline ${
                  isCurrent ? 'text-white font-semibold' : isCompleted ? 'text-zinc-300' : 'text-zinc-500'
                }`}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
