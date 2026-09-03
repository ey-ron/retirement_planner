/**
 * Pure mathematical functions for retirement planning calculations
 */

import {
  DEFAULT_INFLATION_RATE,
  DEFAULT_LIFE_EXPECTANCY,
  DEFAULT_RETIREMENT_REAL_RETURN,
  DEFAULT_INVESTMENT_RETURN,
} from '../constants/benchmarks';

/**
 * Calculates current age from birth date string (YYYY-MM-DD)
 */
export function calculateAge(birthDateStr) {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

/**
 * Calculates Future Value of annual expense adjusted for inflation
 * FV = PV * (1 + r)^n
 */
export function calculateFutureExpense(annualExpense, yearsToRetirement, inflationRate = DEFAULT_INFLATION_RATE) {
  if (yearsToRetirement <= 0) return annualExpense;
  return annualExpense * Math.pow(1 + inflationRate, yearsToRetirement);
}

/**
 * Calculates Total Corpus Required based on Life Expectancy & Retirement Duration
 * Uses the Present Value of an inflation-adjusted annuity:
 * If real return = 0: Corpus = FV * N
 * If real return > 0: Corpus = FV * [ (1 - (1 + r_real)^(-N)) / r_real ]
 */
export function calculateRequiredCorpus(
  futureAnnualExpense,
  retirementDurationYears = 25,
  realReturn = DEFAULT_RETIREMENT_REAL_RETURN
) {
  const duration = Math.max(1, retirementDurationYears);
  if (realReturn <= 0) {
    return Math.round(futureAnnualExpense * duration);
  }
  const annuityFactor = (1 - Math.pow(1 + realReturn, -duration)) / realReturn;
  return Math.round(futureAnnualExpense * annuityFactor);
}

/**
 * Calculates projected wealth at retirement from current lump sum and monthly investments
 */
export function calculateProjectedWealth(
  currentSavings = 0,
  monthlySavings = 0,
  yearsToRetirement = 0,
  annualReturn = DEFAULT_INVESTMENT_RETURN
) {
  if (yearsToRetirement <= 0) return currentSavings;

  const rMonthly = annualReturn / 12;
  const totalMonths = yearsToRetirement * 12;

  // FV of initial savings
  const fvLumpSum = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);

  // FV of monthly annuity
  const fvAnnuity =
    rMonthly > 0
      ? monthlySavings * ((Math.pow(1 + rMonthly, totalMonths) - 1) / rMonthly)
      : monthlySavings * totalMonths;

  return Math.round(fvLumpSum + fvAnnuity);
}

/**
 * Calculates required monthly contribution to reach target corpus
 */
export function calculateRequiredMonthlySavings(
  targetCorpus,
  currentSavings = 0,
  yearsToRetirement = 0,
  annualReturn = DEFAULT_INVESTMENT_RETURN
) {
  if (yearsToRetirement <= 0) return 0;

  const fvLumpSum = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
  const remainingGap = Math.max(0, targetCorpus - fvLumpSum);
  if (remainingGap === 0) return 0;

  const rMonthly = annualReturn / 12;
  const totalMonths = yearsToRetirement * 12;

  if (rMonthly === 0) {
    return Math.round(remainingGap / totalMonths);
  }

  const pmt = (remainingGap * rMonthly) / (Math.pow(1 + rMonthly, totalMonths) - 1);
  return Math.round(pmt);
}

/**
 * Currency formatter with zero decimals
 */
export function formatCurrency(amount, currency = 'USD') {
  if (isNaN(amount) || amount === null || amount === undefined) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Number formatter with commas
 */
export function formatNumber(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
}
