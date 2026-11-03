export const CONTACT_ROLES = Object.freeze([
  "Engineer",
  "Clinician / Prosthetist (CPO)",
  "Funder / Partner",
  "Field partner (NGO / clinic)",
  "Other / just interested",
]);

const MAX_BODY_BYTES = 16_384;
const INVALID_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export function validateContact(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Please send a valid contact message." };
  }
  if (typeof body.website === "string" && body.website.trim()) {
    return { honeypot: true };
  }
  const limits = { name: 120, email: 254, role: 60, message: 4000 };
  const contact = {};
  for (const [field, max] of Object.entries(limits)) {
    if (typeof body[field] !== "string") return { error: `Please enter your ${field}.` };
    const value = body[field].trim();
    if (!value || value.length > max || INVALID_CONTROL.test(value)) {
      return { error: `Please enter a valid ${field} (${max} characters maximum).` };
    }
    contact[field] = value;
  }
  if (/[\r\n\t]/.test(contact.name) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    return { error: "Please enter a valid name and email address." };
  }
  if (!CONTACT_ROLES.includes(contact.role)) return { error: "Please select one of the listed roles." };
  contact.email = contact.email.toLowerCase();
  return { contact };
}

async function readJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_body");
  const chunks = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error("body_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

async function fingerprint(key, input) {
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Injectable I/O keeps the public endpoint testable without contacting a project. */
export function createContactHandler(config, fetchImpl = fetch) {
  const origins = new Set(config.allowedOrigins.split(",").map((origin) => origin.trim()).filter(Boolean));
  let signingKey;

  return async function handleContact(request) {
    const origin = request.headers.get("origin");
    const allowed = origin !== null && origins.has(origin) && origin !== "null";
    const headers = new Headers({
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
    });
    if (allowed) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "content-type");
      headers.set("Access-Control-Expose-Headers", "Retry-After");
    }
    const reply = (status, body, extraHeaders = {}) => new Response(JSON.stringify(body), {
      status,
      headers: new Headers({ ...Object.fromEntries(headers), ...extraHeaders }),
    });

    // Reject missing origins too: command-line checks must name an allowed origin.
    // CORS is a browser boundary, not proof of identity or a substitute for limits.
    if (!allowed) return reply(403, { error: "This website cannot send messages here." });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return reply(405, { error: "Use the contact form to send a message." }, { Allow: "POST, OPTIONS" });

    if (!config.supabaseUrl || !config.adminKey || config.rateLimitSecret.length < 32 || origins.size === 0) {
      return reply(503, { error: "Contact is temporarily unavailable. Please email us instead." });
    }
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return reply(415, { error: "Please send the message as JSON." });
    }
    let body;
    try {
      body = await readJson(request);
    } catch (error) {
      return error.message === "body_too_large"
        ? reply(413, { error: "Your message is too long. Please shorten it and try again." })
        : reply(400, { error: "Please send a valid contact message." });
    }
    const validated = validateContact(body);
    if (validated.honeypot) return reply(200, { ok: true });
    if (validated.error) return reply(400, { error: validated.error });

    try {
      signingKey ||= crypto.subtle.importKey("raw", new TextEncoder().encode(config.rateLimitSecret),
        { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const key = await signingKey;
      // Hosted Supabase sits behind Cloudflare. Never trust the caller-controlled
      // first X-Forwarded-For value. Missing ingress metadata shares one bucket.
      const clientIp = request.headers.get("cf-connecting-ip") || "unavailable";
      const [ipHash, emailHash] = await Promise.all([
        fingerprint(key, `ip:${clientIp}`),
        fingerprint(key, `email:${validated.contact.email}`),
      ]);
      const apiHeaders = { "Content-Type": "application/json", apikey: config.adminKey };
      if (!config.adminKey.startsWith("sb_secret_")) apiHeaders.Authorization = `Bearer ${config.adminKey}`;
      const upstream = await fetchImpl(`${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/receive_contact_message`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({
          p_name: validated.contact.name,
          p_email: validated.contact.email,
          p_role: validated.contact.role,
          p_message: validated.contact.message,
          p_ip_hash: ipHash,
          p_email_hash: emailHash,
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!upstream.ok) return reply(503, { error: "We couldn't save your message. Please try again or email us." });
      const result = await upstream.json();
      if (result.accepted === false) {
        const retry = Math.max(1, Math.min(3600, Number(result.retry_after) || 3600));
        return reply(429, { error: "Too many messages. Please try again later or email us." }, { "Retry-After": String(Math.ceil(retry)) });
      }
      if (result.accepted !== true) return reply(503, { error: "We couldn't save your message. Please email us instead." });
      return reply(200, { ok: true });
    } catch {
      // Never echo database errors, keys, IP addresses, or message content.
      return reply(503, { error: "Contact is temporarily unavailable. Please try again or email us." });
    }
  };
}
