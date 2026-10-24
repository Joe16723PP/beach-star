# BeachStar Game Design Principles

These principles define the intended BeachStar gameplay. They incorporate the latest design review and supersede prototype shortcuts wherever the current build differs. BeachStar may take broad time-management inspiration from *Beach Party Craze*, while keeping its own characters, art, levels, and presentation.

## Target gameplay features

### 1. Customer arrival, check-in, and seating

- Customers enter the beach and wait in a visible arrival queue. Show their patience while they wait.
- The player handles each arrival at the welcome/check-in point. This is a distinct action from preparing or delivering an order.
- Once checked in, the customer chooses an available beach position automatically. The player does not have to drag the customer to a lounger.
- After reaching the position, the customer displays a clear first request. The game reserves the chosen position while the customer walks there.
- If every position is occupied, new arrivals wait in the queue instead of disappearing or being assigned to an occupied lounger.

### 2. Multi-request customer visits

- Receiving one order does not end the customer's visit. Customers stay at their position for a leisure period after service.
- A seated customer may make a follow-up purchase, such as a drink followed by a snack or rental. Display each new need clearly and give it its own fair patience window.
- Customers leave only after their visit is complete, their stay expires, or they become unhappy and choose to leave. Pay the visit's earnings and satisfaction consistently at the appropriate points.
- Track visits and orders separately so a customer can contribute more than one service to a shift goal.

### 3. World-space shops, preparation, and delivery

- Service shops are actionable objects in the beach scene: for example, the drink bar, snack stand, and rental kiosk. Their position and status are visible on the map.
- The player moves to and interacts with a shop to prepare an item or issue rental equipment. Shop interactions are the source of service actions; a row of service buttons must not replace the shops.
- Preparation consumes that shop's ingredients or available rental inventory and takes a readable amount of time. Show the recipe, required inputs, stock, and preparation progress at the shop.
- A prepared item becomes available to carry or deliver. The player must take it to the matching customer to complete the request.
- Invalid actions explain the reason in place: wrong customer, missing ingredient, full carry capacity, or a shop still preparing.

### 4. Shop-specific ingredients, inventory, and refill capacity

- Each shop owns its own ingredients or service inventory. The interface and map markers must make it clear which shop needs which supplies.
- Initial supply model:

  - **Drink bar:** coconuts, ice, and serving cups.
  - **Snack stand:** fruit or snack portions and serving plates/wrappers.
  - **Rental kiosk:** floats, umbrellas, and other rentable beach gear. Track available units and return/condition rules as rental inventory rather than edible ingredients.

- Restocking is performed at the relevant shop or a clearly identified supply point. A refill action shows its input, time cost, refill amount, and remaining storage capacity before it starts.
- Shop capacity is explicit: current amount, maximum amount, and refill amount are visible. Capacity upgrades change the maximum or refill batch and should be described as such.
- Refilling one shop must not silently refill every other shop. Later levels may add supply runs or shared storage only if those create understandable choices.

### 5. Character movement and animation

- Guest and staff movement follows clear, walkable paths between entry points, check-in, shops, loungers, and exits. Characters must not teleport, slide sideways while facing another direction, or pass through blocking props.
- Drive facing from actual movement direction and use the matching front, back, left, or right animation. Left/right art must be checked for correct facing; do not mirror a character if that breaks outfit details or carried objects.
- Keep a stable foot anchor and scale while changing direction or animation frame. Reserve seats and interaction spots so characters do not stack on top of each other.
- Player movement is direct and responsive. Clicking a customer or shop communicates the intended destination and gives visible feedback while the character travels.
- Walking speed, pathing, and interaction range must make service readable without making routine travel feel slow or fiddly.

### 6. Campaign and progression

- Introduce check-in, one shop, preparation, delivery, and restocking in a gentle tutorial sequence before combining them under time pressure.
- Use short level goals that can account for customers served, orders fulfilled, earnings, and satisfaction. Do not count one customer as served multiple times unless the goal explicitly counts orders.
- Upgrade choices should visibly affect movement, preparation, ingredient capacity, refill batch, customer patience, or visit options.
- Helpers may be introduced later, but must follow the same shop, supply, and delivery rules so their contribution remains legible.

