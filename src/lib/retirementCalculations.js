/**
 * Reusable retirement mathematical modeling and formatting helpers
 */

export const COUNTRIES = [
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "$" },
  { code: "US", name: "United States", currency: "USD", symbol: "$" },
  { code: "PH", name: "Philippines", currency: "PHP", symbol: "₱" },
  { code: "MY", name: "Malaysia", currency: "MYR", symbol: "RM" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£" },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "$" },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "$" },
  { code: "EU", name: "European Union", currency: "EUR", symbol: "€" },
  { code: "JP", name: "Japan", currency: "JPY", symbol: "¥" },
  { code: "HK", name: "Hong Kong", currency: "HKD", symbol: "$" },
  { code: "IN", name: "India", currency: "INR", symbol: "₹" },
  { code: "ID", name: "Indonesia", currency: "IDR", symbol: "Rp" },
  { code: "TH", name: "Thailand", currency: "THB", symbol: "฿" },
  { code: "VN", name: "Vietnam", currency: "VND", symbol: "₫" },
  { code: "NZ", name: "New Zealand", currency: "NZD", symbol: "$" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "د.إ" },
  { code: "CH", name: "Switzerland", currency: "CHF", symbol: "Fr." },
  { code: "GLOBAL", name: "Other / Global", currency: "USD", symbol: "$" }
];

export function getCurrencySymbol(countryNameOrCode) {
  if (!countryNameOrCode) return "$";
  const found = COUNTRIES.find(
    c => c.code.toLowerCase() === countryNameOrCode.toLowerCase() ||
         c.name.toLowerCase() === countryNameOrCode.toLowerCase()
  );
  return found ? found.symbol : "$";
}

export function calculateAge(birthDateStr) {
  if (!birthDateStr) return 30;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return 30;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(1, Math.min(100, age));
}

/**
 * Abbreviate numbers if reaching hundred thousands (>= 100,000):
 * - >= 100,000 and < 1,000,000 => K
 * - >= 1,000,000 and < 1,000,000,000 => M
 * - >= 1,000,000,000 => B
 * - < 100,000 => standard thousands comma formatting
 */
export function formatAbbreviatedParts(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return { value: "0", suffix: "" };
  const num = Math.abs(Number(val));
  const sign = Number(val) < 0 ? "-" : "";

  if (num >= 1_000_000_000) {
    const raw = num / 1_000_000_000;
    const formatted = Math.floor(raw) >= 100 ? Math.round(raw).toString() : raw.toFixed(decimals);
    return { value: `${sign}${formatted}`, suffix: "B" };
  }
  if (num >= 1_000_000) {
    const raw = num / 1_000_000;
    const formatted = Math.floor(raw) >= 100 ? Math.round(raw).toString() : raw.toFixed(decimals);
    return { value: `${sign}${formatted}`, suffix: "M" };
  }
  if (num >= 100_000) {
    const raw = num / 1_000;
    const formatted = Math.floor(raw) >= 100 ? Math.round(raw).toString() : raw.toFixed(decimals);
    return { value: `${sign}${formatted}`, suffix: "K" };
  }
  return { value: `${sign}${Math.round(num).toLocaleString("en-US")}`, suffix: "" };
}

export function formatAbbreviatedNumber(val) {
  const parts = formatAbbreviatedParts(val);
  return `${parts.value}${parts.suffix}`;
}

export function computeSimulationMetrics(data = {}) {
  const birthDate = data.birthDate || "1995-01-01";
  const monthlyExpense = parseFloat(data.monthlyExpense) || 3000;
  const retireAge = parseInt(data.retireAge, 10) || 50;
  const lifeExpectancy = parseInt(data.lifeExpectancy, 10) || 85;
  const currentNestEgg = parseFloat(data.currentNestEgg) || 0;
  const monthlyInvestment = parseFloat(data.monthlyInvestment) || 0;
  const cagr = parseFloat(data.cagr) || 8.0;
  const inflation = parseFloat(data.inflation) || 3.5;

  const currentAge = calculateAge(birthDate);
  const currentYear = new Date().getFullYear();
  const retireYear = currentYear + Math.max(0, retireAge - currentAge);

  const yearsToRetire = Math.max(1, retireAge - currentAge);
  const monthsToRetire = yearsToRetire * 12;
  const retirementYears = Math.max(1, lifeExpectancy - retireAge);
  const retirementMonths = retirementYears * 12;

  const monthlyInflationRate = inflation / 100 / 12;
  const monthlyNominalReturn = cagr / 100 / 12;

  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + monthlyInflationRate, monthsToRetire);

  let requiredCorpus = 0;
  for (let m = retirementMonths - 1; m >= 0; m--) {
    const monthCost = futureMonthlyExpense * Math.pow(1 + monthlyInflationRate, m);
    requiredCorpus = (requiredCorpus + monthCost) / (1 + monthlyNominalReturn);
  }

  let projectedNestEgg = currentNestEgg * Math.pow(1 + monthlyNominalReturn, monthsToRetire);
  for (let i = 0; i < monthsToRetire; i++) {
    projectedNestEgg += monthlyInvestment * Math.pow(1 + monthlyNominalReturn, monthsToRetire - 1 - i);
  }

  const shortfall = requiredCorpus - projectedNestEgg;
  const isOnTrack = shortfall <= 0;
  const surplus = isOnTrack ? Math.abs(shortfall) : 0;
  const fundedPct = requiredCorpus > 0 ? (projectedNestEgg / requiredCorpus) * 100 : 100;

  return {
    currentAge,
    retireYear,
    retireAge,
    lifeExpectancy,
    cagr,
    inflation,
    futureMonthlyExpense,
    requiredCorpus,
    projectedNestEgg,
    shortfall,
    surplus,
    isOnTrack,
    fundedPct
  };
}
