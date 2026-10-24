# BeachStar Asset Crafting Plan

## Art direction

Use the selected BeachStar concept as the visual target: cheerful hand-painted 2D art, warm sunlit sand, turquoise water, colorful fabric, rounded forms, and clear silhouettes. Keep the play area readable at a glance. The current demo is a 960 × 540 browser canvas, so design assets for a 16:9 view and test them at that displayed size.

**Production rule:** paint world art and characters in Krita; keep interface labels, counters, and buttons as HTML/CSS so text stays sharp, legible, and easy to localize.

## Asset scope for the first polished slice

### 1. Beach environment

- Main beach background: water, shore foam, sand, and subtle sand texture.
- Edge dressing: palm leaves, flowers, rocks, shells, footprints, and a few beach props.
- Clear guest walking lanes between the bar, loungers, and rental kiosk.
- Keep interactive objects on separate transparent layers so positions can change without repainting the whole scene.

### 2. Service locations and props

- Beach bar exterior and counter, with a small number of readable drink/snack props.
- Rental kiosk and float display.
- Umbrellas, towels, loungers, and side tables; make each a separate reusable prop.
- Optional visual states for important props, such as available versus in-use lounger and stocked versus empty counter.

### 3. Guests and staff

- Start with three distinct guest designs with different silhouettes, hair, swimwear colors, and skin tones.
- One staff character carrying a tray or a selected service item.
- Draw front, back, and side-facing poses before adding extra costumes.
- Add a minimal walk cycle (4 frames per direction) and a simple idle (2 frames) once static scale and readability are approved.

### 4. Gameplay indicators

- Request icons: coconut drink, watermelon snack, swim float.
- Speech-bubble frame, patience bar, selection ring, coin reward pop, and small happy/unhappy feedback marks.
- Draw icons as separate transparent files. Keep request recognition based on both shape and color.

### 5. Interface styling

- HTML/CSS HUD cards, pause button, service selector, selected-service state, and result panel.
- Use a friendly rounded display font only if it is available and licensed for the project; otherwise use a readable system font.
- Avoid baking words or numbers into painted images. Keep icons separate from labels.

## Krita file and export setup

Create project art in `BeachStar/assets/source/` as layered `.kra` files. Export game-ready images to `BeachStar/assets/game/` as transparent PNGs for characters, props, and icons. Use JPG or WebP only for opaque full-screen backgrounds after checking visual quality and browser support.

Suggested folders:

```text
assets/
  reference/       # approved concept screenshots and color references
  source/          # editable Krita .kra files
  game/
    backgrounds/
    characters/
    props/
    ui-icons/
```

Suggested naming: `beach-background.png`, `guest-01-idle-front.png`, `guest-01-walk-front-01.png`, `staff-idle-side.png`, `prop-umbrella-coral.png`, `icon-request-drink.png`. Use lowercase, hyphens, and stable names.

## Drawing and delivery standards

- Work at 2× the intended on-screen pixel size for characters, props, and icons, then export a 1× version for the current demo. This gives room for crisp scaling without forcing large download sizes.
- Keep transparent assets tightly cropped with a little padding around animation poses; align animation frames to a consistent baseline.
- Use separate layers for linework, base color, shadow, highlights, and small details. Name layers by purpose.
- Maintain a compact palette and a shared light direction from the upper-left. Use the same outline weight and shadow softness across assets.
- Check icons at their actual small HUD size. Remove details that disappear when reduced.
- Keep important characters and service indicators visually distinct from the sand and foliage.

## Production order

1. **Lock a mini style guide:** palette swatches, outline/shadow examples, UI corner style, and one character scale test.
2. **Paint one representative scene:** beach background plus one umbrella, one lounger, one guest, one staff member, and three request icons.
3. **Review in the browser:** replace rough canvas shapes with the sample exports and check clarity at desktop and narrow-window sizes.
4. **Complete the MVP set:** finish remaining guest variations, stations, props, and feedback icons using the approved scale and palette.
5. **Add animation:** idle and walk cycles first; add service/celebration reactions only after gameplay calls for them.
6. **Polish and optimize:** remove unused layers from exports, compress opaque backgrounds, and check every filename and alpha edge in the browser.

## First asset milestone

The first reviewable asset pack should contain one beach background, one bar, one rental kiosk, three umbrella styles, three loungers, one staff character, three guest characters, and the three request icons. That is enough to replace the current placeholder look for one playable scene without committing to a large campaign pack.

## Scope to defer

Do not produce a large guest roster, multiple beach themes, extensive cosmetics, detailed narrative illustrations, or a full set of mini-game art before the first scene is readable and fun. Create additional art in response to a demonstrated gameplay need.

## Rights and source tracking

Create original drawings for BeachStar. Use the selected generated concept as visual direction, not as a reason to reproduce another game's characters, logos, or exact composition. Record the source and license for any external brush, font, or reference asset before including it in the project.
