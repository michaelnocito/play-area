from PIL import Image

land = Image.open("flipline_cover_1920x1080.png").convert("RGB")
sq   = Image.open("flipline_icon_800x800.png").convert("RGB")

def crop_to(img, tw, th):
    w, h = img.size
    tr, cr = tw/th, w/h
    if cr > tr:
        nw = int(h*tr); x = (w-nw)//2; img = img.crop((x, 0, x+nw, h))
    else:
        nh = int(w/tr); y = (h-nh)//2; img = img.crop((0, y, w, y+nh))
    return img.resize((tw, th), Image.LANCZOS)

crop_to(land, 512, 384).save("gd_512x384.jpg", "JPEG", quality=92)   # required main thumbnail
crop_to(sq,   512, 512).save("gd_512x512.jpg", "JPEG", quality=92)   # required main thumbnail
crop_to(land, 200, 120).save("gd_200x120.jpg", "JPEG", quality=92)   # required main thumbnail
crop_to(land, 1280, 720).save("gd_1280x720.jpg", "JPEG", quality=92) # marketing

for n in ["gd_512x384.jpg", "gd_512x512.jpg", "gd_200x120.jpg", "gd_1280x720.jpg"]:
    print(n, Image.open(n).size)
print("done")
