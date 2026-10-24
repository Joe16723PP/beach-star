# BeachStar Feature Plan

## Product direction

Build a colorful beach-resort management game inspired by the time-management loop in *Beach Party Craze*: guests arrive, request services, and the player balances several jobs under time pressure. BeachStar should have its own characters, setting details, visual identity, writing, level designs, and assets.

**Working assumptions:** single-player, level-based, casual game. Target platform and business model are undecided and should be chosen before production.

## Core player promise

Keep a growing beach resort running smoothly, learn to prioritize guest needs, and reinvest earnings to open new services and improve the resort.

## Core loop

1. Guests arrive with visible patience and a preferred beach spot.
2. Seat guests and read their requests.
3. Complete service actions: deliver drinks or snacks, rent beach gear, sell keepsakes, and handle cleanup or restocking.
4. Earn coins and guest satisfaction; poor timing lowers patience and rewards.
5. Meet the level goal before time runs out, then spend earnings on upgrades and new services.

## Feature set

### 1. Guest service and patience — MVP

- Guests enter in small groups, request an available spot, and display clear order bubbles and patience indicators.
- Different guest archetypes vary in patience, order complexity, or tip potential. Keep differences readable and fair.
- Completing a request promptly earns coins and satisfaction; guests who wait too long leave with a visible, understandable consequence.
- Chain consecutive accurate services for a modest combo bonus.

### 2. Beach stations and supplies — MVP

- Start with seating and a compact snack/drink stand.
- Add a small number of actionable stations, such as float or umbrella rental, souvenir stand, and cleanup.
- Stations have simple, visible stock levels. Restocking takes player time or a deliberate action, creating a prioritization choice.
- Keep each station's interaction consistent: select the task, complete it, and show clear feedback.

### 3. Level goals and progression — MVP

- Use short levels with a clear goal such as earn a coin target, serve a number of guests, or reach a satisfaction target.
- Grade performance at the end with one to three stars and explain the result.
- Introduce one new pressure or station at a time across early levels; later combine learned tasks.
- Build an initial 10-level campaign slice, then expand after pacing is validated. This is a BeachStar scope proposal, not a claim about the original game's level count.

### 4. Upgrades and resort growth — MVP

- Spend earned coins between levels on upgrades that have clear effects: faster preparation, more stock capacity, improved seating, or longer guest patience.
- Unlock services gradually, with each new station adding a distinct decision rather than only another click.
- Show upgrade cost and effect before purchase; keep the level restart loop forgiving.

### 5. Assistants — Later

- Introduce helpers after the player has learned the basic loop.
- Give each helper one understandable role, such as delivering completed orders or handling cleanup.
- Use limited availability or upgrade choices to make assistants meaningful without automating all decisions.

### 6. Mini-games — Later / optional

- Add short skill interactions for selected tasks (for example, prepare a drink or identify a requested keepsake).
- Reward accurate play with speed, tips, or satisfaction, but provide a quick action alternative so mini-games do not interrupt the main flow too often.
- Start with one prototype and evaluate whether it adds variety before producing more.

### 7. Feedback and accessibility — MVP quality bar

- Every selection, successful service, error, restock, and guest departure gets immediate visual and audio feedback.
- Use distinct icons and text labels in addition to color for orders, patience, and station status.
- Provide adjustable sound levels, readable UI scaling, and a pause option.
- Make targets easy to select and ensure touch or mouse input (depending on the chosen platform) has clear confirmation.

## MVP boundaries

Include the core service loop, three service stations, a small guest roster, stock management, level goals, star grading, a handful of upgrades, and robust action feedback.

Defer a large campaign, many guest/building variants, assistants, extensive mini-games, narrative scenes, and monetization until the core loop feels good in a playable slice.

## Success criteria for the first playable slice

- A new player can understand a guest request and complete the matching service without external instructions.
- Players can identify why they earned or lost satisfaction and coins.
- The level creates prioritization choices without making required actions ambiguous.
- New stations and upgrades change decisions in a noticeable way.
- Actions feel responsive through animation, sound, and UI state changes.

## Risks to watch

- Too many simultaneous task types can feel chaotic instead of strategic; introduce them gradually.
- Repetitive clicking can dominate play; use service chains and station interactions to create varied decisions.
- Weak feedback can make accurate actions feel hollow; treat action confirmation as a core feature, not polish.
- Upgrade effects that only increase numbers may not change play; prefer upgrades that alter capacity, timing, or options.

## Reference basis

The source game is described as a beach-resort time-management game involving guest seating, food and drink service, rentals, souvenirs, restocking, cleanup, upgrades, helpers, and mini-games. A review of its DSiWare version praised the quick, accessible structure but criticized weak tactile and action feedback. BeachStar uses these as design references and proposes its own scope and presentation.

- [Big Fish Games: Beach Party Craze](https://www.bigfishgames.com/beach-party-craze-f2632t1l10.html)
- [MobyGames: Beach Party Craze description](https://www.mobygames.com/game/56535/beach-party-craze/)
- [Nintendo Life: DSiWare review](https://www.nintendolife.com/reviews/2011/06/beach_party_craze_dsiware)
