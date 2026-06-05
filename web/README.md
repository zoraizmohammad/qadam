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

Sections: hero, thesis, the device, the fitting loop, research agenda, an
interactive V1/V2/V3 roadmap, open source, a candid "known risks" callout, and
get-involved. Animations: a mouse-reactive particle/network background, a
self-animating SVG of the stave former, scroll-reveal transitions, count-up
stats, and tabbed roadmap panels.

## Notes

- The stat figures and cost targets in the hero/open-source sections are
  **provisional placeholders** — update them as real numbers land.
- No frameworks, no bundler, no `node_modules`. Intentionally easy to fork and host
  anywhere (GitHub Pages, Netlify, a static folder).
