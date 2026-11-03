# Optional concept-image tooling

The website build does not generate images or call an AI provider. Existing
concept renders are stored in `web/assets/` and must be visibly labeled as
illustrations when used. Prefer actual CAD, prototype photographs, and measured
results when those become available.

## Legacy Python generator

`tools/generate-images.py` is an optional maintenance script for the existing
Imagen prompt pack. It uses Python's standard library and reads its credential
from the `GEMINI_API_KEY` environment variable. It exits with an actionable
message and a nonzero status before making requests when the variable is absent.

Set a fresh key in your current shell, then run the script from the repo root:

```sh
export GEMINI_API_KEY="your-fresh-key"
python tools/generate-images.py
```

In PowerShell, the equivalent assignment is:

```powershell
$env:GEMINI_API_KEY = "your-fresh-key"
python tools/generate-images.py
```

An optional filename or label filter limits generation:

```sh
python tools/generate-images.py case
```

Image generation makes external API requests and may incur provider charges.
It is separate from `npm run build` and is not part of deployment. The script's
model and original prompts are legacy tooling; check current provider support
before starting a new generation session. Generating the entire pack can create
unused files and is unnecessary for ordinary website edits.

## Credentials

Never commit a real key to this folder, `mcp.example.json`, website source,
configuration, or generated build output. Local environment files and
`mcp.local.json` are ignored by Git. The script authenticates through a request
header rather than a URL query parameter and redacts the loaded key from error
messages.

A previously committed credential must be revoked in its provider's console.
Deleting it from the latest source does not revoke it or remove it from Git
history. Create a replacement only after revocation and keep it in the local
environment or a suitable secret store.

## MCP reference

`mcp.example.json` is a historical template for the third-party
[Nano-Banana MCP server](https://github.com/ConechoAI/Nano-Banana-MCP). This repo
does not install, require, or configure that server. Consult its current upstream
documentation before using it. Keep any local configuration containing credentials
in the ignored `mcp.local.json` file.

## Art direction

Follow [the current website design system](../../design/qadam-design-system.md):
warm paper, readable dark text, restrained teal, and documentary clarity. Keep
product concepts visually distinct from evidence. Avoid decorative glow, invented
medical readouts, illegible labels, and images that imply clinical validation.
Optimize final web assets and retain useful captions and alt text.
