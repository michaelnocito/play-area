"""
SPR pipeline: pack the GRABBER atlas from the SAME Engvee zombie model (skin1),
using the ROAR animation (arms-out grasping pose) with a strong amber tint —
DR-#045: Mike requires the grabber to be from the same graphic pack as the zombie.
Roar sheets are a 6x4 grid of 24 frames (Walk was 4x5/20), hence this variant.
Usage: python pack_grabber_atlas.py
"""
import os, json
from PIL import Image

RAW = os.path.join(os.path.dirname(__file__), '..', 'assets', 'raw', 'engvee_zombie_skin1', 'x256_Spritesheets', 'Roar')
OUT_PNG = os.path.join(os.path.dirname(__file__), '..', 'assets', 'grabber_atlas.png')
OUT_JSON = os.path.join(os.path.dirname(__file__), '..', 'assets', 'grabber_atlas.json')

DIRS = [0, 45, 90, 135, 180, 225, 270, 315]
FRAME_IDXS = [0, 3, 6, 9, 12, 15, 18, 21]  # 8 of 24 source frames
SRC_CELL = 256
GRID_COLS = 6
OUT_SIZE = 96
TINT = (217, 148, 74)  # amber — the grabber's hue everywhere else in the game
TINT_ALPHA = 0.55

def tint_frame(frame, rgb):
    frame = frame.convert('RGBA')
    a = frame.split()[3]
    overlay = Image.new('RGB', frame.size, rgb)
    blended = Image.blend(frame.convert('RGB'), overlay, TINT_ALPHA)
    blended.putalpha(a)
    return blended

frames = []
for d in DIRS:
    fname = f"Roar Body {str(d).zfill(3) if d != 0 else '0'}.png"
    sheet = Image.open(os.path.join(RAW, fname)).convert('RGBA')
    for fi, frame_idx in enumerate(FRAME_IDXS):
        col = frame_idx % GRID_COLS
        row = frame_idx // GRID_COLS
        cell = sheet.crop((col*SRC_CELL, row*SRC_CELL, (col+1)*SRC_CELL, (row+1)*SRC_CELL))
        cell = cell.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
        cell = tint_frame(cell, TINT)
        frames.append((d, fi, cell))

atlas = Image.new('RGBA', (len(FRAME_IDXS)*OUT_SIZE, len(DIRS)*OUT_SIZE), (0, 0, 0, 0))
frame_map = {}
for d, fi, cell in frames:
    x, y = fi*OUT_SIZE, DIRS.index(d)*OUT_SIZE
    atlas.paste(cell, (x, y))
    frame_map[f"{d}_{fi}"] = {"x": x, "y": y, "w": OUT_SIZE, "h": OUT_SIZE}

atlas.save(OUT_PNG, optimize=True)
with open(OUT_JSON, 'w') as f:
    json.dump({"frameW": OUT_SIZE, "frameH": OUT_SIZE, "dirs": DIRS,
               "framesPerDir": len(FRAME_IDXS), "frames": frame_map}, f)
print(f"wrote {OUT_PNG} ({os.path.getsize(OUT_PNG)/1024:.1f} KB)")
