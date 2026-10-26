# Progress

## Current state

Walk pathing is intact. A limb-split rebuild had cut the painted walk sprites (holes in skirts, disconnected feet). Those 64 frames were restored from git. Distance stride, bob, and facing hysteresis stay in `src/game.js`. Shift 1 owner walking right on open sand shows a whole character. `node --check src/game.js` passed.

## Done this session

1. Restored the painted walk PNGs after a limb-split rebuild cut through waists and feet.
2. Distance stride: `entity.stride += movedDist * 0.095` in `moveToward` and WASD. Frame `Math.floor(stride) % 4`. Idle resets stride to 0.
3. Stride bob: `-abs(sin((stride % 2) * PI)) * 1.8` while moving.
4. `faceFromDelta` requires 4px axis bias before switching horizontal vs vertical facing.
5. Browser: owner D/A/W/S ~73px each, `stride = dist * 0.095`, facings `right/left/back/front`. Queueing guest stride tracked ~250px of travel. guest-01 arriving faced left then idled. Staff plus guest-01/02/03 were on the beach together.

## Browser

Desktop `1920×1080` DPR 2 → canvas backing `2432×1368`, smoothing `high`. Owner walk frames follow WASD direction. Guests in the right-side queue faced left or right while walking in; seated guests return to idle. `python3 scripts/rebuild-walk-frames.py --check` and `node --check src/game.js` passed.

## Next

None for WALK_ANIMATION_HANDOFF. Out of scope until asked: Shift 1 spawn rate, Sound On chimes, a full win at a phone viewport.
