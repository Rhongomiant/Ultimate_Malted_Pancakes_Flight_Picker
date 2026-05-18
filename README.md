# 🥞 Pancake Flight Picker

A single-file, zero-dependency web app that turns the **Master Pancake Flight Manual** (a malted-diner pancake recipe) into a point-and-click recipe picker. No build step, no install — just open the HTML file in a browser.

Two files in this project:

- `Ultimate_Malted_Pancakes_Flight_Picker_v2.7.0.html` — the picker app
- `Ultimate_Malted_Pancakes_Manual.html` — the companion reference manual (full prose, Word-import friendly)

## What it does

The manual is a binder of cross-referenced tables: 4 batch sizes × 12 flavor combinations × 5 pancake sizes, plus separate charts for ingredients, toppings, syrup pairings, and cooking rules. The picker collapses that into a few clicks and shows exactly what you need for the combination you chose.

**You pick:**

1. **Pancake size / ladle** (0.5 oz mini → 4.0 oz plate-sized) — *(v2.2.0)* in its own sticky bar above the recipe card; collapses to a `Reveal Pancake Size (Ladle Size)` pill when not in use
2. **Batch size** (Quarter / Half / Three-Quarter / Full) and **dry mix source** (Measure Each Ingredient vs. Use Bulk Dry Mix)
3. **Flavors & Combinations** (12 options):
   Plain · Chocolate · Bacon · Banana Nut · Bacon + Banana Nut · Banana Nut + Chocolate · Caramel · Toffee · Caramel + Chocolate · Caramel + Toffee · Toffee + Chocolate · Toffee + Caramel + Chocolate

**Conditional sub-pickers** appear when the selected flavor contains candy:

- **Caramel preparation** — Flash-frozen (10 min) vs. Deep-frozen (long-term). Shows whenever caramel is in the mix.
- **Toffee preparation** — same two options. Shows whenever toffee is in the mix.

When both candies are present, the lower temperature wins: if *either* candy is deep-frozen, the cooking surface drops to 325°F (300°F for the Triple).

**It outputs:**

- Exact dry ingredients (or "scoop X cups of Bulk Dry Mix")
- Wet bowl + correct fat for that flavor
- Spices with batch-scaled measurements (½, ¼, ⅛, 1/16, 1/32, 1/64, 1/128 tsp resolutions)
- Cooking-surface grease type
- Topping amounts for the chosen pancake size + Max Combined Volume Limit
- **Yield count** ("Yields ~N pancakes")
- Flavor-aware cooking callouts: 🛡 Batter Shield, 🛡🛡 Double Shield, 🌡 Heat warnings, 🧈 Unsalted-butter reminder, 🥓 Bacon timing, 🍌 Banana thickness, 🌰 Pine-nut toasting, 🧊 Candy prep
- Quality Tier chart (🥇 Best / 🥈 Good / 🥉 OK / ❌ Avoid) — syrup grade + ingredient pairings
- Step-by-step cooking checklist with **shield volume tailored to the selected pancake size** (½ tsp at 0.5 oz up to 1½ Tbsp at 4.0 oz)
- Print button (hides selectors and theme/layout toggles; prints only the recipe)

**Layout switcher:** Side-by-side (default; sticky picker sidebar with extra scroll room so the size selector stays reachable while reading the recipe) or Stacked (selections on top, recipe below). Falls back to Stacked on viewports under 1000 px.

**Theme switcher:** Auto (follows OS) / Light / Dark. Auto reacts to OS theme changes live. Print always uses the light palette.

**Card-size switcher** *(v2.0.0)*: a compact control next to Layout and Theme that resizes the recipe card from 80% to 140% without changing the recipe itself. Three controls in one pill — quick-jump preset pills (80% / 100% / 120% / 140%), a continuous slider, and a step selector (1% / 5% / 10%) that tunes the slider's increment. Implemented via CSS `zoom` on `.out-card`. Persists in `localStorage` (`pancakeFlightCardScale`, `pancakeFlightCardScaleStep`). Hidden on viewports under 600 px (browser zoom does the job there). Print always forces 100% regardless of slider position.

**Mode switcher: Single / Flight** *(v2.1.0)*: the first pill in the controls row toggles between **Single** mode (one flavor, the v1.x experience) and **Flight** mode (pick any subset of the 12 flavors and run them as a coordinated multi-flavor cook). In Flight mode, Card 2's flavor pills become multi-select (tap to include/exclude — same visual language as Single mode, an active pill is included), and the output reorganizes into two phases:

- **Setup phase** — Deduped prep callouts (toast pine nuts, slice bananas, freeze candy) appear once across the whole flight. One Dry Bowl block labeled `× N` with a "measure N× and split, or make N separate bowls" note. One Wet Bowl per flavor (each with its own milk/egg/fat and spices, including the Banana-Nut pick-one). Cooking-surface grease lines deduplicated by group (Clean / Savory / Candy) so you only re-grease when the grease type actually changes. Toppings per pancake rendered as a grid of per-flavor cards.
- **Cook phase** — Flavors are grouped by their **cooking order** (Clean → Savory → Candy) so you don't constantly swap greases or temperatures. Inline `[Cooking order ✓] [Selection order]` toggle lets you switch to selection-order rendering for the cook phase only. Each group shows its effective heat (Clean/Savory always 375°F; Candy uses colder-candy-wins across the *selected* candy flavors only — Triple + any-deep → 300°F, Triple all-flash → 325°F, non-Triple + any-deep → 325°F, otherwise 375°F). When a group has more than one flavor, a "stagger the rests" note explains how to mix flavor 2's bowls while flavor 1 is in its 10-min rest. Between groups: a "wipe surface and re-grease for the *next* group" transition.

**Quality Tier in Flight mode** *(v2.1.0)*: across multiple flavors, the four tiers each have a syrup slot and an ingredient slot, so 4 selected flavors would otherwise produce 32 tier cells. The picker compares the eight slot values (best/good/ok/avoid × syrup/ingredient) across all selected flavors, lists strict matches once in a **Shared across all N flavors** block at the top, and renders only the differing slots in per-flavor cards below. An inline layout switcher offers `Side-by-side` / `Stacked` / `Grid`. Degenerate case: with exactly one flavor selected, the classic 4-card Single-mode tier grid is rendered instead.

