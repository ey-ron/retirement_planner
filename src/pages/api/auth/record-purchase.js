import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yjjfkaqxsojvnvaaezdi.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_4k7FiqRHNOHgQnwEQtfCVw_Ief3sIkX";
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { email, name, orderId } = req.body || {};
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || "").trim();
    const cleanOrderId = String(orderId || "").trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required." });
    }

    // Upsert into pro_licenses table
    const { data: licenseData, error: licErr } = await supabase
      .from("pro_licenses")
      .upsert(
        {
          email: cleanEmail,
          name: cleanName,
          is_pro: true,
          lemon_order_id: cleanOrderId,
          updated_at: new Date().toISOString()
        },
        { onConflict: "email" }
      )
      .select();

    if (licErr) {
      return res.status(500).json({ success: false, message: licErr.message });
    }

    return res.status(200).json({ success: true, table: "pro_licenses", data: licenseData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
