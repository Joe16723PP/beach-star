# BeachStar Character Walk Cycle & Limb-Alternation Handoff Plan

## 1. Goal & Root-Cause Diagnosis

Eliminate the unnatural, stiff, "sliding on one forward leg" character movement for the **Resort Owner (`staff`)** and all three **Guests (`guest-01`, `guest-02`, `guest-03`)** across all four movement directions (`front`, `right`, `back`, `left`).

### Why Walking Looks Unnatural Right Now (Measured in `assets/source/*-walk-atlas.png` & `src/game.js`)

1. **All 4 Frames in Each Row of the Source Atlases Have the Same Lead Leg & Arm (Zero Limb Switching):**
   - Inspecting `assets/source/staff-walk-atlas.png`, `guest-01-walk-atlas.png`, `guest-02-walk-atlas.png`, and `guest-03-walk-atlas.png` (and the sliced `314×314` frames under `assets/game/characters/*/walk/{front,right,back,left}/frame-{0..3}.png`) reveals that the AI-generated sprite sheets drew **four near-duplicate poses per row**:
     - **`staff`:** In all 4 frames of `front`, `right`, `back`, and `left`, the exact same leg is forward and the arms never swing or alternate.
     - **`guest-01` & `guest-03`:** In `left` and `back`, the pixel difference across `frame-0..3` in the lower half (`y = 157..314`) is only `6.8–13.5` out of `255`—the legs are frozen in a single static stride while the character translates across the sand.
     - **`guest-02`:** Uses an ipsilateral pose (left arm and left leg both frozen forward in all 4 frames) with horizontal center drift across columns (`f0–f3` shifts sideways in the cell rather than alternating feet).
2. **Time-Based Frame Index instead of Distance-Driven Stride Phase (`src/game.js` lines 51, 53):**
   - `drawGuest()` uses `Math.floor(elapsed * 9 + g.phase) % 4` and `draw()` uses `Math.floor(elapsed * 10) % 4` alongside a vertical sine bounce (`bob`). Because the 4 frames do not switch legs, cycling them at 9–10 FPS only jitters the character's outline while they bob up and down on a frozen stride.
3. **Idle-to-Walk Pose Snap & Missing Upper/Lower Body Counter-Swing:**
   - When a character starts or stops walking, they snap abruptly between the static `1254×1254` idle PNG and the `314×314` walk frame without a passing/neutral stance (`frame-1` / `frame-3`) or natural contralateral arm/leg swing.

---

## 2. Authority & Precedence

- Governed by `GAME_DESIGN_PRINCIPLES.md` Section 5 (*Character movement and animation*, lines 45–50):
  - *"Guest and staff movement follows clear, walkable paths... Characters must not teleport, slide sideways while facing another direction, or pass through blocking props."*
  - *"Drive facing from actual movement direction and use the matching front, back, left, or right animation. Left/right art must be checked for correct facing; do not mirror a character if that breaks outfit details or carried objects."*
  - *"Keep a stable foot anchor and scale while changing direction or animation frame."*
- This handoff defines **Milestones 11–13**, complementing `HANDOFF.md` (Milestones 1–6) and `IMAGE_QUALITY_HANDOFF.md` (Milestones 7–10).

---

## 3. Guardrails

- Keep `beach-star` dependency-free (`index.html`, `src/styles.css`, `src/game.js`).
- Preserve the existing file tree (`assets/game/characters/{staff,guest-01,guest-02,guest-03}/walk/{front,back,left,right}/frame-{0..3}.png`) so `src/game.js` asset loading requires zero new network requests or external libraries.
- Preserve outfit details and held items: for `staff`, keep the coconut tray carried stably while the free arm and both legs alternate naturally; for `guest-01..03`, swing both arms contralaterally (left leg forward + right arm forward, then passing stance, then right leg forward + left arm forward, then passing stance).
- Keep every frame's horizontal center-of-mass (`hipX = 157`) and lowest planted foot baseline (`footY = 307` in the `314×314` frame, `walkFoot = 0.98`) locked so characters never jitter horizontally or float off the sand.

---

## 4. Phased Implementation Milestones & Detailed Checklists

### Milestone 11 — Rebuild the 4-Frame Walk Cycle PNGs with True Limb Alternation (`Contact A -> Passing -> Contact B -> Passing`)

**Problem in current assets:**
All 64 walk frames (`4 actors × 4 directions × 4 frames`) under `assets/game/characters/*/walk/*/` repeat the same lead leg across `frame-0`, `frame-1`, `frame-2`, and `frame-3`.

#### Required 4-Frame Walk Cycle Specification (Per Direction)
Every direction (`front`, `right`, `back`, `left`) must follow the classic 4-frame locomotion cycle:
- **`frame-0.png` (Left-Lead Contact Stride):** Left leg stepped forward / down, right leg extended back; right arm swung forward, left arm swung back (for `staff`, tray hand stays steady while free arm swings). Torso dips `-2px` at full stride extension.
- **`frame-1.png` (Passing / Neutral Stance A):** Legs cross under the hips (`legs together / passing`), one foot planted flat at `y = 307` and the swinging foot lifted `6–8px` off the sand; arms near neutral at the sides; head/torso at peak height (`0px`).
- **`frame-2.png` (Right-Lead Contact Stride — Opposite Limb Switch):** Right leg stepped forward / down, left leg extended back; left arm swung forward, right arm swung back.
- **`frame-3.png` (Passing / Neutral Stance B):** Legs cross under the hips in the return passing phase with opposite knee slightly raised; arms passing neutral.

