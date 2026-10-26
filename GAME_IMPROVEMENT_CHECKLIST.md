# BeachStar Gameplay Improvement Checklist

This checklist turns the latest gameplay feedback and `GAME_DESIGN_PRINCIPLES.md` into an implementation sequence. The core queue, movement, repeat-visit, shop-preparation, delivery, ingredient, and refill loops are implemented. Browser playtest items remain open until a permitted browser-access path is available.

The first finished drink shift is sequenced in `PLAYABLE_SHIFT_CHECKLIST.md`. Complete that list before adding stations, helpers, or timing changes.

## 1. Fix movement and navigation first

- [x] Define the player-controlled beach owner/server and the movement input for mouse, keyboard, and touch.
- [x] Replace straight-line movement with walkable routes between check-in, loungers, and exits, avoiding the fixed scene props.
- [x] Extend routed movement to map shops and customer delivery destinations; refill suppliers deliver to the owning shop, so no separate world supply-point route is needed.
- [x] Add a clickable check-in destination and a clear range for selecting the first queued customer.
- [x] Add interaction destinations and a clear arrival/interaction range for each shop and supply point.
- [x] Map movement direction to front, back, left, and right walk frames.
- [x] Verify left/right facing for every character in browser playtesting.
- [x] Keep character foot anchors, scale, and frame timing consistent when changing direction.
- [x] Prevent characters from overlapping or walking through shop counters, loungers, props, reserved seats, and one another where collision is needed.
- [x] Show movement intent and feedback when the player selects a destination; handle blocked routes without freezing or teleporting.

**Acceptance:** Move the owner to all shops, customers, and exits from multiple starting points. The owner faces the travel direction, follows a visible route, stops at the interaction point, and never slides, teleports, or becomes stuck behind a prop.

**Implementation note:** Grid routing blocks shop footprints, BBQ/storage/scooter props, and occupied loungers. `buildRoute` and `canStand` forward `openSeat`. The owner draws a dashed teal route while walking. Walk frames are distance-driven (`entity.stride`) with 4px facing hysteresis. Left/right facing for staff and all three guests was verified in Shift 1 browser play.

## 2. Build the customer arrival and seating lifecycle

- [x] Add an arrival entrance and visible waiting queue with one patience timer per waiting customer.
- [x] Add a welcome/check-in interaction that the player must complete for the next customer in queue.
- [x] After check-in, select and reserve a free beach position automatically; do not require the player to place the customer.
- [x] Route the customer from the queue/check-in point to the reserved position with the appropriate directional walk animation.
- [x] Show the customer's first request only after they are seated and ready.
- [x] Keep new arrivals queued when all positions are occupied; never assign two guests to one position.
- [x] Add clear waiting, checked-in, walking, seated, impatient, and leaving states with matching feedback.

**Acceptance:** A customer waits visibly, can be checked in, picks a free seat automatically, and then shows a request. A full beach creates a readable queue instead of overlapping guests.

**Implementation note:** Queue, check-in, automatic seat reservation, and post-seating requests are implemented. On shift 1 the shift clock waits until the checked-in guest is seated; that first tutorial guest also has extra patience. Visual behavior still needs browser playtesting (section 7).

## 3. Keep customers for multi-order visits

- [x] Separate a customer visit from an individual order in game state and level counters.
- [x] After an order is delivered, keep the customer seated for a leisure interval.
- [x] Allow a follow-up request during the same visit, with a fresh request indicator and patience timer.
- [x] Define how many follow-up opportunities each guest type can receive and how those chances change by level. [MVP: at most one different follow-up request; 28% chance on shifts 4–5, 42% on shifts 6–7, and 50% on shifts 8–10.]
- [x] Leave only when the visit is complete, the stay timer expires, or the customer chooses to leave after patience is lost.
- [x] Award coins and satisfaction at clearly defined moments; distinguish per-order rewards from per-visit rewards. [Coins/satisfaction apply per order; level progress applies per completed visit.]
- [x] Decide whether goals count customers, orders, earnings, or a combination, and label each goal explicitly. [Level goals count completed visits; HUD separately shows fulfilled orders.]

**Acceptance:** One guest can request and receive at least two different items in one visit, remains at the beach between services, and is counted according to the displayed level goal. Browser playtesting remains open in section 7.

**Implementation note:** Orders enter a 3.5-second leisure state; a chance-based subset of guests then makes one different follow-up request with a fresh patience timer. The level goal increments when the visit ends; the HUD reports visits and orders separately. Coins and mood change per delivered order.

## 4. Make shops actionable map objects and add preparation

- [x] Make the drink bar, snack stand, and rental kiosk clickable/tappable world objects with visible ready, preparing, and out-of-stock states.
- [x] Route the owner to the selected shop before opening its interaction.
- [x] Remove direct customer service from the service-button row; retain HUD indicators only when they support, rather than replace, the map interaction.
- [x] Define initial recipes and preparation times for each shop.
- [x] On shop interaction, show required ingredients, current supply, output, preparation duration, and progress.
- [x] Consume ingredients when preparation starts and create a prepared item or rental unit when it completes.
- [x] Define carried-item capacity and show the prepared item clearly while the owner travels.
- [x] Require the owner to reach the requesting customer and deliver the matching prepared item to complete an order.
- [x] Explain invalid interactions in context: wrong customer/item, missing input, no inventory, full carry capacity, or preparation still underway.

