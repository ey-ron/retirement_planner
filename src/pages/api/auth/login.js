import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yjjfkaqxsojvnvaaezdi.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_4k7FiqRHNOHgQnwEQtfCVw_Ief3sIkX";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email } = req.body || {};
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    try {
      // 1. Fetch member profile (resilient select)
      const { data: license, error: licErr } = await supabase
        .from("pro_licenses")
        .select("*")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (!licErr && license) {
        // 2. Fetch plan from dedicated user_retirement_plans table
        let loadedPlan = null;
        try {
          const { data: planRow } = await supabase
            .from("user_retirement_plans")
            .select("*")
            .ilike("email", cleanEmail)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (planRow) {
            loadedPlan = {
              birthDate: planRow.birth_date,
              monthlyExpense: parseFloat(planRow.monthly_expense),
              retireAge: parseInt(planRow.retire_age, 10),
              lifeExpectancy: parseInt(planRow.life_expectancy, 10),
              currentNestEgg: parseFloat(planRow.current_nest_egg),
              monthlyInvestment: parseFloat(planRow.monthly_investment),
              cagr: parseFloat(planRow.cagr),
              inflation: parseFloat(planRow.inflation),
              requiredCorpus: parseFloat(planRow.required_corpus),
              projectedNestEgg: parseFloat(planRow.projected_nest_egg),
              futureMonthlyExpense: parseFloat(planRow.future_monthly_expense),
              shortfall: parseFloat(planRow.shortfall),
              surplus: parseFloat(planRow.surplus),
              fundedPct: parseFloat(planRow.funded_pct),
              isOnTrack: planRow.is_on_track,
              currencySymbol: planRow.currency_symbol || "$"
            };
          }
        } catch (planErr) {
          console.warn("[Login API] user_retirement_plans lookup notice:", planErr.message);
        }

        const isDev = Boolean(license.is_dev);
        const resolvedUnlocks = isDev
          ? {
              unlock_1: "Unlocked",
              unlock_2: "Unlocked",
              unlock_3: "Unlocked",
              unlock_4: "Unlocked",
              unlock_5: "Unlocked",
              unlock_6: "Unlocked",
              unlock_7: "Unlocked"
            }
          : {
              unlock_1: license.unlock_1 || "Locked",
              unlock_2: license.unlock_2 || "Locked",
              unlock_3: license.unlock_3 || "Locked",
              unlock_4: license.unlock_4 || "Locked",
              unlock_5: license.unlock_5 || "Locked",
              unlock_6: license.unlock_6 || "Locked",
              unlock_7: license.unlock_7 || "Locked"
            };

        return res.status(200).json({
          success: true,
          email: license.email,
          name: license.name || "",
          country: license.country || "Singapore",
          isDev,
          planData: loadedPlan,
          unlocks: resolvedUnlocks,
          message: "Login successful!"
        });
      }
    } catch (dbErr) {
      console.warn("[Login API] Supabase check error:", dbErr.message);
    }

    // If not found in DB
    return res.status(404).json({
      success: false,
      message: "No account found for this email. Please register to create your account."
    });
  } catch (err) {
    console.error("[Login API Error]:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to log in."
    });
  }
}
