# 🥞 Pancake Flight Picker

A single-file, zero-dependency web app that turns the **Master Pancake Flight Manual** (a malted-diner pancake recipe) into a point-and-click recipe picker. No build step, no install — just open the HTML file in a browser.

Two files in this project:

- `Ultimate_Malted_Pancakes_Flight_Picker.html` — the picker app (current: v3.1.0)
- `docs/recipe-guide/🥞 Pancake_Recipe_-_Ultimate_Malted_Pancakes.html` — the companion reference manual (full prose, Word-import friendly)

## Quick start

```bash
# Either double-click the HTML file, or:
open  Ultimate_Malted_Pancakes_Flight_Picker.html   # macOS
xdg-open Ultimate_Malted_Pancakes_Flight_Picker.html # Linux
start Ultimate_Malted_Pancakes_Flight_Picker.html   # Windows
```

No server, no install, no internet. Works on Mac, Windows, Linux, iOS Safari, Android Chrome. The entire app is one HTML file (~13,800 lines as of v3.1.0) with inline CSS and vanilla JS.

## Project layout

```
pancake-flight-app/
├── Ultimate_Malted_Pancakes_Flight_Picker.html                          # the app
├── docs/
│   └── recipe-guide/
│       └── 🥞 Pancake_Recipe_-_Ultimate_Malted_Pancakes.html            # source-of-truth reference doc
└── README.md                                                            # this file
```

## What it does

The manual is a binder of cross-referenced tables: 4 batch sizes × 13 flavor combinations × 5 pancake sizes, plus separate charts for ingredients, toppings, syrup pairings, and cooking rules. The picker collapses that into a few clicks and shows exactly what you need for the combination you chose.

The default flow is **Plan a Flight**: pick anywhere from 1 to 13 flavors, optionally across multiple parallel batch sets, and the picker renders Setup + Cook phases with deduplicated prep, cooking-order grouping, a shared cooking-instructions block, and per-flavor delta cards. The alternate mode, **Prep Bulk Dry Mix**, skips the recipe side entirely and shows just the bulk-dry-mix preparation for a single batch — flavors and multi-batch are disabled in that mode.

---

## Features

Each feature lists *Added* (the version it first shipped in) and, where applicable, *Refined* (the most recent version that materially reshaped it). Versions point you at the release where the feature became user-visible or settled into its current shape.

### Inputs (you pick)