All five switchers (Mode, Layout, Theme, Card-size, plus the Flight-only Cook-grouping and Tier-layout toggles) persist in `localStorage`.

### v2.1.1 — Phase B refinements

A pile of UX polish + a long-requested feature, layered onto v2.1.0's Flight mode.

**URL state encoding** *(new in v2.1.1)*: the address bar reflects all current selections — batch, pancake size, flavor (single) or selected flavors (flight), candy preps, mode, dry-mix source, cook grouping, and tier layout. Use `history.replaceState` so the back button isn't polluted. Sharing a recipe is now just "copy URL"; opening someone else's link restores their exact picker state. Defaults are omitted from the URL to keep it short.

**Sticky/collapsible top chrome** *(new in v2.1.1)*: the controls row (Mode/Layout/Theme/Card-size) sticks to the top of the viewport as you scroll, with a `▲ Hide controls` toggle on the right that collapses it to a thin pill (`▼ Show controls`). The recipe card header (e.g. `Flight · 4 flavors · Half batch each · 1.0 oz`) is also sticky and positions itself just below the controls row using a `--controls-h` CSS variable that JS keeps in sync with the actual row height. Collapsed/expanded state persists.

**Picker cards reordered** *(v2.1.1)*: Pancake Size is now Card 1 (was Card 3), Batch is Card 2, Flavor is Card 3. In side-by-side layout, Pancake Size is also `position: sticky` within the picker sidebar so it never scrolls out of view.

**One section per concept** *(v2.1.1, Flight mode)*: Setup phase is restructured into discrete top-level sections — Dry Bowl(s), Wet Bowl(s), Spices, Toppings, Grease — each labeled with the correct singular/plural ("Dry Bowl" for 1 flavor, "Dry Bowls (× N)" for N>1). Wet/Spices/Toppings each render as a per-flavor sub-card grid. Spices was previously folded inside the Wet Bowl sub-card; it now has its own top-level section.

**Per-section layout switchers** *(v2.1.1)*: Wet, Spices, Toppings, and Quality Tiers each have their own `[Side-by-side / Stacked / Grid]` switcher. The "Side-by-side" mode now correctly renders **all N columns** (was capped at 3 by `auto-fit, minmax(220px, 1fr)`; now sets inline `grid-template-columns: repeat(N, minmax(0, 1fr))`). Each layout choice persists separately (`pancakeFlightWetLayout`, `pancakeFlightSpicesLayout`, `pancakeFlightToppingsLayout`, `pancakeFlightTierLayout`).

**Menu-order rendering** *(v2.1.1)*: per-flavor sub-cards (Wet, Spices, Toppings, Tiers) and per-flavor delta cards within the cook phase are always rendered in `FLAVORS` array order, regardless of selection order. Selection-order cook-phase rendering still respects pick order; menu-order is for the per-flavor card grids.

**Deduplicated Cook phase** *(v2.1.1)*: previously each cook-group block contained the full 8-step cooking flow per flavor (which meant 4 flavors × 8 steps = 32 nearly-identical step blocks). Now there's a single **Shared Cooking Instructions** card at the top of the Cook phase with the universal flow (mix, rest, scoop, flip, between-pancake), conditional on which flavors are present (bacon step only appears if any selected flavor uses bacon; shield step only if any selected flavor needs a shield). Below, each cook-group block contains compact per-flavor delta cards listing only the deltas: heat (in selection-order mode only — grouped mode shows heat at group level), strategy, toppings yes/no, bacon prep, banana prep, shield none/single/double, and candy prep state.

**Topping rendering fix** *(v2.1.1)*: toppings now render with a new `ul.topping-list` class that allows free wrapping inside narrow sub-cards (the old `ul.list .v { white-space: nowrap }` was preventing wrap). The Triple-Threat's `📐 Formula: …` legacy line is also gone — all combo-flavor toppings (`toffee_caramel`, `toffee_choc`, `caramel_choc`, `triple`) are now structured as one ingredient per line in the form `Toffee: …`, `Caramel: …`, `Chocolate: …` — matching the way Banana Nut already rendered.

**Single mode parity** *(v2.1.1)*: Single mode also picks up the `out-header` wrap (for sticky header support) and the `topping-list` rendering. Byte-identity to v2.0.0/v2.1.0 Single-mode output is therefore broken **on purpose** for any flavor whose toppings table changed (`toffee_caramel`, `toffee_choc`, `caramel_choc`, `triple`, plus the header wrap on all 12). The change is identical to the Flight-mode improvement.

### v2.7.0 — Unconditional layouts (compact-mode removed)

Three issues reported on v2.6.0: in side-by-side the pancake-size picker was invisible and the Flight title card overlapped the Setup-phase label; in stacked the user wanted the (good-looking) Batch | Flavors | PSB layout shown at initial load to be **permanent**, not a scroll-triggered transformation; and the Flight-card overlap also occurred in stacked.

**Root cause of the side-by-side breakage**: v2.6.0 added a `.picker-region` wrapper around `picker-pane` + `pancake-size-bar` (plus a `picker-sentinel` for an `IntersectionObserver`). In stacked compact mode the wrapper switched to a 2-col grid; in side-by-side it was supposed to use `display: contents` so its children participated in the outer `.wrap` grid as before — but that rule was missing. As a result the wrapper became a single grid item, the `pancake-size-bar`'s `grid-column: 2; grid-row: 1` placement no longer applied, and `.output-pane` got auto-placed into the wrong row. The `.out-header` sticky-top math (calibrated against the absent pancake-size-bar) then put the sticky title visually overlapping the start of the `.out-card` content. Additionally, the `IntersectionObserver` used `rootMargin: '-80px 0px 0px 0px'`, which made the sentinel report `isIntersecting: false` immediately on page load (the sentinel sits above the 80px effective margin from the very start) — activating `data-picker-compact="1"` before any scrolling.

**v2.7.0 strategy: remove the compact-mode toggle entirely. Make both layouts unconditional based on `data-layout` alone.**

