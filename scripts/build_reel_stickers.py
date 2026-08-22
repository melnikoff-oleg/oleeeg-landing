#!/usr/bin/env python3
"""Regenerate the twelve risograph stickers on /reels, with gpt-image-2.

    OPENAI_API_KEY=... python3 scripts/build_reel_stickers.py

Writes public/reels/stickers/<name>.webp, which is what the page reads. The raw
1024px PNGs land beside them in a raw/ folder that is not committed.

Three things this script is the record of:

  The shared STYLE suffix is why twelve separate images read as one print run
  rather than as clip art. Change a colour or the die-cut border there and every
  sticker moves together; change it in one ASSETS line and that one falls out of
  the set.

  gpt-image-2 is the only model with background="transparent". Not gpt-image-1,
  not gpt-image-1.5, not mini. Everything else needs a matte afterwards.

  A high-quality 1024px call takes about three minutes and costs about $0.21, so
  the twelve run concurrently and the whole set is roughly $2.60 and one coffee.
  It is a regeneration script, not something to run on a whim: the output is not
  deterministic, and a rerun replaces the set with a slightly different one.

Post-processing is the part that matters for the page: crop to the alpha
bounding box (the model centres its subject in a 1024px square and leaves a lot
of empty alpha), then down to 400px WebP, which takes the set from 4.4 MB to
474 KB with no visible loss at the sizes the page paints them.
"""
import base64, json, os, sys, urllib.request, concurrent.futures as cf
from io import BytesIO
from PIL import Image

KEY = os.environ["OPENAI_API_KEY"]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FINAL = os.path.join(ROOT, "public", "reels", "stickers")
RAW = os.path.join(FINAL, "raw")
os.makedirs(RAW, exist_ok=True)
os.makedirs(FINAL, exist_ok=True)

STYLE = (
    " Risograph print sticker: bold flat solid ink fills, thick cream-white die-cut sticker"
    " border all the way around, a soft halftone dot gradient only in the shading, one"
    " playful hand-printed zine look. Limited palette: riso blue, coral red, marigold yellow,"
    " soft pink and warm cream. Chunky rounded friendly shapes, cosy and a little imperfect."
    " Single centred object filling the frame. No text, no letters, no background,"
    " fully transparent background."
)

ASSETS = {
  "play": "A chunky rounded-square play button. Coral red squircle with a fat cream-white triangle in the middle.",
  "star": "A fat four-pointed sparkle star with soft rounded points, marigold yellow with a riso blue drop shadow offset.",
  "flame": "A cosy little campfire flame with a rounded curling tip, coral red outside and marigold yellow inside.",
  "eye": "A friendly hand-drawn wide-open eye with thick lashes, riso blue outline with a coral red iris.",
  "heart": "A fat squishy heart with a soft glossy highlight, bubblegum pink with a riso blue offset outline.",
  "phone": "A chunky smartphone standing upright, playing a vertical video, riso blue body with a coral red screen.",
  "rocket": "A stubby toy rocket ship pointing up with three fins and a round window, riso blue body, coral red fins, a marigold flame at the tail.",
  "magnifier": "A chunky magnifying glass held at a jaunty angle, thick riso blue handle and rim with a pale cream lens.",
  "blob": "A soft rounded kidney-bean blob shape with two smaller dots orbiting it, marigold yellow with coral red dots.",
  "arrow": "A fat hand-drawn curving arrow sweeping to the right, riso blue with a coral red offset shadow.",
  # "a luggage tag" first returned an ornate floral one. Naming what it must NOT
  # have is what fixed it, which is the general lesson for this whole file.
  "tag": "A chunky plain rectangular price-tag label tilted slightly, one punched hole in the top corner with a short curl of string. Completely blank face, riso blue tag with a cream border and a coral red string. No flowers, no decoration, no pattern.",
  "bolt": "A fat chunky lightning bolt with rounded corners, marigold yellow with a riso blue offset outline.",
}


def one(name: str, prompt: str) -> str:
    body = json.dumps({
        "model": "gpt-image-2",
        "prompt": prompt + STYLE,
        "background": "transparent",
        "output_format": "png",
        "size": "1024x1024",
        "quality": "high",
        "n": 1,
    }).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=600) as r:
        payload = json.load(r)
    png = base64.b64decode(payload["data"][0]["b64_json"])
    open(os.path.join(RAW, f"{name}.png"), "wb").write(png)

    im = Image.open(BytesIO(png)).convert("RGBA")
    # The model centres its subject in the square and leaves the rest alpha, so
    # without this every sticker paints at a fraction of the size it is asked
    # for and the tilts do not line up with the shapes.
    box = im.split()[-1].getbbox()
    if box:
        im = im.crop(box)
    im.thumbnail((400, 400), Image.LANCZOS)
    im.save(os.path.join(FINAL, f"{name}.webp"), "WEBP", quality=88, method=6)
    u = payload.get("usage", {})
    return f"{name}: {im.size[0]}x{im.size[1]}, {u.get('output_tokens', 0)} out tokens"


with cf.ThreadPoolExecutor(max_workers=12) as ex:
    futs = {ex.submit(one, n, p): n for n, p in ASSETS.items()}
    for f in cf.as_completed(futs):
        try:
            print(f.result(), flush=True)
        except Exception as e:
            print(f"FAILED {futs[f]}: {e}", flush=True)
print("done")
