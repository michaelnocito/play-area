"""
SPR-#003: pack a directional walk-cycle atlas for the Thief (scav attacker) from the
Engvee thief pack. Each source file Walk/Walk_Body_{deg}.png is a 1024x1024 sheet =
4x4 grid of 256px frames for that direction. We take 8 directions x 8 frames, crop
tight to a shared character bbox (so the sprite fills the frame and reads big at
in-game size), downsample, and pack. No tint (human keeps natural color, which reads
distinctly from the green zombie towers). Matches the zombie_atlas.json schema.

Usage: python pack_thief_atlas.py
"""
import os, json
from PIL import Image

SRC = os.path.join(os.path.dirname(__file__), "..", "assets", "raw", "engvee_thief", "x256_Spritesheets", "Walk")
OUT_PNG = os.path.join(os.path.dirname(__file__), "..", "assets", "thief_atlas.png")
OUT_JSON = os.path.join(os.path.dirname(__file__), "..", "assets", "thief_atlas.json")

DIRS = [0, 45, 90, 135, 180, 225, 270, 315]
FRAME_IDXS = [0, 2, 4, 6, 8, 10, 12, 14]  # 8 of the 16 source frames, evenly spaced
CELL = 256
COLS = 4
OUT = 96  # downsampled frame size

def sheet_path(d):
    return os.path.join(SRC, f"Walk_Body_{str(d).zfill(3) if d != 0 else '0'}.png")

def cell_img(sheet, idx):
    c, r = idx % COLS, idx // COLS
    return sheet.crop((c*CELL, r*CELL, (c+1)*CELL, (r+1)*CELL))

def main():
    # pass 1: gather all chosen frames, compute one shared bbox for consistent centering
    raw = {}  # (d, idx) -> RGBA cell
    bbox = None
    for d in DIRS:
        sheet = Image.open(sheet_path(d)).convert("RGBA")
        for idx in FRAME_IDXS:
            cell = cell_img(sheet, idx)
            raw[(d, idx)] = cell
            bb = cell.getchannel("A").getbbox()
            if bb:
                if bbox is None:
                    bbox = list(bb)
                else:
                    bbox[0] = min(bbox[0], bb[0]); bbox[1] = min(bbox[1], bb[1])
                    bbox[2] = max(bbox[2], bb[2]); bbox[3] = max(bbox[3], bb[3])
    # square the bbox so aspect isn't distorted on resize
    bw, bh = bbox[2]-bbox[0], bbox[3]-bbox[1]
    side = max(bw, bh)
    cx, cy = (bbox[0]+bbox[2])//2, (bbox[1]+bbox[3])//2
    half = side // 2 + 6  # small margin
    crop = (cx-half, cy-half, cx+half, cy+half)

    atlas = Image.new("RGBA", (OUT*len(FRAME_IDXS), OUT*len(DIRS)), (0, 0, 0, 0))
    frames = {}
    for di, d in enumerate(DIRS):
        for fi, idx in enumerate(FRAME_IDXS):
            cell = raw[(d, idx)].crop(crop).resize((OUT, OUT), Image.LANCZOS)
            x, y = fi*OUT, di*OUT
            atlas.paste(cell, (x, y))
            frames[f"{d}_{fi}"] = {"x": x, "y": y, "w": OUT, "h": OUT}
    atlas.save(OUT_PNG)
    meta = {"frameW": OUT, "frameH": OUT, "dirs": DIRS, "framesPerDir": len(FRAME_IDXS), "frames": frames}
    with open(OUT_JSON, "w") as f:
        json.dump(meta, f)
    print(f"wrote {OUT_PNG} ({atlas.size[0]}x{atlas.size[1]}) + {OUT_JSON}; crop={crop}")

if __name__ == "__main__":
    main()
