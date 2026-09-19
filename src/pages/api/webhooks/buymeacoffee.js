import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false
  }
};

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!supabaseUrl || !supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey);
}

const DEFAULT_SECRET = "ad7cb10b5354f8b1356a0046392e79ed8ec1d33f16521bd93a88f6ed61f2db9e422c0da34b9bc68e";

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const rawBodyBuffer = await getRawBody(req);
    const rawBody = rawBodyBuffer.toString("utf8");

    const signingSecret = process.env.BUYMEACOFFEE_SIGNING_SECRET || DEFAULT_SECRET;
    const signature = req.headers["x-signature-sha256"] || req.headers["x-signature"] || "";

    // If signature header is present, verify authenticity
    if (signature && signingSecret) {
      const hmac = crypto.createHmac("sha256", signingSecret);
      const computedHash = hmac.update(rawBody).digest("hex");

      const isValid =
        computedHash.length === signature.length &&
        crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(signature));

      if (!isValid) {
        console.warn("[BMC Webhook] Signature verification failed.");
        return res.status(401).json({ error: "Invalid webhook signature" });
      }
    }

    let payload = {};
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const eventType = payload?.type || payload?.event || "";
    const data = payload?.data || payload || {};

    // Extract supporter / buyer email across all BMC payload shapes
    const userEmail = (
      data.payer_email ||
      data.supporter_email ||
      data.email ||
      data.customer_email ||
      ""
    ).trim().toLowerCase();

    const userName = (
      data.payer_name ||
      data.supporter_name ||
      data.name ||
      data.customer_name ||
      ""
    ).trim();

    const orderId = String(data.order_id || data.id || payload.event_id || "");
    const amount = data.amount || data.total_amount || 0;

    console.log(`[BMC Webhook] Processing event: ${eventType} for ${userEmail || "anonymous"} (Order: ${orderId})`);

    if (userEmail && userEmail.includes("@")) {
      const supabase = getSupabase();
      if (supabase) {
        const { error: upsertErr } = await supabase
          .from("pro_licenses")
          .upsert(
            {
              email: userEmail,
              name: userName || "Supporter",
              is_pro: true,
              lemon_order_id: `bmc_${orderId}`,
              updated_at: new Date().toISOString()
            },
            { onConflict: "email" }
          );

        if (upsertErr) {
          console.error("[BMC Webhook] Supabase upsert error:", upsertErr.message);
        } else {
          console.log(`[BMC Webhook] Successfully activated Pro license for: ${userEmail}`);
        }
      }
    }

    return res.status(200).json({
      received: true,
      type: eventType,
      email: userEmail
    });
  } catch (err) {
    console.error("[BMC Webhook Error]:", err);
    return res.status(500).json({ error: "Webhook processing error", details: err.message });
  }
}