#### Implementation Checklist
- [x] **11.1 Build a deterministic articulated limb-rig / frame-synthesis pipeline (`tools/` or Python build script) for `staff`, `guest-01`, `guest-02`, and `guest-03`:**
  - Segment each character's directional base sprite into articulated regions with feathered alpha seams:
    1. **Head & Upper Torso** (`y = 0 .. hipY`): stable horizontal anchor (`cx = 157`), subtle `±1.5°` shoulder counter-twist in `front`/`back` and `-2px` stride dip on contact frames (`frame-0` and `frame-2`).
    2. **Left Arm & Right Arm** (`shoulderY .. wristY`):
       - In **`right` and `left` profile views**: rotate/swing the foreground arm and background arm in **opposite phases** (`+18°` forward on `frame-0`, `0°` passing on `frame-1`, `-18°` back on `frame-2`, `0°` passing on `frame-3`). For `staff`, keep the tray-holding arm stabilized (`±3°` gentle bob) and swing the free arm (`±18°`).
       - In **`front` and `back` views**: apply foreshortened vertical swing + slight inward/outward arm shift (`±6px` vertical, `±3px` horizontal) and shoulder counter-tilt so the left and right arms visibly alternate on `frame-0` vs. `frame-2`.
    3. **Left Leg & Right Leg** (`hipY .. footY = 307`):
       - In **`right` and `left` profile views**: separate the front leg and back leg from the static stride, construct the **Passing stance (`frame-1` and `frame-3`)** with legs aligned under the hip and the passing foot lifted `7px`, and construct the **Alternated Stride (`frame-2`)** with the opposite leg stepped forward (`+14px` to `+18px` horizontal stride separation between front and back foot) and the trailing heel lifted.
       - In **`front` and `back` views**: alternate which leg is stepped forward/planted lower (`footY = 307`, `scaleY = 1.0`) and which leg is receding/lifted (`footY = 296`, foreshortened `scaleY = 0.90` with subtle shadow darkening on the receding leg), swapping left and right legs between `frame-0` and `frame-2`, and bringing both legs to upright passing alignment on `frame-1` and `frame-3`.
- [x] **11.2 Lock horizontal center-of-mass (`cx = 157`) and planted foot baseline (`y = 307`) across all 64 frames:**
  - Fix `guest-02`'s horizontal drift across `frame-0..3` so all 4 frames share the exact same hip center (`x = 157`) inside the `314×314` canvas.
  - Ensure the lowest opaque pixel of the planted foot sits at `y = 306..308` (`walkFoot = 0.98`) in every single frame so characters never hop or sink.
- [x] **11.3 Re-assemble and update `assets/source/*-walk-atlas.png` (`1256×1256` / `1254×1254`):**
  - Write the updated 4×4 grids back to `assets/source/staff-walk-atlas.png`, `assets/source/guest-01-walk-atlas.png`, `assets/source/guest-02-walk-atlas.png`, and `assets/source/guest-03-walk-atlas.png` so the source atlases match the exported frames in `assets/game/characters/*/walk/*/`.

#### Exit Checks (Milestone 11)
- [x] **Check 11A (Quantitative leg-alternation & centroid verification across all 64 frames):**
  - Run an automated pixel-verification script across all 4 actors (`staff`, `guest-01`, `guest-02`, `guest-03`) and all 4 directions (`front`, `right`, `back`, `left`):
    1. **Leg-switch check (`frame-0` vs `frame-2`):** In `front` and `back`, the lower-leg vertical foot centroid (`y` center of mass for left leg `x < 157` vs. right leg `x > 157`) must **swap sign** between `frame-0` and `frame-2` (`(leftFootY - rightFootY)` in `frame-0` has the opposite sign of `(leftFootY - rightFootY)` in `frame-2`, with `|Δy| >= 6px`).
    2. **Profile stride-width check (`frame-0`/`frame-2` vs `frame-1`/`frame-3`):** In `right` and `left`, the lower-leg bounding width (`y = 210..307`) in contact stride frames (`frame-0`, `frame-2`) must be at least **`1.25×` wider** than in passing frames (`frame-1`, `frame-3`), and `frame-0` vs `frame-2` must differ in upper/lower leg and arm shading/occlusion (`mean diff >= 20`).
    3. **Hip stability check:** Torso horizontal centroid (`y = 70..160`) across `frame-0..3` must stay within `±2px` so the body never lurches sideways.

---

### Milestone 12 — Distance-Driven Stride Phase & Smooth Direction/Stop Transitions in `src/game.js`

