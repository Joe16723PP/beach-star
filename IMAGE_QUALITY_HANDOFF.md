# BeachStar Image Quality & HiDPI Rendering Handoff Plan

## 1. Goal & Problem Summary

Eliminate the blurry, low-resolution appearance of **BeachStar** (`beach-star/`) on desktop, Retina (`2×–3×` DPR), and mobile landscape displays.

### Measured Root Causes
1. **Hardcoded `960×540` Canvas Backing Store (`index.html` line 29, `src/game.js` line 52):**
   - `<canvas id="stage" width="960" height="540">` renders into a fixed `960×540` bitmap regardless of display resolution or `window.devicePixelRatio`.
   - At `1920×1080` (`2×` DPR), the canvas displays at `1216×684` CSS px (`2432×1368` physical device pixels). Every high-res PNG (`1254×1254` to `1672×941`) is first crushed into `960×540` (discarding ~84% of source pixels) and then upscaled `2.53×` by the browser compositor, blurring all sprites, plaques, and vector text.
2. **Default `'low'` Canvas Downsampling Filter (`src/game.js`):**
   - `ctx.imageSmoothingQuality` is never set, defaulting to `'low'` (single-pass bilinear filtering). Downscaling `1254×1254` icons and characters into `26×26` or `62×74` logical boxes in one pass without mipmap/high-quality filtering causes severe aliasing and muddy details.
3. **Pre-Downscaled `512×512` Shop Props vs. `1312×1199` Transparent Sources:**
   - `assets/game/props/{coconut-bar,fruit-shack,beach-rentals,bbq-grill}.png` were downsampled to `512×512` even though clean RGBA (`color_type = 6`) master PNGs exist in `assets/source/beachstar-bars-2026-10-25/` (`1312×1199` and `1536×1024`).
4. **Excessive Transparent Padding on Idle Character PNGs & Undersized `guest-01`:**
   - Measured opaque bounding boxes inside the `1254×1254` idle PNGs:
     - `guest-01.png`: `428×728` opaque (`34% × 58%` of canvas; bottom foot is at `y = 987`).
     - `guest-02.png`: `536×963` opaque (`43% × 77%`; bottom foot at `y = 1106`).
     - `guest-03.png`: `550×1000` opaque (`44% × 80%`; bottom foot at `y = 1126`).
     - `staff-server.png`: `614×1028` opaque (`49% × 82%`; bottom foot at `y = 1149`).
   - Because `guest-01.png` has `58%` vertical occupancy while `guest-01/walk/*` frames (`314×314`) have `97%` vertical occupancy (`150×306`), `guestFit.walkScale[0]` had to be set to `0.59` (`36.5×43.6` logical px) to match the tiny padded idle sprite—making `guest-01` render noticeably smaller and softer than `guest-02` and `guest-03`.

---

## 2. Authority & Precedence

1. **Supersedes 1× Export Rule:** This handoff **supersedes** the "export a 1× copy for the browser prototype" lines in `assets/source/STYLE_GUIDE.md` (line 30), `ASSET_CRAFTING_PLAN.md` (line 64), and `ASSET_CREATION_CHECKLIST.md` (line 78). Because the canvas now renders at native HiDPI (`2×–3×` logical scale), game-ready assets in `assets/game/` must remain at `>= 2×–4×` display resolution (`1024×1024` for shops, normalized `1254×1254` / `314×314` for characters).
2. **Preserves Gameplay Coordinates (`960×540` Logical Space):** All game logic, hit detection (`canvasPoint(e)`), pathfinding (`buildRoute`, `pointBlocked`), and layout coordinates in `src/game.js` remain in the **`960×540` logical coordinate system**. Only the `<canvas>` backing-store pixel dimensions (`canvas.width`, `canvas.height`) and the 2D context transform (`ctx.setTransform(...)`) change.

---

## 3. Guardrails

- Keep `beach-star` dependency-free (`index.html`, `src/styles.css`, `src/game.js`).
- Do not change any logical coordinates (`960×540`), shop `rect` bounds, `seats` positions, or `canvasPoint(e)` pointer mapping (`(e.clientX - r.left) * 960 / r.width`).
- Do not exceed a `3×` logical backing store (`2880×1620` max) so mobile GPU memory and frame rate stay rock-solid at 60 FPS.

---

## 4. Phased Implementation Milestones & Detailed Checklists

### Milestone 7 — HiDPI / Retina Canvas Backing Store & High-Quality Mipmap Smoothing

