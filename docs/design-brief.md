# Design brief — Compact reconfigurable socket mold-former

> Subsystem design thread for the Qadam prosthetic-kit project.
> Status: living document. Figures and targets are provisional.

## 1. Context

Qadam is building open, affordable, field-deployable prosthetic technology for
refugees and other underserved populations. The guiding architectural move is to
**push all intelligence into a smartphone and make the field hardware dumb,
cheap, and nearly unbreakable.**

The socket — the cup that joins the residual limb to the prosthetic — is the
make-or-break interface. A poorly fitted socket causes skin breakdown and device
abandonment. This brief covers the highest-risk subsystem: a single **reusable,
reconfigurable tool that forms the mold for a properly rectified socket** from a
digital limb model.

## 2. What the device has to do

- Take a target (rectified) limb geometry computed on a phone.
- Physically realize that geometry as a forming surface.
- Allow a thermoplastic sheet to be formed over/into that surface.
- Reset and repeat for the next patient — hundreds of times.
- Survive field conditions with no electronics, no firmware, no calibration to a cloud.

## 3. Key design decisions (current lead concept)

### 3.1 Manual, digitally-guided (not motorized)
The app prints the target settings; a technician dials them in by hand. All
electronics stay in the phone. The tool becomes dumb, cheap, and field-repairable.

### 3.2 Reduced-DOF staves + membrane (not a dense pin array)
A handful of flexible longitudinal **staves** with a **membrane** stretched over
them. Limbs are smooth, so ~30–50 hand-set controls capture the geometry that
hundreds of actuated pins would — at a fraction of the cost and failure surface.
Stave placement should be **non-uniform**, clustered anterolaterally where the
rectification gradients (tibial crest, tibial tubercle, fibular head) are steepest.

### 3.3 Drape-and-wrap forming (not full vacuum)
Modest external compression over a heated sheet, instead of full vacuum. This
sidesteps the membrane-sag problem, the sealing problem, and the awkwardness of
venting air through a sealed membrane.

### 3.4 PCL check-socket loop (off-grid)
Low-temperature polycaprolactone (PCL) forms in boiling water in minutes. This
gives a clear, off-grid **trial socket** to verify fit and iterate the
rectification before committing the definitive socket.

> ⚠️ Only the check socket is off-grid. The **definitive polypropylene socket
> needs 150–180 °C** (heat gun / oven, i.e. power). The former's primary
> justification is therefore **reusability and reset speed**, not off-grid
> operation. The bar it must clear: beating "3D-print or CNC-foam a cheap
> rectified positive at the power site you already need for definitive forming."

## 4. The durables / consumables split

This is the economic engine of the project: one durable reusable former serves
hundreds of patients; the only per-patient cost is a sheet of thermoplastic.

## 5. Open questions

See [`research-agenda.md`](research-agenda.md). The membrane stiffness dilemma
and the software fidelity question are the two most likely to determine whether
the stave topology is viable at all.

## 6. De-risking order

Cheapest, most decision-relevant tests first. A pure-software fidelity study
runs on a laptop and can kill the concept before any metal is cut. See the
roadmap for sequencing.
