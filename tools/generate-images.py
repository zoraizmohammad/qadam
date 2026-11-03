#!/usr/bin/env python3
"""
Qadam image generation script — uses Imagen 4.0 via Gemini API.
Generates all assets listed in design/image-brief.md.
"""

import base64
import json
import os
import sys
import time
import urllib.request
import urllib.error

API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
MODEL = "imagen-4.0-generate-001"
BASE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:predict"
ASSETS = os.path.join(os.path.dirname(__file__), "..", "web", "assets")

STYLE_ANCHOR = (
    "Visual style: clean, editorial, light-led aesthetic inspired by modern biotech "
    "branding — soft 3D product-render / soft studio photography. Warm off-white "
    "background (#f4f2ed). Soft diffuse lighting, gentle long shadows. A dreamy "
    "pastel iridescent atmosphere — subtle gradients of aqua (#a4e8df), soft pink "
    "(#f9cbd9), periwinkle (#c2c9f7) and lilac (#dcc6f0), like light through frosted "
    "glass — never neon, never oversaturated. Minimal composition, generous negative "
    "space, premium, hopeful, human, not cold or clinical. High detail, "
    "photoreal-but-soft, shallow depth of field. No text, no logos, no watermarks, "
    "no UI chrome."
)

IMAGES = [
    # (filename, aspect_ratio, prompt_body, description)
    (
        "hero-case.png",
        "4:3",
        (
            "A premium open hard-shell carrying case photographed from a high "
            "three-quarter angle on a warm off-white surface. The case is the size of "
            "a large pelican/travel case, opened flat like a clamshell. Inside, neatly "
            "arranged in custom dark-grey foam cut-outs: a rugged smartphone or small "
            "tablet standing upright; a folded compact solar panel; a soft fabric "
            "fitting sleeve; rows of modular prosthetic components — a few cup-shaped "
            "socket blanks in graduated sizes, two prosthetic foot/ankle units, several "
            "short aluminum pylon tubes, and small clamps and adapters. Everything "
            "tidy, labelled by empty foam slots, premium industrial design, matte "
            "finishes, hints of soft brushed metal. The lid interior holds a "
            "reconfigurable fitting tool. A faint pastel iridescent glow rises from "
            "inside the case like soft light. Hopeful, humanitarian-tech feeling. "
            "Centered product hero composition with empty space on the upper left for "
            "a headline. Only hands if any person is included — no faces."
        ),
        "01 Hero case shot",
    ),
    (
        "case-cutaway.png",
        "16:9",
        (
            "A clean top-down knolling flat-lay of an open travel case organized into "
            "three distinct zones, on a warm off-white background. Zone one: reusable "
            "fitting tools — a phone, a fabric pressure sleeve, a flat sensor pad, "
            "calipers and a tape measure, a small heat gun, hand tools, arranged in "
            "foam. Zone two: rows of per-patient parts — graduated cup-shaped socket "
            "blanks, short pylon tubes, two prosthetic feet, liners, small adapters "
            "and clamps. Zone three: a folded solar panel and a power bank with a "
            "short cable. Each zone subtly tinted with a different pastel wash (aqua, "
            "pink, periwinkle) to separate them. Perfectly organized, soft shadows, "
            "editorial product photography from directly overhead. Leave thin empty "
            "margins around each zone for labels to be added later. No text."
        ),
        "02 Case cutaway knolling",
    ),
    (
        "fitting-loop.png",
        "16:9",
        (
            "Four soft 3D isometric vignettes in a horizontal row on a warm off-white "
            "background, connected by a thin flowing line with gentle arrows. Vignette "
            "1: a hand holding a phone scanning a residual lower leg, faint scan grid. "
            "Vignette 2: a translucent plastic trial socket being shaped on a small "
            "reconfigurable tool, with a kettle of hot water nearby. Vignette 3: a "
            "leg wearing a socket with a thin pressure-sensing sleeve, soft heat-map "
            "glow on the surface. Vignette 4: a finished matte socket being "
            "heat-formed with a heat gun, small power/solar icon. The first three "
            "vignettes glow soft aqua-green; the fourth glows warm amber/orange. "
            "Minimal, premium, lots of breathing room between steps. Leave space "
            "beneath each vignette for a caption. No text."
        ),
        "03 Fitting-loop flow",
    ),
    (
        "device-cutaway.png",
        "1:1",
        (
            "A clean technical cutaway render of a cylindrical device: roughly 9 to 12 "
            "flexible vertical ribs (staves) arranged in a ring, with a smooth "
            "stretched membrane skin draped over them forming a tapered socket shape. "
            "A faint translucent residual lower-leg limb sits centered inside. Small "
            "hand-set adjustment screws sit at the base of each stave. Half the "
            "membrane is cut away to reveal the staves underneath. Soft pastel "
            "iridescent material, matte and premium, floating on a warm off-white "
            "background with a soft shadow. Engineering-elegant, calm, precise. Leave "
            "clear space around the device for callout labels. No text."
        ),
        "04 Device cutaway (socket former)",
    ),
    (
        "stave-topology.png",
        "1:1",
        (
            "A clean medical cross-section diagram of a below-knee residual limb, "
            "viewed from above as a rounded organic cross-section on a warm off-white "
            "background. Two bone shapes inside: a larger tibia toward the front, a "
            "smaller fibula to the side. Small dots (staves) are placed evenly around "
            "the outer ring in some areas but clustered densely along the front-and-"
            "side arc near the bony prominences, and spaced sparsely along the back. "
            "Subtle pastel pressure-relief glows over the bony spots. Soft, elegant, "
            "scientific-illustration quality, gentle pastel palette, minimal. Leave a "
            "clean margin for anatomical labels. No text."
        ),
        "05 Stave-topology cross-section",
    ),
    (
        "membrane-sag.png",
        "16:9",
        (
            "Two simple side-by-side diagrams on a warm off-white background. Left "
            "panel: two vertical posts with a skin or membrane stretched between them "
            "that visibly droops and sags in the middle under downward pressure arrows. "
            "Right panel: the same two posts with a very taut membrane that pulls the "
            "tops of the posts inward, bending them toward each other. Clean line-art "
            "with soft pastel fills (aqua and pink), minimal, diagrammatic, lots of "
            "white space, elegant scientific illustration. Leave room above each panel "
            "for a short caption. No text."
        ),
        "06 Membrane-sag dilemma",
    ),
    (
        "error-heatmap.png",
        "1:1",
        (
            "A soft 3D render of a below-knee socket or limb surface covered in a "
            "smooth color-gradient heat-map showing surface deviation — mostly calm "
            "cool aqua and periwinkle (low error) with a few small warmer pink or "
            "coral hot-spots near the bony prominences. Floating on a warm off-white "
            "background with a soft shadow, faint contour iso-lines across the "
            "surface, scientific-visualization quality, premium and clean. Leave space "
            "beside it for a small legend or colorbar. No text."
        ),
        "07 Surface-error heatmap",
    ),
    (
        "og-image.png",
        "16:9",
        (
            "A wide, calm hero composition on a warm off-white background: an open "
            "premium carrying case on the right third, packed with neatly organized "
            "prosthetic components, a phone, and a folded solar panel, glowing softly "
            "with pastel iridescence. The left two-thirds is clean, softly graded "
            "pastel space (aqua to pink to periwinkle) intentionally left empty for a "
            "headline. Editorial, aspirational, lots of negative space, soft studio "
            "light. No text."
        ),
        "08 OG social card background",
    ),
    (
        "field-scene.png",
        "16:9",
        (
            "A warm, hopeful documentary-style scene in a simple, bright room or tent: "
            "a technician kneeling beside an open Qadam carrying case, using a phone "
            "and a fitting sleeve to fit a below-knee prosthetic for a seated patient. "
            "Natural soft daylight, dignified and calm, focus on hands and the case "
            "rather than faces. Folded solar panel visible. A faint pastel iridescent "
            "warmth in the light. Respectful, non-clichéd humanitarian tech, premium "
            "editorial photography, shallow depth of field. Faces soft, turned, or out "
            "of frame."
        ),
        "09 In-field deployment scene",
    ),
    (
        "explode/case-start.png",
        "4:3",
        (
            "A premium closed or just-opened carrying case, centered on a warm "
            "off-white background, high three-quarter angle, soft studio light, faint "
            "pastel iridescence, all prosthetic components packed neatly inside visible "
            "through the open lid. Generous empty margin on all sides so parts have "
            "room to fan out. Clean, minimal, product-render quality."
        ),
        "EX-01 Case explode — start frame (assembled)",
    ),
    (
        "explode/case-end.png",
        "4:3",
        (
            "A premium carrying case shown as a clean exploded view: the lid, the "
            "shell, the phone or tablet, the folded solar panel, the fitting sleeve, "
            "the socket blanks, the prosthetic foot, the pylon tubes, and the adapters "
            "all separated and floating apart with even spacing between them, as if "
            "gently pulled outward in mid-air. Each part fully visible and not "
            "overlapping. High three-quarter camera angle, warm off-white background, "
            "soft shadows, pastel iridescent glow on each part. Generous margin on all "
            "sides. No text."
        ),
        "EX-01 Case explode — end frame (exploded)",
    ),
    (
        "explode/former-start.png",
        "6:7",
        (
            "A cylindrical socket-former device, fully assembled, centered on a warm "
            "off-white background, three-quarter angle, soft light, pastel iridescent "
            "matte materials, membrane skin stretched smoothly over the staves. "
            "Generous margin on all sides."
        ),
        "EX-02 Former explode — start frame (assembled)",
    ),
    (
        "explode/former-end.png",
        "6:7",
        (
            "A cylindrical socket-former device shown as an exploded view: the "
            "membrane skin lifted up and away at the top, the approximately 10 "
            "flexible staves separated outward in a fan from the central ring, the "
            "base adjustment screws pulled out below, and a faint translucent "
            "residual-limb shape floating in the center. Even spacing, nothing "
            "overlapping, same three-quarter camera angle, warm off-white background "
            "and soft pastel glow on each part. No text."
        ),
        "EX-02 Former explode — end frame (exploded)",
    ),
]