For **side-by-side**, `.picker-region { display: contents; }` lets `picker-pane` and `pancake-size-bar` participate in the outer `.wrap` grid via their existing rules (picker-pane col 1 spanning two rows, pancake-size-bar col 2 row 1, output-pane col 2 row 2). The standalone `pancake-size-bar` is visible and sticky at the top of the right column. The `.out-header` sticks below it as in v2.5.0, no overlap.

For **stacked**, `.picker-region` is always a 2-column grid with `position: sticky; top: var(--controls-h)` and `border-bottom: 1px solid var(--line)`. `.picker-pane > .card`s use `display: contents` so Batch and Flavors participate in the grid: Batch in col 1 row 1, Flavors in col 2 rows 1-2 (spans since it's taller with 12 flavors plus candy prep), and `pancake-size-bar` in col 1 row 2 with reduced padding and font sizes — fitting under Batch the way image 2 showed. The whole picker stays stuck at the top of the viewport so all settings remain accessible while reading the recipe.

**Sticky-top math** for `.out-header` now differentiates by layout: side-by-side uses `calc(controls-h + psb-h + 12px)` (because pancake-size-bar is the sticky element above it), stacked uses `calc(controls-h + picker-region-h + 12px)` (because the entire picker-region is the sticky band above it). A new `--picker-region-h` CSS variable, set by a `ResizeObserver` on `#picker-region`, keeps the math correct as content reflows (collapsing options, expanding candy prep, etc.).

**Removed**: the `picker-sentinel` element from the DOM, the `IntersectionObserver` IIFE, the `--picker-compact-h` CSS variable, every `[data-picker-compact]` selector, the `.out-header-psb` / `.out-header-text` substructure, the `buildEmbeddedPsbHtml()` function, the embedded-psb click handler in `attachToggleHandlers`, and the transient `state.pickerCompact` field.

**Net effect**: file is ~5KB smaller and ~80 lines shorter than v2.6.0. No new persistent state — same `orderMode`, `recommendedSubOrder`, `cookLayout` fields, same localStorage keys, same URL parameters.

### v2.6.0 — Compact-mode pancake-size relocation

Two follow-on layout changes for the scrolled state:

1. **Stacked compact mode**: when the user scrolls past the picker in stacked, the picker pane already becomes a side-by-side Batch | Flavors sticky band — but because Flavors is taller than Batch (especially with many flavors + candy prep), there was empty space in the bottom-left corner. v2.6.0 fills that space with the pancake-size-bar (smaller). Implementation: introduced a new `.picker-region` wrapper that contains `picker-sentinel`, `picker-pane`, and `pancake-size-bar`. In stacked compact, `.picker-region` becomes a 2-column CSS grid, `picker-pane` uses `display: contents` to let its children participate in the grid, Batch takes col 1 row 1, Flavors spans col 2 rows 1-2, and the pancake-size-bar tucks into col 1 row 2 with reduced padding/font sizes. In side-by-side mode, `.picker-region` uses `display: contents` so the existing grid placement of `pancake-size-bar` (col 2 row 2) and `picker-pane` (col 1 spans 2 rows) is preserved unchanged.

2. **Side-by-side compact mode**: when scrolling in side-by-side, the pancake-size-bar previously stayed sticky at the top of the right column as a separate band above the recipe title. v2.6.0 merges them into a single sticky chrome band — the standalone `pancake-size-bar` hides, and a compact version of the size pills appears inline inside `#out-header` next to the Flight title. The header becomes a flex row: `.out-header-text` (title + yield) on the left, `.out-header-psb` (size pills) on the right.

**Implementation details:**

- New `buildEmbeddedPsbHtml()` helper renders the inline size pills inside `#out-header`. Same `data-size` attribute as the standalone `#size-opts`, so both stay in sync with `state.size`.
- The embedded pills get their own `onclick` binding in `attachToggleHandlers()` (direct binding, same pattern as the order/sub-order/cook-layout buttons).
- The `picker-sentinel` is now active in *both* layouts (in side-by-side it spans `grid-column: 1 / -1` as a 1px line) so the `IntersectionObserver` fires the `data-picker-compact` state in both modes. This unlocks the side-by-side scrolling band.
- `.out-header-psb` is `display: none` by default; CSS reveals it only when `body[data-layout="side"][data-picker-compact="1"]`. In stacked compact, it stays hidden because the (real) `pancake-size-bar` is tucked under Batch in the picker-region grid.

**No state shape changes** vs v2.5.0 — same `orderMode`, `recommendedSubOrder`, `cookLayout` fields, same localStorage keys, same URL parameters. Pure CSS + HTML wrapper + small render-helper addition.

### v2.5.0 — Stacked width parity + centered header

Two tiny polish items on v2.4.0:

1. **Stacked width matches side-by-side**: v2.4.0 bumped the default `.wrap` from 920px to 1200px, but side-by-side was still wider at 1600px — so switching to stacked mode (or hiding options in side-by-side) felt like the page suddenly got narrower. Stacked now uses the same 1600px max-width as side-by-side, so visually the chrome and content occupy the same horizontal real estate regardless of layout. In stacked-mode compact-pair, this gives Batch + Flavors a much wider sticky band, which in turn means the band can be flatter (less vertical space lost) since each card has more room to lay out its options horizontally.
2. **Centered title + subtitle**: `h1` and `.sub` both got `text-align: center`. In side-by-side they were already spanning the full grid via `grid-column: 1 / -1`, but the text inside was left-aligned. They now sit visually centered at the top of the page in both layouts.

No state/localStorage/URL changes; no JS changes. Pure CSS.

### v2.4.0 — Eight feedback items on v2.3.0

A polish pass that fixes the bugs and gaps users hit in v2.3.0, plus one UX addition:

1. **Sticky title visibility** *(bug)*: the v2.3.0 sticky `.out-header` was using a 4-pixel gap below the pancake-size-bar in its sticky-`top` calc, which wasn't enough breathing room — the title was visually slipping behind the size bar as the user scrolled. Gap bumped from 4px to 12px on every `.out-header` sticky-top calc variant (controls-collapsed, pancake-collapsed, both collapsed, and the new compact-pair variant). A `ResizeObserver` now watches `controls-row` and `pancake-size-bar` and updates `--controls-h` / `--psb-h` whenever those elements reflow, so the calc stays correct on viewport changes or content reflow.
2. **Setup-phase order toggle** *(UX addition; the reason this is v2.4.0)*: the 3-way Recommended/Menu/Selection order toggle (with conditional Recommended-only sub-order) now appears in *both* phase headers — Setup and Cook. New `buildOrderToggle(suffix)` helper produces two instances (`data-toggle-group="order-mode-setup"` and `data-toggle-group="order-mode-cook"`), each with its own DOM identity but mirroring the same state. Clicking either updates the same state and re-renders both.
3. **Sub-order + cook-layout clickability** *(bug)*: in v2.3.0 the delegated `closest()`-matching listener didn't fire reliably for the sub-order buttons or the cook-phase layout switcher (suspected browser-specific quirk with closest() through nested toggles). Replaced delegation with **direct per-button `onclick` binding** via a new `attachToggleHandlers()` function called after every render. The selector for cook-layout uses `button[data-cook-layout]` so the `.flavor-deltas-grid` (which also has `data-cook-layout` for CSS styling) doesn't get swept in. Each handler calls `e.stopPropagation()` to prevent double-firing with the still-present delegated listener.
4. **Side-by-side sub-card overlap** *(bug)*: in v2.3.0, `sideGridStyle()` emitted `repeat(N, minmax(0, 1fr))` for the inline `grid-template-columns`. Combined with the CSS rule `.subcards-grid[data-subcard-layout="side"] .subcard { min-width: 220px }`, columns shrank to nearly 0 while children refused to shrink below 220px — the children overflowed their cells and visually overlapped. Fix: inline `minmax(220px, 1fr)` so the grid columns themselves honor the 220-pixel floor and grow the grid container to whatever total width is needed. Horizontal scrolling now actually moves the cards instead of just nudging.
5. **Syrups everywhere** *(restructure)*: v2.3.0 split syrup display by mode (shared list in Recommended, per-flavor row in Menu/Selection). In practice that was confusing — when switching modes, the syrup info would teleport between places. v2.4.0 shows syrups in **both** places, in **all** modes — a per-flavor `Syrup: …` row inside every delta card AND a deduped `Recommended syrups (one line per distinct syrup)` list inside the shared cook card. Switching modes now only changes ordering, not content placement.
6. **Stacked-mode width + compact pair refinement** *(layout)*: the v2.3.0 stacked layout was using the default `.wrap { max-width: 920px }` — substantially narrower than side-by-side's 1600px — which made the compact-pair Batch+Flavors band feel cramped after the animation. Default wrap is now `1200px`. The compact-pair CSS also shrinks the cards visually when in compact mode (padding `8px 12px`, smaller h2, tighter opts gap, smaller opt padding/font) so the sticky band takes considerably less vertical space. A new CSS variable `--picker-compact-h` is set live by JS (in `updateStickyHeights` + the `ResizeObserver`) to the picker pane's measured height, and is consumed by:
    - `body[data-picker-compact="1"] .pancake-size-bar` — sticky top becomes `calc(var(--controls-h) + var(--picker-compact-h))`, so the size bar sits *below* the compact pair instead of overlapping it
    - `body[data-picker-compact="1"] .out-header` — sticky top becomes `calc(var(--controls-h) + var(--picker-compact-h) + var(--psb-h) + 12px)`, so the recipe title also stacks below everything
   The result: in stacked mode, when the user scrolls past the picker, the chrome band reorganizes to {controls} → {compact pair} → {pancake size} → {recipe title (sticky)} with no overlaps and visibly less vertical space than the un-compacted version.

**No state shape changes** vs v2.3.0 — same `orderMode`, `recommendedSubOrder`, `cookLayout` fields. Same localStorage keys, same URL parameters. Pure CSS + rendering + event-binding fixes.

**Note for future iterations**: the user mentioned they may want syrup-per-group-card (instead of/in addition to syrup-per-delta-card) in a future iteration when in Recommended Order. v2.4.0 keeps the syrup in every per-flavor card for consistency; switching to per-group-card display would be a small render-time change in `cookGroupsHtml` if requested later.

### v2.3.0 — Twelve refinements + a sub-order add

Twelve user-driven refinements addressing v2.2.0 bugs and feature requests:

1. **Sticky title + yield (both visible, fixed)**: v2.2.0's split sticky (title scrolls, yield stays) didn't actually stick — the `.out-yield` element lived inside `.out-card`, which has `zoom: var(--card-scale)`, and that zoom breaks `position: sticky` on descendants in every browser. Fix: moved the header into a new `<div class="out-header" id="out-header">` that lives **outside** `.out-card`, directly inside `.output-pane`. Both renderers now write to two elements (`#out-header` for the header, `#output` for the recipe body). Single sticky block contains both title and `Yields ~X pancakes` together; both stay visible while scrolling.
2. **Show/Hide buttons visible when collapsed; capitalized labels**: deleted a leftover v2.1.1 CSS rule (`body[data-controls-collapsed="1"] .controls-row > :not(.controls-toggle) { display: none; }`) that was still hiding `.controls-actions` even though v2.2.0 moved the toggle inside that wrapper. Labels are now `Hide Controls` / `Show Controls` / `Hide Options` / `Show Options` (capitalized).
3. **Dry + Wet side-by-side**: in Flight output, the Dry Bowl(s) and Wet Bowl(s) blocks are wrapped in a `.setup-row-pair` 2-column grid (`grid-template-columns: 1fr 1fr`). Falls back to a single column under 700px viewport.
4. **Three-way order toggle + sub-order**: the Cook-phase grouping toggle was a boolean (`Recommended Order` / `Selection Order`). It's now a 3-way enum: **Recommended Order** (cook-group grouping, Clean → Savory → Candy), **Menu Order** (flat, by FLAVORS array position), **Selection Order** (flat, by user's pick order). Applies to both Setup and Cook phases. When Recommended is selected, a secondary sub-toggle appears (`within groups: Menu / Selection`) that controls within-group ordering. State: `orderMode` ('recommended'|'menu'|'selection') and `recommendedSubOrder` ('menu'|'selection') replace the old `groupByCookOrder` boolean. CSS hides the sub-toggle when not in Recommended mode via `body[data-order-mode="recommended"]`.
5. **Quality Tier moved to the end** (after Cook phase): Quality Tier is reference content, not action content. Recipe flow now reads top-to-bottom in execution order — header → prep callouts → Setup phase → Cook phase → Quality Tier (reference).
6. **Picker card prefixes stripped**: `2. Batch size & dry mix source` → `Batch size & dry mix source`. `3. Flavors & Combinations` → `Flavors & Combinations`. (Pancake Size already had no prefix.)
7. **Side-by-side overlap fix**: tier and sub-card grids in Side-by-side mode no longer crush cards past readability. Sub-card grid min-width raised from 200px to 220px; tier-side cards have their own min-width of 260px (more text per card). Tier-side now also has horizontal scroll (`.tier-side-grid { overflow-x: auto }`) matching the sub-card behavior, with a slim themed scrollbar.
8. **Cook-phase layout switcher**: Side-by-side / Stacked / Grid switcher, same pattern as Tier / Wet / Spices / Toppings. New state `cookLayout` (default `grid`), localStorage key `pancakeFlightCookLayout`, URL param `cklayout`. Applies to every `.flavor-deltas-grid` in the cook phase (one per group in Recommended mode, one flat grid in Menu/Selection mode). Hidden when n=1.
9. **Syrups moved into Cook phase**: the standalone Recommended-Syrups block (previously between callouts and Quality Tier) is gone. In **Recommended Order** mode, syrups appear in the Shared Cooking Instructions card as a deduped list (`Recommended syrups: <syrup> — for <flavors>`). In **Menu** or **Selection** mode (flat per-flavor cards), each delta card gets its own Syrup row. New helper `getSyrupGroupings(flavors)` returns `[{syrup, flavors:[labels]}]` for the dedup.
10. **Stacked mode compact pair animation**: in Stacked layout, Batch / Flavors / Pancake Size cards start vertically stacked (full-width). When the user scrolls past the picker-pane's natural position, Batch and Flavors animate into a side-by-side compact pair (each card width transitions from `100%` to `calc(50% - 7px)` over 0.3s ease). The pair becomes sticky as a band at the top of the viewport (under the controls row). Pancake Size stays as its own separate sticky bar below the pair. Implementation: hidden `.picker-sentinel` 1px element sits just above the picker-pane; an IntersectionObserver watches the sentinel and toggles `body[data-picker-compact]` when it leaves the viewport. The picker-pane uses `display: flex; flex-wrap: wrap; transition: width 0.3s ease` so card widths animate smoothly.
11. **Pancake Size under Flavors in Stacked**: in v2.2.0 the DOM order was `pancake-size-bar` → `picker-pane`, which put the size bar above Batch in Stacked. v2.3.0 moves `pancake-size-bar` in DOM to **after** `picker-pane`. In Side-by-side, the grid placement is explicit (col 2) so DOM order doesn't matter — the bar still sits above the recipe in the right column.
12. **Print fallback with side alert**: clicking 🖨 Print now goes through a JS override (the inline `onclick="window.print()"` is gone). If any layout currently set to Side-by-side has more than 5 flavors (heuristic — overflows most print pages), the script sets `body[data-print-fallback="1"]` (CSS auto-switches side-by-side grids to `repeat(auto-fit, minmax(240px, 1fr))` for print) and shows a fixed-position alert pinned to the **left** edge of the viewport (so the centered print dialog can't cover it) explaining what happened. On `afterprint`, the fallback flag clears immediately and the alert fades after 4 seconds. The alert also has a manual close button.

**Bug fixes layered into the same release:**

- The v2.1.1-era CSS rule `body[data-controls-collapsed="1"] .controls-row > :not(.controls-toggle) { display: none; }` was hiding `.controls-actions` whenever controls were collapsed (item 2 above). Deleted; the equivalent v2.2.0 rule using `:not(.controls-actions)` is what's actually correct.

**State / localStorage / URL changes (with backward compatibility):**

- State: `orderMode` ('recommended'|'menu'|'selection') and `recommendedSubOrder` ('menu'|'selection') replace `groupByCookOrder` (bool). Added `cookLayout` ('side'|'stack'|'grid'). Added transient `pickerCompact` (observer-driven, not persisted).
- localStorage: new keys `pancakeFlightOrderMode`, `pancakeFlightRecSubOrder`, `pancakeFlightCookLayout`. **Backward compat**: if `pancakeFlightOrderMode` is absent, the old `pancakeFlightGroupByCook` is read — `'1'` → `recommended`, `'0'` → `selection`. New key wins when both are present.
- URL: new params `order=recommended|menu|selection` (or short forms `rec`/`sel`), `recsub=menu|sel`, `cklayout=...`. Backward compat: old `group=0|1` still parses. `recsub` is only written when in Recommended mode and value is non-default; `cklayout` elides when grid (default).
- Helpers: `groupSelectedByCooking(ids, subOrder)` accepts a sub-order parameter. New `getSyrupGroupings(flavors)`. `getRenderOrderedFlavors()` rewritten for 3-way + sub-order. `applyCollapseStates()` now also writes `body[data-order-mode]` so the sub-toggle CSS visibility stays in sync.
- DOM: new elements `#out-header` (outside `.out-card`), `#picker-sentinel` (above `.picker-pane`), `#print-alert` (fixed-left alert), `#pa-close` (alert close), `#print-btn` (id added so JS can override). `pancake-size-bar` relocated in DOM after `picker-pane`.

### v2.2.0 — Layout overhaul

Ten user-driven layout refinements:

1. **Card 3 renamed** to `Flavors & Combinations` (was `Flavor combination`) — more accurately reflects what's there.
2. **Wet Bowl count** *(Flight, N>1)*: heading now reads `Wet Bowls (× N)` so the multiplier is visible at-a-glance.
3. **Sticky yield, scrolling title**: the `out-header` is split into `out-title` (scrolls away normally) + `out-yield` (sticky, sits just below the controls + size bar). The `Yields ~X pancakes` line stays visible as you read down through the recipe; the verbose title text doesn't compete for that sticky space.
4. **Wet bowl content restructured** *(Flight)*: the Wet Bowl block now shows **only the shared ingredients** (2% Lactaid milk + egg) in a single block — these are identical across every bowl. The previous `Spices (into wet bowls)` block becomes **`FAT & Spices (into wet bowls)`** and now includes the per-flavor melted fat (varies by flavor: butter / ghee / bacon grease etc.) alongside spices and any pick-one spice groups.
5. **Selection Order extended** *(Flight)*: the Cook-phase toggle now also affects Setup-phase sub-cards. The labels are clearer too — `Cooking order` → `Recommended Order` (cook-phase grouping for the cook phase + menu order for setup sub-cards), and `Selection order` → `Selection Order` (your raw pick order everywhere, both phases). New `getRenderOrderedFlavors()` helper centralizes the choice.
6. **Sub-card readability fix** (the trickiest of the bunch): when many flavor sub-cards rendered side-by-side, ingredient lines like `Cinnamon … Pinch (1/16 tsp)` were squashed into a too-narrow flex `space-between` row. Fix is three-pronged:
   - **k/v stacks vertically inside sub-cards**: the ingredient name renders on its own line in `--ink`/600-weight; the measurement renders on a second line, bulleted with `•` in `--accent`. No more `nowrap` squish.
   - **horizontal scroll fallback** on the sub-card grid in side-by-side mode (`overflow-x: auto`, slim themed scrollbar, `min-width: 200px` per sub-card) so even at high column counts the content remains readable rather than truncating.
   - **wider recipe card**: side-by-side wrap max-width bumped from `1320px` to `1600px`, giving the recipe column ~280px more room.
7. **Pancake Size moved out of the picker pane**: it now lives as its own sticky bar (`#pancake-size-bar`) above the recipe card in both layouts. Sits below the controls row, above the recipe. Collapses to a compact pill reading `Reveal Pancake Size (Ladle Size)` via the `▲ Hide` / `▼ Show` button. Picker pane now contains only Card 2 (Batch & dry mix) and Card 3 (Flavors & Combinations).
8. **Hide Options button**: grouped with `Hide Controls` on the right side of the controls row (in a new `.controls-actions` container). Clicking collapses the entire picker pane, giving the recipe + size bar the full page width. The two buttons stay together on the right whether the controls themselves are collapsed or not; `data-options-collapsed="1"` on `<body>` drives the CSS.
9. **Stacked-mode sticky picker cards** *(independent collapse)*: in Stacked layout, the Pancake Size bar and Batch card stay on screen as you scroll (each `position: sticky` with stacked `top:` offsets from `--controls-h` + `--psb-h` CSS variables). The longer Flavors card scrolls with the page. Each of the picker cards has its own `▲ Hide` / `▼ Show` chevron — collapse just the card you're not currently editing.
10. **Side-by-side options always visible**: with the sticky picker pane (`position: sticky; top: var(--controls-h) + 8px; max-height: calc(100vh - var(--controls-h) - 16px); overflow-y: auto`), the top of the side menu is anchored to the viewport and the user can scroll *within* the pane to bring the picker they want next to whatever section of the recipe they're reading.

**New state fields**: `pancakeSizeCollapsed`, `batchCardCollapsed`, `flavorCardCollapsed`, `optionsCollapsed`. **New localStorage keys**: `pancakeFlightPancakeSizeCollapsed`, `pancakeFlightBatchCardCollapsed`, `pancakeFlightFlavorCardCollapsed`, `pancakeFlightOptionsCollapsed`. Collapse state is UI prefs only, not encoded in the URL (keeps shared URLs short and recipe-state-only).

**New helpers**: `wetBowlSharedHtml(b)` — milk + egg only; `fatAndSpicesHtml(f, b)` — per-flavor fat + spices + pickOneSpices; `getRenderOrderedFlavors()` — menu order or pick order based on `state.groupByCookOrder`; `applyCollapseStates()` — writes all body data-attrs from state in one pass; `updateStickyHeights()` — keeps `--controls-h`, `--controls-collapsed-h`, `--psb-h`, `--psb-collapsed-h` in sync with actual rendered heights. The old `updateControlsHeight` is kept as a thin alias since `render()` calls it.

All four new switchers (Wet/Spices/Toppings/Tier layout) and the controls-collapsed state persist in `localStorage`.

**Reference docs** (collapsible at bottom): Bulk Pantry Mix recipe + jar storage, vocabulary cheat sheet (Hint / Drop / Smidgen / Pinch / Dash / Tad + Scant / Fat modifiers + Shield Rule), mixing & resting rules, Shield Rule with precise volumes per pancake size, ladle prep (45–60 sec ice-bath rule), advanced tips (warm-water fat bath, Microplane nutmeg, pine-nut toasting, Candy Crushing Protocol, Shield Application Mechanism), cooking order + between-batch cleanup, liquid troubleshooting, flipping technique, syrup grade reference, component sourcing guide.

## Running it locally

```bash
# Either double-click the HTML file, or:
open  Ultimate_Malted_Pancakes_Flight_Picker_v2.7.0.html   # macOS
xdg-open Ultimate_Malted_Pancakes_Flight_Picker_v2.7.0.html # Linux
start Ultimate_Malted_Pancakes_Flight_Picker_v2.7.0.html   # Windows
```

That's it. No server, no install, no internet. Works on Mac, Windows, Linux, iOS Safari, Android Chrome. The entire app is one HTML file (~3200 lines as of v2.7.0) with inline CSS and vanilla JS.

The companion `.html` manual opens the same way in a browser. To import into Word: File → Open → select the manual HTML; Word preserves the tables, headers, and bullet hierarchy.

## Project layout

```
pancake-flight-app/
├── Ultimate_Malted_Pancakes_Flight_Picker_v2.7.0.html   # the app
├── Ultimate_Malted_Pancakes_Manual.html                 # source-of-truth reference doc
└── README.md                                            # this file
```

## How the code is organized

All in the picker HTML file. Approximate landmarks (line numbers from v2.2.0):

| Lines       | What lives there |
|-------------|------------------|
| 1–278       | `<style>` block — design tokens (CSS custom properties + dark-theme overrides), pickers, output cards, tier badges, reference accordion, print rules; side-by-side grid w/ wider 1600px wrap and options-collapse fallback *(v2.2.0)* |
| 279–340     | Layout switcher CSS · Theme switcher CSS (share visual language) |
| 341–380     | Card-scale switcher CSS *(v2.0.0)* |
| 381–540     | Flight-mode CSS *(v2.1.0)* — mode switcher, flavor-status row, empty state, phase headers, wet-flavor cards, toppings-by-flavor grid, grease lines, cook-group blocks, inline pill toggles, shared/per-flavor tier blocks |
| 541–600     | Base print rules + other utility CSS |
| 601–740     | v2.1.1 CSS — sticky+collapsible controls row, `subcards-grid` with `data-subcard-layout`, `topping-list` wrapping class, `cook-shared` + `flavor-delta-card` styles |
| 741–890     | v2.2.0 CSS additions — `.controls-actions`, `.pancake-size-bar` (sticky+collapsible), `.card-collapse` per-card toggles, split `.out-title` / `.out-yield`, sub-card list k/v stacking, sub-card grid horizontal scroll, stacked-mode sticky batch card |
| 891–980     | HTML — controls row w/ `controls-actions`, new `pancake-size-bar`, picker pane w/ `data-card` + `card-head/card-body` on Batch and Flavors *(v2.2.0)* |
| 981–1265    | Reference content (`<details>` accordions) — unchanged |
| 1267–1330   | Theme switcher IIFE · Layout switcher IIFE |
| 1331–1400   | Card-scale switcher IIFE |
| 1401–1460   | Lookup tables (`BATCHES`, `SIZES`, `SHIELD_VOLUMES`, `DRY`, `WET`, etc.) |
| 1461–1590   | `FLAVORS` array (each entry has `cookGroup`) |
| 1485–1556   | `TOPPINGS` matrix — combo flavors and Triple cleaned to one-ingredient-per-line |
| 1591       | `state` object — now includes `pancakeSizeCollapsed`, `batchCardCollapsed`, `flavorCardCollapsed`, `optionsCollapsed` *(v2.2.0)* |
| 1608       | localStorage restore — 4 new keys for v2.2.0 collapse states |
| 1631       | `parseUrlState()` and `updateUrlState()` |
| 1730–1985   | Shared helpers — `FLAVOR_INDEX`, `getSortedSelectedFlavors`, **`getRenderOrderedFlavors`** *(v2.2.0)*, `groupSelectedByCooking`, heat helpers, `dryBowlHtml`, `wetBowlHtml`, **`wetBowlSharedHtml`** *(v2.2.0 — shared milk + egg only)*, `spicesHtml`, **`fatAndSpicesHtml`** *(v2.2.0 — per-flavor fat + spices + pickOneSpices)*, `toppingsInnerHtml`, `flavorCallouts`, `tierGridHtml`, `compareTiers` |
| 1986–2000   | `layoutSwitcherHtml`, `sideGridStyle` |
| 2000–2090   | `flavorDeltaCardHtml`, `sharedCookingFlowHtml` |
| 2086–2183   | `render()` — calls `updateStickyHeights()` *(v2.2.0)* after each render |
| 2185–2299   | `renderSingleOutput()` — split `.out-title` / `.out-yield` *(v2.2.0)* |
| 2301–2556   | `renderFlightOutput()` — uses `getRenderOrderedFlavors`, single Wet block (shared only), `FAT & Spices` per-flavor block, sticky-split header, `Recommended Order` / `Selection Order` Cook toggle |
| 2559–2825   | Event listeners — `controls-toggle`, **`options-toggle`** *(v2.2.0)*, **`psb-toggle`** *(v2.2.0)*, **`[data-card-toggle]` delegation** *(v2.2.0)* for Batch + Flavors collapse; **`applyCollapseStates()` + `updateStickyHeights()`** replace v2.1.1's narrower helpers |

### Data model

Each entry in `FLAVORS[]` looks like this:

```js
{
  id: 'caramel',
  cookGroup: 'candy',      // 'clean' | 'savory' | 'candy' — used by Flight mode to group cooking steps
  label: 'Caramel',
  strategy: 'BATTER SHIELD required. Add flake salt on top after flipping.',
  spices: [
    { name: 'Sea Salt Flakes', amounts: SPICE.seaSalt },   // 4-element array, one per batch size
  ],
  pickOneSpices: { ... },   // optional: a "choose ONE" group (used by Banana Nut)
  fat: 'Melted Ghee',
  panGrease: 'Pure Avocado Oil',
  syrup: 'Grade A Very Dark Strong',
  shield: true,            // shows the Batter Shield warning + step
  doubleShield: true,      // shows the Double Shield warning + step (Triple only)
  hasCaramel: true,        // triggers the Caramel Prep picker + heat logic
  hasToffee: true,         // triggers the Toffee Prep picker + heat logic
  tiers: {
    best: ['Grade A Very Dark Strong', 'Frozen Baking Caramel Bits'],
    good: ['Grade A Dark Robust',      'Micro-chopped Kraft Caramel Bits'],
    ok:   ['Grade A Amber Rich',       'Chopped standard caramel squares'],
    bad:  ['Imitation Maple / Corn Syrup', 'Liquid caramel sauce in wet mix'],
  },
}
```

Spice "ladders" are stored in `SPICE` as 4-element arrays indexed by batch size (`quarter / half / three / full`):

```js
const SPICE = {
  cinnamon: ['Pinch (1/16 tsp)', 'Dash (⅛ tsp)', 'Scant Tad (3/16 tsp)', 'Tad (¼ tsp)'],
  nutmeg:   ['Drop (1/64 tsp)',  'Smidgen (1/32 tsp)', 'Scant Pinch (3/64 tsp)', 'Pinch (1/16 tsp)'],
  // ...
};
```

`SHIELD_VOLUMES` maps each pancake size to the precise volume of cold plain batter to scoop into the 1-oz shielding ladle, plus the execution technique for that size:

```js
const SHIELD_VOLUMES = {
  's05': { volume: '½ tsp',           fill: '...', execution: 'Drizzle a tiny drop ... micro-stamp.' },
  's10': { volume: '1 tsp',           fill: '...', execution: 'Drizzle a thin ring ... perimeter seal.' },
  // ...
};
```

### Heat / Candy Preparation logic

The one piece of business logic that goes beyond the original PDF:

- The original PDF hardcodes lower temperatures for `Caramel + Toffee` (325°F) and the Triple (300–325°F) but doesn't lower the temp for `Caramel`, `Toffee`, or `Caramel + Chocolate` alone.
- The picker overrides this with a rule: **heat depends on candy preparation, not on the flavor combo**. Any candy-containing flavor + any candy currently deep-frozen → lower cooking-surface temperature (325°F; 300°F for the Triple). All flash-frozen → normal 375°F.
- The Caramel Prep picker shows when `flavor.hasCaramel`. The Toffee Prep picker shows when `flavor.hasToffee`. When both are present, **the colder candy wins** — if either is deep-frozen, the heat drops.
- To revert to the original PDF behavior, change the effective-prep computation in `getEffectivePrep()` and the `useLowHeat` logic in `renderOutput()`.

### Theming

Colors live entirely in CSS custom properties on `:root` (light) and `body[data-theme="dark"]` (dark overrides). To re-skin, change the tokens — no element-level CSS edits needed.

Key tokens: `--bg`, `--card`, `--line`, `--ink`, `--muted`, `--accent`, `--accent-soft`, `--good`, `--warn`, `--info`, plus tier-specific tokens like `--tier-best-bg/border/fg`.

## Extending the project

### Add a new flavor

1. Add a new object to `FLAVORS[]` with the structure shown above.
2. Set `cookGroup` to one of `clean` / `savory` / `candy` — Flight mode uses this to group the flavor's cooking steps. *Clean*: no bacon grease, no sticky candy. *Savory*: cooked in bacon grease. *Candy*: sticky sugar residue, cook last.
3. Add an entry to `TOPPINGS[<flavor-id>]` — an array of 5 entries (one per pancake size), each an array of topping lines.
4. If it uses caramel, set `hasCaramel: true`. If it uses toffee, set `hasToffee: true`. Either flag enables the corresponding prep picker + heat logic.
5. Done — it shows up in both the Single-mode flavor picker and the Flight-mode multi-select pills automatically.

### Add a new batch size

Extend all the 4-element arrays in `DRY`, `WET`, `SPICE`, `FAT`, `BULK_SCOOP` to 5 elements and add an entry to `BATCHES[]`. That's a lot of measurement math; the original PDF only provides 4 sizes.

### Add a new pancake size / ladle

1. Add an entry to `SIZES[]` with a `maxCombined` value.
2. Add an entry to `SHIELD_VOLUMES[]` with `volume`, `fill`, and `execution` text for the shield instructions at that size.
3. Add a 6th row to every entry in `TOPPINGS[]`.

(Note: combo-candy `TOPPINGS` entries are extrapolations — the PDF only specifies one explicit combo formula at 1.0 oz Triple. Existing extrapolations live in the file with a comment.)

### Change the styling

All design tokens live in the `:root` and `body[data-theme="dark"]` blocks at the top of the `<style>` tag. Tweak the variables and every component picks up the change.

## What's NOT in this picker

The picker captures the dynamic recipe logic from the manual, but a few things live only in the **reference sections** at the bottom (the collapsible `<details>` accordions) rather than reacting to picker selections:

- Mason jar canning / storage rules
- Vocabulary cheat sheet (Hint / Drop / Smidgen / Pinch / Dash / Tad + Scant / Fat / Shield Rule)
- Storage & leftover rules
- Advanced ingredient nuances (vanilla paste vs. extract, Microplane nutmeg technique, etc.)
- Candy Crushing Protocol and Shield Application Mechanism (separate write-ups in addition to the cooking-step injections)
- Precise Shield Volumes Per Ladle Sizing reference table (volumes also flow into the cooking steps automatically)
- Component sourcing recommendations (King Arthur malt + espresso, Saco buttermilk powder, Nielsen-Massey vanilla, Peter's Caramel Loaf, Heath Bits O' Brickle, etc.)

These are static reference docs, not picker outputs.

## Honest caveats

- **Combo candy toppings are extrapolations.** The PDF only gives one explicit combo formula (Triple at 1.0 oz = 2 chips + 2 caramel bits + 1 pinch toffee). For other candy combo sizes, the picker shows per-ingredient max amounts with "stay under Max Combined" rather than fabricating exact totals. This is more honest but less prescriptive.
- **Candy Prep heat logic** is a user-driven refinement of the PDF, not literal PDF content (see *Heat / Candy Preparation logic* above).
- **No automated tests.** Verification is manual against the manual.

## Sharing it

The whole app is one self-contained HTML file. Send it via email/iMessage/Slack/AirDrop — the recipient double-clicks it and it works. No install steps.

If you want to host it on a URL: drop it in Nextcloud public share, Netlify Drop, a static nginx pod, or any static host. There's no backend to deploy.

## Source

Based on **The Master Pancake Flight Manual** (24-page PDF, malted-diner profile, optimized for a beginner cook making custom "flavor flights" with buttermilk powder + 2% Lactaid milk). The companion `Ultimate_Malted_Pancakes_Manual.html` is the manual updated to match every refinement that landed in the picker — same recipe, same conventions, browser-readable and Word-importable.

## Versioning

`X.Y.Z` — `Z` bumps **only** for bug fixes or items previously shipped buggy/incomplete; `Y` bumps for layout changes, UX restructures, new features, or anything user-visibly different; `X` is major. Current: **v2.7.0** (unconditional layouts: side-by-side `.picker-region { display: contents }` restores v2.5.0 grid behavior so the pancake-size picker is visible again; stacked is always a 2-col sticky grid with Batch | Flavors | PSB matching the image-2 look user asked for; compact-mode mechanism with IntersectionObserver/sentinel/embedded-psb removed entirely). **v2.6.0** had introduced compact-mode pancake-size relocation but broke side-by-side. **v2.5.0** bumped stacked .wrap to 1600px and centered h1/.sub. **v2.4.0** was the eight-item polish pass. **v2.3.0** was the 12-item refinement. **v2.2.0** was the 10-item layout overhaul. **v2.1.1** added URL state encoding, sticky chrome, picker card reorder, setup restructure, tier-side-by-side fix, topping wrapping fix, menu-order rendering. v2.1.0 introduced Flight mode; v2.0.0 added the recipe card-size switcher. The v2 roadmap is in `v2_HANDOFF.md`; the next phase (mixed batch sizes per flavor + master shopping list) will be **v2.8.0**.

## License

Personal project. Recipe content belongs to the original manual author; the picker code is yours to do whatever with.
