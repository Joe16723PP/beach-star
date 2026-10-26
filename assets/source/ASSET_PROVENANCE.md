# BeachStar Asset Provenance

## Source and method

- Art direction reference: `assets/reference/beachstar-concept-approved.png`, the BeachStar concept image selected earlier in this project.
- The PNG game art in `assets/game/` was generated specifically for BeachStar on 2026-10-24, using that concept as style guidance.
- The cleaner beach background was generated on 2026-10-24 from the original background to reduce edge foliage and preserve clearer sand lanes. The game now uses `assets/game/backgrounds/beach-background-clean.png`; `beach-background.png` remains available as the original version.
- Guest 01's directional walk atlas was generated on 2026-10-24 using `assets/game/characters/guest-01.png` as its character reference. The original atlas is retained at `assets/source/guest-01-walk-atlas.png`; its 16 transparent frames are exported under `assets/game/characters/guest-01/walk/`.
- Guest 02 and guest 03 each received a matching directional walk atlas on 2026-10-24, using their respective existing PNG as the character reference. The original atlases are retained under `assets/source/`; each atlas is split into 16 transparent frames under its matching `assets/game/characters/guest-0N/walk/` folder.
- The server's directional walk atlas was generated on 2026-10-24 using `assets/game/characters/staff-server.png` as its character reference. The original atlas is retained at `assets/source/staff-walk-atlas.png`; its 16 transparent frames are exported under `assets/game/characters/staff/walk/`.
- On 2026-10-25 the Coconut Bar, Fruit Shack, Beach Rentals, and BBQ received a distinct kiosk redesign guided by the user's Beach Party Craze screenshots. The new silhouettes use a round thatched drinks counter, a striped fruit stall, an elevated coral-roofed rental hut, and a terracotta-roofed grill. The references guide the cheerful painted beach-resort readability; the new objects are original designs. Generated source PNGs are retained in `assets/source/beachstar-bars-2026-10-25/`; fitted transparent 1024 × 1024 exports are used by the game. The prior prop files remain preserved.
- On 2026-10-25 guest-01's idle PNG was scaled to match guest-02 / guest-03 body height. The uncropped original is at `assets/source/guest-01-idle-original.png`. A tight-framed umbrella request icon was exported to `assets/game/ui-icons/icon-request-umbrella.png`.
- No external game assets, downloaded brushes, or third-party font files are included in this pack. The interface uses a system font.
- These are generated raster PNGs, not layered Krita `.kra` documents. Keep this note with the source folder until Krita source files are authored.

## Game-ready files

| File | Intended use | Dimensions | Alpha |
|---|---|---:|---|
| `backgrounds/beach-background.png` | Full 16:9 beach scene background | 1672 × 941 | Opaque |
| `backgrounds/beach-background-clean.png` | Gameplay background with quieter, more open edges | 1672 × 941 | Opaque |
| `characters/guest-01.png` | Guest character variant 1 | 1254 × 1254 | Transparent |
| `characters/guest-02.png` | Guest character variant 2 | 1254 × 1254 | Transparent |
| `characters/guest-03.png` | Guest character variant 3 | 1254 × 1254 | Transparent |
| `characters/staff-server.png` | Staff character carrying a tray | 1254 × 1254 | Transparent |
| `characters/guest-01/walk/{front,left,back,right}/frame-{0..3}.png` | Four-direction, four-frame walk cycle for guest 01 | 314 × 314 each | Transparent |
| `characters/guest-02/walk/{front,left,back,right}/frame-{0..3}.png` | Four-direction, four-frame walk cycle for guest 02 | 314 × 314 each | Transparent |
| `characters/guest-03/walk/{front,left,back,right}/frame-{0..3}.png` | Four-direction, four-frame walk cycle for guest 03 | 314 × 314 each | Transparent |
| `characters/staff/walk/{front,left,back,right}/frame-{0..3}.png` | Four-direction, four-frame walk cycle for the server | 314 × 314 each | Transparent |
| `props/beach-bar.png` | Beach bar service station | 1402 × 1122 | Transparent |
| `props/rental-kiosk.png` | Rental hut and float display | 1349 × 1166 | Transparent |
| `props/umbrella-coral.png` | Coral umbrella variant | 1254 × 1254 | Transparent |
| `props/umbrella-blue.png` | Blue umbrella variant | 1265 × 1244 | Transparent |
| `props/umbrella-yellow.png` | Yellow umbrella variant | 1308 × 1202 | Transparent |
| `props/lounger-coral.png` | Coral-striped lounger | 1246 × 1263 | Transparent |
| `props/lounger-blue.png` | Blue-striped lounger | 1246 × 1263 | Transparent |
| `props/lounger-yellow.png` | Yellow-striped lounger | 1246 × 1262 | Transparent |
| `props/side-table-coconut.png` | Side table with coconut drink | 1295 × 1214 | Transparent |
| `props/coconut-bar.png` | Distinct coconut drinks kiosk | 1024 × 1024 | Transparent |
| `props/fruit-shack.png` | Striped fruit service stall | 1024 × 1024 | Transparent |
| `props/beach-rentals.png` | Rental kiosk with swim gear display | 1024 × 1024 | Transparent |
| `props/bbq-grill.png` | Open-air BBQ stand | 1024 × 1024 | Transparent |
| `props/beach-ball.png` | Beach ball prop | 1312 × 1199 | Transparent |
| `ui-icons/icon-request-drink.png` | Coconut drink request/service icon | 1254 × 1254 | Transparent |
| `ui-icons/icon-request-snack.png` | Watermelon snack request/service icon | 1403 × 1121 | Transparent |
| `ui-icons/icon-request-float.png` | Swim float request/service icon | 1314 × 1197 | Transparent |
| `ui-icons/icon-request-umbrella.png` | Shade umbrella request/service icon | 1254 × 1254 | Transparent |

## Browser use

`index.html` keeps a 960 × 540 logical game view. The canvas backing store scales with CSS size and `devicePixelRatio` (capped at 3× / 2880×1620). Shop kiosks are 1024 × 1024; character and icon art stays at source resolution for HiDPI.
