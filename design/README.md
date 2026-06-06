# design/

Design documentation for the Qadam website and its visual language.

## Contents

- **[`qadam-design-system.md`](qadam-design-system.md)** — the full breakdown of
  the design language used in `web/index.html`: color tokens, typography, layout,
  components, motion, and the (intentionally serverless) frontend/backend
  architecture. Start here to extend the site consistently.

- **[`inspiration/`](inspiration/)** — reference analyses of sites we're drawing
  from.
  - [`nucleoresearch.md`](inspiration/nucleoresearch.md) — analysis of
    nucleoresearch.com. **Currently blocked** (the site can't be reached from the
    build environment and screen capture is disabled), so it's a structured
    template plus instructions for what to provide. Drop screenshots or the page
    source into `inspiration/` and it can be completed.

## How to add a new inspiration analysis

1. Save screenshots and/or the saved page source into `inspiration/<site>/`.
2. Copy the template structure from `nucleoresearch.md`.
3. Fill sections A–G, then add a "what to borrow for Qadam" section with concrete,
   actionable changes mapped to `web/index.html`.
