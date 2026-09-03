'use client';

import { useState, useMemo } from 'react';
import {
  calculateAge,
  calculateFutureExpense,
  calculateRequiredCorpus,
  calculateProjectedWealth,
  calculateRequiredMonthlySavings,
} from '@/lib/calculations/retirement';
import {
  DEFAULT_INFLATION_RATE,
  DEFAULT_LIFE_EXPECTANCY,
  DEFAULT_RETIREMENT_REAL_RETURN,
  DEFAULT_INVESTMENT_RETURN,
} from '@/lib/constants/benchmarks';

export function useRetirementPlanner() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form inputs
  const [birthDate, setBirthDate] = useState('1994-05-15');
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(DEFAULT_LIFE_EXPECTANCY);
  const [expenseAmount, setExpenseAmount] = useState('4500');
  const [expenseFrequency, setExpenseFrequency] = useState('monthly'); // 'monthly' | 'yearly'
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('1200');

  // Computed properties
  const currentAge = useMemo(() => calculateAge(birthDate) ?? 30, [birthDate]);

  const yearsToRetirement = useMemo(() => {
    const years = retirementAge - currentAge;
    return years > 0 ? years : 1;
  }, [retirementAge, currentAge]);

  const retirementDuration = useMemo(() => {
    const duration = lifeExpectancy - retirementAge;
    return duration > 0 ? duration : 1;
  }, [lifeExpectancy, retirementAge]);

  const currentAnnualExpense = useMemo(() => {
    const amt = parseFloat(expenseAmount) || 0;
    return expenseFrequency === 'monthly' ? amt * 12 : amt;
  }, [expenseAmount, expenseFrequency]);

  const futureAnnualExpense = useMemo(() => {
    return calculateFutureExpense(currentAnnualExpense, yearsToRetirement, DEFAULT_INFLATION_RATE);
  }, [currentAnnualExpense, yearsToRetirement]);

  const requiredCorpus = useMemo(() => {
    return calculateRequiredCorpus(futureAnnualExpense, retirementDuration, DEFAULT_RETIREMENT_REAL_RETURN);
  }, [futureAnnualExpense, retirementDuration]);

  const projectedWealth = useMemo(() => {
    const savings = parseFloat(currentSavings) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    return calculateProjectedWealth(savings, monthly, yearsToRetirement, DEFAULT_INVESTMENT_RETURN);
  }, [currentSavings, monthlyContribution, yearsToRetirement]);

  const requiredMonthlySavings = useMemo(() => {
    const savings = parseFloat(currentSavings) || 0;
    return calculateRequiredMonthlySavings(requiredCorpus, savings, yearsToRetirement, DEFAULT_INVESTMENT_RETURN);
  }, [requiredCorpus, currentSavings, yearsToRetirement]);

  const shortfallOrSurplus = projectedWealth - requiredCorpus;
  const isTargetAchieved = shortfallOrSurplus >= 0;
  const progressPercent = requiredCorpus > 0 ? Math.min(150, Math.round((projectedWealth / requiredCorpus) * 100)) : 0;

  // Validation
  const canProceedStep1 = Boolean(birthDate && retirementAge > currentAge && lifeExpectancy > retirementAge);
  const canProceedStep2 = (parseFloat(expenseAmount) || 0) > 0;
  const canProceedStep4 = currentSavings !== '' && !isNaN(parseFloat(currentSavings));
  const canProceedStep5 = monthlyContribution !== '' && !isNaN(parseFloat(monthlyContribution));

  // Navigation
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    // State
    currentStep,
    birthDate,
    retirementAge,
    lifeExpectancy,
    expenseAmount,
    expenseFrequency,
    currentSavings,
    monthlyContribution,

    // Setters
    setBirthDate,
    setRetirementAge,
    setLifeExpectancy,
    setExpenseAmount,
    setExpenseFrequency,
    setCurrentSavings,
    setMonthlyContribution,

    // Computed
    currentAge,
    yearsToRetirement,
    retirementDuration,
    currentAnnualExpense,
    futureAnnualExpense,
    requiredCorpus,
    projectedWealth,
    requiredMonthlySavings,
    shortfallOrSurplus,
    isTargetAchieved,
    progressPercent,

    // Validation
    canProceedStep1,
    canProceedStep2,
    canProceedStep4,
    canProceedStep5,

    // Actions
    handleNext,
    handleBack,
    handleRestart,
    goToStep,
  };
}
