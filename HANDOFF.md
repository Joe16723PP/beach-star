# BeachStar Improvement Handoff Plan

## 1. Goal & Target Rating

Raise **BeachStar** (`beach-star/`) from its current **7/10** (capped by P1 functional, pathing, touch-target, and accessibility defects) to a **9/10 release-ready playable slice** across desktop (`1920×1080`, DPR `1`) and mobile landscape (`844×390`, DPR `2`) while preserving its original tropical art identity and core time-management inspiration from *Beach Party Craze*.

---

## 2. Authority & Document Precedence (Resolving Split Authority)

This handoff resolves all contradictions between earlier prototype docs and the current codebase:

1. **Governing design authority:** `GAME_DESIGN_PRINCIPLES.md` and `.cursor/skills/ux-ui-design/SKILL.md` govern all gameplay and UI decisions.
2. **Superseded sections replaced by this handoff:**
   - **On-beach stock & refill UI vs. DOM `#station-panel`:** `README.md` (line 13) and `GAME_IMPROVEMENT_CHECKLIST.md` (Section 4 & Section 5 implementation notes) describe opening a DOM `#station-panel` with an `<input type="number">` quantity picker on shop arrival. That behavior is **superseded** by `.cursor/skills/ux-ui-design/SKILL.md` and `GAME_DESIGN_PRINCIPLES.md` (Principle 4, lines 39–41): stock and refill are a single component rendered as circular pictures on the sand below each open shop, with zero words on the sand marker and all delivery details (`ingredient`, `+amount`, `duration`, `resulting/max stock`) shown in the `#message` status bar.
   - **Per-ingredient refill across all open shops:** `COCONUT_REFILL_CHECKLIST.md` scoped per-ingredient marker refills to `Coconut Bar` on Shift 1 while leaving `Fruit Shack` and `Beach Rentals` on legacy `beginCanvasRefill()`. Milestone 2 of this handoff extends the unified supply-marker refill rule to **all three active shops** (`drink`, `snack`, `rental`) and removes `beginCanvasRefill()` and the unreachable `#station-panel` DOM code.

---

## 3. Current Baseline & Guardrails

### Baseline (`src/game.js`, `src/styles.css`, `index.html`)
- **Single-bundle vanilla JS runtime:** `index.html` loads `src/styles.css` and `src/game.js` (no build step, no external npm packages).
- **Save state:** Persisted in `localStorage` under `beachstar-save-v1`.
- **Implemented systems:** 10 shift definitions (`levels`), 4-guest arrival queue at `y = 510`, owner check-in, automatic seating across 9 loungers (`seats`), 3.5s leisure period with chance-based second request on Shifts 4–10, 4-step action queue (`actions`), batch preparation (`STACK_CAPS = [3, 4, 6]`), 1-item carry slot (`carry`), draggable shade umbrellas (`shadeSeats`), and between-shift upgrades (`patience`, `capacity`, `tip`, `bar-drink`, `bar-snack`, `bar-rental`, `shade`).

### Guardrails
- Keep `beach-star` dependency-free (`index.html`, `src/styles.css`, `src/game.js`). Do not introduce a bundler or external libraries.
- Preserve the 10-shift structure, star grading rules (`visits >= level.goal` required; `happy >= 85%` = 3 stars, `>= 60%` = 2 stars, `< 60%` = 1 star), and `beachstar-save-v1` schema compatibility.
- Keep `BBQ Bar`, `Supply Depot`, and `Restock Scooter` as non-functional scenery in this pass (ignored on Shift 1 clicks; informational status message on Shifts 2–10).
- Never clear unrelated browser storage during verification; only inspect or reset `beachstar-save-v1`.

---

## 4. Phased Implementation Milestones & Detailed Checklists

### Milestone 1 — Action Queue Integrity & Walk Cancellation (Fixes P1 Queue Stall)

**Problem in current code:**
In `src/game.js` (line 45), clicking open sand calls `setDestination(p, {type: 'walk'})`, which sets `owner.walking = true` and `pending = {type: 'walk'}`. If the player clicks a queued guest, shop, or low supply marker while the owner is walking to open sand, `queueAction()` pushes the task to `actions` and calls `runFrontAction()`, which immediately exits on `if (!a || a.wait || owner.walking) return;`. When the open-sand walk completes, `finishOwnerTask()` (line 48) hits `if (!a || t?.type !== 'queued') return;` and exits without calling `runFrontAction()`, leaving `actions[0]` permanently frozen with its numbered badge on screen.