**Problem in current code:**
`canvas.width` is fixed at `960` and `canvas.height` is fixed at `540` (`index.html` line 29), and `draw()` (`src/game.js` line 52) runs `ctx.clearRect(0, 0, 960, 540)` at `1×` transform with default `'low'` smoothing.

#### Implementation Checklist
- [x] **7.1 Add `syncCanvasResolution()` in `src/game.js`:**
  - Define logical constants `const LOGICAL_W = 960, LOGICAL_H = 540;`.
  - Before clearing in `draw()` (or on `resize` + inside `draw()`), compute the required physical backing store size from the canvas's rendered CSS size and `window.devicePixelRatio`:
    ```javascript
    function syncCanvasResolution() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      const targetW = Math.max(LOGICAL_W, Math.min(2880, Math.round((r.width || LOGICAL_W) * dpr)));
      const targetH = Math.round(targetW * LOGICAL_H / LOGICAL_W);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      const scaleX = canvas.width / LOGICAL_W;
      const scaleY = canvas.height / LOGICAL_H;
      ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
    ```
  - Call `syncCanvasResolution()` at the very start of `draw()` right before `ctx.clearRect(0, 0, 960, 540);`.
- [x] **7.2 Ensure `ctx.restore()` never resets the HiDPI root transform:**
  - Verify every `ctx.save()` in `draw()`, `drawStation()`, `drawPlaque()`, `drawGuest()`, `drawFaces()`, `bubble()`, `requestMark()`, `drawReadyMark()`, `drawStackCount()`, and `drawActionBadge()` is paired with a matching `ctx.restore()` **after** `syncCanvasResolution()` sets the root transform, so all sub-draws inherit the HiDPI `scaleX, scaleY` matrix.
- [x] **7.3 Ensure crisp CSS rendering on `.canvas-wrap canvas` (`src/styles.css`):**
  - Keep `width: 100%; height: auto; aspect-ratio: 16/9;` on desktop and `width: min(100cqw, calc(100cqh * 16 / 9)); height: min(100cqh, calc(100cqw * 9 / 16));` in `@media (orientation: landscape) and (max-height: 520px)`. Do **not** set `image-rendering: pixelated` on `canvas` (since the art is smooth hand-painted illustration, not pixel art).

#### Exit Checks (Milestone 7)
- [x] **Check 7A (Desktop `1920×1080` at `DPR = 2` backing-store verification):** Open `http://127.0.0.1:8765/index.html` with `1920×1080` and `deviceScaleFactor: 2`. **Pass:** `canvas.width` is `>= 1920` (specifically `2432` when CSS width is `1216px`), `canvas.height` is `>= 1080` (`1368`), `canvas.width / canvas.height` equals `16 / 9`, and `ctx.imageSmoothingQuality === 'high'`. **Fail:** `canvas.width` remains `960`.
- [x] **Check 7B (Mobile landscape `844×390` at `DPR = 2` backing-store verification):** Emulate `844×390` with `deviceScaleFactor: 2`. **Pass:** `canvas.width` is `>= 1250` (`2×` the `~629px` CSS width) and `canvasPoint(e)` still maps clicks at `(90, 200)` (`Coconut Bar`) and `(720, 516)` (queue front) to the exact same logical coordinates (`960×540`). **Fail:** Click coordinates are offset or `canvas.width` is `< 1200`.

---

### Milestone 8 — Re-export `1024×1024` High-Resolution Shop Kiosks from Source Masters

**Problem in current assets:**
The four shop PNGs in `assets/game/props/{coconut-bar,fruit-shack,beach-rentals,bbq-grill}.png` were downscaled to `512×512`. At `2.53×` HiDPI scale (`140 × 2.53 = 355px` on screen) or `3×` DPR (`420px`), `512×512` leaves almost no supersampling headroom, whereas the original transparent source masters in `assets/source/beachstar-bars-2026-10-25/` are `1312×1199` and `1536×1024`.

