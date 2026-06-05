# Nano-Banana MCP — image generation for Qadam

[Nano-Banana](https://github.com/ConechoAI/Nano-Banana-MCP) is an MCP server that
wraps Google's **Gemini 2.5 Flash Image** API so an AI client (Claude Code / Cowork,
Cursor, etc.) can generate and edit raster images from text prompts. We use it to
produce on-brand hero/illustration assets for the website.

> **Why this is a "run it on your machine" step.** The build/automation sandbox this
> repo was assembled in has **no outbound network** to npm or the Gemini API, so the
> server can't run there. It runs fine locally, where your machine has normal
> internet. The procedural assets already in `web/assets/` (favicon, OG image) and
> the inline SVG hero art were built without it; Nano-Banana is for *additional*
> photographic/painterly assets you may want later.

---

## 1. Get a Gemini API key

1. Go to **Google AI Studio** → <https://aistudio.google.com/app/apikey>.
2. Create an API key and copy it.

> **Security:** treat the key like a password. Never paste it into chat, commit it,
> or put it in `mcp.example.json`. If a key is ever exposed, **delete it** in AI
> Studio and create a new one. This repo's `.gitignore` already excludes
> `.env*`, `*.key`, `mcp.local.json`, and `.nano-banana-config.json`.

Recommended: put the key in your shell profile instead of any file:

```bash
export GEMINI_API_KEY="your-new-key-here"
```

## 2. Configure your MCP client

The server is published on npm and runs via `npx` (Node 18+ required) — no install
step needed.

**Claude Code (`~/.claude.json` or project `.mcp.json`):**

```jsonc
{
  "mcpServers": {
    "nano-banana": {
      "command": "npx",
      "args": ["nano-banana-mcp"],
      "env": { "GEMINI_API_KEY": "your-key-here" }
    }
  }
}
```

If you already exported `GEMINI_API_KEY` in your shell (step 1), you can drop the
`env` block entirely — the server reads the system environment variable.

A copyable template lives next to this file: **`mcp.example.json`**. To keep a
local copy *with* your key that git ignores:

```bash
cp tools/nano-banana/mcp.example.json tools/nano-banana/mcp.local.json
# then edit mcp.local.json and paste your key (this file is gitignored)
```

**Cursor / other MCP clients:** same block, under that client's MCP settings. See
the upstream README for client-specific paths.

## 3. Tools the server exposes

| Tool | Use |
|---|---|
| `generate_image({ prompt })` | Create a new image from text. |
| `edit_image({ imagePath, prompt, referenceImages? })` | Edit an existing file. |
| `continue_editing({ prompt })` | Iterate on the last image. |
| `get_last_image_info()` | Info on the most recent output. |
| `configure_gemini_token({ apiKey })` | Set the key via tool (writes a local config). |
| `get_configuration_status()` | Check whether a key is loaded. |

Output is saved to `./generated_imgs/` on macOS/Linux (this folder is gitignored).
Move/rename finals into `web/assets/` when you're happy with them, then wire them in.

---

## 4. Qadam art-direction prompt pack

Use these to keep generated assets consistent with the site's **mystical bio-tech**
language (palette: teal `#39f5c8` → blue `#5b8cff` → violet `#b07bff` on near-black
`#05070d`). Keep generated raster art behind the existing text — never let it fight
legibility, and prefer dark, low-clutter compositions.

**Hero background (abstract "living material"):**
> Abstract iridescent holographic material on a near-black background (#05070d),
> soft mother-of-pearl gradient in signal-teal, deep blue and violet, slow flowing
> energy, subtle film grain, volumetric soft glow, no text, no logos, ultra-clean,
> cinematic, high-tech research-lab aesthetic, 16:9.

**Limb-scan / socket motif (illustration):**
> Stylized 3D scan of a human residual limb cross-section rendered as glowing
> topographic contour lines and point-cloud landmarks, teal-to-violet gradient
> wireframe, dark background, scientific-visualization look, soft depth of field,
> no text, minimal, elegant.

**Device beauty shot (the reconfigurable former):**
> A futuristic modular medical device: a ring of slim vertical staves around a soft
> membrane forming a socket mold, matte dark materials with teal edge-lighting,
> studio product photography on near-black seamless, dramatic rim light, shallow
> depth of field, clean, premium, no text.

**Texture / overlay:**
> Seamless subtle holographic noise texture, faint teal-blue-violet iridescence on
> black, very low contrast, tileable, for use as a soft overlay.

**Tips**
- Add `no text, no watermark, no logo` to avoid garbled lettering.
- Generate large, then downscale; export PNG for UI, and keep file sizes small.
- Run an `edit_image` pass with the site's color note to nudge stray palettes back
  toward the teal-led triad.
- For the hero, dark + low-detail wins — the headline must stay readable on top.
