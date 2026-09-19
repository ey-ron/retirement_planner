import { createClient } from "@supabase/supabase-js";
import { computeSimulationMetrics, getCurrencySymbol } from "@/lib/retirementCalculations";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yjjfkaqxsojvnvaaezdi.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_4k7FiqRHNOHgQnwEQtfCVw_Ief3sIkX";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { name, email, country, planData } = req.body || {};
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || "").trim();
    const cleanCountry = (country || "Singapore").trim();

    if (!cleanName) {
      return res.status(400).json({ success: false, message: "Please enter your name." });
    }

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address." });
    }

    const defaultUnlocks = {
      unlock_1: "Locked",
      unlock_2: "Locked",
      unlock_3: "Locked",
      unlock_4: "Locked",
      unlock_5: "Locked",
      unlock_6: "Locked",
      unlock_7: "Locked"
    };

    let parentUser = null;
    let savedPlanRecord = null;

    try {
      // 1. Upsert into pro_licenses table (resilient to missing columns)
      const nowIso = new Date().toISOString();
      let { data: userData, error: userErr } = await supabase
        .from("pro_licenses")
        .upsert(
          {
            email: cleanEmail,
            name: cleanName,
            country: cleanCountry,
            is_pro: true,
            ...defaultUnlocks,
            last_login_at: nowIso,
            last_accessed_at: nowIso,
            updated_at: nowIso
          },
          { onConflict: "email" }
        )
        .select()
        .maybeSingle();

      // If full upsert failed because country or unlock columns do not exist yet in Supabase,
      // fallback to inserting the core schema columns (email, name, is_pro)
      if (userErr) {
        console.warn("[Register API] Full schema upsert notice:", userErr.message, "Retrying with core columns...");
        const { data: fallbackUser, error: fallbackErr } = await supabase
          .from("pro_licenses")
          .upsert(
            {
              email: cleanEmail,
              name: cleanName,
              is_pro: true,
              last_login_at: nowIso,
              last_accessed_at: nowIso,
              updated_at: nowIso
            },
            { onConflict: "email" }
          )
          .select()
          .maybeSingle();

        if (fallbackUser && !fallbackErr) {
          parentUser = fallbackUser;
        } else if (fallbackErr) {
          console.error("[Register API] Core upsert failed:", fallbackErr.message);
        }
      } else if (userData) {
        parentUser = userData;
      }

      // 2. If planData is provided, write to dedicated user_retirement_plans table
      if (planData && typeof planData === "object") {
        const currencySymbol = getCurrencySymbol(cleanCountry);
        const metrics = computeSimulationMetrics(planData);
        const userId = parentUser?.id || null;

        const planRecord = {
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

        const { data: existingPlan } = await supabase
          .from("user_retirement_plans")
          .select("id")
          .ilike("email", cleanEmail)
          .maybeSingle();

        if (existingPlan?.id) {
          const { data: upd } = await supabase
            .from("user_retirement_plans")
            .update(planRecord)
            .eq("id", existingPlan.id)
            .select()
            .maybeSingle();
          savedPlanRecord = upd;
        } else {
          const { data: ins } = await supabase
            .from("user_retirement_plans")
            .insert(planRecord)
            .select()
            .maybeSingle();
          savedPlanRecord = ins;
        }
      }
    } catch (dbErr) {
      console.warn("[Register API] Supabase write notice:", dbErr.message);
    }

    return res.status(200).json({
      success: true,
      user: parentUser,
      name: cleanName,
      email: cleanEmail,
      country: cleanCountry,
      planData: planData || null,
      savedPlanRecord,
      unlocks: defaultUnlocks,
      message: "Registration successful!"
    });
  } catch (err) {
    console.error("[Register API Error]:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Registration failed."
    });
  }
}