**Acceptance:** The player cannot complete an order directly from a HUD service button. The player prepares an item at its shop, spends the displayed inputs, carries it to the correct seated customer, and sees the request complete.

**Implementation note:** Each shop has a canvas label and an in-world click target. A hut tap prepares or collects after the owner reaches the approach point. Orders go into a one-item carry slot and must be delivered to a seated guest. There is no shop DOM panel.

## 5. Add per-shop ingredients, capacity, and refill actions

- [x] Give the drink bar its own coconut, ice, and cup supplies.
- [x] Give the snack stand its own fruit/snack portions and plates or wrappers.
- [x] Give the rental kiosk its own floats, umbrellas, and rentable gear inventory.
- [x] Show current amount and maximum capacity for every supply at the owning shop and in its refill interaction.
- [x] Define where each supply comes from: delivery point, storage, or a level-specific supplier. [Supplier delivery is shop-specific.]
- [x] Let the player choose or preview refill quantity; show time cost, amount added, and capacity remaining before confirming.
- [x] Prevent refills from exceeding capacity or changing another shop's stock.
- [x] Add a visible refill progress state and completion feedback.
- [x] Connect capacity and refill upgrades to specific amounts or batch sizes and update their descriptions. [+2 per ingredient per capacity-upgrade level.]
- [x] Decide how rental returns restore inventory and how damaged or late returns affect it before implementing gear-condition rules. [Rental is returned four seconds after departure; gear is assumed in working order in this MVP.]

**Acceptance:** Each shop can run out independently. The player can see why it is out, refill an explicit amount at the relevant location, and verify that only that shop's inventory changes.

**Implementation note:** Superseded by `HANDOFF.md` Milestone 6. Each shop has one stock pool. A hut tap prepares, collects, or refills that shop. The plaque shows stock and refill state. Capacity upgrades add +2 to that shop's stock cap. No per-ingredient circles on the sand.

## 6. Rebuild the level/tutorial progression around the corrected loop

- [x] Teach movement and customer check-in before adding time pressure. [Shift 1 starts its clock only after the first customer is seated.]
- [x] Introduce automatic seating and one drink recipe in an early tutorial shift.
- [x] Introduce delivery, repeat orders, and the snack shop after the first service loop is understood. [Snack/repeat requests unlock at shift 4.]
- [x] Introduce rental inventory and capacity-based restocking in a later shift. [Rentals unlock at shift 6.]
- [x] Rebalance guest arrival rates, patience, stay duration, preparation time, and refill time around real travel and production. [MVP values are staged across the ten shifts and need playtest tuning.]
- [x] Revisit stars, earnings, upgrades, and helper behavior so they reward the full customer visit and shop workflow. [Earnings are per delivered order; stars require completed visit goals and mood. Capacity, patience, and tip upgrades affect the new loop. The legacy instant-service helper is removed and deferred.]
- [x] Keep helper actions within the same ingredient, inventory, preparation, and delivery rules as player actions. [No helper action ships until it can follow those rules.]

**Acceptance:** A new player learns the full sequence in small steps, and later levels combine known tasks without relying on unexplained timer increases.

## 7. Playtest and close the feedback loop

- [x] Play one full shift at desktop size using mouse and keyboard.
- [ ] Play one full shift at a narrow/mobile-sized viewport using touch or pointer input.
- [x] Confirm queue, check-in, automatic seating, follow-up requests, shop prep, delivery, and refill states are visible and understandable.
- [x] Verify all directional animations, especially left/right transitions, during arrival, routing, interaction, and departure.
- [x] Check that counters, queues, stations, and props do not block routes or hide request and stock indicators.
- [x] Record confusing or slow steps, fix them, and replay the affected sequence before treating the loop as complete.

**Implementation note:** 2026-10-25 playtest pass. Shift 1 at desktop won 3 stars (3 visits, 3 orders, 21 coins, 100% mood). A tap on the coconut request bubble queued serve. A second Coconut Bar roof tap kept the job (`Already heading to Coconut Bar`); the numbered badge cancelled it. Queue spots are 72px apart. At `844×390` the HUD sits over the ocean (`hud` top-center, brand and shift card hidden). Ready orders and supplies share one sand row; BBQ and depot plaques sit on those sprites. Walk cycles: 64 frames rebuilt (`scripts/rebuild-walk-frames.py --check` passed). Owner `W/A/S/D` at `1920×1080` DPR 2 used distance stride (`~73px → stride 6.94`) and facings `back/left/front/right`; guests queued facing right and arrived facing left; stopping reset to idle. `node --check src/game.js` passed. A full win at a phone viewport is still open above.

## Feedback mapped to work

| Feedback | Checklist sections |
|---|---|
| Waiting customer, player check-in, automatic seating, then request | 1–2 |
| Customer remains and may order again | 3 |
| Buggy left/right movement | 1 and 7 |
| Shops are actionable on the map; prepare before serving | 1 and 4 |
| Restock needs visible refill quantity and capacity | 5 |
| Coconut Bar canvas refill fills every supply, sits on the prepare tap, hides the delivery, and is too small in landscape | `COCONUT_REFILL_CHECKLIST.md` |
| Each shop has its own ingredients/supplies | 4–5 |

HiDPI and image quality (canvas backing store, 1024 shop kiosks, guest-01 scale, plaque type, umbrella request icon) are recorded in `IMAGE_QUALITY_HANDOFF.md`.
