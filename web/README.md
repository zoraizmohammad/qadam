# Qadam — website

A single-file, dependency-free landing page for the Qadam project.

Qadam is an **accessible biotech venture** that packs an entire prosthetics clinic
into one portable, solar-powered case — the phone, tools, and standardized parts to
custom-fit **15–20 robust mechanical limbs** anywhere, plus the open IP to make more.
The intelligence lives in the *fitting*; the limb the patient keeps is purely
mechanical (no electronics, no battery, nothing to break).

Repo: <https://github.com/zoraizmohammad/qadam>

## Run it

Open `index.html` in any modern browser. There is no build step and no install.

```
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

## What's inside

Everything (HTML, CSS, JS) lives in `index.html`. External fonts load from Google
Fonts when online; the page degrades gracefully offline.

Design: an editorial, light-led aesthetic inspired by nucleoresearch.com — a warm
off-white base with a sectional rhythm of **iridescent → white → black** sections,
bookended by a soft pastel iridescent hero and contact band. Type pairs Instrument
Serif (display) with Inter (body) and JetBrains Mono (labels); buttons are pills,
cards are glassmorphic, and a persistent floating "Get involved" CTA appears on
scroll.

Sections: hero (iridescent), a stats proof band, thesis, **"What's in the case"**
(iridescent — the carrying-case kit broken into reusable fitting tech, per-patient
consumables, and power/logistics), the device (dark), the fitting loop, research
agenda (dark bento), an interactive V1/V2/V3 roadmap, open source (dark terminal),
an About section with the four team portraits,
and get-involved (iridescent bookend). The nav and
footer both carry a GitHub icon linking the repo. Animations: a slowly drifting
iridescent gradient, a self-animating SVG of the stave former, scroll-reveal
transitions, count-up stats, and tabbed roadmap panels. All decorative motion is
disabled automatically for visitors who set `prefers-reduced-motion`.

### `assets/`

- `favicon.svg` — the Qadam mark (scalable, pastel iridescent), wired via `<link rel="icon">`.
- `og-image.png` — 1200×630 social card (pastel iridescent, serif headline) used by
  the Open Graph / Twitter meta tags.
- `people/` — portraits of Mohammad Zoraiz, Hala Kannan, Nizar Alsaidi, and
  Jad Barghouti supplied for the About section.

Both are referenced with relative paths so they work on GitHub Pages under a
project subpath. The iridescent fields are pure CSS (no extra files).
To generate *additional* AI raster art on-brand, see
[`../tools/nano-banana/`](../tools/nano-banana/README.md).

## Notes

- The stat figures and cost targets in the hero/open-source sections are
  **provisional placeholders** — update them as real numbers land.
- No frameworks, no bundler, no `node_modules`. Intentionally easy to fork and host
  anywhere (GitHub Pages, Netlify, a static folder).
- The Get involved section offers email and GitHub links; it has no form.
