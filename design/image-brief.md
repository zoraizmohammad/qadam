# Qadam — Image & Diagram Brief

A complete, build-ready spec for every image the website needs: **what to make, where
it goes, why it exists, exact dimensions, and a copy-paste prompt written for
nano-banana (Gemini 2.5 Flash Image).**

All assets live in [`../web/assets/`](../web/assets/) and are referenced from
`web/index.html` with relative paths.

---

## How to use this brief with nano-banana

1. **Generate the hero case shot first** (Image 01). It defines the look. Once you
   like it, feed it back in as a *reference/style image* for the others so the whole
   set feels like one family. Reusing the same case render across images is ideal.
2. **Paste the prompt blocks verbatim.** Each one already ends with the shared
   **Style Anchor** so you don't have to remember it.
3. **Aspect ratio matters more than pixel count** in nano-banana — request the ratio
   listed, then export/downscale to the target pixels.
4. **About text in images:** image models render text badly. For anything with
   labels (the cutaway, the loop, the technical diagrams), generate the *illustration
   only, no text*, then I'll overlay crisp labels in SVG/HTML afterward — or I can
   build those diagrams entirely as on-brand SVG. Those images are flagged
   **🔧 illustration-only** below.

### Shared Style Anchor (already appended to every prompt)

> Visual style: clean, editorial, light-led aesthetic inspired by modern biotech
> branding — soft 3D product-render / soft studio photography. Warm off-white
> background (#f4f2ed). Soft diffuse lighting, gentle long shadows. A dreamy pastel
> iridescent atmosphere — subtle gradients of aqua (#a4e8df), soft pink (#f9cbd9),
> periwinkle (#c2c9f7) and lilac (#dcc6f0), like light through frosted glass — never
> neon, never oversaturated. Minimal composition, generous negative space, premium,
> hopeful, human, not cold or clinical. High detail, photoreal-but-soft, shallow
> depth of field. No text, no logos, no watermarks, no UI chrome.

### Global negative prompt (use if the tool supports it)

> harsh neon colors, dark moody lighting, cluttered background, text, captions,
> labels, logos, watermarks, distorted or extra limbs, gore, medical sterility,
> stock-photo cheesiness, low resolution, jpeg artifacts.

### Brand palette (for reference / overlays)

| token | hex | use |
|---|---|---|
| paper | `#f4f2ed` | background base |
| ink | `#15161b` | text / line work |
| black | `#0a0a0c` | dark sections |
| aqua (p2) | `#a4e8df` | iridescence |
| pink (p1) | `#f9cbd9` | iridescence |
| periwinkle (p3) | `#c2c9f7` | iridescence |
| lilac (p4) | `#dcc6f0` | iridescence |

Type, if rendering any mockups: **Instrument Serif** (display), **Inter** (body),
**JetBrains Mono** (labels).

---

## Priority order

| # | Asset | Section | Type | Priority |
|---|---|---|---|---|
| 01 | Hero case shot | Hero | 📸 AI render | ★★★ must-have |
| 02 | Case cutaway / "what's in the case" | 02 The Kit | 🔧 illustration-only | ★★★ must-have |
| 03 | Fitting-loop flow | 04 The fitting loop | 🔧 illustration-only | ★★ high |
| 04 | Device cutaway (socket former) | 03 The device | 🔧 illustration-only | ★★ high |
| 05 | Stave-topology cross-section | 05 / 08 research | 🔧 illustration-only | ★★ high |
| 06 | Membrane-sag dilemma | 08 Q-02 | 🔧 illustration-only | ★ nice |
| 07 | Surface-error heatmap | 08 Q-01 | 🔧 illustration-only | ★ nice |
| 08 | OG / social card refresh | `<head>` meta | 📸 AI + text overlay | ★★ high |
| 09 | In-field deployment scene | Hero alt / About | 📸 AI render | ★ nice |
| EX-01 | Case **explode** scroll-sequence | 02 The Kit | 🎞️ keyframes → scroll-scrub | ★★★ signature |
| EX-02 | Former **explode / how-it-works** scroll-sequence | 03 The device | 🎞️ keyframes → scroll-scrub | ★★ high |

> 🔧 = I recommend I build these as SVG (crisp labels, exact geometry). nano-banana
> can still make beautiful *backdrops/illustrations* for them — just text-free.
>
> 🎞️ = scroll-driven exploded animations. nano-banana makes the **start & end
> frames** (assembled → exploded); the in-between motion + per-part highlighting is
> built on the site. Full spec in **"Scroll-driven exploded sequences"** below.

---

## 01 — Hero case shot  📸 ★★★

- **File:** `web/assets/hero-case.png`
- **Where:** Top of the hero section, beside the headline (we'll split the hero into
  text-left / image-right). This is the single most important asset — it makes the
  "a prosthetics clinic in a case" idea instantly real.
- **Dimensions:** 1600 × 1200 px (4:3), transparent or paper-colored background.
- **Purpose:** Show the whole value prop in one frame — an open, portable case packed
  with everything needed to fit a prosthetic anywhere.

**Prompt:**
> A premium open hard-shell carrying case photographed from a high three-quarter
> angle on a warm off-white surface. The case is the size of a large pelican/travel
> case, opened flat like a clamshell. Inside, neatly arranged in custom dark-grey
> foam cut-outs: a rugged smartphone or small tablet standing upright; a folded
> compact solar panel; a soft fabric fitting sleeve; rows of modular prosthetic
> components — a few cup-shaped socket blanks in graduated sizes, two prosthetic
> foot/ankle units, several short aluminum pylon tubes, and small clamps and
> adapters. Everything tidy, labelled by empty foam slots, premium industrial
> design, matte finishes, hints of soft brushed metal. The lid interior holds a
> reconfigurable fitting tool. A faint pastel iridescent glow rises from inside the
> case like soft light. Hopeful, humanitarian-tech feeling. Centered product hero
> composition with empty space on the upper left for a headline.
>
> [Style Anchor]

**Notes:** Keep the upper-left ~35% relatively empty/clean so the headline overlays
cleanly. If a person is included, only hands — no faces (avoids distortion + keeps
focus on the case).

---

## 02 — Case cutaway / "what's in the case"  🔧 ★★★

- **File:** `web/assets/case-cutaway.png` (illustration) → labels added in SVG/HTML
- **Where:** Section **02 — What's in the case**, replacing or sitting beside the
  three "layer" cards (or above them as an overview).
- **Dimensions:** 1600 × 1000 px (16:10).
- **Purpose:** The workhorse explainer — shows the three layers (reusable fitting
  toolkit / per-patient consumables / power & logistics) as physical zones in the case.

**Prompt (illustration only — no text):**
> A clean top-down "knolling" flat-lay of an open travel case organized into three
> distinct zones, on a warm off-white background. Zone one: reusable fitting tools —
> a phone, a fabric pressure sleeve, a flat sensor pad, calipers and a tape measure,
> a small heat gun, hand tools, arranged in foam. Zone two: rows of per-patient
> parts — graduated cup-shaped socket blanks, short pylon tubes, two prosthetic
> feet, liners, small adapters and clamps. Zone three: a folded solar panel and a
> power bank with a short cable. Each zone subtly tinted with a different pastel wash
> (aqua, pink, periwinkle) to separate them. Perfectly organized, soft shadows,
> editorial product photography from directly overhead. Leave thin empty margins
> around each zone for labels to be added later.
>
> [Style Anchor]

**Notes:** Ask for it *top-down and evenly lit* so I can place callout labels and a
3-color legend on top. I can do this entirely as SVG if you'd rather have exact
labels baked in.

---

## 03 — Fitting-loop flow  🔧 ★★

- **File:** `web/assets/fitting-loop.png` (or SVG)
- **Where:** Section **04 — The fitting loop**, above or behind the four step cards.
- **Dimensions:** 1800 × 700 px (wide, ~18:7).
- **Purpose:** Show the 4-step process — Scan → Form check socket → Verify & iterate
  → Form definitive socket — and visually mark which steps are off-grid vs. need power.

**Prompt (illustration only — no text):**
> Four soft 3D isometric vignettes in a horizontal row on a warm off-white
> background, connected by a thin flowing line with gentle arrows. Vignette 1: a
> hand holding a phone scanning a residual lower leg, faint scan grid. Vignette 2: a
> translucent plastic trial socket being shaped on a small reconfigurable tool, with
> a kettle of hot water nearby. Vignette 3: a leg wearing a socket with a thin
> pressure-sensing sleeve, soft heat-map glow on the surface. Vignette 4: a finished
> matte socket being heat-formed with a heat gun, small power/solar icon. The first
> three vignettes glow soft aqua-green (off-grid); the fourth glows warm
> amber/orange (needs power). Minimal, premium, lots of breathing room between
> steps. Leave space beneath each vignette for a caption.
>
> [Style Anchor]

**Notes:** The aqua-vs-amber coding matches the live "off-grid / needs power" badges
in that section. Strong SVG candidate.

---

## 04 — Device cutaway (the socket former)  🔧 ★★

- **File:** `web/assets/device-cutaway.png`
- **Where:** Section **03 — The device**, as a still companion to the existing
  animated SVG (e.g. a "how it works" cutaway).
- **Dimensions:** 1200 × 1200 px (1:1).
- **Purpose:** Explain the reconfigurable stave-and-membrane former: flexible
  longitudinal staves with a membrane stretched over them, forming a socket around a
  limb.

**Prompt (illustration only — no text):**
> A clean technical cutaway render of a cylindrical device: roughly 9–12 flexible
> vertical ribs (staves) arranged in a ring, with a smooth stretched membrane skin
> draped over them forming a tapered socket shape. A faint translucent residual
> lower-leg limb sits centered inside. Small hand-set adjustment screws sit at the
> base of each stave. Half the membrane is cut away to reveal the staves underneath.
> Soft pastel iridescent material, matte and premium, floating on a warm off-white
> background with a soft shadow. Engineering-elegant, calm, precise. Leave clear
> space around the device for callout labels.
>
> [Style Anchor]

---

## 05 — Stave-topology cross-section  🔧 ★★

- **File:** `web/assets/stave-topology.png` (strong SVG candidate)
- **Where:** Section **05 research** or **08 Q-04** ("Can 8–12 circumferential
  samples capture a 2–3 cm fibular-head relief?").
- **Dimensions:** 1200 × 1200 px (1:1).
- **Purpose:** Show *non-uniform* stave placement — dense anterolaterally over the
  bony prominences (fibular head, tibial crest, tibial tubercle), sparse posteriorly.

**Prompt (illustration only — no text):**
> A clean medical cross-section diagram of a below-knee residual limb, viewed from
> above as a rounded organic cross-section on a warm off-white background. Two bone
> shapes inside (a larger tibia toward the front, a smaller fibula to the side).
> Small dots (staves) are placed evenly around the outer ring in some areas but
> clustered densely along the front-and-side arc near the bony prominences, and
> spaced sparsely along the back. Subtle pastel pressure-relief glows over the bony
> spots. Soft, elegant, scientific-illustration quality, gentle pastel palette,
> minimal. Leave a clean margin for anatomical labels.
>
> [Style Anchor]

**Notes:** This one really benefits from exact labels (fibular head, tibial crest,
etc.) — recommend SVG, or AI illustration + SVG labels.

---

## 06 — Membrane-sag dilemma  🔧 ★

- **File:** `web/assets/membrane-sag.png` (SVG candidate)
- **Where:** Section **08 — Q-02** ("Can a tensioned skin stay smooth without
  distorting the staves?").
- **Dimensions:** 1400 × 700 px (2:1) — two panels side by side.
- **Purpose:** Visualize the coupled trade-off: too slack → membrane sags between
  staves; too taut → stave tips pulled inward and shape distorts.

**Prompt (illustration only — no text):**
> Two simple side-by-side diagrams on a warm off-white background. Left panel: two
> vertical posts with a skin/membrane stretched between them that visibly droops and
> sags in the middle under downward pressure arrows. Right panel: the same two posts
> with a very taut membrane that pulls the tops of the posts inward, bending them
> toward each other. Clean line-art with soft pastel fills (aqua and pink), minimal,
> diagrammatic, lots of white space, elegant scientific illustration. Leave room
> above each panel for a short caption.
>
> [Style Anchor]

---

## 07 — Surface-error heatmap  🔧 ★

- **File:** `web/assets/error-heatmap.png`
- **Where:** Section **08 — Q-01** ("Can the topology hit a millimeter-class target —
  in software alone?").
- **Dimensions:** 1200 × 1200 px (1:1).
- **Purpose:** Convey that you do real geometry analysis — a residual-error heat-map
  of the formed surface vs. the ideal rectified shape.

**Prompt (illustration only — no text):**
> A soft 3D render of a below-knee socket / limb surface covered in a smooth
> color-gradient heat-map showing surface deviation — mostly calm cool aqua and
> periwinkle (low error) with a few small warmer pink/coral hot-spots near the bony
> prominences. Floating on a warm off-white background with a soft shadow, faint
> contour iso-lines across the surface, scientific-visualization quality, premium and
> clean. Leave space beside it for a small legend/colorbar.
>
> [Style Anchor]

**Notes:** Keep the palette inside your brand (aqua→periwinkle→pink) rather than a
classic blue-red heatmap, so it matches the site. Easy to fake convincingly; the
*real* one would come out of your fidelity sim later.

---

## 08 — OG / social card refresh  📸 ★★

- **File:** `web/assets/og-image.png` (replaces existing)
- **Where:** Open Graph / Twitter meta tags in `<head>`.
- **Dimensions:** **exactly 1200 × 630 px** (hard requirement for social).
- **Purpose:** Update the share card to the new "a prosthetics clinic in a case"
  message. Headline text should be added as a crisp overlay (not generated).

**Prompt (background illustration only — text added after):**
> A wide, calm hero composition on a warm off-white background: an open premium
> carrying case on the right third, packed with neatly organized prosthetic
> components, a phone, and a folded solar panel, glowing softly with pastel
> iridescence. The left two-thirds is clean, softly graded pastel space (aqua to
> pink to periwinkle) intentionally left empty for a headline. Editorial,
> aspirational, lots of negative space, soft studio light.
>
> [Style Anchor]

**Notes:** After generating, I'll overlay the headline **"A prosthetics clinic in a
case."** in Instrument Serif + a small "Qadam" mark, exactly like the current card,
so the text stays razor-sharp.

---

## 09 — In-field deployment scene  📸 ★

- **File:** `web/assets/field-scene.png`
- **Where:** Optional — an "in the field" band, the About/involved area, or a
  secondary hero.
- **Dimensions:** 1600 × 1000 px (16:10).
- **Purpose:** Humanize the mission — show the case actually being used to fit someone.

**Prompt:**
> A warm, hopeful documentary-style scene in a simple, bright room or tent: a
> technician kneeling beside an open Qadam carrying case, using a phone and a
> fitting sleeve to fit a below-knee prosthetic for a seated patient. Natural soft
> daylight, dignified and calm, focus on hands and the case rather than faces. Folded
> solar panel visible. A faint pastel iridescent warmth in the light. Respectful,
> non-clichéd humanitarian tech, premium editorial photography, shallow depth of
> field.
>
> [Style Anchor]

**Notes:** Keep faces soft/turned or out of frame to avoid distortion and to keep it
dignified. Avoid anything that looks like a stock "charity" cliché.

---

## Scroll-driven exploded sequences  🎞️ (the signature interaction)

The idea: a sticky "showcase" section where, **as the visitor scrolls, the object
explodes apart** to reveal everything inside — the case fanning open to show all its
parts, or the socket-former separating to show how it works — and **each part lights
up / gets labelled in turn** as it comes into view. Scrolling back up re-assembles it.

This is the most memorable thing on the site, so it's worth doing right. You generate
the **start frame (fully assembled)** and **end frame (fully exploded)** in
nano-banana; the motion and highlighting are built on top. There are two production
routes — pick per asset.

### Route A — Layered parts (best quality, fully interactive) ✅ recommended

Each part is its own transparent-background image; the explode, the camera, and the
highlights are all done in CSS/JS. Crisp at any size, real per-element highlighting,
clickable, accessible, tiny file size. More asset prep, but the best result.

**What to ask nano-banana for:** the assembled hero render **plus each component
rendered in isolation on a transparent (or pure white) background, from the exact
same camera angle and lighting.** Example for the case:

> Generate these as a matched set, identical camera angle (high three-quarter),
> identical soft lighting and pastel iridescent style, each on a transparent
> background, no shadows baked in:
> 1) the closed/assembled carrying case;
> 2) the empty case shell alone;
> 3) the phone/tablet alone;
> 4) the folded solar panel alone;
> 5) the fitting sleeve alone;
> 6) a socket blank alone;
> 7) a prosthetic foot unit alone;
> 8) a bundle of pylon tubes alone;
> 9) the adapters/clamps cluster alone;
> 10) the reconfigurable fitting tool alone.
>
> [Style Anchor]

