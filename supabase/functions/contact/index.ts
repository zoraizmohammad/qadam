import { createContactHandler } from "./handler.js";

function adminKey(): string {
  // Current hosted projects inject named secret keys; support legacy projects too.
  try {
    const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}");
    if (typeof keys.default === "string") return keys.default;
  } catch {
    // A missing/invalid configuration is handled by the request handler.
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

Deno.serve(createContactHandler({
  supabaseUrl: Deno.env.get("SUPABASE_URL") || "",
  adminKey: adminKey(),
  allowedOrigins: Deno.env.get("CONTACT_ALLOWED_ORIGINS") || "",
  rateLimitSecret: Deno.env.get("CONTACT_RATE_LIMIT_SECRET") || "",
}));
