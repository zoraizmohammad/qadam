# Qadam website design system

The website is a clear introduction to an early research project. Its design
should help visitors understand the proposal, assess its current stage, and find
the actual work. It should not imply a mature clinical product.

## Visual direction

Use a warm paper background, dark ink text, and a restrained teal accent. Prefer
plain surfaces, fine dividers, and generous but purposeful spacing. Establish a
visual hierarchy through typography and layout before adding decoration.

Avoid decorative gradient fields, glass panels, glow effects, a moving marquee,
count-up statistics, pulsing markers, fake terminals, and a floating duplicate
contact button. These effects compete with the subject and add motion without
explaining it.

## Typography and readability

- Use Georgia for display and section headings, with a serif fallback.
- Use the operating system's sans-serif font for body text, controls, and labels.
- Do not request remote fonts; text should render immediately and remain usable
  on a limited connection.
- Keep paragraphs to a readable line length and use a small, consistent type scale.
- Give supporting text sufficient contrast. Faint text is not a substitute for
  hierarchy, especially for status, labels, and image captions.
- Make link purpose clear from its text and keep keyboard focus visible.

The exact colors, spacing, and responsive rules are defined in `web/styles.css`.
Treat that file as the source of truth for implementation tokens.

## Page structure

1. A concise headline and explanation, development-stage label, concept image,
   and primary route into the project.
2. The proposed kit, separated into reusable tools, per-person parts, and power.
3. The proposed workflow in four readable steps.
4. Current work, planned milestones, and the most important open questions.
5. A route to the About page and the four people behind Qadam.
6. A working contact route and links to the real repository and documentation.

Keep detailed engineering arguments in the research documents. Avoid repeating
the same thesis across several equally prominent sections.

## Imagery and evidence

Visible captions must identify concept renders as concepts. A generated pressure
illustration is not measured pressure data. Measured results should link to their
method, units, and source files; never add simulated terminal output that appears
to report a successful test.

Prefer documented CAD, annotated sketches, real bench photographs, and measured
results when they exist. Use consistent viewpoints if a comparison requires two
images. Do not crossfade unrelated renders to imitate an unpacking animation.

Set intrinsic image dimensions, choose an efficient file format, and load images
below the first viewport lazily where appropriate. Keep alt text useful without
duplicating an entire caption.

## Interaction and accessibility

- Keep essential content visible before JavaScript runs.
- Give small screens an accessible navigation route rather than hiding links.
- Use native links, buttons, form controls, and disclosure elements where useful.
- Ensure all interactive behavior works with a keyboard and touch; do not rely
  on hover to expose essential information.
- Honor `prefers-reduced-motion`. Keep other transitions brief and purposeful.
- Avoid automatic animations that compete with a control while someone uses it.
- Associate form labels and status messages with the correct controls, preserve
  entered values on failure, and report success only after the backend accepts
  the message.

## Implementation and delivery

Source stays in `web/index.html`, `web/about.html`, `web/styles.css`,
`web/app.js`, and `web/config.js`. The Node build produces a separate `dist/` folder with content
fingerprints in local asset filenames. There is no frontend framework, remote
font dependency, or service worker.

Cache fingerprinted files for a long time on hosts that support custom headers.
HTML and public backend configuration should revalidate. Never cache contact
submissions. See the root README for deployment and Supabase setup.

## Editorial rules

Describe the kit as proposed or in development until validation demonstrates
otherwise. Separate project intentions from published assets and finished work.
Label targets next to the associated claim, cite external figures, and identify
who is responsible for the project. Prefer concrete language over pitch phrases.

Earlier image briefs and inspiration notes are historical reference material;
they are not instructions to restore the previous gradient-heavy design.
