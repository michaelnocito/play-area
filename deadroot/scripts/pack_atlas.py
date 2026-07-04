"""
SPR pipeline step 3: pack a directional walk-cycle atlas for one deadroot enemy
from an Engvee-style 256px spritesheet pack (16 dirs x 20 frames per sheet,
4x5 grid, 256px cells). Downsamples + tints at build time so runtime just
blits. Usage: python pack_atlas.py <raw_walk_dir> <out_png> <out_json> <hex_tint>
"""
import sys, os, json
from PIL import Image

DIRS = [0, 45, 90, 135, 180, 225, 270, 315]
FRAME_IDXS = [0, 2, 5, 7, 10, 12, 15, 17]  # 8 of 20 source frames per direction
SRC_CELL = 256
GRID_COLS = 4
OUT_SIZE = 96  # downsampled frame size
TINT_ALPHA = 0.55

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def tint_frame(frame, rgb):
    frame = frame.convert('RGBA')
    r, g, b, a = frame.split()
    overlay = Image.new('RGBA', frame.size, rgb + (0,))
    blended = Image.blend(frame.convert('RGB'), overlay.convert('RGB'), TINT_ALPHA)
    blended.putalpha(a)
    return blended

def main():
    raw_dir, out_png, out_json, hex_tint = sys.argv[1:5]
    rgb = hex_to_rgb(hex_tint)
    frames = []  # (dir, frame_i, PIL image)
    for d in DIRS:
        fname = f"Walk Body {d if d != 0 else 0}.png" if d != 0 else "Walk Body 0.png"
        fname = f"Walk Body {str(d).zfill(3) if d != 0 else '0'}.png"
        path = os.path.join(raw_dir, fname)
        sheet = Image.open(path).convert('RGBA')
        for fi, frame_idx in enumerate(FRAME_IDXS):
            col = frame_idx % GRID_COLS
            row = frame_idx // GRID_COLS
            cell = sheet.crop((col*SRC_CELL, row*SRC_CELL, (col+1)*SRC_CELL, (row+1)*SRC_CELL))
            cell = cell.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
            cell = tint_frame(cell, rgb)
            frames.append((d, fi, cell))

    cols = len(FRAME_IDXS)
    rows = len(DIRS)
    atlas = Image.new('RGBA', (cols*OUT_SIZE, rows*OUT_SIZE), (0, 0, 0, 0))
    frame_map = {}
    for i, (d, fi, cell) in enumerate(frames):
        row = DIRS.index(d)
        col = fi
        x, y = col*OUT_SIZE, row*OUT_SIZE
        atlas.paste(cell, (x, y))
        frame_map[f"{d}_{fi}"] = {"x": x, "y": y, "w": OUT_SIZE, "h": OUT_SIZE}

    atlas.save(out_png, optimize=True)
    meta = {
        "frameW": OUT_SIZE, "frameH": OUT_SIZE,
        "dirs": DIRS, "framesPerDir": len(FRAME_IDXS),
        "frames": frame_map,
    }
    with open(out_json, 'w') as f:
        json.dump(meta, f)
    size_kb = os.path.getsize(out_png) / 1024
    print(f"wrote {out_png} ({size_kb:.1f} KB), {out_json}")

if __name__ == '__main__':
    main()
