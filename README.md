<div align="center">

# Qadam · قدم

**An accessible biotech venture that packs a whole prosthetics clinic into one portable case.**

*Qadam means "a step forward."*

Open hardware · Open methods · Accessible biotech

</div>

---

## Mission

Roughly **65 million people** need a prosthetic or orthotic device; only about
**1 in 10** has access to one. The barrier usually isn't the limb — it's everything
around it: the clinician, the lab, the power, and the supply chain.

Qadam's answer is to make that whole apparatus **portable**. We pack an entire
fitting clinic into one ruggedized, solar-powered carrying case — the phone, the
fitting technology, the tools, and the standardized parts needed to custom-fit
**15–20 prosthetic limbs anywhere**, plus the open IP to make more. The intelligence
lives in the *fitting process*; the limb the patient keeps is **robust, low-cost,
and purely mechanical** — nothing to charge, brick, or break.

## What Qadam is: a prosthetics clinic in a case

Qadam isn't a single limb — it's a deployable system that turns any room into a
fitting clinic. One case produces 15–20 complete below-knee fittings before it needs
a resupply of standardized parts. It splits into three layers:

- **Layer 01 · the reusable fitting toolkit** *(lives in the case forever, sanitized
  between patients)* — a phone/rugged tablet running the offline technician app, a
  pressure-mapping sleeve, a gait/alignment pad, a measurement kit and limb scanner,
  a reconfigurable fitting jig, and basic hand tools.
- **Layer 02 · the per-patient consumables** *(what gets built into each limb — this
  is what depletes, sized for 15–20 builds)* — modular socket blanks in standard
  sizes, pylon tubes cut to length, modular feet/ankle units, liners and cushioning,
  adapters, clamps, and suspension hardware.
- **Layer 03 · power & logistics** *(off-grid and travelable)* — a foldable solar
  panel and power bank, the foam-cut case itself, at-a-glance inventory, and the
  offline IP (build instructions and parametric templates) on the device.

The honest version of the claim: **the reusable fitting tech plus consumables for
15–20 custom fittings** — resupply is just a refill of standardized parts.

## The thesis

> **Put the intelligence in the fitting. Keep the limb robust.**

- **Smart fitting tech + robust mechanical limb** — all scanning, computation,
  fit-checking and guidance run on the phone and reusable sensors inside the case,
  *never in the limb*. The device the patient keeps has no electronics, no firmware,
  and nothing to calibrate to a cloud.
- **Reusable fitting kit + low-cost consumables** — one durable, reconfigurable
  toolkit serves patient after patient. The only per-patient cost is the standardized
  parts built into each limb. This durables/consumables split is the economic engine
  of the whole project.
- **Clinician in the loop, remotely** — a certified prosthetist sets the accuracy
  targets and red-flag criteria the software enforces, so expertise scales without a
  specialist in every tent.

## Flagship device — the reconfigurable socket former

The socket is the make-or-break interface between limb and prosthetic. Our former is
a single reusable tool that takes a digital limb model and reshapes itself into the
mold for a properly rectified socket. Key design calls:

- **Reduced-DOF staves + membrane**, not a dense pin array — ~30–50 hand-set controls
  instead of hundreds of actuated pins.
- **Drape-and-wrap forming**, not full vacuum — sidesteps the membrane-sag and
  sealing traps.
- **Manual, digitally-guided** — the app prints settings; a technician dials them in
  by hand. No motors, no power needed to *shape* a limb.
- **Robust by design** — no electronics in the tool itself: nothing to brick, no
  battery, no firmware, field-serviceable with basic parts.

The fitting tech is used **only for fitting, alignment, and comfort** — it is never
embedded in the final device. See [`docs/design-brief.md`](docs/design-brief.md) for
the full device brief.

## The fitting workflow

Off-grid where it can be, powered only where it must be:

1. **Scan** — the phone camera captures the residual limb and computes the rectified
   target shape. *(off-grid)*
