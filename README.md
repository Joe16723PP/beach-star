# BeachStar

BeachStar is a single-player, top-down beach resort time-management game. The playable campaign runs directly in a modern browser and uses the art in `assets/game/`.

## Play

Open `index.html` in a browser. No build step or package install is required. Game progress, coins, stars, and upgrades are saved in browser local storage.

## Shift controls

- Click or tap the first customer in the queue to check them in. The owner walks over, then the customer automatically takes an open lounger.
- Click or tap a labeled shop to walk there. Prepare its recipe, collect the ready order, then click or tap the matching seated guest to deliver it.
- Use the shop panel to refill individual ingredients. Choose an amount and start the supplier delivery; shop capacity prevents overfilling.
- Click or tap open beach ground to walk there, or move with **WASD** / **arrow keys**. The route is shown on the map.
- Guests relax after an order; some may request another item during the same visit. Rentals return to the kiosk shortly after the guest leaves.
- Press **P** or **Escape** to pause.

## Campaign

The first shift teaches check-in before its clock starts, then introduces the coconut bar. Later shifts add the fruit shack and rentals, repeat requests, and supplier refills. Prompt deliveries earn coins and combo rewards. Complete each customer-visit goal to earn stars and unlock shifts; use earnings on patience, shop-capacity, and tip upgrades. The shift HUD tracks visits separately from fulfilled orders. A helper is deferred until it can follow the same preparation and delivery rules.

## Project files

- `index.html` — game page shell.
- `src/game.js` — campaign, service loop, progression, save data, and canvas scene.
- `src/styles.css` — responsive interface styles.
- `assets/game/` — generated game illustrations.
- `assets/game/props/` — original props plus drink-bar, snack-bar, rental-shop, BBQ, storage-hut, and restock-scooter art. All six are visible in the beach scene. BBQ service and depot/scooter supply runs are scenery only; current refills still start at each shop.
- `assets/game/characters/guest-0N/walk/` — each guest's four-direction, four-frame walking animation.
- `assets/game/characters/staff/walk/` — the server's four-direction, four-frame walking animation.
- `assets/source/*-walk-atlas.png` — original generated sprite atlases used to create the frames.
- `FEATURES_PLAN.md` and `GAME_DESIGN_PRINCIPLES.md` — product and design direction.
