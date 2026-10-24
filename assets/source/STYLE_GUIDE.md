# BeachStar Mini Style Guide

## Visual target

- Camera: readable high-angle 2D top-down view with slight three-quarter volume on characters and props.
- Medium: polished hand-painted casual-game illustration, soft surface texture, clean silhouettes, restrained outlines.
- Mood: welcoming, sunny, playful resort shift.
- Light: warm sun from upper-left; soft shadows fall lower-right.
- Detail: keep gameplay objects and request symbols clear at their actual browser size. Keep walking routes open.

## Core palette

Approximate colors sampled by eye from the approved concept; tune during integration.

- Deep ocean: `#087F9B`
- Shallow aqua: `#55C9C7`
- Foam: `#E9FFF8`
- Warm sand: `#F4D99B`
- Sand shadow: `#D9B978`
- Tropical leaf: `#267C58`
- Coral: `#F47769`
- Sunny yellow: `#F5BD43`
- Lagoon blue: `#539CD1`
- UI cream: `#FFF5DF`
- Ink: `#244D53`

## Scale and export

- Reference canvas: 960 × 540 logical pixels, 16:9.
- Initial sprite drawing target: 2× display dimensions; export a 1× copy for the browser prototype.
- Guest sprite target: about 48 × 80 logical pixels including a soft ground shadow; keep head and body readable at 1×.
- Small request icons: 32 × 32 logical pixels; request bubbles about 48 × 36 logical pixels.
- Use transparent PNG for separate gameplay art. Keep HUD words and numbers as HTML text.
- Use lowercase, hyphenated filenames and preserve transparent padding around animation poses.

## Consistency checks

- Use matching light direction, shadow softness, texture density, and edge treatment across all art.
- Guest silhouettes and request symbols must remain distinguishable on pale sand.
- Avoid text embedded in game art except the approved title treatment; keep it separate from world assets when possible.
- The concept image is a visual reference, not a production-ready atlas. Create reusable original assets that fit the game layout.
