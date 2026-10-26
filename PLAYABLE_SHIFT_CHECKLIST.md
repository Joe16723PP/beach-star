# BeachStar Playable Shift Checklist

This is the implementation sequence for the first finished drink shift. Complete the sections in order. Sections 1–4 make shift 1 readable and finishable. Section 5 changes timing only after that shift has been played.

A playable shift 1 means the player checks in the first guest, prepares a coconut cooler at the Coconut Bar, carries it to that guest, and sees the visit count change. `GAME_DESIGN_PRINCIPLES.md` principles 1, 3, and 10 govern this list. `GAME_IMPROVEMENT_CHECKLIST.md` records the service loop that is already in `src/game.js`.

## Out of scope

Leave these unchanged in this pass: helpers, mini-games, rides, souvenirs, cleanup, a BBQ menu, depot or scooter supply runs, action queues, and carry capacity above one item. The Fruit Shack and Beach Rentals stay in later shifts.

## 1. Finish check-in, the walk, and the delivery

The route, facing, and click handling live in `src/game.js` (`mapClick`, `setDestination`, `buildRoute`, `follow`, `finishOwnerTask`, `draw`).

- [x] Play shift 1 at desktop size with the mouse: welcome the first guest, walk to the Coconut Bar, prepare the cooler, collect it, and deliver it.
- [x] Play the same sequence with WASD or the arrow keys.
- [x] Confirm the owner and the walking guest face front, back, left, and right according to the way they move, including left and right.
- [x] Confirm the route line stays visible and the owner stops at check-in, the bar approach, and the guest approach.
- [x] Confirm a blocked destination explains itself in the status line and leaves the owner where they are.
- [x] Fix any stuck pose, sideways slide, wrong facing, missed click, or teleport found above, then replay the sequence.

**Implementation note:** Guests now enter on the open sand at y=516, so they are not born inside a shop. A walk that stops making progress cancels and says the route is blocked. The footer guide is wired to `#guide-text`. In the browser, the owner walked to check-in and the Coconut Bar, the bar opened on arrival, and the cooler was delivered. Held A, D, W, and S moved the owner and set left, right, back, and front. A click on a blocked spot left the owner in place and said to choose a clear spot.

**Acceptance:** From more than one starting spot, the owner reaches check-in, the Coconut Bar, and a seated guest, faces the travel direction, and stops at the interaction point.

## 2. Show the same request mark on the guest and the bar

Shift 1 uses `assets/game/ui-icons/icon-request-drink.png`. The same mark is drawn for a fruit cup or swim ring from the existing snack and float files. The shade umbrella still has no icon file.

- [x] Draw the cooler icon in the bubble of a seated guest who wants a coconut cooler.
- [x] Draw that same icon on the Coconut Bar while a seated guest wants a cooler.
- [x] Keep the bar name and its text state: ready to prep, preparing, order ready, or out of stock.
- [x] When a later shift serves a fruit cup or a swim ring, draw that product’s existing icon on the guest and on its shop the same way.

**Implementation note:** The browser shift showed the cooler picture on the seated guest and above the Coconut Bar while the plaque still read READY TO PREP. Snack and float use that same mark. Umbrella text stays the emoji until a rental icon exists.

**Acceptance:** On shift 1, the seated guest and the Coconut Bar show the same cooler mark before the shop panel opens.

## 3. Put the result on the guest

A delivery raises a coin label at the lounger. An ignored guest leaves with a different label from a finished visit. The shift-end dialog states the star rule.

- [x] When a delivery succeeds, show the coin amount just earned at that lounger for a short moment.
- [x] When a guest leaves because patience ran out, show an unhappy departure that looks different from a finished visit.
- [x] Keep the coin total and mood percent updating in the header.
- [x] On the shift-end dialog, state the star rule in code: the visit goal is required; mood of at least 85% is 3 stars; mood of at least 60% is 2 stars; a met goal below 60% is 1 star; a missed goal is no stars.

**Implementation note:** The browser header went from 4 coins to 10 on a fast delivery, and the visit count became 1 / 3. A queue guest who waited too long showed a “Left unhappy” label, kept inside the beach. A missed shift said “Missed visit goal: no stars. Mood 98%.” A finished visit uses “Visit done.”

**Acceptance:** After one delivery and one ignored guest, both results are visible on the beach. The shift-end dialog states why the star count was awarded.

## 4. Keep shift 1 clicks on the tutorial targets

On shift 1 the Fruit Shack, Beach Rentals, BBQ stand, supply hut, and scooter are visible and clickable. Those clicks currently answer with a closed or later-shift message and can replace the player’s destination. Leave the objects on the beach. During shift 1, ignore clicks on them so they do not start a walk, close an open bar panel, or replace the current route. Check-in and the Coconut Bar stay active.

- [x] On shift 1, a click on the first queued guest still starts check-in.
- [x] On shift 1, a tap on a seated guest’s request bubble or body queues serve.
- [x] On shift 1, a second tap on the Coconut Bar roof keeps or collects the job. Only the numbered badge cancels it.
- [x] On shift 1, a click on the Coconut Bar still walks the owner there and opens the bar.
- [x] On shift 1, clicks on the Fruit Shack, Beach Rentals, BBQ stand, supply hut, and scooter leave the current route and any open bar panel alone.
- [x] Those five objects remain visible.
- [x] From shift 4, the Fruit Shack click starts its shop walk. From shift 6, the Beach Rentals click does the same. BBQ, the hut, and the scooter stay scenery.

**Implementation note:** Shift 1 returns before those five clicks. The locked shops and scenery stayed on the beach. Their clicks did not open a panel or replace the walk. Shifts 4 and 6 still use the existing shop unlock. A seated guest’s coconut bubble at `y-100` queued serve. A second hut-roof tap said `Already heading to Coconut Bar`; the numbered badge cancelled that job.

**Acceptance:** On shift 1, clicking the queue or the Coconut Bar starts that task. Clicking the other stands does not cancel it.

## 5. Retune shifts 1–3 after the shift is finishable

Do this section only after sections 1–4 are checked in the browser. The current shift 1 values are 3 visits, 135 seconds, 52 seconds of seated patience, 2.6 seconds of cooler prep, and owner path movement at 235 pixels per second. These numbers are untested against real routes.

- [x] Leave those values unchanged until sections 1–4 pass.
- [x] Play shift 1 again. Record whether a correct cooler arrives while the guest is still seated, and whether ignoring a guest is what makes that guest leave.
- [x] If a correct drink is late, or waiting has no cost, change only the timing or goals of shifts 1–3, then replay shift 1.
- [x] Leave shifts 4–10 on their current services until this drink shift is finishable.

**Implementation note:** No timing change. A served cooler landed during the visit, and the header stayed at 100% mood with time still on the clock. Serving three visits in the game loop took about 48 seconds of the 135. An ignored guest left the queue. Shifts 4–10 were not retimed.

**Acceptance:** A player who serves the open drink requests completes 3 visits with time remaining. A guest leaves after the player ignores that guest.

## Done

The checklist is done when every acceptance line above has been seen in a browser play of shift 1. Source review alone does not check a box in sections 1, 3, or 5.