Then I stack them in a sticky section, give each part a scroll-linked transform
(translate/rotate/scale outward), and fade in a label + soft pastel glow on the
"active" part as the scrubber passes its range. Files: `web/assets/explode/case/01.png …`.

### Route B — Two keyframes → interpolated video → scroll-scrub (your described method)

Exactly what you outlined: nano-banana makes **frame A (assembled)** and **frame B
(exploded)**; an image-to-video model that supports *first-frame + last-frame
conditioning* (e.g. Runway Gen-3, Kling, Luma, Pika) tweens the explosion; we export
a short clip as a **numbered frame sequence (PNG/JPG)** and scrub it on scroll so the
explosion is tied 1:1 to scroll position. Label overlays fade in at known scroll %.
Fastest to a "wow," but highlighting is approximate (overlaid, not true per-object)
and frame sequences are heavier to load.

**The golden rule for the two keyframes:** they must be *the same render, only moved.*
Same camera, same focal length, same framing, same lighting, same parts — only the
spacing changes. The cleanest way: generate frame A, then feed frame A back in as a
reference image for frame B with a prompt like the ones below.

### EX-01 — Case explode sequence

- **Files:** `web/assets/explode/case-start.png`, `…/case-end.png` (+ optional
  per-part set for Route A) → frame sequence `…/case/0001.jpg …`