#### Implementation Checklist
- [x] **1.1 Override open-ground walk when queuing an action:** In `queueAction(action)` (`src/game.js` line 48), before pushing `action` (or immediately before calling `runFrontAction()`), check if `owner.walking && pending?.type === 'walk'`. If true, clear the unqueued ground walk (`owner.walking = false; owner.path = []; owner.pathIndex = 0; pending = null;`) so `runFrontAction()` immediately routes the owner to `actions[0]`.
- [x] **1.2 Resume queued actions at the end of `finishOwnerTask()`:** In `finishOwnerTask()` (`src/game.js` line 48), replace:
  ```javascript
  if(!a||t?.type!=='queued')return;
  ```
  with:
  ```javascript
  if(!a)return;
  if(t?.type!=='queued'){runFrontAction();return;}
  ```
- [x] **1.3 Allow open-ground walk only when action queue is empty:** Confirm `mapClick(p)` (`src/game.js` line 45) retains `if (actions.length) { say('Tap a numbered step to cancel it.'); return; }` before starting a new `type: 'walk'`, so queued tasks are never overwritten by accidental sand clicks.
- [x] **1.4 Clear stale `wait` flags on action cancellation:** In `queueAction()` (`src/game.js` line 48), when removing a queued action at `idx === 0`, ensure `owner.walking = false; owner.path = []; owner.pathIndex = 0; pending = null;` runs even if `removed.wait` was true, and immediately call `runFrontAction()`.

#### Exit Checks (Milestone 1)
- [x] **Check 1A (Walk-then-queue handoff):** Start Shift 1, click open sand at `(455, 340)` to start a ground walk, and while the owner is still moving, click the first waiting guest in the queue and then `Coconut Bar`. **Pass:** The owner immediately redirects to check in the guest (`badge 1`) and then walks to `Coconut Bar` (`badge 2`). **Fail:** The owner stops at `(455, 340)` with `badge 1` frozen on the guest.
- [x] **Check 1B (Queue-cancel recovery):** Queue 3 actions (`checkin`, `shop`, `restock`), then tap `badge 1` to cancel it mid-walk. **Pass:** `badge 2` becomes `badge 1`, the owner immediately re-routes to the new front action, and no orphaned badge remains. **Fail:** Owner freezes or `actions` fails to advance.

---

### Milestone 2 — True Obstacle & Lounger Collision in Grid Routing (Fixes P1 Pathing)

**Problem in current code:**
In `src/game.js` (line 46), `pointBlocked(x, y, openSeat = -1)` only checks `x < 8 || x > 952 || y < 8 || y > 532`. In addition, `buildRoute()` (line 47) calls `pointBlocked(c*step+step/2, r*step+step/2)` without forwarding `openSeat`, and `canStand(entity, x, y)` (line 48) calls `pointBlocked(x, y)` without forwarding `entity.seat ?? entity.openSeat ?? -1`. Characters walk straight through shops, props, and occupied loungers.

#### Implementation Checklist
- [x] **2.1 Define obstacle rectangles in `pointBlocked(x, y, openSeat = -1)`:** Update `pointBlocked(x, y, openSeat = -1)` (`src/game.js` line 46) to return `true` when `(x, y)` falls inside:
  1. Outer canvas margins: `x < 12 || x > 948 || y < 12 || y > 528`.
  2. Any shop footprint in `Object.values(shopDefs)` inset by 6px so approach points stay clear: `x >= s.rect.x + 6 && x <= s.rect.x + s.rect.w - 6 && y >= s.rect.y + 6 && y <= s.rect.y + s.rect.h - 10` (`drink`: `26..154, 136..260`; `rental`: `806..934, 136..260`; `snack`: `806..934, 356..480`).
  3. Any `mapProps` obstacle box (`p.obstacle`):
     - `bbq`: `x: 26..154, y: 357..483`
     - `storage`: `x: 183..229, y: 375..405`
     - `scooter`: `x: 184..228, y: 440..468`
  4. Any lounger in `seats` where index `i !== openSeat`: `Math.abs(x - seats[i].x) < 24 && Math.abs(y - seats[i].y) < 30`.
