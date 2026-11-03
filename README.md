# Qadam · قدم

**A prosthetics clinic in a case.**

Qadam is an early research project exploring a portable prosthetics fitting kit
for settings with limited equipment and power. The proposal puts scanning,
measurement, and fitting tools in a reusable case while keeping the prosthetic
limb mechanical and repairable. *Qadam* means "a step forward."

## Current stage

This repository contains the project website, design brief, research agenda,
and proposed roadmap. It does **not** contain a validated fitting device, a
released fitting app, or clinical trial results. Website illustrations are
concept renders, not photographs of a working product or measured results.

The website includes an [About page](web/about.html) explaining the humanitarian
motivation and introducing Mohammad Zoraiz, Hala Kannan, Jad Bargouti, and
Nizar Alsaidi using the portraits they provided. Individual roles and
biographies have not been assigned without confirmation.

Capacity, cost, fitting accuracy, and the off-grid power budget remain design
targets to investigate. The next technical question is whether a manually
adjustable stave-and-membrane former can reproduce an acceptable target surface.
Clinical accuracy criteria and any work involving patients require qualified
prosthetist involvement and appropriate validation.

- [Design brief](docs/design-brief.md): proposed socket-former architecture.
- [Research agenda](docs/research-agenda.md): unresolved questions and risks.
- [Roadmap](docs/roadmap.md): proposed bench study, supervised pilot, and release.

## The proposed kit

The concept separates three things:

1. **Reusable fitting equipment:** a phone or tablet, measurement tools, a
   manually adjustable former, and proposed fit-verification equipment.
2. **Per-person parts:** socket material, pylons, feet, liners, and connecting
   hardware, replenished as they are used.
3. **Power and transport:** a protective case and a proposed solar/battery supply.
   Heating the definitive socket material requires energy; portability does not
   remove that requirement.

The proposed workflow is scan, form a trial socket, verify and adjust the fit,
then form the definitive socket. The research documents describe hypotheses and
planned tests rather than a procedure ready for clinical use.

## Run the website

Use Node.js 22 or later. The static site has no runtime framework or external
font dependency, and the build uses Node's standard library.

```sh
npm run dev
```

Open `http://127.0.0.1:4173`. This serves `web/`; edit those source files directly.
You can also open `web/index.html` for a basic visual preview, but use the local
server when checking HTTP behavior.

```sh
npm test
npm run build
npm run preview
```

The production build is written to `dist/`, which is generated and ignored by
Git. Preview serves that directory on the same local port.

## Loading and caching

The build fingerprints local assets by content and rewrites their references.
An asset changes URL when its contents change, so repeat visitors can reuse
 cached files without being stuck on an old release. The site uses local fonts
 provided by the operating system and explicit image dimensions. It does not
 install a service worker.

On Vercel, fingerprinted assets are cached for a year with `immutable`; HTML and
the public contact configuration revalidate so releases and configuration changes
can be picked up promptly. GitHub Pages controls its own HTTP cache headers;
fingerprinted filenames still provide safe cache invalidation there.

## Contact and Supabase

The site currently provides an email link and has **no contact form**. A
Supabase contact backend is implemented and tested in `supabase/` for possible
future use, but no Qadam project has been provisioned and no browser sends
messages to it. The authenticated Supabase account is at its active free-project
limit, so deployment was deferred.

If the form is brought back later, follow [the Supabase setup guide](docs/supabase-setup.md),
apply the migration, configure server secrets, deploy the function, and connect
the frontend. Service credentials must stay out of `web/`, `dist/`, GitHub
repository variables, and browser code.

## Deployment

**GitHub Pages:** [the workflow](.github/workflows/pages.yml) builds and publishes
`dist/` on pushes to `main`. Set **Settings > Pages > Source** to **GitHub
Actions**.

**Vercel:** import this repository. [vercel.json](vercel.json) specifies the build,
output directory, and cache headers.

GitHub Pages remains a static host. Contact currently uses email.

## Repository layout

```text
web/                         Website source and image assets
  index.html                 Semantic content and accessible navigation
  about.html                 Mission and team portraits
  styles.css                 Responsive layout, color, and restrained motion
  app.js                     Navigation behavior
  config.js                  Reserved public contact configuration
supabase/                    Prepared, undeployed contact backend
tools/build.mjs              Fingerprinted production build
tools/serve.mjs              Local source or production preview
tests/                       Build and behavior checks
docs/                        Design brief, research agenda, roadmap, backend setup
design/qadam-design-system.md Current website design rules
tools/generate-images.py     Optional legacy concept-image generation tool
```

## Contributing

Qadam is looking for mechanical and software contributors, certified
prosthetists, and people with relevant clinic or field experience. Start with
the research agenda, open an issue describing the question you want to work on,
or contact Mohammad Zoraiz at <zoraizmohammad@gmail.com>.

Keep public project updates clear about what has been built, measured, proposed,
or remains unknown. Do not upload patient information, clinical scans, or private
contact submissions to this repository.

## Credentials and optional imagery tooling

The optional image-generation script reads `GEMINI_API_KEY` from the environment
and exits before making requests if it is absent. See
[the tooling notes](tools/nano-banana/README.md). This is separate from the website
build and Supabase configuration.

A credential previously committed to Git must be revoked at its provider.
Removing it from the current source does not revoke it or erase Git history.
Use a fresh credential for any subsequent image-generation work.

## License

Code and documentation are MIT licensed; see [LICENSE](LICENSE). Future hardware
releases will specify their license when the files are published. An open release
is a project intention, not a claim that unimplemented hardware or software is
already available.

Mohammad Zoraiz · <zoraizmohammad@gmail.com>