#### Implementation Checklist
- [x] **8.1 Re-export the 4 shop props at `1024×1024` from `assets/source/beachstar-bars-2026-10-25/`:**
  - Write a repeatable Python/macOS `sips` or CoreGraphics script (or pure-Python PNG/Quartz script) that reads each source file in `assets/source/beachstar-bars-2026-10-25/`, crops to its opaque bounding box with symmetric padding so the building sits centered on a consistent ground baseline, and exports a **`1024×1024` RGBA PNG** to `assets/game/props/`:
    - `assets/source/beachstar-bars-2026-10-25/coconut-bar.png` (`1312×1199`, opaque `1264×1162`) $\rightarrow$ `assets/game/props/coconut-bar.png` (`1024×1024`).
    - `assets/source/beachstar-bars-2026-10-25/fruit-shack.png` (`1312×1199`, opaque `1128×1168`) $\rightarrow$ `assets/game/props/fruit-shack.png` (`1024×1024`).
    - `assets/source/beachstar-bars-2026-10-25/rental-hut.png` (`1536×1024`, opaque `986×992`) $\rightarrow$ `assets/game/props/beach-rentals.png` (`1024×1024`).
    - `assets/source/beachstar-bars-2026-10-25/bbq-stand.png` (`1312×1199`, opaque `1271×1160`) $\rightarrow$ `assets/game/props/bbq-grill.png` (`1024×1024`).
- [x] **8.2 Update `assets/source/ASSET_PROVENANCE.md`:**
  - Update the dimensions table in `assets/source/ASSET_PROVENANCE.md` (lines 38–41) from `512 × 512` to `1024 × 1024` for `coconut-bar.png`, `fruit-shack.png`, `beach-rentals.png`, and `bbq-grill.png`.

#### Exit Checks (Milestone 8)
- [x] **Check 8A (Asset dimension & alpha check):** Run `sips -g pixelWidth -g pixelHeight -g hasAlpha assets/game/props/{coconut-bar,fruit-shack,beach-rentals,bbq-grill}.png`. **Pass:** All 4 files report `pixelWidth: 1024`, `pixelHeight: 1024`, and `hasAlpha: yes`. **Fail:** Any file is `512×512` or loses transparency.

---

### Milestone 9 — Normalize Idle Character Padding & Scale (`guest-01..03` & `staff-server`)

**Problem in current assets & code:**
`assets/game/characters/guest-01.png` (`1254×1254`) has an opaque character height of only `728px` (`58%` of canvas height, `y = 260..987`), whereas `guest-02.png` is `963px` tall (`77%`), `guest-03.png` is `1000px` tall (`80%`), and `staff-server.png` is `1028px` tall (`82%`). Because `guest-01.png` is surrounded by 42% vertical empty space, `guestFit` (`src/game.js` line 51) sets:
```javascript
const guestFit={w:62,h:74,top:-47,idleFoot:[.78,.88,.90],walkScale:[.59,.79,.82],walkFoot:.98}
```
This shrinks `guest-01` during both idle and walking (`0.59 × 74 = 43.6` logical px tall vs. `60.7` logical px for `guest-03`), losing ~40% of its on-screen pixel density.

#### Implementation Checklist
- [x] **9.1 Normalize `assets/game/characters/guest-01.png` to match `guest-02` / `guest-03` body height and foot baseline:**
  - Scale the opaque character region `(419, 260, 846, 987)` (`428×728`) of `guest-01.png` inside its `1254×1254` RGBA canvas so its height is `~980px` (`78%` height) and its bottom foot baseline sits at `y = 1114` (`idleFoot = 0.89`, matching `guest-02` at `0.88` and `guest-03` at `0.90`).
  - Keep a backup of the uncropped original at `assets/source/guest-01-idle-original.png`.
- [x] **9.2 Update `guestFit` in `src/game.js` (line 51) for uniform, crisper character scale:**
  - Change `guestFit` in `src/game.js`:
    - `idleFoot`: from `[.78, .88, .90]` to `[.89, .88, .90]`
    - `walkScale`: from `[.59, .79, .82]` to `[.80, .79, .82]`
  - Verify in browser that `guest-01`, `guest-02`, and `guest-03` now have consistent visual height both when standing idle and when walking in all 4 directions (`front`, `back`, `left`, `right`).

#### Exit Checks (Milestone 9)
- [x] **Check 9A (`guest-01` opaque height & walk-to-idle transition):** Inspect `assets/game/characters/guest-01.png` opaque bounding box and observe `guest-01` walking to a lounger and sitting down in Shift 1. **Pass:** `guest-01.png` opaque height is `960–1000px` inside `1254×1254`, `guestFit.walkScale[0]` is `0.80`, and `guest-01` does not shrink or jump in height when transitioning between `arriving` (walk frames) and `seated` (idle sprite). **Fail:** `guest-01` visibly pops in size or remains `728px` in the source PNG.

---

### Milestone 10 — Canvas Vector UI, Plaque & Icon Sharpness Polish