- [x] **2.2 Forward `openSeat` in `buildRoute()` and `canStand()`:**
  - In `buildRoute(entity, target, openSeat = -1)` (`src/game.js` line 47), change `const blocked = (c, r) => pointBlocked(c*step+step/2, r*step+step/2);` to `const blocked = (c, r) => pointBlocked(c*step+step/2, r*step+step/2, openSeat);`.
  - In `canStand(entity, x, y)` (`src/game.js` line 48), change `return !pointBlocked(x, y)` to `return !pointBlocked(x, y, entity.seat ?? entity.openSeat ?? -1)`.
- [x] **2.3 Verify all key coordinates remain unblocked:**
  - Owner home/spawn: `(700, 490)` — clear.
  - Guest spawn points: `(250, 516)`, `(700, 516)`, `(430, 516)` — clear.
  - Queue spots: `x = 520 - i * 38` (`406..520`), `y = 510..514` — clear.
  - Shop approach points: `drink (180, 290)`, `rental (775, 290)`, `snack (775, 510)` — clear.
  - Guest approach points (`guestApproach(g)`): `seat.x ± 52, seat.y` and `seat.x, seat.y ± 56` — all outside the `±24 × ±30` lounger box.
- [x] **2.4 Draw visible route indicator while owner walks:** In `draw()` (`src/game.js` line 54), when `owner.walking && owner.path?.length > owner.pathIndex`, render a subtle dotted sand-path line and destination ring at `owner.path.at(-1)` (`strokeStyle = '#18a99c88'`, `lineWidth = 2`, `setLineDash([5, 5])`) so the player has immediate visual confirmation of the routed path around obstacles (`GAME_IMPROVEMENT_CHECKLIST.md` Section 1).

#### Exit Checks (Milestone 2)
- [x] **Check 2A (Shop & prop collision):** On Shift 1, position the owner at `(700, 490)` and click `Coconut Bar` (`90, 200`), then click a seat on the opposite side of the lounger grid. **Pass:** The owner's route curves around the `24×30` lounger boxes and never crosses through `Coconut Bar`, `BBQ Bar`, `Supply Depot`, `Scooter`, or occupied loungers; a dashed route line is visible while walking. **Fail:** The owner walks through any lounger or building rect, or gets stuck (`That route is blocked`) when clicking a valid shop or seated guest.
- [x] **Check 2B (Direct click on blocked prop):** Click directly inside the `Coconut Bar` roof (`90, 200`) vs. inside a non-interactive blocked prop on Shift 2 (`BBQ Bar` at `90, 410`). **Pass:** Clicking `Coconut Bar` routes to `drink.approach` (`180, 290`); clicking `BBQ Bar` displays `The BBQ stand is closed in this demo.` without walking inside the obstacle. **Fail:** Owner walks into the prop sprite.
- [x] **Check 2C (WASD collision):** Hold `A` / `W` to walk the owner against the bottom edge of `Coconut Bar` (`y = 260`) and against a lounger (`285, 265`). **Pass:** The owner slides along or stops at the obstacle boundary without entering it. **Fail:** Owner clips through the lounger or hut.

---

### Milestone 3 — Unified On-Beach Supply Refill UX & Mobile Landscape Touch Targets (Fixes P1 Touch & Refill Split)

**Problem in current code:**
1. At `844×390` mobile landscape, the canvas renders at `573×323` (`scale = 0.597`). In `shopMarks()` (`src/game.js` line 44), supply circles have `r = 13` (`15.5px` CSS diameter), hit radius `r + 8 = 21` (`25.1px` CSS hit diameter), and `dx = 32` (`19.1px` CSS spacing)—failing the `44×44` CSS pixel target requirement and causing adjacent hit zones to overlap.
2. `lowSupplies(s)` (`src/game.js` line 44) hardcodes `if (!s || s.id !== 'drink' || !shopOpen(s)) return [];`, and `finishOwnerTask()` (line 48) still calls `beginCanvasRefill(s, item)` on hut tap for `Fruit Shack` (`snack`) and `Beach Rentals` (`rental`), violating `.cursor/skills/ux-ui-design/SKILL.md` ("A tap on the hut prepares or collects. It does not restock.").
3. `openStation()`, `hideStation()`, `renderStation()`, `refill()`, `supplyDraft`, and `#station-panel` in `index.html` / `src/styles.css` / `src/game.js` are dead code that is never opened during play.