## Review of the current prototype

The browser prototype now has a visible queue, owner check-in, automatic lounger assignment, repeat visits, click/tap and keyboard movement, routed travel, and map-labeled shops. Orders must be prepared from each shop's own ingredients, collected into a one-item carry slot, and delivered to the matching guest. Shop-specific supplier refills use explicit quantities, time, and capacity limits; rental units return after the guest leaves. The first shift introduces check-in before its shift clock starts, then teaches the drink workflow. The drink, snack, rental, and future BBQ stands use a balanced two-by-two map layout with square 140×140 display footprints. The supply depot and delivery scooter remain nonfunctional scenery, and refills still start from each shop. The free-serving helper has been removed until it can use the same preparation and delivery rules. Browser playtesting is still required for movement, scene readability, timing, and responsive controls; see `GAME_IMPROVEMENT_CHECKLIST.md` section 7.

## 1. Make the service loop easy to read

Players should be able to see who is waiting to check in, who is seated, what each customer needs, where to prepare it, and how urgent each task is. Use distinct request icons, visible patience, map-based shop status, clear selection states, and immediate action confirmation. Do not communicate essential information by color alone.

## 2. Make pressure create choices

Time pressure should ask the player to prioritize arrivals, follow-up requests, production, deliveries, and shop-specific supplies. A mistake should have a clear cause and a recoverable consequence. Avoid difficulty that comes only from faster timers, hidden rules, or excessive clicking.

## 3. Add complexity one step at a time

Teach one service or pressure at a time, then combine familiar tasks in later levels. New stations, guest behaviors, and upgrades should each have a readable purpose. Keep the first playable slice small enough to learn and tune.

## 4. Reward attention and good service

Prompt, accurate service should feel satisfying through clear preparation, delivery animation, sound, and reward feedback. Combos and bonuses should reinforce good prioritization without making a single missed action ruin a level.

## 5. Keep progression meaningful

Upgrades should change decisions, capacity, timing, or options, not only inflate numbers. Unlocks should introduce a useful new activity and arrive after the player understands the existing loop.

## 6. Protect visual clarity in the top-down view

Keep walking lanes open and important characters, request bubbles, stations, and interactive objects visually distinct from sand and decoration. Use consistent scale, lighting, foot anchors, and art style. Decorative detail must not obscure gameplay. Test every directional transition and path against shop fronts, queues, seats, and props.

## 7. Make the beach feel welcoming

Use warm, playful presentation and friendly character reactions. Failure can create urgency, but avoid punishing or hostile tone. Keep the setting original to BeachStar.

## 8. Design for responsive, accessible interaction

Every click or tap should provide visible feedback. Keep targets easy to select, support keyboard input where practical, and consider touch layouts if a mobile target is chosen. Provide readable UI, pause, and adjustable audio as the game grows.

## 9. Keep the game original

Use *Beach Party Craze* only as a reference for the broad time-management genre and beach-service premise. BeachStar should have its own characters, dialogue, levels, visual identity, and asset designs.

## 10. Prove the core before expanding

Prefer a polished, playable beach scene over a large amount of unfinished content. Add campaign length, assistants, mini-games, and cosmetic variety after the service loop is understandable and enjoyable.

## Design review questions

Before approving a feature or level, ask:

- Can a new player tell what to do and why?
- Is the customer waiting, checking in, choosing a position, being served, and leaving in a clear order?
- Can the player identify which shop prepares the requested item and which ingredients or inventory it consumes?
- Does a refill show how much it restores, how much capacity remains, and what it costs in time or supplies?
- Do characters face the direction they are moving, follow clear paths, and avoid blocking one another?
- Does this create an interesting choice, or only more work?
- Is the consequence of waiting or choosing incorrectly visible and fair?
- Does the feature fit the top-down beach layout and preserve clear movement space?
- Does it improve the core loop enough to justify its content and implementation cost?
- Can the idea be tested in one small playable slice?
