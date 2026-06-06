# Inspiration analysis — nucleoresearch.com

> **Status: BLOCKED — awaiting source material.**
> This session could not reach `nucleoresearch.com`: the network proxy blocks the
> domain for both page fetches and screenshots (screen capture is disabled here).
> So the specifics below are **not yet filled in** — I won't guess at that site's
> real colors/fonts/stack and present them as fact. This file is the structured
> template; fill it (or hand me the material and I will).

---

## What to give me so I can complete this

Any one of these unblocks the analysis. More is better.

1. **Screenshots** — full-page captures of the homepage (desktop + mobile), plus
   close-ups of the hero, a couple of mid sections, and the footer. A short screen
   recording of the scroll is gold for judging motion.
2. **Page source** — in the browser: right-click → *View Page Source* (or
   `Cmd/Ctrl+U`), select all, paste into a file and drop it in this folder. Even
   better, *Save Page As → "Webpage, Complete"* to capture the CSS/JS too.
3. **Network/stack hints** — DevTools → *Network* tab → reload → tell me the
   script/host names you see (or screenshot it). DevTools → *Sources* often reveals
   the framework. Or paste the output of the "Wappalyzer" extension.

---

## Analysis template (to fill once material is in)

### A. First impression
- One-line vibe: ____
- What feeling does it create in the first 3 seconds? ____

### B. Color
- Background(s): `#______`
- Primary accent: `#______`  · Secondary: `#______`
- Text colors (hierarchy): ____
- Use of gradients / glow / duotone: ____

### C. Typography
- Heading font: ____ (weights ____)
- Body font: ____ (weights ____)
- Mono/label font, if any: ____
- Font service (Google Fonts / Adobe / self-hosted): ____
- Notable type treatments (oversized hero, tight tracking, mixed case): ____

### D. Layout & sections (in order)
1. ____
2. ____
3. ____
(…capture each section's headline + purpose)

### E. Motion & interaction
- Smooth-scroll / inertia? (Lenis, Locomotive): ____
- Scroll-triggered reveals / pinning? (GSAP ScrollTrigger): ____
- 3D / WebGL? (Three.js, R3F, Spline): ____
- Lottie / video / canvas?: ____
- Cursor effects, hover states, marquees: ____

### F. Tech stack (from source / network)
- Framework / generator: ____ (look for `<meta name="generator">`, `__next`,
  `data-framer-*`, Webflow classes, `_nuxt`, Vite hashes)
- Hosting/CDN hints: ____
- Key libraries (script src URLs): ____

### G. What to borrow for Qadam (and what NOT to)
- Borrow: ____
- Skip (off-brand for an accessible-medical nonprofit): ____

---

## General reference: the "frontier research lab" pattern

While we wait for the real capture, here are the conventions sites in this genre
*typically* share — useful as a build checklist, but treat as generic patterns,
**not** claims about nucleoresearch.com specifically:

- **Near-black canvas, one electric accent**, lots of negative space.
- **Oversized, tightly-tracked display type** for the hero; small mono labels as
  "eyebrows."
- **Smooth inertial scrolling** (Lenis/Locomotive) and **scroll-pinned sections**
  (GSAP ScrollTrigger) that animate as you pass them.
- **A hero focal piece**: WebGL/Three.js object, shader gradient, or looping video.
- **Restrained, "expensive" motion** — slow eases, subtle parallax, nothing bouncy.
- **Grain/noise overlay** and soft radial glows to avoid flat black.
- Often built on **Framer, Webflow, or Next.js + React** with **Vercel/Netlify** hosting.

### How Qadam already aligns, and where it could push further
Qadam's current site already hits: dark canvas + single teal accent, mono eyebrows,
oversized clamp() hero, scroll-reveal, canvas particle hero, grain + glow. The most
likely upgrades to match a top-tier lab site are:

1. **Inertial smooth scroll** — add Lenis (`~3kb`) for that weighty glide.
2. **Scroll-pinned storytelling** — GSAP ScrollTrigger to pin the device diagram
   and reveal its callouts one-by-one as you scroll.
3. **A WebGL hero moment** — e.g. a subtle shader gradient or a 3D limb/socket mesh
   behind the headline (Three.js is already permitted in the stack).
4. **`prefers-reduced-motion`** support so all of the above degrades gracefully.

Once you drop in screenshots or the source, I'll fill sections A–G with the real
specifics and turn "what to borrow" into a concrete diff against `web/index.html`.
