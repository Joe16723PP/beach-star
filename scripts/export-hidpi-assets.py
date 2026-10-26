#!/usr/bin/env python3
"""Re-export BeachStar HiDPI shop, guest-01, and umbrella-request assets."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ALPHA = 8
LANCZOS = Image.Resampling.LANCZOS


def opaque_bbox(im):
    alpha = im.split()[-1]
    return alpha.point(lambda p: 255 if p > ALPHA else 0).getbbox()


def fit_on_canvas(src, size, fill=0.90, ground=True):
    im = Image.open(src).convert('RGBA')
    box = opaque_bbox(im)
    if not box:
        raise SystemExit(f'no opaque pixels: {src}')
    cropped = im.crop(box)
    margin = int(round(size * (1 - fill) / 2))
    inner = size - margin * 2
    scale = min(inner / cropped.width, inner / cropped.height)
    nw, nh = max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale))
    resized = cropped.resize((nw, nh), LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    x = (size - nw) // 2
    y = size - margin - nh if ground else (size - nh) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas


def normalize_guest01():
    src = ROOT / 'assets/game/characters/guest-01.png'
    backup = ROOT / 'assets/source/guest-01-idle-original.png'
    if not backup.exists():
        backup.write_bytes(src.read_bytes())
    im = Image.open(backup).convert('RGBA')
    box = opaque_bbox(im) or (419, 259, 848, 989)
    cropped = im.crop(box)
    target_h, canvas, foot = 980, 1254, 1114
    scale = target_h / cropped.height
    nw, nh = round(cropped.width * scale), target_h
    resized = cropped.resize((nw, nh), LANCZOS)
    out = Image.new('RGBA', (canvas, canvas), (0, 0, 0, 0))
    out.paste(resized, ((canvas - nw) // 2, foot - nh), resized)
    dest = ROOT / 'assets/game/characters/guest-01.png'
    out.save(dest, 'PNG')
    b = opaque_bbox(out)
    print(f'guest-01 {out.size} opaque={b} h={b[3]-b[1]} foot={b[3]} backup={backup}')


def export_shops():
    mapping = [
        ('assets/source/beachstar-bars-2026-10-25/coconut-bar.png', 'assets/game/props/coconut-bar.png'),
        ('assets/source/beachstar-bars-2026-10-25/fruit-shack.png', 'assets/game/props/fruit-shack.png'),
        ('assets/source/beachstar-bars-2026-10-25/rental-hut.png', 'assets/game/props/beach-rentals.png'),
        ('assets/source/beachstar-bars-2026-10-25/bbq-stand.png', 'assets/game/props/bbq-grill.png'),
    ]
    for src_rel, dest_rel in mapping:
        canvas = fit_on_canvas(ROOT / src_rel, 1024, fill=0.90, ground=True)
        dest = ROOT / dest_rel
        canvas.save(dest, 'PNG')
        b = opaque_bbox(canvas)
        print(f'{dest.name} {canvas.size} opaque={b} alpha={canvas.mode}')


def export_umbrella_icon():
    src = ROOT / 'assets/game/props/umbrella-coral.png'
    dest = ROOT / 'assets/game/ui-icons/icon-request-umbrella.png'
    canvas = fit_on_canvas(src, 1254, fill=0.78, ground=False)
    canvas.save(dest, 'PNG')
    b = opaque_bbox(canvas)
    print(f'{dest.name} {canvas.size} opaque={b} occ={(b[2]-b[0])/1254:.2f}x{(b[3]-b[1])/1254:.2f}')


if __name__ == '__main__':
    export_shops()
    normalize_guest01()
    export_umbrella_icon()