**Problem in current code:**
1. In `drawPlaque()` (`src/game.js` line 49), the sub-label state text (`READY TO PREP · 5/8`, `LOW STOCK · TAP TO REFILL`) is drawn at `font = '900 7px Nunito,sans-serif'` and the title at `9px`. Even with HiDPI scaling, `7px` logical text is tiny and hard to read at a glance.
2. In `drawReadyMark()`, `requestMark()`, and `drawActor()`, destination coordinates (`x - w/2`, `y + footY + bob - foot*h`) use fractional floating-point numbers (`bob = Math.sin(...) * 1.2`), which can cause sub-pixel shimmer on thin strokes.

#### Implementation Checklist
- [x] **10.1 Increase plaque typography legibility in `drawPlaque()` (`src/game.js` line 49):**
  - Increase the shop title font from `900 9px Nunito,sans-serif` to `900 10px Nunito,sans-serif` and the status sub-label font from `900 7px Nunito,sans-serif` to `800 8.5px Nunito,sans-serif` (adjusting plaque height `h` from `29` to `32` when `show` is true).
- [x] **10.2 Dedicated `icon-request-umbrella.png` at `1254×1254` (matching drink, snack, float icons):**
  - Currently `art.requests.umbrella` loads the full-scene prop `assets/game/props/umbrella-coral.png` (`1254×1254` with long pole and ground shadow) and squeezes it into `26×26` inside `requestMark()` and `16×16` inside `drawReadyMark()`.
  - Generate or crop a dedicated tight-framed icon `assets/game/ui-icons/icon-request-umbrella.png` (`512×512` or `1254×1254`, centered canopy + handle filling `~78%` of the frame, matching `icon-request-drink.png` and `icon-request-float.png`) and point `art.requests.umbrella` to `assets/game/ui-icons/icon-request-umbrella.png`.

#### Exit Checks (Milestone 10)
- [x] **Check 10A (Plaque & icon visual inspection at `1920×1080` and `844×390`):** Open Shift 1 and Shift 6 in the browser. **Pass:** `COCONUT BAR` / `READY TO PREP · 5/8` and `BEACH RENTALS` plaques render with crisp vector edges and legible sub-labels; `art.requests.umbrella` loads from `assets/game/ui-icons/icon-request-umbrella.png` (`naturalWidth >= 512`) and fills the `26×26` request bubble cleanly. **Fail:** Plaque text overflows its rounded box or `icon-request-umbrella.png` fails to load.

**Implementation note:** 2026-10-25. `syncCanvasResolution()` runs at the start of `draw()`. Check 7A: `1920×1080` DPR 2, CSS `1216×684`, backing store `2432×1368`, `imageSmoothingQuality === 'high'`. Check 7B: `844×390` DPR 2, backing store `1351×760`, clicks at `(90, 200)` and `(720, 516)` stay in logical space. Shops exported at `1024×1024` RGBA via `scripts/export-hidpi-assets.py`. `guest-01.png` opaque height `968px` (backup `assets/source/guest-01-idle-original.png`), `idleFoot[0] = 0.89`, `walkScale[0] = 0.80`. Plaque fonts `10px` / `8.5px`. `icon-request-umbrella.png` `1254×1254`, `naturalWidth = 1254`. `node --check src/game.js` passed.

---

## 5. Verification Runbook

From `/Users/jirotjoe/Projects/beach-star`, run:

1. **Syntax & Asset Dimension Check:**
   ```bash
   node --check src/game.js
   sips -g pixelWidth -g pixelHeight assets/game/props/{coconut-bar,fruit-shack,beach-rentals,bbq-grill}.png assets/game/ui-icons/icon-request-umbrella.png
   ```

2. **Browser HiDPI & Gameplay Verification (`http://127.0.0.1:8765/index.html`):**
   - **Desktop Retina (`1920×1080`, `deviceScaleFactor: 2`):**
     - Verify `canvas.width === 2432` and `canvas.height === 1368` (or `2×` rendered CSS box).
     - Verify `ctx.imageSmoothingQuality === 'high'`.
     - Verify `guest-01`, `guest-02`, and `guest-03` match in standing and walking height.
   - **Mobile Landscape (`844×390`, `deviceScaleFactor: 2`):**
     - Verify `canvas.width >= 1250` and pointer clicks on the queue, `Coconut Bar`, and loungers hit their exact targets.
   - Confirm zero console errors across Shift 1 and Shift 6.