def generate_image(prompt: str, aspect_ratio: str, output_path: str, label: str) -> bool:
    if not API_KEY:
        raise RuntimeError("Set GEMINI_API_KEY in your environment before generating images.")
    full_prompt = f"{prompt}\n\n{STYLE_ANCHOR}"

    payload = json.dumps({
        "instances": [{"prompt": full_prompt}],
        "parameters": {
            "sampleCount": 1,
            "aspectRatio": aspect_ratio,
            "safetySetting": "block_low_and_above",
        },
    }).encode("utf-8")

    req = urllib.request.Request(
        BASE_URL,
        data=payload,
        headers={"Content-Type": "application/json", "x-goog-api-key": API_KEY},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"  ✗ HTTP {e.code}: {body.replace(API_KEY, '[redacted]')[:300]}")
        return False
    except Exception as e:
        print(f"  ✗ Error: {str(e).replace(API_KEY, '[redacted]')}")
        return False

    predictions = result.get("predictions", [])
    if not predictions:
        print(f"  ✗ No predictions in response: {json.dumps(result).replace(API_KEY, '[redacted]')[:300]}")
        return False

    img_b64 = predictions[0].get("bytesBase64Encoded", "")
    if not img_b64:
        print(f"  ✗ No image data in prediction")
        return False

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(base64.b64decode(img_b64))

    size_kb = os.path.getsize(output_path) // 1024
    print(f"  ✓ Saved {os.path.basename(output_path)} ({size_kb} KB)")
    return True


def main():
    if not API_KEY:
        print("Set GEMINI_API_KEY in your environment before generating images.", file=sys.stderr)
        return 1

    target = sys.argv[1] if len(sys.argv) > 1 else None

    print(f"Qadam image generation — model: {MODEL}")
    print(f"Output: {os.path.abspath(ASSETS)}\n")

    success = 0
    fail = 0

    for filename, aspect, prompt, label in IMAGES:
        if target and target not in filename and target not in label:
            continue

        out = os.path.join(ASSETS, filename)
        print(f"[{label}]")
        print(f"  → {filename}  ({aspect})")

        ok = generate_image(prompt, aspect, out, label)
        if ok:
            success += 1
        else:
            fail += 1

        if ok:
            time.sleep(2)  # brief pause between requests

    print(f"\nDone — {success} generated, {fail} failed.")
    return 1 if fail else 0


if __name__ == "__main__":
    sys.exit(main())