#### Implementation Checklist
- [x] **3.1 Remove dead `#station-panel` DOM code and `beginCanvasRefill`:**
  - Remove `<section class="station-panel" id="station-panel" ...>` from `index.html` (lines 32–35).
  - Remove `.station-panel`, `.station-header`, `.station-pill`, `.station-body`, `.station-guide`, `.recipe-card`, `.supply-row`, `.ready-card`, `.station-progress`, and `.station-footnote` rules from `src/styles.css`.
  - Remove `openStation`, `hideStation`, `renderStation`, `refill`, `beginCanvasRefill`, and `supplyDraft` from `src/game.js`.
- [x] **3.2 Unify per-ingredient supply-dot restock across all 3 shops (`drink`, `snack`, `rental`):**
  - In `finishOwnerTask()` (`src/game.js` line 48), when `s` does not have enough ingredients (`!enough`), use the same rule for **every** shop (remove `if (s.id === 'drink')` branch and `beginCanvasRefill`):
    ```javascript
    if(!enough){
      if(s.refill){a.wait=true;return;}
      const missing=item?Object.entries(product[item].recipe).filter(([k,n])=>s.materials[k].qty<n).map(([k])=>s.materials[k].name):[];
      say(missing.length?`Not enough ${missing.join(' or ')}. Tap that gray supply marker beside ${s.name}.`:`${s.name} needs supplies. Tap a gray supply marker beside the shop.`);
      actions.shift();runFrontAction();return;
    }
    ```
  - Update `README.md` (line 13) so it accurately documents tapping the gray supply marker beside a shop to restock that ingredient instead of referencing the removed shop panel.
- [x] **3.3 Enlarge supply markers and guarantee `>= 44×44` CSS px non-overlapping touch targets at `844×390` landscape:**
  - In `src/styles.css` (`@media (orientation: landscape) and (max-height: 520px)`), tighten `.shell { padding: 2px 6px; }`, `.topbar { min-height: 28px; margin: 0 0 2px; }`, `.shift-card, .hud-card.stat-card, .icon-button { min-height: 28px; padding: 2px 6px; }`, and `.game-card { padding: 2px; }` so the `16:9` canvas at `844×390` renders at `629×354` CSS pixels (`scale = 0.655×`).
  - In `shopMarks(s)` (`src/game.js` line 44):
    - Place the `ready` badge on the front corner of the hut (`x = right ? s.rect.x + 22 : s.rect.x + s.rect.w - 22`, `y = s.rect.y + s.rect.h - 18`, `r = 15`) so it sits inside the hut's tap target (tapping the hut or its ready badge prepares/collects).
    - Place the `supply` markers in a dedicated row below the hut (`y = s.rect.y + s.rect.h + 24`, visual radius `r = 16`, center-to-center spacing `dx = right ? -68 : 68`, starting at `x0 = right ? s.rect.x + s.rect.w - 28 : s.rect.x + 28`). For `Coconut Bar`, the 3 supply centers are `(48, 294)`, `(116, 294)`, and `(184, 294)`.
    - Shift the decorative `BBQ BAR` plaque down by 14px in `draw()` (`y = 326` instead of `312`) so it never touches the supply row.
  - In `supplyHit(p)` and `stationAt(p)` (`src/game.js` line 44):
    - Cap `stationAt(p)` bottom boundary at `s.rect.y + s.rect.h - 4` (`y <= 266` for top shops, `y <= 486` for `Fruit Shack`).
    - Give each supply marker a non-overlapping `68×68` logical pixel hit box (`Math.abs(p.x - spot.x) <= 34 && p.y >= s.rect.y + s.rect.h - 3 && p.y <= spot.y + 37`). At `844×390` (`scale = 0.655×`), each supply target measures `44.5×44.5` CSS pixels (`>= 44px` on both axes) with zero overlap between adjacent ingredients or the hut roof.
- [x] **3.4 Draw queued action badge on restock markers:**
  - In `drawSupplyCard()` (`src/game.js` line 52), check `const restockNo = actionNumber('restock', spot.key);` and if `restockNo > 0`, call `drawActionBadge(spot.x + 12, spot.y - 12, restockNo)` so queued restocks display their step number (`1..4`) just like shop and guest actions.

