import pymupdf
import os
from PIL import Image

pdf_path = r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\3026bff8-975f-427d-b051-273184069b19\.user_uploaded\media_1790246005399.pdf"
doc = pymupdf.open(pdf_path)
os.makedirs("assets", exist_ok=True)

# Render page 1 at high DPI and crop the logo
page = doc[0]
pix = page.get_pixmap(dpi=300)
pix.save("assets/page1_300dpi.png")

img = Image.open("assets/page1_300dpi.png")
# Logo is centered near top: let's inspect width and height
w, h = img.size
print(f"Page size: {w}x{h}")
# Crop the TU logo specifically: x around 35% to 65%, y around 5% to 22%
box = (int(w * 0.35), int(h * 0.05), int(w * 0.65), int(h * 0.22))
logo_img = img.crop(box)
# find bounding box of non-white pixels
import numpy as np
arr = np.array(logo_img)
non_white = np.where((arr[:, :, 0] < 250) | (arr[:, :, 1] < 250) | (arr[:, :, 2] < 250))
if len(non_white[0]) > 0:
    min_y, max_y = non_white[0].min(), non_white[0].max()
    min_x, max_x = non_white[1].min(), non_white[1].max()
    pad = 10
    logo_tight = logo_img.crop((max(0, min_x - pad), max(0, min_y - pad), min(logo_img.width, max_x + pad), min(logo_img.height, max_y + pad)))
    logo_tight.save("assets/tu_logo_highres.png")
    print(f"Saved assets/tu_logo_highres.png: {logo_tight.size}")
else:
    logo_img.save("assets/tu_logo_highres.png")
