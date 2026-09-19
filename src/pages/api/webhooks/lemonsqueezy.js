import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin client for secure backend webhook handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const event = req.body;
    const eventName = event?.meta?.event_name;

    if (eventName === "order_created" || eventName === "subscription_created") {
      const attributes = event?.data?.attributes || {};
      const userEmail = attributes.user_email?.trim()?.toLowerCase();
      const userName = (attributes.user_name || attributes.customer_name || attributes.first_name || "").trim();
      const orderId = String(event?.data?.id || attributes.order_number || "");

      if (userEmail) {
        // Upsert into pro_licenses table
        await supabase
          .from("pro_licenses")
          .upsert(
            {
              email: userEmail,
              name: userName,
              is_pro: true,
              lemon_order_id: orderId,
              updated_at: new Date().toISOString()
            },
            { onConflict: "email" }
          );
      }
    }

    return res.status(200).json({ received: true, event: eventName });
  } catch (err) {
    return res.status(500).json({ error: "Webhook processing error", details: err.message });
  }
}