- **Where:** Section **02 — What's in the case**, as a tall sticky section.
- **Dimensions:** 1600 × 1200 (4:3); keep the object centered with margin so parts
  don't clip when they fan out.

**Start frame (A) prompt:**
> A premium closed/just-opened carrying case, centered on a warm off-white
> background, high three-quarter angle, soft studio light, faint pastel iridescence,
> all components packed neatly inside. Generous empty margin on all sides.
>
> [Style Anchor]

**End frame (B) prompt — pass frame A as reference image:**
> The exact same carrying case, identical camera angle, lighting and style as the
> reference image, now shown as a clean **exploded view**: the lid, the shell, the
> phone, the folded solar panel, the fitting sleeve, the socket blanks, the
> prosthetic foot, the pylon tubes, and the adapters all separated and floating apart
> with even spacing between them, as if gently pulled outward in mid-air. Each part
> fully visible and not overlapping. Same warm off-white background, same soft
> shadows, same pastel iridescent glow.
>
> [Style Anchor]

### EX-02 — Former explode / how-it-works sequence

- **Files:** `web/assets/explode/former-start.png`, `…/former-end.png`
- **Where:** Section **03 — The device**, sticky section (can replace or sit under
  the existing animated SVG).
- **Dimensions:** 1200 × 1400 (vertical) so the staves have room to separate.
- **Purpose:** Show how the reconfigurable former works — the membrane lifting off,
  the staves fanning out from the ring, the adjustment screws revealed, the limb
  inside.

