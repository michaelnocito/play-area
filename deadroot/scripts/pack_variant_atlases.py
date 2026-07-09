"""
DR-#046/#048 SPR pipeline: pack every remaining unit atlas from the SAME two Engvee
packs (thief + zombie skin1) — no new source art needed. Each variant = a different
animation set + a tint, the DR-#045 pattern (grabber = zombie Roar + amber).
Grid shape is auto-detected per sheet (Engvee anims vary: 4x4, 4x5, 6x4, 8x3...),
empty trailing cells are skipped, frames crop to a shared alpha bbox so the character
fills the frame (reads big in-game), then downsample + tint + pack.
Usage: python pack_variant_atlases.py
"""
import os, json
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "assets")
DIRS = [0, 45, 90, 135, 180, 225, 270, 315]
CELL = 256

PACKS = {
    "thief":  {"dir": os.path.join(ROOT, "raw", "engvee_thief", "x256_Spritesheets"),
               "name": lambda anim, d: f"{anim}_Body_{str(d).zfill(3) if d else '0'}.png"},
    "zombie": {"dir": os.path.join(ROOT, "raw", "engvee_zombie_skin1", "x256_Spritesheets"),
               "name": lambda anim, d: f"{anim} Body {str(d).zfill(3) if d else '0'}.png"},
}

# key -> (pack, anim, tint RGB, tint alpha, out px)
# Anim choice carries the role read: Block=shielded tank, Attack_Stance=aggressor,
# Run=fast cleanup crew, Buff=caster/healer, Attack1/3=heavies, Lookup=arms-raised
# mender chant, Idle=the seated Queen.
VARIANTS = {
    "knight":  ("thief",  "Block",         (77, 126, 168),  0.45, 80),
    "incin":   ("thief",  "Attack_Stance", (217, 143, 74),  0.45, 80),
    "sweeper": ("thief",  "Run",           (227, 211, 78),  0.50, 80),
    "cleric":  ("thief",  "Buff",          (239, 227, 180), 0.55, 80),
    "butcher": ("thief",  "Attack1",       (176, 74, 74),   0.50, 96),
    "boss":    ("thief",  "Attack3",       (201, 211, 221), 0.50, 96),
    "mender":  ("zombie", "Lookup",        (155, 224, 127), 0.50, 80),
    "queen":   ("zombie", "Idle",          (150, 110, 210), 0.45, 112),
}

def tint_frame(frame, rgb, alpha):
    frame = frame.convert("RGBA")
    a = frame.split()[3]
    blended = Image.blend(frame.convert("RGB"), Image.new("RGB", frame.size, rgb), alpha)
    blended.putalpha(a)
    return blended

def real_frames(sheet):
    """indices of non-empty 256px cells, row-major"""
    cols, rows = sheet.width // CELL, sheet.height // CELL
    out = []
    for i in range(cols * rows):
        c, r = i % cols, i // cols
        cell = sheet.crop((c*CELL, r*CELL, (c+1)*CELL, (r+1)*CELL))
        if cell.getchannel("A").getbbox():
            out.append(i)
    return out, cols

def pack(key, pack, anim, tint, alpha, out_px):
    src = PACKS[pack]
    raw, bbox = {}, None
    for d in DIRS:
        sheet = Image.open(os.path.join(src["dir"], anim, src["name"](anim, d))).convert("RGBA")
        idxs, cols = real_frames(sheet)
        take = [idxs[round(i*(len(idxs)-1)/7)] for i in range(8)] if len(idxs) >= 8 else idxs
        for fi, idx in enumerate(take):
            c, r = idx % cols, idx // cols
            cell = sheet.crop((c*CELL, r*CELL, (c+1)*CELL, (r+1)*CELL))
            raw[(d, fi)] = cell
            bb = cell.getchannel("A").getbbox()
            if bb:
                bbox = bb if bbox is None else (min(bbox[0], bb[0]), min(bbox[1], bb[1]),
                                                max(bbox[2], bb[2]), max(bbox[3], bb[3]))
    # square the shared bbox so aspect is preserved
    w, h = bbox[2]-bbox[0], bbox[3]-bbox[1]
    side = max(w, h)
    cx, cy = (bbox[0]+bbox[2])//2, (bbox[1]+bbox[3])//2
    sq = (max(0, cx-side//2), max(0, cy-side//2))
    sq = (sq[0], sq[1], min(CELL, sq[0]+side), min(CELL, sq[1]+side))
    fpd = max(fi for (_, fi) in raw) + 1
    atlas = Image.new("RGBA", (fpd*out_px, len(DIRS)*out_px), (0, 0, 0, 0))
    fmap = {}
    for (d, fi), cell in raw.items():
        img = tint_frame(cell.crop(sq).resize((out_px, out_px), Image.LANCZOS), tint, alpha)
        x, y = fi*out_px, DIRS.index(d)*out_px
        atlas.paste(img, (x, y))
        fmap[f"{d}_{fi}"] = {"x": x, "y": y, "w": out_px, "h": out_px}
    png = os.path.join(ROOT, f"{key}_atlas.png")
    atlas.save(png, optimize=True)
    with open(os.path.join(ROOT, f"{key}_atlas.json"), "w") as f:
        json.dump({"frameW": out_px, "frameH": out_px, "dirs": DIRS,
                   "framesPerDir": fpd, "frames": fmap}, f)
    print(f"{key}: {fpd} frames/dir, {os.path.getsize(png)/1024:.0f} KB")

for key, (pk, anim, tint, alpha, px) in VARIANTS.items():
    pack(key, pk, anim, tint, alpha, px)
