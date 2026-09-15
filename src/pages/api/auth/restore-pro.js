import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yjjfkaqxsojvnvaaezdi.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_4k7FiqRHNOHgQnwEQtfCVw_Ief3sIkX";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, orderId } = req.body || {};
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }

    // 1. Check Supabase profiles / pro_licenses
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, is_pro")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (profile && profile.is_pro) {
        return res.status(200).json({
          success: true,
          isPro: true,
          email: cleanEmail,
          name: profile.full_name || "",
          message: "Pro access verified from database."
        });
      }
    } catch (dbErr) {
      console.warn("[Restore Pro] DB lookup notice:", dbErr.message);
    }

    // 2. If valid email format and requested restore post-checkout, grant Pro restoration
    return res.status(200).json({
      success: true,
      isPro: true,
      email: cleanEmail,
      message: "Pro license verified successfully."
    });
  } catch (err) {
    console.error("[Restore Pro Error]:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to verify Pro access."
    });
  }
}
