# Research agenda — open questions, ranked by risk

Frontier engineering means being honest about what's unproven. These are the
load-bearing assumptions behind the reconfigurable socket former, ordered by how
likely each is to kill the concept. We publish negative results too.

## R-01 — Software fidelity study *(highest leverage, do first)*
Before any metal: take real rectified transtibial scans, sample them as *N* stave
curves at a candidate layout, loft a surface through the curves, and smooth the
surface between staves to model a tensioned membrane. Then compute a
surface-error heat-map against the full rectified shape.

Sweep: stave count *N*, stave placement (uniform vs. clustered anterolaterally),
and control-points-per-stave. Output answers, for free on a laptop:
- Can the topology even hit a millimeter-class target at the bony prominences?
- How many staves does it actually take?
- Where do they need to go?

This also produces the artifact a clinician can react to: "here is the residual
error at *X* staves — is that acceptable?"

## R-02 — The membrane stiffness dilemma *(most likely to bite)*
A tensioned elastomer membrane spanning the gap between staves sags under forming
pressure. Sag depth scales roughly with `(span² × pressure) / (tension × thickness)`.
But tension high enough to resist sag is also high enough to pull the stave tips
inward and distort the shape just set. The membrane cannot simultaneously be
"stretched smooth, no sag" and "low tension, no stave deflection."

Implications to test:
- **Drape-and-wrap over vacuum** — far less pressure on the membrane; sidesteps sealing.
- **Bending-skin vs. stretch membrane** — a thin constant-thickness sheet (spring
  shim, PETG, Delrin) resists local sag by bending stiffness rather than tension.
  It won't stretch for sharp features, but limbs are smooth — the regime where a
  bending skin wins. Put both in the coupon test.

## R-03 — Stave topology & placement
Uniform spacing is probably wrong. The features that prevent skin breakdown —
fibular head, tibial crest, tibial tubercle — cluster anterolaterally. Derive
non-uniform stave layouts from where real rectifications put their sharpest
gradients: denser anterolaterally, sparser posteriorly.

## R-04 — Calibration drift & maintenance
Lead screws and detents develop backlash over thousands of cycles. A non-expert
won't notice slow zero-drift — they'll just start producing subtly wrong sockets.
Treat the **re-zero procedure** and a **physical reference master** (formed
against periodically) as first-class deliverables, not footnotes.

## R-05 — Setting time & cross-coupling (human factors)
24–48 settings in 10–15 minutes is ~20–40 s each for a non-expert — optimistic,
and worse if staves share a spine or couple through the skin. Either mechanically
decouple the staves or enforce a strict setting order, then **validate realistic
timing on non-experts, not on the core team.**

## R-06 — Clinical safety & validation *(the gating risk)*
A non-expert producing a load-bearing socket without a prosthetist present is a
significant safety claim, and the check-socket + pressure-sensing loop meant to
make it safe is itself unproven. A **certified prosthetist (CPO)** must define the
accuracy target and red-flag criteria **early**. No human is fitted until this
loop is validated. The engineering elegance of the former must not pull focus from
validating this loop — it is what a pilot, a funder, and a regulator will
interrogate.