- **Pancake size / ladle (0.5 oz mini → 4.0 oz plate-sized)** — *Added: v1.x · Refined: v3.0.0* — Lives in its own sticky **Pancake Size Bar** (PSB) above the recipe card. Collapsible to a `Reveal Pancake Size (Ladle Size)` pill via a show/hide toggle. PSB header restructured in v3.0.0 to a 3-slot row reading `[title | flight info | compact yield | toggle]`; yield grid migrated out of the recipe header into the PSB body with a border-top divider.
- **Mode toggle: Plan a Flight / Prep Bulk Dry Mix** — *Added: v3.0.0 (slice 5P, rc.9.71)* — Lives in the Batch card head, above the batch-set tabs strip. **Plan a Flight** (default) is the normal recipe flow — any 1 to 13 flavors, optionally across multiple batch sets, full Setup + Cook output. **Prep Bulk Dry Mix** disables the Flavors card with a banner, hides the `+Add batch` and per-tab `× close` affordances (single batch only), forces the dry-mix source to `Measure Each Ingredient`, hides the Flight Checklist bar, and collapses the output to a single dry-only `Dry Bowl for Prep Bulk Dry Mix` card. The Prep mode's batch-size picker also collapses from 4 sizes to `Full | Predefined`, where Predefined opens a sub-picker — see Output modes / Prep Bulk Dry Mix below.
- **Multiple batch sets (Sthāla)** — *Added: v3.0.0 · Refined: v3.1.0 (rc.10.0.7.2)* — In Plan a Flight mode, the Batch card shows a tabs strip with `+Add batch` to create additional parallel batch sets. Each batch set has its own batch size, dry-mix source, Full Batch Multiplier, banana variant, and flavor selection. Tabs close with `×` down to a minimum of one. The user-facing label for a batch set is configurable via the Batch-Set Name switcher (Sthāla · Batch · Batch Set · Round · and several others — 8 options total).
- **Batch quantity stepper (size-aware)** — *Added: v3.0.0 (slice 5P.3, rc.9.71.3) · Refined: v3.1.0 (rc.10.0.7.2)* — A 3-slot stepper, per batch set. At Full, sets an integer count from 1 to 40. At Quarter / Half / Three-Quarter, sets additional Full batches on top of the size's base fraction — e.g. Quarter @ qty 1 = 1.25× Full equivalent, Half @ qty 2 = 2.5×, Three-Quarter @ qty 3 = 3.75×. A sublabel below the stepper reads `= X.YZ× Full equivalent` when qty > 0. Active at every size in v3.1.0; was Full-only through v3.0.0. Faded (replaced by the Predefined picker) in Prep Bulk Dry Mix mode.
- **Batch size (Quarter / Half / Three-Quarter / Full)** — *Added: v1.x* — Per batch set in Plan a Flight mode.
- **Dry-mix source: Measure Each Ingredient vs. Use Bulk Dry Mix** — *Added: v1.x* — Per batch set in Plan a Flight mode. Forced to `Measure Each Ingredient` in Prep Bulk Dry Mix mode (the Use-Bulk option's whole purpose collapses when the bulk mix *is* the output).
- **13 flavors & combinations** — *Added: v1.x · Refined: v2.10.2, v3.1.0 (rc.10.0.7.1)* — Classic Plain · **Patisserie Plain** · Chocolate · Bacon · Banana Nut · Bacon + Banana Nut · Banana Nut + Chocolate · Caramel · Toffee · Caramel + Chocolate · Caramel + Toffee · Toffee + Chocolate · Triple (Toffee + Caramel + Chocolate). Recipe data for candy combos rescaled in v2.10.2 (Option A — 2/3 of single max at each size, with perceptual-floor exceptions at 0.5 oz). v3.1.0 adds **Patisserie Plain** — a pastry-tier sibling to the original Plain (now labelled Classic Plain). Same batter posture as Classic Plain, but the Spices / Sugar / Fat profile borrows the Triple's anchors: white sugar with Vanilla Extract carried over from Classic Plain, a 50% non-diastatic-malt bump for roasty backbone, an espresso-powder accent, a cultured-buttermilk-powder brightness lift (with a milk uptick to balance), and chocolate-tier salt. Wet bowl uses Melted Unsalted Butter — same clean lead as Classic Plain, since the Patisserie variant has no candy load to fight. No toppings (same as Classic Plain).
- **Caramel preparation: Flash-frozen (10 min) vs. Deep-frozen (long-term)** — *Added: v1.x* — Appears when caramel is in the mix.
- **Toffee preparation: Flash-frozen vs. Deep-frozen** — *Added: v1.x* — Appears when toffee is in the mix.
- **Banana-in-batter variant** — *Added: v2.10.2 · Refined: v3.0.0* — Per-batch `bananaVariant` (`'top'` default · `'inBatter'`). In-batter fork-mashes the banana into the wet bowl after milk + egg + vanilla floor, before ghee; selection-time disables non-banana flavor pills when in-batter is active. Scoped per batch set in v3.0.0.

### Output sections

- **Dry ingredients** (or "scoop X cups of Bulk Dry Mix") — *Added: v1.x*
- **Wet bowl + correct fat** for the chosen flavor — *Added: v1.x · Refined: v2.10.2* — Bacon flights pull Avocado Oil out of the in-batter list; Bacon + Banana Nut switches to Melted Ghee in batter.
- **Batch-scaled spices** with ½, ¼, ⅛, 1/16, 1/32, 1/64, 1/128 tsp resolutions — *Added: v1.x · Refined: v2.9.0* — Candy-combo accent spices replaced with per-flavor inline arrays that double-multiply from Quarter Batch; chocolate-family salt floor rebalanced to a universal ¼ tsp with per-card additions; Banana-Nut cinnamon schedule strengthened one step heavier across all three Banana-Nut cards in v2.10.2.
- **Cooking-surface grease type** — *Added: v1.x*
- **Topping amounts** for the chosen pancake size + **Max Combined Volume Limit** — *Added: v1.x · Refined: v2.10.2, v3.1.0 (rc.10.0.6)* — Caramel converted across all 5 sizes from bit-counts to volume measurements (Scant Tad / 1½ tsp / 1 Tbsp / 1½ Tbsp / 2 Tbsp); toffee 0.5 oz raised 6× (Smidgen → Scant Tad); bacon 0.5 oz raised to Tad (¼ tsp) with explicit ¼" thickness; 4.0 oz banana count bumped 4 → 5–6 slices per area-scaling math. v3.1.0 syncs the chart to the source manual's Rev 5 numbers: a new chocolate-chip schedule (solo flavors: 5–6 / 8–10 / 14–17 / 20–22 / 27–32 across the 5 sizes; chocolate-combos: 4–5 / 7–8 / 10–12 / 14–16 / 20–24); toffee amounts doubled across the board for pop; Banana Nut + Chocolate and Bacon + Banana Nut slice / nut / bacon ramps rescaled to match the manual's Rev 5 cells; a new caramel sizing calibration note renders below the perimeter note for any caramel flavor — "amounts assume Peter's ¼" cold-cut cubes; with Kraft Caramel Bits (uniform pre-formed) you may run the high end of each cell."
- **Yield count** ("Yields ~N pancakes") — *Added: v1.x · Refined: v3.0.0* — Flight-mode total reads `TOTAL: ~N PANCAKES FROM M BATCHES` (uppercase via CSS).
- **Flavor-aware cooking callouts** — *Added: v1.x · Refined: v3.0.0* — 🛡 Batter Shield, 🛡🛡 Double Shield, 🌡 Heat warnings, 🧈 Unsalted-butter reminder, 🥓 Bacon timing, 🍌 Banana thickness, 🌰 Pine-nut toasting, 🧊 Candy prep, 🥄 Ladle prep. The 🥄 Ladle callout (added unconditionally in v2.10.2) was split in v3.0.0 into pre-cook setup + during-cook rhythm. Candy callouts reference **Peter's Caramel Loaf** and **Heath Bits O' Brickle** by name and embed the freeze-smash-sift protocol.
- **Quality Tier chart** (🥇 Best / 🥈 Good / 🥉 OK / ❌ Avoid) — *Added: v1.x · Refined: v2.1.1* — Syrup grade + ingredient pairings.
- **Step-by-step cooking checklist** with shield volume tailored to the selected pancake size (½ tsp at 0.5 oz → 1½ Tbsp at 4.0 oz) — *Added: v1.x*
- **Print button** — *Added: v1.x · Refined: v3.0.0* — Full print rewrite hides selectors, toggles, and theme controls; forces 100% card scale; forces the light palette; prints only the recipe.

### Output modes

- **Plan a Flight** — *Added: v2.1.0 (as Flight mode) · Refined: v3.0.0 (slice 5P)* — The default. Pick 1 to 13 flavors and run them as a coordinated cook. Flavor pills are multi-select (tap to include/exclude). With exactly one flavor selected the output is the same shape the v1.x Single mode used to render — there is no longer a separate "Single mode" pill; Plan a Flight degenerates gracefully when only one flavor is picked.
- **Prep Bulk Dry Mix** — *Added: v3.0.0 (slice 5P, rc.9.71) · Refined: v3.1.0 (rc.10.0.8)* — Skips the recipe side entirely. Flavors card is disabled with an explanatory banner, multi-batch is hidden (single batch only), dry-mix source is forced to Measure Each Ingredient, and the Flight Checklist bar is hidden. The batch-size picker collapses from 4 sizes to `Full | Predefined`. v3.1.0 adds the **Predefined** option, which opens a two-tier sub-picker: a Series row (**Nominal** | **Jar-Fit**) above an Index row. **Nominal** scales in 4× Full batch increments (10 indices: 4× through 40×) — useful when you want a quick multiple of the Full recipe. **Jar-Fit** scales in canonical Half-Gal Fit A units (12 indices) sourced directly from the companion manual's Bulk Pantry Mix section — index 1 fills one half-gallon storage jar, index 2 equals the manual's Gallon Fit row exactly, and the output card and print page both render a jar-storage subline ("Predefined · Jar-Fit index N = …" plus "… stored as N jars of …"). Selecting Predefined greys the batch-quantity stepper (one-way coupling — Predefined sets the math). Output is a single dry-only card titled `Dry Bowl for Prep Bulk Dry Mix`. Use this when you are prepping the bulk pantry mix itself, not cooking a flight.

### Plan a Flight — output anatomy

- **Multi-select flavor pills** — *Added: v2.1.0* — Tap to include/exclude — an active pill is included.
- **Setup phase** — *Added: v2.1.0 · Refined: v3.0.0* — Discrete top-level sections: Dry Bowl(s), Wet Bowl(s), Spices, Toppings, Grease. Each labeled with correct singular/plural ("Dry Bowl" for 1 flavor, "Dry Bowls (× N)" for N>1). Each renders as a per-flavor sub-card grid with its own *Side-by-side / Stacked / Grid* layout switcher. Setup-phase subgrid is one of the four v3.0.0 final-ship majors.
- **Cook phase** — *Added: v2.1.0 · Refined: v3.0.0* — Flavors grouped by their cooking order (Clean → Savory → Candy) so you don't constantly swap greases or temperatures. Inline `[Cooking order ✓] [Selection order]` toggle lets you switch to selection-order rendering for the cook phase only. When a group has more than one flavor, a "stagger the rests" note explains how to mix flavor 2's bowls while flavor 1 is in its 10-min rest. Between groups: a "wipe surface and re-grease for the next group" transition.
- **Shared Cooking Instructions** — *Added: v2.1.1* — Single universal-flow card at the top of the Cook phase (mix, rest, scoop, flip, between-pancake). Below it, compact per-flavor **delta cards** list only the deltas — heat (in selection-order mode only), strategy, toppings yes/no, bacon prep, banana prep, shield level, candy prep state.
- **Quality Tier (Flight output)** — *Added: v2.1.0 · Refined: v2.1.1* — Strict matches rendered once in a `Shared across all N flavors` block at the top; differing slots rendered per-flavor below. Side-by-side / Stacked / Grid layout switcher. With exactly one flavor selected, the per-flavor block collapses back to the classic 4-card tier grid.
- **Master Shopping List** — *Added: v3.0.0* — Consolidated cross-flight purchase math. One of the four v3.0.0 final-ship majors.
- **Flight Checklist** — *Added: v3.0.0 · Refined: v3.1.0 (rc.10.0.5.2)* — Floating prep checklist with two-column layout, configurable density modes, and snippet/full Display Mode (snippet is the default for fresh users). Renamed from "prep checklist" mid-cycle. One of the four v3.0.0 final-ship majors. v3.1.0 splits the single `Mode` reset button into two: **↺ Reset views** clears the per-item view options (density / disclosure) without touching checkmark state — single click, no confirm; **✕ Clear checkmarks** wipes every prep-step checkmark via a two-stage in-DOM confirm (first click arms, second click commits) so it can't be triggered accidentally mid-flight.

### Layout & display controls

- **Layout switcher: Side-by-side / Stacked** — *Added: v1.x · Refined: v2.7.0* — Side-by-side uses a sticky picker sidebar; Stacked puts selections on top. Both are unconditional based on `data-layout` alone — v2.7.0 removed the compact-mode toggle entirely. Falls back to Stacked on viewports under 1000 px.
- **Theme switcher: Auto / Light / Dark** — *Added: v1.x* — Auto follows OS and reacts to OS theme changes live. Print always uses the light palette.
- **Flight Zoom (formerly Card-size / Display Zoom)** — *Added: v2.0.0 · Refined: v3.0.0 (slice 5O)* — Resizes the recipe card from 80% to 200% without changing the recipe itself. Originally a 3-control slider widget (preset pills + continuous slider + step selector) in v2.0.0; slice 5O (rc.9.69) replaced that with a single popover-menu picker (25 values at 5% increments from 80% to 200%) matching the Batch Set Name / Print Mode visual language. Implemented via CSS `zoom` on `.out-card`. Hidden on viewports under 600 px. Print always forces 100%. The `pancakeFlightCardScale` localStorage key is reused for back-compat; legacy decimal values snap to the nearest valid 5-step entry on hydrate.
- **Sticky / collapsible controls row** — *Added: v2.1.1 · Refined: v3.0.0* — Holds the Reset · Batch Set Name · Print Mode · Flight Zoom · Theme · Layout · Picker-Min · Batch-Column-Sizing switchers (the picker-mode toggle is NOT here — it lives in the Batch card head). The row sticks to the top of the viewport; `▲ Hide Controls` collapses it to a thin pill. v2.10.0 moved Hide Options + Hide Controls to the **leftmost** position of the row for natural inline-flex left-to-right flow; v2.10.1 fixed switcher alignment + row gap.
- **Hide Options button** — *Added: v2.2.0 · Refined: v3.0.0* — Collapses the entire picker pane, giving recipe + Pancake Size Bar the full page width. Grouped with Hide Controls on the right side of the controls row. In side-by-side with options collapsed, the PSB uses the full width.
- **Stacked-mode sticky picker cards** — *Added: v2.2.0 · Refined: v2.7.1* — In Stacked layout, the Pancake Size Bar and Batch card stay on screen as you scroll, each with its own `▲ Hide` / `▼ Show` chevron. v2.7.1 removed the v2.2.0 sticky-batch CSS rule that was overriding v2.7.0's intended static-batch behavior in the picker-region grid.
- **Side-by-side options always visible** — *Added: v2.2.0* — The sticky picker pane stays anchored to the viewport; the user scrolls within the pane to bring the picker they want next to whatever section of the recipe they're reading.
- **Per-section layout switchers (Wet / Spices / Toppings / Quality Tiers)** — *Added: v2.1.1 · Refined: v2.8.0* — Each has its own `[Side-by-side / Stacked / Grid]` switcher, persisted separately. v2.8.0 added direct `onclick` bindings as a backup for event delegation (which was failing silently in some mobile webviews).
- **Centered controls row** — *Added: v2.5.0 · Refined: v2.10.0* — Stacked width parity with side-by-side; v2.10.0 unwound the centering trick when the actions moved to the left.
- **Flavors & Combinations cell sizing** — *Added: v3.0.0* — Width-balanced cells in the flavor picker.
- **Batch-set name switcher** — *Added: v3.0.0* — Switches the user-facing label for batch sets (sthāla terminology).
- **Trace Dusting vocabulary** — *Added: v2.9.0* — Spice-measurement vocabulary extension surfaced in the reference cheat sheet.

### State, sharing, & print

- **URL state encoding** — *Added: v2.1.1* — The address bar reflects all current selections (batch, pancake size, flavor or selected flavors, candy preps, mode, dry-mix source, cook grouping, tier layout). Uses `history.replaceState` so the back button isn't polluted. Sharing a recipe is "copy URL"; opening someone else's link restores their exact picker state. Defaults are omitted to keep the URL short.
- **localStorage persistence** — *Added: v1.x · Refined: v2.2.0* — UI prefs (layout, theme, card-scale + step, per-section layouts, collapse states for Pancake Size / Batch / Flavors / Options / Controls) persist across visits. Not encoded in the URL — keeps shared URLs short and recipe-state-only.
- **Print path** — *Added: v1.x · Refined: v3.0.0* — Full print rewrite (see Output sections above): hides controls + theme toggles, forces 100% card scale, forces light palette, prints only the recipe.

### Reference content (collapsible at bottom)

Static reference docs in `<details>` accordions — *Added: v1.x · Refined: v2.9.0 (Trace Dusting vocabulary), v2.10.2 (Peter's Caramel Loaf / Heath Bits O' Brickle naming)*:

- Bulk Pantry Mix recipe + jar storage
- Vocabulary cheat sheet (Hint / Drop / Smidgen / Pinch / Dash / Tad + Scant / Fat modifiers + Shield Rule)
- Mixing & resting rules
- Shield Rule with precise volumes per pancake size
- Ladle prep (45–60 sec ice-bath rule)
- Advanced tips (warm-water fat bath, Microplane nutmeg, pine-nut toasting, Candy Crushing Protocol, Shield Application Mechanism)
- Cooking order + between-batch cleanup
- Liquid troubleshooting
- Flipping technique
- Syrup grade reference
- Component sourcing guide

### Tests

- **In-repo test suite** — *Added: v3.0.0 · Refined: v3.1.0 (Suite 20 added at rc.10.0.8)* — 591 tests across 20 suites (`npm test` exits 0). Rewritten from picker behavior in v3.0.0; Suite 20 added in v3.1.0 to cover the Prep Bulk Predefined picker state, persistence, URL round-trip, canonical Half-Gal Fit A cross-references, and display + print mirrors.
- **Playwright visual regression** — *Added: v3.0.0* — `tests-visual/setup-phase.spec.js` enumerates 54 (orderMode × outputGrouping × batchLayout × flavorCardsLayout) URL-parameter combinations with PNG baselines in `tests-visual/setup-phase.spec.js-snapshots/`. Six pre-fix rc.9 baselines are committed as historical record.

---

## Heat / Candy Preparation logic

The one piece of business logic that goes beyond the original PDF:

- The PDF hardcodes lower temperatures for `Caramel + Toffee` (325°F) and the Triple (300–325°F) but doesn't lower the temp for `Caramel`, `Toffee`, or `Caramel + Chocolate` alone.
- The picker overrides this: **heat depends on candy preparation, not on the flavor combo**. Any candy-containing flavor + any candy currently deep-frozen → lower cooking-surface temperature (325°F; 300°F for the Triple). All flash-frozen → normal 375°F.
- When both candies are present, **the colder candy wins** — if either is deep-frozen, the heat drops.
- In Flight mode, the rule applies across the **selected** candy flavors only.

## Honest caveats

- **Combo candy toppings are extrapolations.** The PDF only gives one explicit combo formula (Triple at 1.0 oz = 2 chips + 2 caramel bits + 1 pinch toffee). v2.10.2 rescaled the rest with the Option A rule (each candy in a combo = 2/3 of single max at that size, with perceptual-floor exceptions at the 0.5 oz size).
- **Candy Prep heat logic** is a user-driven refinement of the PDF, not literal PDF content (see *Heat / Candy Preparation logic* above).
- **Combo candy column reads are internally consistent** — toffee in C+T = toffee in T+Ch = toffee in TCC, etc. — prioritizing consistency across the three candy columns over external benchmark replication.

## Sharing it

The whole app is one self-contained HTML file. Send it via email/iMessage/Slack/AirDrop — the recipient double-clicks it and it works. No install steps.

To host it on a URL: drop it in Nextcloud public share, Netlify Drop, a static nginx pod, or any static host. There's no backend to deploy.

## Source

Based on **The Master Pancake Flight Manual** (24-page PDF, malted-diner profile, optimized for a beginner cook making custom "flavor flights" with buttermilk powder + 2% Lactaid milk).

## Versioning

`X.Y.Z` — `Z` bumps **only** for bug fixes or items previously shipped buggy/incomplete; `Y` bumps for layout changes, UX restructures, new features, or anything user-visibly different; `X` is major. When a release bundles both, the higher bump wins.

**Current: v3.1.0** (active development on `_local_dev`, latest tag `v3.0.0-rc.10.0.8.0.1`). The v3.0.0 final shipped 2026-05-30; polish release **v3.0.0.1** (2026-05-31) added a sanitization sweep with no user-visible changes. v3.1.0 introduces a new flavor (Patisserie Plain), fractional batch quantity for non-Full sizes, a Prep Bulk Predefined picker (Nominal / Jar-Fit), a Flight Checklist mode split, and a TOPPINGS chart sync to Rev 5 of the source manual.

The 8-segment internal scheme (`vA.B.C.D.E.F.G.H-branch-pXX.YY_mZZ`) and the rc.9 development-cycle history are bookkeeping kept in the private archive, not in this README.

## License

Personal project. Recipe content belongs to the original manual author; the picker code is yours to do whatever with.
