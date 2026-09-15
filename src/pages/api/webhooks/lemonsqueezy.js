import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for secure backend webhook handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yjjfkaqxsojvnvaaezdi.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_4k7FiqRHNOHgQnwEQtfCVw_Ief3sIkX";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const event = req.body;
    const eventName = event?.meta?.event_name;
    const customData = event?.meta?.custom_data;

    console.log(`[LemonSqueezy Webhook] Received event: ${eventName}`);
    console.log("[LemonSqueezy Webhook RAW BODY]:", JSON.stringify(req.body, null, 2));

    if (eventName === "order_created" || eventName === "subscription_created") {
      const attributes = event?.data?.attributes || {};
      const userEmail = attributes.user_email?.trim()?.toLowerCase();
      const userName = (attributes.user_name || attributes.customer_name || attributes.first_name || "").trim();
      const orderId = String(event?.data?.id || attributes.order_number || "");
      const totalFormatted = attributes.total_formatted || "$4.00";

      if (userEmail) {
        console.log(`[LemonSqueezy Webhook] Provisioning Pro access for: ${userName ? `${userName} <${userEmail}>` : userEmail} (Order ${orderId})`);

        // 1. Check if user already exists in Supabase profiles
        const { data: existingProfile, error: profileErr } = await supabase
          .from("profiles")
          .select("id, is_pro")
          .eq("email", userEmail)
          .maybeSingle();

        if (existingProfile) {
          // Upgrade existing profile with name and pro status
          await supabase
            .from("profiles")
            .update({
              is_pro: true,
              full_name: userName || undefined,
              pro_since: new Date().toISOString(),
              lemon_order_id: orderId,
              updated_at: new Date().toISOString()
            })
            .eq("id", existingProfile.id);
        } else {
          // Auto-invite / create Supabase auth user with is_pro and name metadata
          try {
            if (supabase.auth.admin) {
              await supabase.auth.admin.createUser({
                email: userEmail,
                email_confirm: true,
                user_metadata: {
                  full_name: userName,
                  is_pro: true,
                  lemon_order_id: orderId,
                  plan: "Pro Suite"
                }
              });
            }
          } catch (authErr) {
            console.warn("[LemonSqueezy Webhook] Auth user create notice:", authErr.message);
          }
        }
      }
    }

    return res.status(200).json({ received: true, event: eventName });
  } catch (err) {
    console.error("[LemonSqueezy Webhook Error]:", err);
    return res.status(500).json({ error: "Webhook processing error", details: err.message });
  }
}
