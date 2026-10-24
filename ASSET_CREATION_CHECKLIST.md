# BeachStar Asset Creation Checklist

Checklist for producing the first polished, single-scene demo in Krita. The scope follows the selected sunny, hand-painted top-down concept and the current 16:9 browser demo.

## 1. Setup and style guide

- [x] Save the selected BeachStar concept image under `assets/reference/`.
- [x] Create `assets/source/` for editable Krita files.
- [x] Create export folders: `assets/game/backgrounds/`, `characters/`, `props/`, and `ui-icons/`.
- [x] Record a compact palette for ocean, foam, sand, foliage, coral, yellow, and UI cream.
- [x] Set a shared light direction, outline weight, shadow softness, and character scale.
- [x] Create a sample guest and umbrella prop.
- [ ] Review the samples in the actual browser at final gameplay size.

## 2. Environment art

- [x] Create the main beach background: turquoise water, foam, shoreline, and sand.
- [x] Add subtle sand texture that does not compete with gameplay objects.
- [x] Include edge foliage and rocks to frame the play area without blocking it.
- [x] Include small decorative details: shells, footprints, and flowers.
- [x] Keep clear walking lanes between the bar, guests, and rental kiosk.

## 3. Stations and reusable props

- [x] Create the beach bar exterior and service counter.
- [x] Create the rental kiosk and float display.
- [x] Create three distinct umbrella designs.
- [x] Create three loungers and matching towels.
- [x] Create side tables.
- [x] Create small props: drink cups, snack portions, beach tote, and beach ball.
- [x] Create alternate drink-bar and snack-bar props in the BeachStar shop style.
- [x] Create an alternate rental shop and a barbecue bar prop.
- [x] Create a supply-storage hut and a restock scooter with a delivery load.
- [ ] Integrate the barbecue stand into shop unlocks, recipes, map routing, and inventory.
- [ ] Design and implement the central-storage and scooter supply-run loop before making these props actionable.
- [ ] Export important state variants if gameplay needs them: available/in-use lounger and stocked/empty counter.

## 4. Characters and animation

- [x] Design one staff character with a readable silhouette.
- [x] Design three visually distinct guests with varied silhouettes, hairstyles, and swimwear colors.
- [x] Include varied skin tones across the guest set.
- [x] Draw front, back, and side views for all three guests and the server.
- [ ] Create idle animation frames (2 frames per needed character).
- [x] Create 4-frame walk cycles in four directions for all three guests and the server.
- [x] Replace single-pose art with directional animation for every moving guest and the server.
- [x] Create staff service pose with a tray and drink.
- [ ] Create guest reactions: happy, impatient, and leaving.
- [x] Align all guest and server animation frames to a consistent baseline and leave transparent padding.

## 5. Gameplay icons and feedback

- [x] Create coconut drink request icon.
- [x] Create watermelon snack request icon.
- [x] Create swim float request icon.
- [x] Add a reusable speech bubble in the game canvas.
- [x] Add the guest patience bar background and fill style in the game canvas.
- [x] Add a guest selection marker on pointer hover.
- [x] Add floating coin reward feedback.
- [x] Add happy and unhappy feedback marks.
- [ ] Confirm each icon remains distinct at its smallest intended display size.

## 6. Interface art

- [x] Refine the BeachStar title treatment using browser text and styling.
- [x] Use timer, coin, and guest counter symbols in the HUD.
- [ ] Create a pause button icon and control.
- [x] Create Drink, Snack, and Float service button icons.
- [x] Define selected, hover/focus, disabled, and pressed states for service buttons.
- [ ] Create start-screen and end-of-shift illustrations or decorative accents.
- [x] Keep all labels, numbers, and instructions as browser text rather than painted pixels.

## 7. Export and integration

- [ ] Save source artwork as layered `.kra` files in `assets/source/` (current art is generated PNG source, not layered Krita documents).
- [x] Export characters, props, and icons as transparent PNGs to `assets/game/`.
- [x] Export the opaque background as PNG.
- [x] Use lowercase, hyphenated, descriptive filenames.
- [ ] Create optimized 1× exports; current source PNGs are higher resolution and scaled by the canvas.
- [x] Replace the demo's placeholder scene art with the new assets.
- [ ] Check the integrated scene at desktop and narrow-window sizes in a browser.
- [x] Check PNG dimensions and alpha channel presence; animation frames remain to be made.
- [x] Record the generated-art and reference provenance.

## Completion gate: first polished scene

- [x] One beach background is integrated.
- [x] One bar and one kiosk are integrated.
- [x] Three umbrellas and three loungers are integrated.
- [x] One staff character and three guests are integrated.
- [x] Three request icons are integrated.
- [ ] Verify requests, patience, and selected service at actual browser size.
- [x] The designed scene preserves open movement space and clear visual hierarchy.

## Progress notes

- The first static scene asset pack is generated and referenced by `index.html`.
- Guest arrivals and departures travel between the beach edges and loungers; the server walks to guests after service and returns to the station. All three guest variants and the server use directional walk frames while moving.
- All three guests and the server now have 4×4 transparent directional walk atlases, split into 16 frame PNGs each and integrated for their movement paths.
- The gameplay background uses a cleaner variant with most large edge foliage removed; the original background remains preserved alongside it.
- Exported art files are high-resolution PNGs; browser-scale visual review and optimized 1× exports remain.
- Six additional transparent prop PNGs are in `assets/game/props/`: `drink-bar.png`, `snack-bar.png`, `rental-shop.png`, `bbq-bar.png`, `supply-storage.png`, and `restock-scooter.png`. They are 1402×1122 with transparent corner pixels. All six are visible in the map now; the BBQ, storage, and scooter remain nonfunctional scenery while their service and delivery mechanics are designed.
- The four beach stands now share a 140×140 square map footprint in a two-by-two layout; each rendered stand uses the same square size, and their name/status plaques align above them. Visual spacing still needs browser review.
- Generated PNGs are not layered Krita `.kra` source files. Idle/reaction animation, 1× export optimization, and browser-scale integration review remain future work.

## Later, after the first scene works

- [ ] Add more guest variants and outfits.
- [ ] Add alternate beach themes or level backgrounds.
- [ ] Add extra station and upgrade illustrations.
- [ ] Add mini-game-specific art only for mini-games included in the game.
- [ ] Add decorative story illustrations if the campaign needs them.
