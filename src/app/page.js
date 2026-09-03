'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Stepper from '@/components/planner/Stepper';
import Step1Timeline from '@/components/planner/Step1Timeline';
import Step2Expenses from '@/components/planner/Step2Expenses';
import Step3Corpus from '@/components/planner/Step3Corpus';
import Step4Savings from '@/components/planner/Step4Savings';
import Step5Roadmap from '@/components/planner/Step5Roadmap';
import { useRetirementPlanner } from '@/hooks/useRetirementPlanner';
import { PLANNER_STEPS } from '@/lib/constants/benchmarks';

export default function Home() {
  const planner = useRetirementPlanner();

  return (
    <div className="min-h-screen bg-radial from-zinc-900 via-zinc-950 to-black text-zinc-100 flex flex-col justify-between relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[280px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-2.5 sm:px-6 py-2 sm:py-3 w-full max-w-3xl mx-auto">
        {/* Compact Hero Header */}
        <header className="w-full text-center pb-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-semibold mb-1 tracking-wide shadow-[0_0_10px_rgba(16,185,129,0.15)] whitespace-nowrap">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="whitespace-nowrap">Intelligent Retirement Architecture</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white mb-0.5 whitespace-nowrap">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 whitespace-nowrap">Financial Freedom</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-zinc-400 max-w-xl mx-auto hidden sm:block">
            Professional 3.0% inflation and life expectancy duration modeling to calculate your exact corpus.
          </p>
        </header>

        {/* Modular Step Flow Frame */}
        <div className="w-full">
          {/* Progress Stepper */}
          <Stepper
            steps={PLANNER_STEPS}
            currentStep={planner.currentStep}
            onStepClick={planner.goToStep}
          />

          {/* Card Container */}
          <div className="relative rounded-2xl border border-zinc-800/90 bg-zinc-900/85 p-3 sm:p-4 md:p-5 backdrop-blur-2xl shadow-2xl transition-all duration-300 w-full">
            {planner.currentStep === 1 && (
              <Step1Timeline
                birthDate={planner.birthDate}
                setBirthDate={planner.setBirthDate}
                currentAge={planner.currentAge}
                retirementAge={planner.retirementAge}
                setRetirementAge={planner.setRetirementAge}
                lifeExpectancy={planner.lifeExpectancy}
                setLifeExpectancy={planner.setLifeExpectancy}
                yearsToRetirement={planner.yearsToRetirement}
                retirementDuration={planner.retirementDuration}
                canProceed={planner.canProceedStep1}
                onNext={planner.handleNext}
              />
            )}

            {planner.currentStep === 2 && (
              <Step2Expenses
                expenseAmount={planner.expenseAmount}
                setExpenseAmount={planner.setExpenseAmount}
                expenseFrequency={planner.expenseFrequency}
                setExpenseFrequency={planner.setExpenseFrequency}
                currentAnnualExpense={planner.currentAnnualExpense}
                canProceed={planner.canProceedStep2}
                onBack={planner.handleBack}
                onNext={planner.handleNext}
              />
            )}

            {planner.currentStep === 3 && (
              <Step3Corpus
                currentAge={planner.currentAge}
                retirementAge={planner.retirementAge}
                lifeExpectancy={planner.lifeExpectancy}
                yearsToRetirement={planner.yearsToRetirement}
                retirementDuration={planner.retirementDuration}
                currentAnnualExpense={planner.currentAnnualExpense}
                futureAnnualExpense={planner.futureAnnualExpense}
                requiredCorpus={planner.requiredCorpus}
                onBack={planner.handleBack}
                onNext={planner.handleNext}
              />
            )}

            {planner.currentStep === 4 && (
              <Step4Savings
                currentSavings={planner.currentSavings}
                setCurrentSavings={planner.setCurrentSavings}
                requiredCorpus={planner.requiredCorpus}
                canProceed={planner.canProceedStep4}
                onBack={planner.handleBack}
                onNext={planner.handleNext}
              />
            )}

            {planner.currentStep === 5 && (
              <Step5Roadmap
                monthlyContribution={planner.monthlyContribution}
                setMonthlyContribution={planner.setMonthlyContribution}
                retirementAge={planner.retirementAge}
                requiredCorpus={planner.requiredCorpus}
                projectedWealth={planner.projectedWealth}
                requiredMonthlySavings={planner.requiredMonthlySavings}
                shortfallOrSurplus={planner.shortfallOrSurplus}
                isTargetAchieved={planner.isTargetAchieved}
                progressPercent={planner.progressPercent}
                onBack={planner.handleBack}
                onRestart={planner.handleRestart}
              />
            )}
          </div>
        </div>
      </main>

      {/* Global Compact Footer */}
      <Footer />
    </div>
  );
}
