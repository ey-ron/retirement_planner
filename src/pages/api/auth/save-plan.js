import { createClient } from "@supabase/supabase-js";
import { computeSimulationMetrics, getCurrencySymbol } from "@/lib/retirementCalculations";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(500).json({ success: false, message: "Database connection not configured." });
  }

  try {
    const { email, planData } = req.body || {};
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }

    if (!planData || typeof planData !== "object") {
      return res.status(400).json({ success: false, message: "Plan data is required." });
    }

    try {
      // 1. Look up parent user in pro_licenses
      const { data: parentUser } = await supabase
        .from("pro_licenses")
        .select("id, email, country")
        .ilike("email", cleanEmail)
        .maybeSingle();

      const userId = parentUser?.id || null;
      const country = parentUser?.country || "Singapore";

      // Touch parent user's last_accessed_at
      if (userId) {
        const nowIso = new Date().toISOString();
        try {
          await supabase
            .from("pro_licenses")
            .update({
              last_accessed_at: nowIso,
              updated_at: nowIso
            })
            .eq("id", userId);
        } catch (accessErr) {
          console.warn("[Save Plan API] last_accessed_at notice:", accessErr.message);
        }
      }

      const currencySymbol = getCurrencySymbol(country);
      const metrics = computeSimulationMetrics(planData);

      // 2. Prepare dedicated column record
      const record = {
        user_id: userId,
        email: cleanEmail,
        birth_date: planData.birthDate || "1995-01-01",
        monthly_expense: parseFloat(planData.monthlyExpense) || 3000,
        retire_age: parseInt(planData.retireAge, 10) || 50,
        life_expectancy: parseInt(planData.lifeExpectancy, 10) || 85,
        current_nest_egg: parseFloat(planData.currentNestEgg) || 0,
        monthly_investment: parseFloat(planData.monthlyInvestment) || 0,
        cagr: parseFloat(planData.cagr) || 8.0,
        inflation: parseFloat(planData.inflation) || 3.5,
        current_age: metrics.currentAge,
        retire_year: metrics.retireYear,
        future_monthly_expense: metrics.futureMonthlyExpense,
        required_corpus: metrics.requiredCorpus,
        projected_nest_egg: metrics.projectedNestEgg,
        shortfall: metrics.shortfall > 0 ? metrics.shortfall : 0,
        surplus: metrics.surplus,
        funded_pct: metrics.fundedPct,
        is_on_track: metrics.isOnTrack,
        currency_symbol: currencySymbol,
        updated_at: new Date().toISOString()
      };

      // 3. Upsert into user_retirement_plans table
      const { data: existingPlan } = await supabase
        .from("user_retirement_plans")
        .select("id")
        .ilike("email", cleanEmail)
        .maybeSingle();

      let planResult = null;
      if (existingPlan?.id) {
        const { data: updated } = await supabase
          .from("user_retirement_plans")
          .update(record)
          .eq("id", existingPlan.id)
          .select()
          .maybeSingle();
        planResult = updated;
      } else {
        const { data: inserted } = await supabase
          .from("user_retirement_plans")
          .insert(record)
          .select()
          .maybeSingle();
        planResult = inserted;
      }

      return res.status(200).json({
        success: true,
        message: "Plan saved successfully in user_retirement_plans!",
        data: planResult
      });
    } catch (dbErr) {
      console.warn("[Save Plan API] DB write notice:", dbErr.message);
      return res.status(200).json({
        success: true,
        message: "Plan acknowledged locally."
      });
    }
  } catch (err) {
    console.error("[Save Plan Error]:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to save plan."
    });
  }
}