#### Exit Checks (Milestone 3)
- [x] **Check 3A (Tap separation & `>= 44×44` CSS px measurement at `844×390` and `1920×1080`):** On Shift 1, prepare one batch of 3 Coconut Coolers (`5/8 → 2/8` for coconuts, ice, and cups so all three supply markers turn gray). Tap the `Coconut Bar` roof (`90, 200`) to collect a cooler, then tap the gray `coconut` marker (`x = 48, y = 294`). **Pass:** At `844×390`, each supply hit box measures at least `44×44` CSS pixels (`68 * 0.655 = 44.5px`); tapping the hut collects 1 cooler (`badge 1`); tapping the `coconut` marker queues `Coconuts +6 · 4.9s · 8/8` (`badge 2`) with a numbered badge on the coconut circle, leaving `Ice` and `Cups` at `2/8`. **Fail:** Shorter side of any supply target is `< 44` CSS px at `844×390`, tapping the supply circle triggers shop collect/prepare, or tapping the hut triggers a restock.
- [x] **Check 3B (Fruit Shack & Beach Rentals parity on Shift 6):** Start Shift 6 (`Float Time`), prepare swim rings at `Beach Rentals` until `float` is below the batch cap (`< 3`), and tap the gray `float` marker below `Beach Rentals`. **Pass:** Only `Swim rings` restocks; tapping the `Beach Rentals` roof when out of stock displays `Not enough Swim rings. Tap that gray supply marker beside Beach Rentals.` instead of auto-refilling. **Fail:** Tapping `Beach Rentals` roof starts an automatic refill.

---

### Milestone 4 — Accessibility, Contrast, Focus Rings & Shift-Reset Protection (Fixes P1 & P2 UI Issues)

**Problem in current code:**
1. Zero `:focus-visible` rules exist in `src/styles.css`.
2. `.icon-button` (`#pause`) is `40px` wide (below `44px` minimum target width).
3. Clicking `.brand` (`<a class="brand" href="#home">`) in the top-left corner during an active shift jumps the URL hash without pausing or warning, and sits right above `Coconut Bar`.
4. Contrast failures measured at `1920×1080`: `.stat-card small` (`#82989a` on `#ffffff`) is `3.04:1` at `9px`; `.help-row` / `#guide-text` (`#769094` on `#dff5ef`) is `2.98:1` at `10px`; `.control-label` is `3.3:1`.

#### Implementation Checklist
- [x] **4.1 Add high-contrast `:focus-visible` styles:** In `src/styles.css`, add:
  ```css
  button:focus-visible, a:focus-visible, [tabindex]:focus-visible {
    outline: 3px solid #0d5c75;
    outline-offset: 2px;
  }
  ```
- [x] **4.2 Widen `.icon-button` (`#pause`) to `>= 44×44` CSS px:**
  - In `src/styles.css`, change `.hud` grid template from `repeat(3, minmax(78px, 1fr)) 40px` to `repeat(3, minmax(78px, 1fr)) 44px` (and in media queries from `40px` / `38px` / `34px` to `44px`), and set `.icon-button { width: 44px; min-height: 44px; }`.
- [x] **4.3 Guard `.brand` click during active gameplay:**
  - In `src/game.js`, bind `$('brand')` or `document.querySelector('.brand')` `onclick`:
    ```javascript
    document.querySelector('.brand').addEventListener('click', e => {
      e.preventDefault();
      if (mode === 'playing') pause();
      else menu();
    });
    ```
- [x] **4.4 Fix WCAG AA contrast ratios (`>= 4.5:1` for small text):**
  - In `src/styles.css`:
    - Change `.stat-card small` color from `#82989a` (`3.04:1`) to `#456366` (`6.35:1` on `#ffffff`) and font-size from `9px` to `10px`.
    - Change `.help-row` color from `#769094` (`2.98:1`) to `#3d5d61` (`6.12:1` on `#dff5ef`) and font-size from `10px` to `11px`.
    - Change `.small-note` color in dialogs from `#849a98` to `#4a676a` (`5.7:1` on `#fffdf5`).
    - Change `.brand small` color from `#66848a` to `#456366`.

