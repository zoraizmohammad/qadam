<div align="center">

# Qadam · قدم

**An open-source frontier lab for accessible prosthetics & affordable medical technology.**

*Qadam means "a step forward."*

Open hardware · Open methods · Non-profit

</div>

---

## Mission

Qadam builds **affordable, field-deployable** prosthetic and medical technology
for refugees and the world's underserved. Roughly 65 million people need a
prosthetic or orthotic device; only about 1 in 10 has access to one. The barrier
usually isn't the limb — it's everything around it: the clinician, the lab, the
power, the supply chain.

## The thesis

> **Move the intelligence into software. Make the hardware dumb.**

- **Smartphone app + dumb hardware** — all scanning, computation, fit-checking and
  guidance run on a device the user already carries. The field tool has no
  electronics to break, no firmware to update, nothing to calibrate to a cloud.
- **Reusable former + cheap consumable** — one durable, reconfigurable tool serves
  hundreds of patients. The only per-patient cost is a sheet of thermoplastic.
  This durables/consumables split is the economic engine of the whole project.
- **Clinician in the loop, remotely** — a certified prosthetist sets the accuracy
  targets and red-flag criteria the software enforces, so expertise scales without
  a specialist in every tent.

## Flagship device — the reconfigurable socket mold-former

The socket is the make-or-break interface between limb and prosthetic. Our former
is a single reusable tool that takes a digital limb model and reshapes itself into
the mold for a properly rectified socket. Key design calls:

- **Reduced-DOF staves + membrane**, not a dense pin array — ~30–50 hand-set
  controls instead of hundreds of actuated pins.
- **Drape-and-wrap forming**, not full vacuum — sidesteps the membrane-sag and
  sealing traps.
- **Manual, digitally-guided** — the app prints settings; a technician dials them
  in by hand. No motors, no power needed to *shape* a limb.
- **PCL check-socket loop** — an off-grid trial socket (forms in boiling water)
  lets fit be verified and rectification iterated before the definitive socket.

See [`docs/design-brief.md`](docs/design-brief.md) for the full device brief.

## Repository structure

```
qadam/
├── README.md              ← you are here
├── LICENSE                ← MIT
├── .github/workflows/
│   └── pages.yml          ← auto-deploys /web to GitHub Pages on push
├── docs/
│   ├── design-brief.md    ← socket mold-former design brief
│   ├── research-agenda.md ← open questions, ranked by risk
│   └── roadmap.md         ← V1 / V2 / V3 plan
├── design/
│   ├── qadam-design-system.md  ← the site's colors, type, motion, architecture
│   └── inspiration/            ← reference analyses (e.g. nucleoresearch.com)
└── web/
    ├── index.html         ← the project website (single-file, no build step)
    └── README.md
```

## The website

A single-file, dependency-free landing page lives in [`web/`](web/). It presents
the mission, the device, the research agenda, and the V1/V2/V3 roadmap with a
dark "frontier lab" aesthetic and scroll/canvas animations.

**Run it locally:** just open `web/index.html` in any modern browser — there is no
build step. (Fonts load from Google Fonts when online; the page degrades gracefully
offline.)

**Deploy:** pushing to `main` runs [`.github/workflows/pages.yml`](.github/workflows/pages.yml),
which publishes the `/web` folder to GitHub Pages. One-time setup: in the repo's
**Settings → Pages**, set **Source = GitHub Actions**. The site then lives at
`https://<user>.github.io/qadam/`.

**Get-involved form:** the form in the site's "Get involved" section posts to
[Formspree](https://formspree.io) so it works on static hosting with no backend.
One-time setup: create a free Formspree form and replace `YOUR_FORM_ID` in the
form's `action` URL inside `web/index.html`. Until then the form shows a friendly
"not configured yet" message instead of failing silently.

The design language (colors, type, motion, architecture) is documented in
[`design/qadam-design-system.md`](design/qadam-design-system.md).

## Research agenda

We are honest about what's unproven. The open questions, ranked by how likely each
is to kill the concept, live in [`docs/research-agenda.md`](docs/research-agenda.md).
The two that matter most: the **software fidelity study** (can the stave topology
even represent a clinically acceptable surface?) and the **membrane stiffness
dilemma**. The *gating* risk is clinical: a non-expert producing a load-bearing
socket is a serious safety claim, and the safety loop meant to justify it is itself
unproven. **No human is fitted until that loop is validated by a certified prosthetist.**

## Roadmap

- **V1 — Prove the geometry** (bench & simulation, no patients)
- **V2 — Prove it in the field** (CPO-supervised pilot)
- **V3 — Scale & open it up** (full open-hardware release, training, regulatory path)

Details in [`docs/roadmap.md`](docs/roadmap.md).

## Get involved

Qadam is early, open, and looking for engineers, clinicians (especially CPOs),
funders, and field partners. Contributions, issues, and feedback — including
negative results — are welcome.

## License

MIT — see [LICENSE](LICENSE). Hardware designs, when released, will carry an
appropriate open-hardware license.

## Author

Mohammad Zoraiz · <zoraizmohammad@gmail.com>
