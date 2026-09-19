import { getCountryInfo } from "../../../lib/retirementCalculations.js";

// 1-hour in-memory cache for World Bank CPI indicators
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { country } = req.query || {};
    const countryInfo = getCountryInfo(country || "Singapore");
    const wbCode = countryInfo.wbCode || "SGP";

    const cacheKey = wbCode;
    const now = Date.now();
    const cached = cache.get(cacheKey);

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return res.status(200).json({
        success: true,
        country: countryInfo.name,
        code: countryInfo.code,
        wbCode,
        inflation: cached.inflation,
        year: cached.year,
        source: "World Bank (Cached)",
        isCached: true
      });
    }

    // Query World Bank official indicator for Consumer Price Index (Annual %): FP.CPI.TOTL.ZG for past 10+ years
    const url = `https://api.worldbank.org/v2/country/${wbCode}/indicator/FP.CPI.TOTL.ZG?format=json&per_page=14`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`World Bank API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const records = (data?.[1] || []).filter(r => r.value !== null && r.value !== undefined);

    let liveInflation = countryInfo.defaultInflation;
    let period = "10-Yr Historical Benchmark";

    if (typeof countryInfo.defaultInflation === "number") {
      liveInflation = countryInfo.defaultInflation;
    } else if (records.length > 0) {
      const sample = records.slice(0, 10);
      const sum = sample.reduce((acc, r) => acc + Number(r.value), 0);
      liveInflation = Math.round((sum / sample.length) * 100) / 100;
      const startYear = sample[sample.length - 1]?.date;
      const endYear = sample[0]?.date;
      period = `${startYear}-${endYear} (10-Yr Avg)`;
    }

    // Save to cache
    cache.set(cacheKey, {
      inflation: liveInflation,
      period,
      timestamp: now
    });

    return res.status(200).json({
      success: true,
      country: countryInfo.name,
      code: countryInfo.code,
      wbCode,
      inflation: liveInflation,
      period,
      source: "World Bank (10-Year Historical Average)"
    });
  } catch (err) {
    console.warn("[World Bank Inflation API Notice]:", err.message);
    const countryInfo = getCountryInfo(req.query?.country || "Singapore");
    return res.status(200).json({
      success: true,
      country: countryInfo.name,
      code: countryInfo.code,
      wbCode: countryInfo.wbCode,
      inflation: countryInfo.defaultInflation,
      year: "2025",
      source: "World Bank (Fallback Benchmark)"
    });
  }
}