#### Exit Checks (Milestone 4)
- [x] **Check 4A (Measured contrast check):** Run `getComputedStyle` luminance check in the browser at `1920×1080`. **Pass:** `.stat-card small`, `#guide-text`, `#message`, `#carry-status`, and `.small-note` all measure `>= 4.5:1` contrast against their respective backgrounds. **Fail:** Any text element measures `< 4.5:1`.
- [x] **Check 4B (Pause button target size & brand link guard):** Measure `#pause.getBoundingClientRect()` at `1920×1080` and `844×390`, then click `.brand` during Shift 1. **Pass:** `#pause` measures at least `44×44` CSS px at both viewports, and clicking `.brand` during a shift opens the `Shift paused` modal instead of losing shift state. **Fail:** `#pause` width or height is `< 44px`, or `.brand` does not pause.
- [x] **Check 4C (Keyboard focus visibility):** Press `Tab` on the main menu modal and during gameplay. **Pass:** Every focused button and link displays a `3px solid rgb(13, 92, 117)` focus ring (`outlineStyle === 'solid'`, `outlineWidth === '3px'`). **Fail:** `outlineStyle` is `none`.

---

### Milestone 5 — Visual System Polish & *Beach Party Craze* Feedback Parity (Fixes P2 Polish)

**Problem in current code:**
1. `art.requests` (`src/game.js` line 11) has painted PNG icons for `drink`, `snack`, and `float`, but no `umbrella` request icon, falling back to system emoji `⛱️` on Shift 6+.
2. `art.table` (`assets/game/props/side-table-coconut.png`) and `art.tote` (`assets/game/props/beach-tote.png`) are loaded on line 11 of `src/game.js` but never drawn in `draw()`.
3. `save.sound` toggles `Sound: On / Off` in the main menu, but zero audio feedback exists when checking in guests, completing prep, delivering orders, or refilling stock.

#### Implementation Checklist
- [x] **5.1 Render `umbrella-coral.png` (or dedicated umbrella icon) in `art.requests.umbrella`:**
  - In `src/game.js` (line 11), wire `umbrella: load('assets/game/props/umbrella-coral.png')` inside `art.requests` (or export `assets/game/ui-icons/icon-request-umbrella.png`), so `requestMark()`, `drawMiniStack()`, and `drawReadyMark()` render consistent painted art instead of a system emoji.
- [x] **5.2 Render decorative `side-table-coconut.png` and `beach-tote.png` props without blocking lanes:**
  - In `draw()` (`src/game.js` line 54), draw `art.table` (`34×34`) beside the front row of loungers and `art.tote` (`32×32`) near the bottom-right sand decoration (`x = 715, y = 415`), keeping them purely visual so they do not block `pointBlocked()`.
- [x] **5.3 Wire lightweight Web Audio synthesizer cues when `save.sound === true`:**
  - Add a tiny zero-asset `playTone(kind)` helper using `window.AudioContext` (`checkin`, `prepDone`, `deliver`, `refillDone`, `unhappy`) that plays short, gentle sine/triangle chimes only when `save.sound` is `true`.

#### Exit Checks (Milestone 5)
- [x] **Check 5A (No emoji fallback on Shift 6):** Start Shift 6 and observe a guest or `Beach Rentals` plaque requesting an umbrella. **Pass:** `requestMark()` draws the painted umbrella image (`im.complete && im.naturalWidth > 0`). **Fail:** System emoji `⛱️` is rendered on canvas.
- [x] **Check 5B (Sound toggle behavior):** With `Sound: Off`, play Shift 1 and confirm no `AudioContext` oscillator runs; toggle `Sound: On` in the menu and confirm check-in and delivery trigger audible tones without console errors.

---

### Milestone 6 — Remove Bottom Supply Button Row & Simplify Shop Stock/Refill (UX Simplification)

**Why this change is needed (User feedback):**
The row of 4 circular buttons below the Coconut Bar (`ready drink (1)` + `coconut` + `ice` + `cup`) is too complex:
1. Every drink consumes `1 coconut + 1 ice + 1 cup` in lockstep (`5/8 → 2/8`), so all three gray buttons always run out at the same time and force the player to tap three separate circles just to refill one bar.
2. Rendering 3–4 circles under each shop clutters the sand and splits one question (*"Can this shop serve or does it need a refill?"*) across four icons.

#### Implementation Checklist
- [x] **6.1 Remove the bottom row of per-ingredient buttons (`shopMarks`, `supplySpots`, `supplyHit`, `onSupplyTap`, `drawSupplyGlyph`):**
  - In `src/game.js`, delete `drawSupplyGlyph()`, `supplySpots()`, `supplyHit()`, and `onSupplyTap()`, and remove `const supply = supplyHit(p); if (supply) { onSupplyTap(supply); return; }` from `mapClick(p)`.
  - Remove the `kind: 'supply'` loop from `shopMarks(s)` so no `coconut`, `ice`, `cup`, `fruit`, `wrapper`, `float`, or `umbrella` circles are drawn on the sand below any shop.
