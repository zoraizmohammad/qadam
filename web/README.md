# Qadam — website

A single-file, dependency-free landing page for the Qadam project.

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

Sections: hero (iridescent), a stats proof band, thesis, the device (dark), the
fitting loop, research agenda (dark bento), an interactive V1/V2/V3 roadmap, open
source (dark terminal), a candid "known risks" callout, and get-involved
(iridescent bookend). Animations: a slowly drifting iridescent gradient, a
self-animating SVG of the stave former, scroll-reveal transitions, count-up stats,
and tabbed roadmap panels. All decorative motion is disabled automatically for
visitors who set `prefers-reduced-motion`.

> The previous dark "frontier-lab" theme is preserved at `index.dark-backup.html`
> (untracked) in case you want to compare or revert.

### `assets/`

- `favicon.svg` — the Qadam mark (scalable, pastel iridescent), wired via `<link rel="icon">`.
- `og-image.png` — 1200×630 social card (pastel iridescent, serif headline) used by
  the Open Graph / Twitter meta tags.

Both are referenced with relative paths so they work on GitHub Pages under a
project subpath. The iridescent fields are pure CSS (no extra files).
To generate *additional* AI raster art on-brand, see
[`../tools/nano-banana/`](../tools/nano-banana/README.md).

## Notes

- The stat figures and cost targets in the hero/open-source sections are
  **provisional placeholders** — update them as real numbers land.
- No frameworks, no bundler, no `node_modules`. Intentionally easy to fork and host
  anywhere (GitHub Pages, Netlify, a static folder).