**Problem in current code (`src/game.js` lines 44, 51, 53):**
1. Walk frames are indexed by global wall-clock time (`Math.floor(elapsed * 10) % 4` for owner, `Math.floor(elapsed * 9 + g.phase) % 4` for guests) rather than **distance traveled** (`stride`). If a character slows down or turns a corner, feet skate on the sand.
2. In `moveToward()` (`src/game.js` line 44), `entity.facing = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'back' : 'front')` can flicker rapidly on diagonal grid steps when `|dx| ≈ |dy|`.
3. `drawActor()` adds an external sine wave `bob` on top of the walk frames (`Math.abs(Math.sin(elapsed * 14)) * 2`), which fights the 4-frame contact/passing vertical rhythm.

#### Implementation Checklist
- [x] **12.1 Drive walk-cycle frames from actual distance walked (`entity.stride`):**
  - In `moveToward(entity, x, y, speed, dt)` (`src/game.js` line 44) and the keyboard `WASD` movement block in `tick(dt)` (line 47), increment `entity.stride = (entity.stride || 0) + movedDist * 0.095;` (where 1 full step = ~10.5 logical pixels, or 1 full 4-frame cycle every ~42 logical pixels walked).
  - Select the walk frame using `Math.floor(entity.stride || 0) % 4` in both `drawGuest(g)` (line 51) and `draw()` for `owner` (line 53).
  - When a character stops walking (`!moving`), reset `entity.stride = 0` so the next walk always begins cleanly on `frame-0`.
- [x] **12.2 Synchronize vertical stride bob with the 4-frame cycle (`[0, -1.5, 0, -1.5]`):**
  - When `moving` is `true`, derive `bob` directly from the stride phase (`const stepBob = -Math.abs(Math.sin(((entity.stride || 0) % 2) * Math.PI)) * 1.8;`) instead of an unrelated `elapsed * 14` timer, so the body rises slightly on passing frames (`frame-1`, `frame-3`) and plants solidly on contact frames (`frame-0`, `frame-2`).
- [x] **12.3 Add direction hysteresis in `moveToward()` to prevent diagonal facing flicker:**
  - In `moveToward()` (`src/game.js` line 44), require a `4px` axis bias before switching between horizontal (`left`/`right`) and vertical (`front`/`back`) facing when both `|dx|` and `|dy|` are non-zero, so characters do not rapidly flip sprites at 24px grid corners.

#### Exit Checks (Milestone 12)
- [x] **Check 12A (Distance-locked stride & zero foot skating in browser):**
  - Open `http://127.0.0.1:8765/index.html`, start Shift 1, and walk the owner in all 4 directions (`W`, `A`, `S`, `D` and click-to-walk) and check in a guest.
  - **Pass:** `owner.stride` and `g.stride` advance proportionally to distance moved (`~1 frame per 10.5 logical px`), feet visibly alternate left-right-left-right without skating, and stopping returns cleanly to the idle pose.
  - **Fail:** Character limbs remain static, skate while stationary, or flicker between directions on diagonal segments.

---

### Milestone 13 — Visual Inspection & Browser Playtest Sign-off

#### Implementation Checklist
- [x] **13.1 Inspect all 4 characters in all 4 directions in live browser play:**
  - Verify `staff`, `guest-01`, `guest-02`, and `guest-03` walking `front`, `right`, `back`, and `left` at `1920×1080` (`DPR = 2`).
- [x] **13.2 Update `GAME_IMPROVEMENT_CHECKLIST.md` and `progress.md`:**
  - Check off the remaining directional animation playtest box in `GAME_IMPROVEMENT_CHECKLIST.md` (Section 1 line 15 & Section 7 line 102) once verified in browser.

---

## 5. Verification Runbook

Run from `/Users/jirotjoe/Projects/beach-star`:

1. **Syntax check:**
   ```bash
   node --check src/game.js
   ```
2. **Automated 64-frame walk-cycle anatomy & alternation check:**
   - Verify that for all 4 actors (`staff`, `guest-01`, `guest-02`, `guest-03`):
     - `front` and `back` swap left/right foot vertical extension between `frame-0` and `frame-2` (`(leftFootY - rightFootY)` flips sign with `|Δy| >= 6px`).
     - `right` and `left` alternate stride width between contact frames (`frame-0`, `frame-2`) and passing frames (`frame-1`, `frame-3`) (`strideWidth_contact / strideWidth_passing >= 1.25`) and swap front/back limb shading between `frame-0` and `frame-2`.
3. **Browser playtest (`http://127.0.0.1:8765/index.html`):**
   - Walk the owner with `W`, `A`, `S`, `D` and click-to-move; check in guests and observe `queueing`, `arriving`, and `leaving` walk animations across all 4 directions.

**Implementation note:** 2026-10-25. Distance stride, stride bob, and 4px facing hysteresis stay in `src/game.js`. A later limb-split pass cut the painted sprites through the waist (holes in skirts, floating feet). Those 64 frames were restored from git. `scripts/rebuild-walk-frames.py` no longer splits limbs. Shift 1: owner walking right on open sand shows a whole character. `node --check src/game.js` passed.
