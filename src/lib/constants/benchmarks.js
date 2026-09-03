/**
 * Professional Financial Planning Benchmarks & Constants
 */

// 3.0% annual inflation benchmark (CFP standard)
export const DEFAULT_INFLATION_RATE = 0.03;

// Default life expectancy benchmark (85 years)
export const DEFAULT_LIFE_EXPECTANCY = 85;

// Conservative real rate of return during retirement (after inflation)
// 1.5% real return (e.g., 4.5% nominal return - 3% inflation in conservative retirement portfolio)
export const DEFAULT_RETIREMENT_REAL_RETURN = 0.015;

// 4.0% Safe Withdrawal Rate benchmark
export const DEFAULT_SWR = 0.04;

// 7.0% annual pre-retirement balanced growth rate
export const DEFAULT_INVESTMENT_RETURN = 0.07;

// Default trial wizard questions metadata
export const PLANNER_STEPS = [
  { id: 1, title: 'Timeline', description: 'Age, retirement & life expectancy' },
  { id: 2, title: 'Expenses', description: 'Monthly or yearly budget' },
  { id: 3, title: 'Corpus', description: 'Inflation & duration-based nest egg' },
  { id: 4, title: 'Savings', description: 'Existing portfolio' },
  { id: 5, title: 'Roadmap', description: 'Readiness verdict & targets' },
];
