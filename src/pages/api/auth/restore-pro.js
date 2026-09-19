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

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    // Check Supabase pro_licenses table
    const { data: license, error: licErr } = await supabase
      .from("pro_licenses")
      .select("id, email, name, is_pro, lemon_order_id")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (licErr) {
      console.error("[Restore Pro] pro_licenses error:", licErr);
      return res.status(500).json({ success: false, message: licErr.message });
    }

    if (license && license.is_pro) {
      const nowIso = new Date().toISOString();
      try {
        await supabase
          .from("pro_licenses")
          .update({
            last_login_at: nowIso,
            last_accessed_at: nowIso,
            updated_at: nowIso
          })
          .eq("id", license.id);
      } catch (touchErr) {
        console.warn("[Restore Pro] last_login_at update notice:", touchErr.message);
      }

      return res.status(200).json({
        success: true,
        isPro: true,
        email: license.email,
        name: license.name || "",
        message: "Pro license verified successfully."
      });
    }

    // If no active license found in pro_licenses
    return res.status(404).json({
      success: false,
      isPro: false,
      message: "No active Pro license found for this email. Please check your purchase email or purchase Pro."
    });
  } catch (err) {
    console.error("[Restore Pro Error]:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to verify Pro access."
    });
  }
}
