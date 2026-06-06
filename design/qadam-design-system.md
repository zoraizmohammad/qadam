# Qadam — design system breakdown

A reference for the design language used in `web/index.html`, so it can be
extended consistently. The site is intentionally a **single file with no build
step, no framework, and no runtime dependencies** — all HTML, CSS, and JS live in
`web/index.html`. The only external resource is Google Fonts (with graceful
offline fallback to system fonts).

---

## 1. Aesthetic direction

**Dark "frontier lab."** The reference points are deep-tech / research-lab sites
(SpaceX, OpenAI, Boston Dynamics): near-black backgrounds, a single luminous
accent, restrained motion, and typography that feels engineered. The goal is
credibility + ambition without looking like a clinical brochure.

---

## 2. Color palette

All colors are CSS custom properties declared in `:root`.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#05070d` | Page background (near-black, slightly blue) |
| `--bg-2` | `#080b14` | Secondary background / insets |
| `--panel` | `#0c111d` | Card / panel surface |
| `--line` | `#1b2436` | Borders, dividers, hairlines |
| `--txt` | `#e8edf7` | Primary text |
| `--txt-dim` | `#9aa6bd` | Secondary / body text |
| `--txt-faint` | `#5d6982` | Labels, captions, muted |
| `--accent` | `#39f5c8` | **Signal teal** — primary accent, glow, CTAs |
| `--accent-2` | `#5b8cff` | Deep blue — secondary accent, links in motion |
| `--accent-3` | `#b07bff` | Violet — tertiary accent, gradient endpoint |
| `--warn` | `#ffcf6b` | Amber — "needs power" / risk callouts |

**Usage rules**
- One dominant accent (teal). Blue and violet appear mostly in gradients and
  hover/motion states, never as competing primary CTAs.
- Amber is reserved for honesty/risk signals (the "needs power" badge, the known-
  risks callout). Don't use it decoratively.
- Text uses a 3-step hierarchy (`--txt` → `--txt-dim` → `--txt-faint`) — almost
  never pure white, never pure gray.

**Signature gradient:** `linear-gradient(110deg, --accent, --accent-2 55%, --accent-3)`
used for the hero word, headings-as-accent, and the scroll-progress bar.

---

## 3. Typography

Three families loaded from Google Fonts:

| Family | Use | Weights |
|---|---|---|
| **Space Grotesk** | Headings, brand, buttons, numeric stats | 400–700 |
| **Inter** | Body copy, form inputs | 300–600 |
| **JetBrains Mono** | Eyebrows, section tags, labels, code/terminal | 400–500 |

- Body weight is **300** (light) for an airy, technical feel; emphasis via
  `--txt` color + weight 500, not bold-everywhere.
- Headings use tight tracking (`letter-spacing:-.02em`) and `line-height:1.1`.
- "Eyebrow" labels are mono, uppercase, `letter-spacing:.12–.14em`, accent-colored.
- Fluid sizing via `clamp()` — e.g. hero `clamp(40px,7vw,82px)`, H2 `clamp(30px,4.5vw,50px)`.

---

## 4. Layout & spacing

- Container: `.wrap`, `max-width:1180px`, `padding:0 28px`, centered.
- Section rhythm: `padding:120px 0` (→ `80px` on mobile).
- Section header pattern `.sec-head`: mono accent tag (with a leading hairline) →
  large H2 → dim intro paragraph, capped at `max-width:760px`.
- Grids: device & thesis use 2-col; research uses 3-col; loop uses 4-col; roles
  use 4-col. All collapse predictably at `920px` then `600px`.
- Radii: cards `14–20px`, inputs/buttons `9–11px`, pills `20–30px`.

---

## 5. Components

- **Buttons** `.btn` — `.btn-primary` (solid teal, glow shadow, lifts on hover);
  `.btn-ghost` (transparent, teal border on hover).
- **Cards** — panel gradient `linear-gradient(160–170deg, --panel, #070a12)`, 1px
  `--line` border, hover lifts `translateY(-4..6px)` + accent border.
- **Eyebrow / section tag** — mono uppercase accent label.
- **Pills / badges** — small mono chips; green = off-grid/ok, amber = needs power.
- **Stat block** — gradient numeric (Space Grotesk 700) + faint caption; animated
  count-up on scroll.
- **Form fields** — dark inset `rgba(8,11,20,.7)`, `--line` border, teal focus ring
  `box-shadow:0 0 0 3px rgba(57,245,200,.12)`; custom SVG select chevron.
- **Terminal mock** — `#06080f` panel, traffic-light dots, mono body with colored
  tokens mapped to the accent palette.

---

## 6. Motion & interaction

| Effect | How |
|---|---|
| Scroll progress bar | top gradient bar scaled by scroll fraction |
| Sticky nav | blurs + condenses after 40px scroll (`.scrolled`) |
| Scroll-reveal | `IntersectionObserver` adds `.in` → opacity+translateY; staggered via `.d1–.d6` delays |
| Count-up stats | cubic ease-out, triggered once on 50% visibility |
| Hero background | `<canvas>` particle/network field, mouse-reactive links |
| Device diagram | self-animating SVG: staves bulge in/out via animated quadratic control points |
| Roadmap | tabbed panels (V1/V2/V3), fade-in on switch |
| Marquee | infinite horizontal scroll of principles, masked at edges |
| Scanline / grain | CSS gradient scanline overlay + SVG fractal-noise texture |

**Easing standard:** `--ease: cubic-bezier(.16,1,.3,1)` everywhere for a smooth,
"settled" feel. Durations 0.3s (UI) to 0.9s (reveals).

Respect users: heavy motion is decorative and never blocks content. (A future
improvement: honor `prefers-reduced-motion` — see backlog below.)

---

## 7. "Frontend & backend" architecture

- **Frontend:** 100% static, single HTML file. No React/Vue/bundler. This is a
  deliberate choice — trivially forkable, hostable anywhere, and aligned with the
  project's "dumb, unbreakable" ethos.
- **Backend:** none required. The one dynamic piece is the **get-involved form**,
  which POSTs to a third-party form endpoint (Formspree) via `fetch()`. This keeps
  the site fully static/serverless while still capturing real submissions.
- **Hosting:** GitHub Pages via `.github/workflows/pages.yml`, which publishes the
  `/web` folder on every push to `main`.

---

## 8. Backlog / opportunities

- Add `@media (prefers-reduced-motion: reduce)` to disable canvas + reveals.
- Replace provisional stats/cost numbers with cited figures.
- Optional: self-host fonts for full offline + privacy.
- Optional smooth-scroll inertia (Lenis) and section-pinned scroll storytelling
  (GSAP ScrollTrigger) — see `inspiration/nucleoresearch.md` for the influence.
- Add OpenGraph/Twitter card meta + a favicon/social image.
