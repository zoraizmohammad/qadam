# Supabase contact form

**Current status:** This is a prepared backend for possible future use. The
website currently has no contact form, and no Qadam Supabase project has been
created. The account reached its active free-project limit. Provisioning and
frontend connection are deferred.

The website submits enquiries to a public Supabase Edge Function named `contact`.
The function validates the request and writes to `public.qadam_contact_messages`
through a service-only database function. Visitors cannot read, edit, or insert
rows directly. A successful form response means the message was saved in Supabase;
it does **not** mean an email notification was sent.

The public browser configuration contains only the Edge Function URL. Never put
a Supabase secret key, service-role key, database password, or access token in
`web/`, a build variable intended for the browser, or Git history.

## Activate an existing project

Choose the Supabase project deliberately. This repository does not automatically
link to or modify any other project in your account. With an authorized project
and a current [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started):

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push --dry-run
supabase db push
```

Review the dry run first, particularly if the project already has migrations.
The migration creates only Qadam-named tables, a private rate-limit schema, and
`receive_contact_message`. It does not change policies on unrelated tables.
For an existing database with migration history managed elsewhere, have the
project owner apply the supplied migration through their established workflow.

Set two function secrets in the Dashboard's **Edge Functions → Secrets**, or put
them in a local, ignored `supabase/functions/.env` and use `supabase secrets set
--env-file supabase/functions/.env`. Do not commit that file.

```dotenv
CONTACT_ALLOWED_ORIGINS=https://zoraizmohammad.github.io,https://YOUR_SITE.vercel.app
CONTACT_RATE_LIMIT_SECRET=REPLACE_WITH_A_RANDOM_SECRET_OF_AT_LEAST_32_CHARACTERS
```

Origins have no path or trailing slash: GitHub Pages' `/qadam/` path is not part
of the origin. List production domains explicitly; do not use `*` or broad
Vercel-preview wildcards. Add each staging origin deliberately. Local development
is also opt-in, for example `http://localhost:4173`. Generate a strong random
rate-limit secret with a password manager or `openssl rand -hex 32`.

Supabase injects server-side credentials automatically. The function prefers the
`default` entry in `SUPABASE_SECRET_KEYS` and supports the legacy
`SUPABASE_SERVICE_ROLE_KEY` on older projects. Neither reaches the browser.

Deploy:

```sh
supabase functions deploy contact --project-ref YOUR_PROJECT_REF
```

`supabase/config.toml` explicitly sets `verify_jwt = false`: this contact form is
public, not an authenticated application. Authentication for other functions is
unchanged. The contact endpoint uses validation, exact origin checks, a honeypot,
and persistent rate limits instead of treating a browser-visible key as a secret.

Set the website's `CONTACT_ENDPOINT` build variable to:

```text
https://YOUR_PROJECT_REF.supabase.co/functions/v1/contact
```

For GitHub Pages, add it as a repository Actions **variable**; for Vercel, add it
as a build environment variable. Rebuild and deploy the site after changing it.
The frontend reads `window.QADAM_CONFIG.contactEndpoint`. Until configured, the
site must offer direct email rather than report a successful submission.

## Request and response

Send `POST` with `Content-Type: application/json` and this body:

```json
{
  "name": "Example Partner",
  "email": "partner@example.org",
  "role": "Engineer",
  "message": "I'd like to discuss the project.",
  "website": ""
}
```

`website` is an invisible honeypot and must be empty. The accepted role values are:

- `Engineer`
- `Clinician / Prosthetist (CPO)`
- `Funder / Partner`
- `Field partner (NGO / clinic)`
- `Other / just interested`

The limits are 120 characters for name, 254 for email, 60 for role, and 4,000 for
message. The entire request body is limited to 16 KiB. Timestamps and IDs come
from the database. The endpoint returns `{ "ok": true }` only after a confirmed
database insert (or a benign honeypot response). Errors are `{ "error": "…" }`:

| Status | Meaning |
| --- | --- |
| 400 | Invalid fields or malformed JSON |
| 403 | Missing or unapproved origin |
| 405 | Unsupported method |
| 413 | Body too large |
| 415 | Not JSON |
| 429 | Rate limit; `Retry-After` gives seconds to wait |
| 503 | Configuration or storage unavailable; offer email |

All responses are `Cache-Control: no-store`. Never cache contact requests in a
service worker or retry them automatically: retries could create duplicate mail.

## Data access, abuse controls, and retention

Row Level Security is enabled with **no** public policies on the message table.
Table privileges and RPC execution are revoked from `anon`, `authenticated`, and
`PUBLIC`; the server-side service role alone can use the ingestion function.
Read incoming enquiries in the Supabase Dashboard's Table Editor, using your
normal authenticated project-owner access.

One database transaction updates hourly rate buckets and inserts the message.
The limits are 100 attempts globally, five per client-address fingerprint, and
three per email fingerprint per hour. The global bucket is locked first, so
parallel function instances cannot bypass a counter through a read/write race.
The function HMACs fingerprints with a private secret; plaintext client IPs are
not stored by this application. Rate rows older than one day past expiry are
removed during successful ingestion.

The hosted function uses `cf-connecting-ip` from Supabase's Cloudflare ingress.
Do not treat a client-supplied first `x-forwarded-for` value as trustworthy. If
the ingress header is absent, requests share a conservative fallback bucket;
verify ingress behavior when using a custom proxy or self-hosted runtime. CORS
does not authenticate callers, and per-address limits do not defeat distributed
spam. The global and email limits remain independent safeguards; high-traffic
deployments may additionally need provider-level abuse protection.

Messages contain contact information. Restrict dashboard access, choose and
document a retention period, and delete old enquiries through the dashboard or
an authenticated maintenance job. Do not submit medical records or patient data
through this form. Application code does not log request content, client IPs,
database details, or credentials; Supabase's infrastructure may retain its own
request metadata under the project's logging settings.

## Verification

The request-handler tests need Node 22+ and no Supabase account:

```sh
node --test supabase/functions/contact/handler.test.mjs
```

These exercise validation, allowed/denied origins, bounded input, honeypots,
fingerprint generation, service-only RPC requests, upstream failure, and rate-limit
responses. They mock the storage boundary and do not prove a remote deployment.

For database integration locally, start Docker and run `supabase start`,
`supabase db reset`, then `supabase functions serve contact --env-file
supabase/functions/.env`. Set an explicit localhost origin in the env file.
Run `psql` against that disposable local database with
`-v ON_ERROR_STOP=1 -f supabase/tests/contact.sql` to check service-role insertion,
denied browser grants, RLS, hourly limits, expiry reset, and the global cap. The
script rolls back its test data and counters. Do not point it at production.
After remote deployment, submit a single clearly marked test message from the
allowed site, confirm its row in `qadam_contact_messages`, and delete the test
row. Also verify that anonymous Data API reads and direct inserts are denied.

## Official references

- [Function configuration](https://supabase.com/docs/guides/functions/function-configuration)
- [Function environment variables and secrets](https://supabase.com/docs/guides/functions/secrets)
- [API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Database function privileges](https://supabase.com/docs/guides/database/functions)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
