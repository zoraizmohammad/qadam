# Qadam website

A small static site explaining Qadam's proposed portable prosthetics fitting kit,
current research stage, and ways to contribute.

## Local development

From the repository root, with Node.js 22 or later:

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. Source lives in `index.html`, `about.html`,
`styles.css`, `app.js`, `config.js`, and `assets/`. No frontend framework or
font download is required.
The main content remains readable without JavaScript.

```sh
npm test
npm run build
npm run preview
```

The build writes `dist/`. Deploy that folder, not the repository root.

## Content and design

The home page presents the proposal, fitting workflow, current stage, open
research questions, and contact route. The About page explains the motivation
and introduces Mohammad Zoraiz, Hala Kannan, Jad Bargouti, and Nizar Alsaidi
with the supplied portraits. Product imagery is labeled as a concept
illustration. Do not describe capacity, cost, accuracy, or clinical results
as proven without linking to supporting work.

The visual system uses a warm paper background, dark readable text, Georgia
headings, system sans-serif body text, and a restrained teal accent. Navigation
works on small screens. Content does not wait for a scroll animation to become
visible. See [the design system](../design/qadam-design-system.md).

## Assets and caching

Use explicit image dimensions to reserve layout space and efficient image
formats for content imagery. Keep alt text descriptive and label concept imagery
in visible captions. Link to actual project files instead of simulated outputs.

The build fingerprints asset filenames by content and rewrites their references,
including relative paths needed by GitHub Pages project sites. Vercel caches
fingerprinted assets for one year with `immutable`, while HTML and public config
revalidate. GitHub Pages controls its own cache headers. No service worker is
installed, so there is no separate offline cache to invalidate.

## Contact configuration

The production build creates public `config.js` using `CONTACT_ENDPOINT`, or
`SUPABASE_URL` with `/functions/v1/contact` appended. It contains a public URL only;
never place Supabase service keys or image-generation credentials in it.

The default source configuration has no endpoint. The site exposes a direct
email contact until a backend is configured, and does not report false success.
For database migration, Edge Function deployment, allowed origins, and secrets,
follow [the Supabase setup guide](../docs/supabase-setup.md).

The backend expects `{ name, email, role, message, website }`, with `website`
reserved as a honeypot. A successful JSON response contains `{ "ok": true }`;
failures return a human-readable `error`. Form requests must not be cached.

See [the main README](../README.md) for hosting setup and project status.
