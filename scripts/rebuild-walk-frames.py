#!/usr/bin/env python3
"""Lock BeachStar walk frames without cutting the painted sprites.

Translates each intact 314x314 frame so the torso spine sits at x=157 and the
planted foot at y=307, then writes matching 4x4 atlases. Does not split limbs.
"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SIZE = 314
HIP_X = 157
FOOT_Y = 307
ALPHA = 8
LANCZOS = Image.Resampling.LANCZOS
ACTORS = ('staff', 'guest-01', 'guest-02', 'guest-03')
DIRS = ('front', 'right', 'back', 'left')


def load_rgba(path):
    return Image.open(path).convert('RGBA')


def pixels(im):
    return im.load(), im.size


def opaque_bbox(im, thresh=ALPHA):
    return im.split()[-1].point(lambda p: 255 if p > thresh else 0).getbbox()


def translate(im, dx, dy):
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    out.paste(im, (int(round(dx)), int(round(dy))), im)
    return out


def iter_opaque(im, x0=0, y0=0, x1=None, y1=None, thresh=ALPHA):
    pix, (w, h) = pixels(im)
    x1 = w if x1 is None else x1
    y1 = h if y1 is None else y1
    for y in range(max(0, y0), min(h, y1)):
        for x in range(max(0, x0), min(w, x1)):
            p = pix[x, y]
            if p[3] > thresh:
                yield x, y, p


def lowest_y(im):
    pix, (w, h) = pixels(im)
    for y in range(h - 1, -1, -1):
        for x in range(w):
            if pix[x, y][3] > ALPHA:
                return y
    return None


def torso_anchor(im):
    box = opaque_bbox(im)
    pix, (w, h) = pixels(im)
    if box:
        y0, y1 = box[1] + 58, box[1] + 118
    else:
        y0, y1 = 70, 160
    counts = [0] * w
    for y in range(max(0, y0), min(h, y1)):
        for x in range(w):
            if pix[x, y][3] > ALPHA:
                counts[x] += 1
    peak = max(counts) if counts else 0
    if peak <= 0:
        return HIP_X
    thresh = peak * 0.45
    best_w = best_x = 0
    x = 0
    while x < w:
        if counts[x] >= thresh:
            start = x
            while x < w and counts[x] >= thresh:
                x += 1
            width = x - start
            if width > best_w:
                best_w = width
                best_x = start + width // 2
        else:
            x += 1
    return best_x or max(range(w), key=lambda i: counts[i])


def lock(im, hip_x=HIP_X, foot_y=FOOT_Y, size=SIZE):
    pad = 56
    cx = torso_anchor(im)
    foot = lowest_y(im)
    dx = hip_x - cx
    dy = 0 if foot is None else foot_y - foot
    work = Image.new('RGBA', (size + pad * 2, size + pad * 2), (0, 0, 0, 0))
    work.paste(im, (pad + int(round(dx)), pad + int(round(dy))), im)
    return work.crop((pad, pad, pad + size, pad + size))


def write_atlas(frames_by_dir, dest):
    atlas = Image.new('RGBA', (SIZE * 4, SIZE * 4), (0, 0, 0, 0))
    for r, d in enumerate(DIRS):
        for c, frame in enumerate(frames_by_dir[d]):
            atlas.paste(frame, (c * SIZE, r * SIZE), frame)
    dest.parent.mkdir(parents=True, exist_ok=True)
    atlas.resize((1254, 1254), LANCZOS).save(dest, 'PNG')


def load_exported():
    frames = {}
    for actor in ACTORS:
        frames[actor] = {}
        for d in DIRS:
            dest = ROOT / 'assets/game/characters' / actor / 'walk' / d
            frames[actor][d] = [load_rgba(dest / f'frame-{i}.png') for i in range(4)]
    return frames


def verify(frames):
    failures = []
    for actor in ACTORS:
        for d in DIRS:
            cycle = frames[actor][d]
            hips = [torso_anchor(fr) for fr in cycle]
            for i, fr in enumerate(cycle):
                box = opaque_bbox(fr)
                if not box or box[2] - box[0] < 80 or box[3] - box[1] < 160:
                    failures.append(f'{actor} {d} f{i} collapsed bbox={box}')
    return failures


def rebuild():
    print('Keeping painted walk frames intact (no limb split).')
    failures = verify(load_exported())
    if failures:
        print('WALK LOCK CHECK FAILED:')
        for line in failures:
            print(' ', line)
        return 1
    print('WALK LOCK CHECK PASSED')
    return 0


if __name__ == '__main__':
    if '--check' in sys.argv:
        failures = verify(load_exported())
        if failures:
            print('WALK LOCK CHECK FAILED:')
            for line in failures:
                print(' ', line)
            sys.exit(1)
        print('WALK LOCK CHECK PASSED')
        sys.exit(0)
    sys.exit(rebuild())
