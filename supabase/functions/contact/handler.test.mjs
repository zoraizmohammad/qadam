import test from "node:test";
import assert from "node:assert/strict";
import { createContactHandler, validateContact } from "./handler.js";

const origin = "https://zoraizmohammad.github.io";
const config = {
  supabaseUrl: "https://example.supabase.co",
  adminKey: "sb_secret_test_only",
  allowedOrigins: origin,
  rateLimitSecret: "test-only-not-a-real-secret-value-123456789",
};
const payload = { name: "Example Partner", email: "PARTNER@example.org", role: "Engineer", message: "I'd like to discuss the project.", website: "" };
const makeRequest = (body = payload, init = {}) => new Request("https://example.supabase.co/functions/v1/contact", {
  method: "POST",
  headers: { origin, "content-type": "application/json", "cf-connecting-ip": "192.0.2.1" },
  body: JSON.stringify(body),
  ...init,
});
const success = async () => Response.json({ accepted: true });

test("normalizes valid contact data and rejects invalid types, roles and lengths", () => {
  assert.equal(validateContact(payload).contact.email, "partner@example.org");
  for (const body of [null, [], { ...payload, name: 10 }, { ...payload, email: "bad" },
    { ...payload, role: "Administrator" }, { ...payload, message: "x".repeat(4001) },
    { ...payload, name: "Header\r\nInjection" }, { ...payload, message: "hello\u0000world" }]) {
    assert.equal(typeof validateContact(body).error, "string");
  }
});

test("preflight permits only exact configured origins and never caches responses", async () => {
  let calls = 0;
  const handler = createContactHandler(config, async () => { calls++; return success(); });
  const response = await handler(new Request("https://example.supabase.co/functions/v1/contact", { method: "OPTIONS", headers: { origin } }));
  assert.equal(response.status, 204);
  assert.equal(response.headers.get("access-control-allow-origin"), origin);
  assert.equal(response.headers.get("cache-control"), "no-store");
  for (const untrusted of ["https://zoraizmohammad.github.io.attacker.invalid", "null", "https://other.invalid"]) {
    const blocked = await handler(makeRequest(payload, { headers: { origin: untrusted, "content-type": "application/json" } }));
    assert.equal(blocked.status, 403);
    assert.equal(blocked.headers.has("access-control-allow-origin"), false);
  }
  assert.equal((await handler(makeRequest(payload, { headers: { "content-type": "application/json" } }))).status, 403);
  assert.equal(calls, 0);
});

test("writes normalized data via one service-only RPC with hashed fingerprints", async () => {
  let captured;
  const handler = createContactHandler(config, async (url, options) => {
    captured = { url, options };
    return success();
  });
  const response = await handler(makeRequest());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(captured.url, "https://example.supabase.co/rest/v1/rpc/receive_contact_message");
  assert.equal(captured.options.headers.apikey, config.adminKey);
  assert.equal(captured.options.headers.Authorization, undefined);
  const submitted = JSON.parse(captured.options.body);
  assert.equal(submitted.p_email, "partner@example.org");
  assert.match(submitted.p_ip_hash, /^[0-9a-f]{64}$/);
  assert.match(submitted.p_email_hash, /^[0-9a-f]{64}$/);
  assert.equal(captured.options.body.includes("192.0.2.1"), false);
  assert.equal(Object.hasOwn(submitted, "created_at"), false);
});

test("legacy service credentials remain server-side and work with legacy auth headers", async () => {
  const handler = createContactHandler({ ...config, adminKey: "legacy-test-only" }, async (_url, options) => {
    assert.equal(options.headers.Authorization, "Bearer legacy-test-only");
    return success();
  });
  const response = await handler(makeRequest());
  assert.equal(response.status, 200);
  assert.equal((await response.text()).includes("legacy-test-only"), false);
});

test("honeypot and rejected inputs never touch the database", async () => {
  let calls = 0;
  const handler = createContactHandler(config, async () => { calls++; return success(); });
  assert.equal((await handler(makeRequest({ ...payload, website: "spam.invalid" }))).status, 200);
  assert.equal((await handler(makeRequest({ ...payload, email: "bad" }))).status, 400);
  assert.equal((await handler(makeRequest(payload, { body: "not JSON" }))).status, 400);
  assert.equal((await handler(makeRequest(payload, { headers: { origin, "content-type": "text/plain" } }))).status, 415);
  assert.equal((await handler(makeRequest(payload, { body: "x".repeat(16_385) }))).status, 413);
  assert.equal(calls, 0);
});

test("persistent rate-limit decisions return retry guidance without accepting a message", async () => {
  const handler = createContactHandler(config, async () => Response.json({ accepted: false, retry_after: 300 }));
  const response = await handler(makeRequest());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "300");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(Object.hasOwn(await response.json(), "ok"), false);
});

test("upstream failures and unconfigured functions fail honestly without leaking secrets", async () => {
  const handlers = [
    createContactHandler({ ...config, allowedOrigins: "" }, success),
    createContactHandler({ ...config, rateLimitSecret: "" }, success),
    createContactHandler(config, async () => Response.json({ detail: config.adminKey }, { status: 500 })),
    createContactHandler(config, async () => { throw new Error(config.adminKey); }),
    createContactHandler(config, async () => Response.json({ unexpected: true })),
  ];
  for (const handler of handlers) {
    const response = await handler(makeRequest());
    assert.ok(response.status >= 400);
    const text = await response.text();
    assert.equal(text.includes(config.adminKey), false);
    assert.equal(text.includes(payload.message), false);
  }
});