**Start frame (A) prompt:**
> A cylindrical socket-former device, assembled, centered on a warm off-white
> background, three-quarter angle, soft light, pastel iridescent matte materials,
> membrane skin stretched smoothly over the staves. Generous margin.
>
> [Style Anchor]

**End frame (B) prompt — pass frame A as reference image:**
> The exact same socket-former, identical camera angle, lighting and style as the
> reference image, now as an **exploded view**: the membrane skin lifted up and away
> at the top, the ~10 flexible staves separated outward in a fan from the central
> ring, the base adjustment screws pulled out below, and a faint translucent
> residual-limb shape floating in the center. Even spacing, nothing overlapping,
> same warm off-white background and soft pastel glow.
>
> [Style Anchor]

### Optional middle frames (smoother scrub, either route)

For Route B you can also generate a **half-exploded frame (C)** to anchor the
interpolation midpoint (parts ~50% separated, same camera). Three keyframes (A→C→B)
give the video model a much more stable, even explosion than A→B alone.

### Per-part highlight & label plan (what scroll reveals, in order)

As the visitor scrolls through the sticky section, the explosion progresses and each
part becomes the "active" one — glowing softly and showing a short label. Suggested
reveal order for the case (EX-01): **① the case shell → ② phone (the brain) → ③
fitting sleeve & sensor pad → ④ socket blanks → ⑤ foot & pylon → ⑥ adapters/liners →
⑦ solar panel & power bank.** For the former (EX-02): **① membrane → ② staves → ③
adjustment screws → ④ the limb inside.** Give me this order and I'll wire the
scroll-linked highlighting and labels to it.

