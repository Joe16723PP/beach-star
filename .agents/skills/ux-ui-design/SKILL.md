---
name: ux-ui-design
description: BeachStar UX and UI rules for on-beach controls. Use when changing BeachStar screens, canvas UI, shop stock, refill, ready orders, stack badges, supply markers, plaques, or when the user gives UX or UI feedback.
---

# BeachStar UX/UI

## Saved feedback

why refile and stock not use the same component? split it is a BAD UX/UI design
plan for remove. the buttons below are too complex

The Coconut Bar showed four circles in a row below the hut: a green ready-drink circle (`1`) plus three separate gray ingredient circles (`coconut`, `ice`, `cup`). Because every recipe consumes ingredients in a 1:1:1 ratio, all three run out together and force three separate restock taps. Having multiple buttons below the shop is too complex and splits stock and refill across up to four circles.

## Rule

Do not render a row of per-ingredient buttons (`coconut`, `ice`, `cup`, `fruit`, `wrapper`, `float`, `umbrella`) below a shop.

Stock and refill use **one single component** per shop (or the hut itself), never a row of ingredient circles:
- **No per-ingredient micro-buttons:** Each shop tracks a single unified stock count and refills that pool in one action instead of forcing the player to tap 2–3 separate ingredient circles.
- **One indicator per shop:** The wooden plaque plus the counter ready-stack badge answer both "how many orders are ready / can it serve?" and "does it need a refill?". Plaque states: `READY TO PREP · 5/8`, `PREPARING...`, `ORDER READY (3)`, `LOW STOCK · TAP TO REFILL`, `REFILLING...`.
- **Hut tap:** Tapping the shop prepares when stock can cover the next batch, collects a ready order, or starts that shop's single refill when stock is empty. The status line states the refill amount, time, and resulting stock.

## Before a beach UI change

1. Read `GAME_DESIGN_PRINCIPLES.md`.
2. If a control already answers the question, extend that control. A second control for the same shop state is a defect.
3. Keep words off the sand marker. Put names, amounts, and times in the status line.