- [x] **6.2 Collapse per-ingredient restocking into a single shop-level stock & refill action:**
  - Give each shop a single unified stock pool (`s.stock = 5`, `s.maxStock = 8 + save.upgrades.capacity * 2` for `drink`; `4/7` for `snack`; `3/5` for `rental`)—or refill all materials of shop `s` together in one action (`s.refill = { amount, timer, total }`).
  - Remove `action.material` from `{ type: 'restock', id: s.id }` so a restock action applies to the shop as a whole (`Coconut Bar +6 · 3.8s · 8/8`).
- [x] **6.3 Use ONE on-hut visual indicator (no buttons on the sand below the shop):**
  - Render the ready stack directly on the shop counter (`drawReadyMark` on the front corner of the hut with the stack count badge `drawStackCount(ready.x, ready.y - 10, s.stack.length)` when `s.stack.length > 0`, plus the radial progress arc while `s.prep` or `s.refill` is active).
  - Show stock & state on the shop's overhead wooden plaque (`drawPlaque` in `drawStation(s)`):
    - `READY TO PREP · 5/8` when idle and stocked
    - `PREPARING...` when filling a batch
    - `ORDER READY (3)` when prepared items are stacked on the counter
    - `LOW STOCK · TAP TO REFILL` when `s.stack.length === 0` and stock cannot cover the next order/batch
    - `REFILLING...` while supplier delivery is underway
- [x] **6.4 Make a single tap on the shop handle Prepare, Collect, or Refill automatically:**
  - When the player taps a shop (`queueAction({ type: 'shop', id: s.id })`) and the owner arrives in `finishOwnerTask()`:
    1. If `s.stack.length > 0`: **Collect** 1 ready order into `carry`.
    2. Else if `s` has enough stock to prepare a batch: **Prepare** the batch (`s.prep`).
    3. Else (stock is empty/low): **Start the shop refill** (`s.refill`) automatically in one tap, announcing `Refilling Coconut Bar +6 (3.8s · 8/8).` in `#message`.
- [x] **6.5 Update `README.md`, `GAME_DESIGN_PRINCIPLES.md`, and `.cursor/skills/ux-ui-design/SKILL.md`:**
  - Remove references to tapping gray ingredient circles on the sand and document the single shop-tap workflow (Prepare / Collect / Refill).

#### Exit Checks (Milestone 6)
- [x] **Check 6A (Zero bottom supply circles on sand):** Start Shift 1 and Shift 6. **Pass:** Neither `Coconut Bar`, `Fruit Shack`, nor `Beach Rentals` renders the row of 3–4 circular buttons in the sand below the hut; only the hut, its overhead plaque, and its counter ready-stack badge appear. **Fail:** Any ingredient circle (`coconut`, `ice`, `cup`, etc.) is drawn below a shop.
- [x] **Check 6B (One-tap prepare, collect, and refill):** On Shift 1, tap `Coconut Bar` to prepare 3 coolers, collect and deliver them until stock is depleted, then tap `Coconut Bar` again. **Pass:** Tapping `Coconut Bar` when stock is low/empty starts a single unified refill for the bar without requiring 3 separate ingredient taps. **Fail:** Player must tap multiple buttons to restock the shop.

**Implementation note:** 2026-10-25. Shift 1 at desktop: no ingredient circles on the sand. Plaque showed `READY TO PREP · 5/8`, then one hut tap filled 3 coolers, then `ORDER READY (2)` with the stack badge on the hut counter, then `READY TO PREP · 2/8`. A hut tap with empty stock starts `Refilling Coconut Bar +N (…s · 8/8).` `node --check src/game.js` passed. Fruit Shack and Beach Rentals use the same single-pool hut tap; they stay locked on Shift 1.

---

### Milestones 7–10 — Image Quality & HiDPI Rendering Handoff (`IMAGE_QUALITY_HANDOFF.md`)

