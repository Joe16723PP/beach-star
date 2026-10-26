# Coconut Bar Refill Checklist

**Superseded by `HANDOFF.md` Milestone 6.** Per-ingredient sand markers are removed. A shop tap prepares, collects, or refills one stock pool. Keep this file as the record of the earlier per-ingredient pass.

This is the follow-up to the shift 1 playtest of the green **REFILL** control. Complete the sections in order. The bar must be restockable before an ingredient hits zero, and a hut tap must keep preparing or collecting.

`GAME_DESIGN_PRINCIPLES.md` principle 4 governs this list. `GAME_IMPROVEMENT_CHECKLIST.md` section 5 records the older shop-panel refill. This list replaces the canvas behavior where one tap fills coconuts, ice, and cups to the cap.

## Out of scope

Leave these unchanged in this pass: shade umbrellas, the four-action queue limit, ready-stack size, carry limit, guest patience, and depot or scooter supply runs. Fruit Shack and Beach Rentals stay locked on shift 1. Do not give them a new restock control in this pass.

## 1. Restock one ingredient, and choose the amount

The Coconut Bar starts shift 1 with 5 coconuts, 5 ice, and 5 cups. Each cap is 8. One cooler uses 1 of each.

- [x] A restock adds units to one ingredient only.
- [x] The player can change that amount before the owner starts walking.
- [x] The amount cannot exceed the empty space in that ingredient, and it cannot change ice or cups when coconuts were the chosen supply.
- [x] Play shift 1, restock coconuts, and confirm ice and cups stay at their previous counts.

**Acceptance:** After a coconut restock, only the coconut count changes, and the added amount is the amount the player confirmed.

## 2. Keep the hut tap for prepare and collect

The restock control is separate from the hut. It stays off the counter. It is hidden at the opening 5/8, while every ingredient can still cover the next prepare batch. It appears for an ingredient that is still above zero but too low for that next batch.

- [x] On a new shift 1, the Coconut Bar shows **READY TO PREP** and three green supply markers. A tap on a green marker does not start a restock.
- [x] Tap the hut roof. The owner prepares or collects. That tap does not start a restock.
- [x] Prepare until one ingredient is above zero and below the next batch. A restock control for that ingredient appears away from the counter.
- [x] With a ready stack on the bar, tap the hut and collect. Tap the restock control and queue a restock. Neither tap cancels the other action.
- [x] Restock that ingredient before it reaches zero.

**Acceptance:** The player can prepare, collect, and restock as three distinct taps. The opening bar has no restock control. A low ingredient can be refilled while it still has stock.

## 3. Show the delivery before the walk

The beach marker is a green or gray picture with no words. The status line carries the ingredient, amount, time, and resulting stock. The shop name stays readable.

- [x] Before the owner starts walking, the status line names the ingredient, the amount to add, the time, and the capacity that will remain. The marker itself has no words.
- [x] The plaque still reads **COCONUT BAR** during the walk and during the supplier timer.
- [x] The **+** meter does not cover the shop name.
- [x] When the delivery arrives, the status line names that ingredient and its new count. It does not report the other two ingredients as refilled.

**Acceptance:** A player can read what is coming, how long it takes, and what the stock will be before the owner leaves for the bar.

## 4. Make the landscape target easy to hit

Checked at a landscape viewport of 844×390. On the last play the control measured 62×13 CSS pixels.

- [x] At 844×390, measure the restock control from the canvas rectangle. Its shorter side is at least 44 CSS pixels.
- [x] At that size, a tap on the hut roof still prepares or collects.
- [x] At that size, a tap on the restock control starts a restock and does not prepare.
- [x] Replay the section 2 sequence at 1920×1080 and confirm the same two targets remain distinct.

**Acceptance:** At 844×390 and at desktop size, a thumb or pointer can hit restock and the hut as separate targets.

## Done when

Sections 1–4 are checked from a browser play of shift 1. Source review alone does not check a box.

**Implementation note:** Checked in the browser on 2026-10-25. A new shift shows **READY TO PREP** and no restock card. After one batch the card appears in the sand beside the bar. Raising coconuts from the default +1 to +2 delivered `Coconuts 4/8` only; Ice and Cups stayed at 2 and kept their own previews. A hut tap while that restock was queued became action 2 and did not cancel it. At 844×390 the card measured 48×69 CSS pixels. `node --check src/game.js` passed.