### What I need from you vs. what I'll build

- **You (nano-banana, on your Mac):** the start & end frames (and optional middle
  frame) per sequence — and, if we go Route A, the isolated per-part images. Same
  camera/lighting every time; pass frame A as a reference for frame B.
- **You (image-to-video, Route B only):** run A→B (or A→C→B) through a first/last-
  frame video model and export a numbered frame sequence (~48–90 frames).
- **Me (on the site):** the sticky scroll-scrub section, the scroll-to-progress
  mapping, per-part highlight glows, the labels and their reveal order, reduced-motion
  fallback (show the static exploded frame), and lazy-loading so it stays fast.

**My recommendation:** do **Route A for the case (EX-01)** — the per-part highlighting
is the whole point and Route A nails it — and **Route B for the former (EX-02)** if you
want a quick cinematic explode without prepping every stave separately.

---

## Consistency checklist

- [ ] Same warm off-white (#f4f2ed) background across all renders.
- [ ] Same pastel iridescence (aqua/pink/periwinkle/lilac), soft never neon.
- [ ] The *same* case design appears in 01, 02, 08, 09 (generate 01 first, reuse it
      as a reference image).
- [ ] Matte, premium, humane — not cold/clinical, not cluttered.
- [ ] Illustration-only on the 🔧 items; labels added later in SVG/HTML.
- [ ] Explode keyframes (🎞️): start & end frames share identical camera, focal
      length, lighting and parts — only spacing changes (pass frame A as reference).
- [ ] OG card is exactly 1200 × 630; everything else exported at the listed size.

## What I can build for you directly (no nano-banana needed)

The 🔧 items — case cutaway (02), fitting-loop flow (03), device cutaway (04),
stave-topology (05), membrane-sag (06), and error-heatmap (07) — I can produce as
crisp, on-brand **SVG** figures with exact labels that match the site's type and
palette. The 📸 items (01, 08, 09) are the ones to run through nano-banana on your
Mac. Tell me which you want me to start on.