See `beach-star/IMAGE_QUALITY_HANDOFF.md` for the complete specification and verification runbook covering:
- [x] **Milestone 7 (HiDPI / Retina Canvas Backing Store & `imageSmoothingQuality = 'high'`):** Scale `canvas.width` and `canvas.height` dynamically to `Math.round(cssWidth * Math.min(3, devicePixelRatio))` (`up to 2880×1620`) and apply `ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0)` + `ctx.imageSmoothingQuality = 'high'` in `draw()` while preserving all `960×540` logical coordinates.
- [x] **Milestone 8 (Re-export `1024×1024` Shop Kiosks from `1312×1199` Source Masters):** Re-export `coconut-bar.png`, `fruit-shack.png`, `beach-rentals.png`, and `bbq-grill.png` at `1024×1024` RGBA from `assets/source/beachstar-bars-2026-10-25/`.
- [x] **Milestone 9 (Normalize Idle Character Padding & Scale for `guest-01`):** Crop/scale `assets/game/characters/guest-01.png` (`428×728` opaque inside `1254×1254`) to match `guest-02` / `guest-03` (`~980px` opaque height, `idleFoot = 0.89`, `walkScale = 0.80`).
- [x] **Milestone 10 (Plaque Typography & Dedicated `icon-request-umbrella.png`):** Increase `drawPlaque()` title/state font sizes (`10px` / `8.5px`) and export a tight-cropped `assets/game/ui-icons/icon-request-umbrella.png`.

---

### Milestones 11–13 — Character Walk Cycle & Limb-Alternation Handoff (`WALK_ANIMATION_HANDOFF.md`)

See `beach-star/WALK_ANIMATION_HANDOFF.md` for the complete specification and verification runbook covering:
- [x] **Milestone 11 (Rebuild 64 Walk Frames with True Limb Alternation `Contact A -> Passing -> Contact B -> Passing`):** Replace the duplicate-pose rows in `assets/source/*-walk-atlas.png` and `assets/game/characters/{staff,guest-01,guest-02,guest-03}/walk/{front,right,back,left}/frame-{0..3}.png` so `frame-0` (left foot lead / right arm forward), `frame-1` (passing stance), `frame-2` (right foot lead / left arm forward), and `frame-3` (passing stance) visibly alternate legs and arms with a locked hip center (`cx = 157`) and planted foot baseline (`y = 307`).
- [x] **Milestone 12 (Distance-Driven Stride Phase & Direction Hysteresis in `src/game.js`):** Drive walk frame selection from actual distance traveled (`entity.stride += movedDist * 0.095`, frame `Math.floor(entity.stride) % 4`), synchronize vertical step bob with the passing/contact phases, and add `4px` axis hysteresis in `moveToward()` to eliminate diagonal facing flicker.
- [x] **Milestone 13 (Visual Inspection & Playtest Sign-off):** Verify all 4 characters in all 4 directions (`front`, `right`, `back`, `left`) in live browser play and close the directional animation items in `GAME_IMPROVEMENT_CHECKLIST.md`.

---

## 5. Verification Runbook

Run all verification steps from `/Users/jirotjoe/Projects/beach-star`:

1. **Syntax check:**
   ```bash
   node --check src/game.js
   ```
   Must exit `0` with no output.

2. **Local HTTP server:**
   ```bash
   python3 -m http.server 8765 --bind 127.0.0.1
   ```

3. **Browser playtest matrix (`http://127.0.0.1:8765/index.html`):**
   - **Desktop viewport:** `1920×1080`, `deviceScaleFactor: 1`.
   - **Mobile landscape viewport:** `844×390`, `deviceScaleFactor: 2`, `mobile: true`.
   - Execute Exit Checks `1A–1B`, `2A–2C`, `3A–3B`, `4A–4C`, `5A–5B`, `6A–6B`, `7A–10A`, and `11A–13`.
   - Verify zero `console.error` or uncaught page exceptions across a complete Shift 1 win, a Shift 1 ignored-guest departure, and a Shift 6 rental + restock cycle.

---

## 6. Definition of Done

- All 13 milestones and their exit checks (`1A–6B`, `7A–10A`, `11A–13`) pass in live browser testing at `1920×1080` and `844×390`.
- `node --check src/game.js` passes.
- `README.md`, `GAME_IMPROVEMENT_CHECKLIST.md`, `IMAGE_QUALITY_HANDOFF.md`, `WALK_ANIMATION_HANDOFF.md`, and `progress.md` are updated to record the verified results.