2. **Form a check socket** — a low-temp PCL trial socket forms in boiling water in
   minutes. *(off-grid)*
3. **Verify & iterate** — a pressure-sensing sleeve checks fit against clinical
   thresholds; adjust and re-form until it's right. *(off-grid)*
4. **Form the definitive socket** — the load-bearing polypropylene socket needs
   heat (150–180 °C), i.e. a heat gun or oven. *(needs power — hence the solar panel)*

## Repository structure

```
qadam/
├── README.md              ← you are here
├── LICENSE                ← MIT
├── .github/workflows/
│   └── pages.yml          ← auto-deploys /web to GitHub Pages on push
├── docs/
│   ├── design-brief.md    ← socket former design brief
│   ├── research-agenda.md ← open questions, ranked by risk
│   └── roadmap.md         ← V1 / V2 / V3 plan
├── design/
│   ├── qadam-design-system.md  ← the site's colors, type, motion, architecture
│   ├── image-brief.md          ← image/diagram specs + nano-banana prompts
│   └── inspiration/            ← reference analyses (e.g. nucleoresearch.com)
├── tools/
│   └── nano-banana/       ← AI image-generation (Gemini) setup for site assets
└── web/
    ├── index.html         ← the project website (single-file, no build step)
    ├── assets/            ← favicon, social card, generated imagery
    └── README.md
```

## The website

A single-file, dependency-free landing page lives in [`web/`](web/). It presents the
mission, the carrying-case kit, the device, the research, and the V1/V2/V3 roadmap in
a light-led editorial aesthetic (warm off-white, pastel iridescence, Instrument Serif)
with scroll and SVG animations. The nav and footer link the GitHub repo.

**Run it locally:** just open `web/index.html` in any modern browser — there is no
build step. (Fonts load from Google Fonts when online; the page degrades gracefully
offline.)

**Deploy:** pushing to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml),
which publishes the `/web` folder to GitHub Pages. One-time setup: in the repo's
**Settings → Pages**, set **Source = GitHub Actions**. The site then lives at
`https://<user>.github.io/qadam/`.

**Get-involved form:** the form in the site's "Get involved" section posts to
[Formspree](https://formspree.io) so it works on static hosting with no backend.
One-time setup: create a free Formspree form and replace `YOUR_FORM_ID` in the form's
`action` URL inside `web/index.html`. Until then the form shows a friendly "not
configured yet" message instead of failing silently.

**Imagery:** the on-brand image and diagram plan — including copy-paste generation
prompts and the scroll-driven exploded-view sequences — is documented in
[`design/image-brief.md`](design/image-brief.md). The design language (colors, type,
motion, architecture) is in [`design/qadam-design-system.md`](design/qadam-design-system.md).

## Research

Qadam is a venture, not a lab — but building something this load-bearing means being
honest about what's unproven, and **every fitting we do feeds the data that improves
the next one.** The open questions, ranked by how likely each is to kill the concept,
live in [`docs/research-agenda.md`](docs/research-agenda.md). The two that matter
most: the **software fidelity study** (can the stave topology even represent a
clinically acceptable surface?) and the **membrane stiffness dilemma**. The *gating*
risk is clinical: a non-expert producing a load-bearing socket is a serious safety
claim, and the safety loop meant to justify it is itself unproven. **No human is
fitted until that loop is validated by a certified prosthetist.**

## Roadmap

- **V1 — Prove the geometry** (bench & simulation, no patients)
- **V2 — Prove it in the field** (CPO-supervised pilot)
- **V3 — Scale & open it up** (full open-hardware release, training, regulatory path)

Details in [`docs/roadmap.md`](docs/roadmap.md).

## Get involved

Qadam is early, open, and looking for engineers, clinicians (especially CPOs),
funders, and field partners. Contributions, issues, and feedback — including negative
results — are welcome.

## License

MIT — see [LICENSE](LICENSE). Hardware designs, when released, will carry an
appropriate open-hardware license.

## Author

Mohammad Zoraiz · <zoraizmohammad@gmail.com>
