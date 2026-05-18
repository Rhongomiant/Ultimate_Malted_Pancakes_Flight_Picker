# 🥞 Pancake Flight Picker

A single-file, zero-dependency web app that turns the **Master Pancake Flight Manual** (a malted-diner pancake recipe) into a point-and-click recipe picker. No build step, no install — just open the HTML file in a browser.

Two files in this project:

- `Ultimate_Malted_Pancakes_Flight_Picker_v2.1.1.html` — the picker app
- `Ultimate_Malted_Pancakes_Manual.html` — the companion reference manual (full prose, Word-import friendly)

## What it does

The manual is a binder of cross-referenced tables: 4 batch sizes × 12 flavor combinations × 5 pancake sizes, plus separate charts for ingredients, toppings, syrup pairings, and cooking rules. The picker collapses that into a few clicks and shows exactly what you need for the combination you chose.

**You pick:**

1. **Batch size** (Quarter / Half / Three-Quarter / Full) and **dry mix source** (Measure Each Ingredient vs. Use Bulk Dry Mix)
2. **Flavor combination** (12 options):
   Plain · Chocolate · Bacon · Banana Nut · Bacon + Banana Nut · Banana Nut + Chocolate · Caramel · Toffee · Caramel + Chocolate · Caramel + Toffee · Toffee + Chocolate · Toffee + Caramel + Chocolate
3. **Pancake size / ladle** (0.5 oz mini → 4.0 oz plate-sized)

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

All four new switchers (Wet/Spices/Toppings/Tier layout) and the controls-collapsed state persist in `localStorage`.

**Reference docs** (collapsible at bottom): Bulk Pantry Mix recipe + jar storage, vocabulary cheat sheet (Hint / Drop / Smidgen / Pinch / Dash / Tad + Scant / Fat modifiers + Shield Rule), mixing & resting rules, Shield Rule with precise volumes per pancake size, ladle prep (45–60 sec ice-bath rule), advanced tips (warm-water fat bath, Microplane nutmeg, pine-nut toasting, Candy Crushing Protocol, Shield Application Mechanism), cooking order + between-batch cleanup, liquid troubleshooting, flipping technique, syrup grade reference, component sourcing guide.

## Running it locally

```bash
# Either double-click the HTML file, or:
open  Ultimate_Malted_Pancakes_Flight_Picker_v2.1.1.html   # macOS
xdg-open Ultimate_Malted_Pancakes_Flight_Picker_v2.1.1.html # Linux
start Ultimate_Malted_Pancakes_Flight_Picker_v2.1.1.html   # Windows
```

That's it. No server, no install, no internet. Works on Mac, Windows, Linux, iOS Safari, Android Chrome. The entire app is one HTML file (~2560 lines as of v2.1.1) with inline CSS and vanilla JS.

The companion `.html` manual opens the same way in a browser. To import into Word: File → Open → select the manual HTML; Word preserves the tables, headers, and bullet hierarchy.

## Project layout

```
pancake-flight-app/
├── Ultimate_Malted_Pancakes_Flight_Picker_v2.1.1.html   # the app
├── Ultimate_Malted_Pancakes_Manual.html                 # source-of-truth reference doc
└── README.md                                            # this file
```

## How the code is organized

All in the picker HTML file. Approximate landmarks (line numbers from v2.1.1):

| Lines       | What lives there |
|-------------|------------------|
| 1–245       | `<style>` block — design tokens (CSS custom properties + dark-theme overrides), pickers, output cards, tier badges, reference accordion, print rules |
| 246–294     | Layout switcher CSS · Theme switcher CSS (share visual language) |
| 295–325     | Card-scale switcher CSS *(v2.0.0)* |
| 326–490     | Flight-mode CSS *(v2.1.0)* — mode switcher, flavor-status row, empty state, phase headers, wet-flavor cards, toppings-by-flavor grid, grease lines, cook-group blocks, inline pill toggles, shared/per-flavor tier blocks |
| 491–538     | Base print rules + other utility CSS |
| 540–625     | v2.1.1 CSS additions — sticky+collapsible controls row, sticky `out-header`, `subcards-grid` with `data-subcard-layout`, `topping-list` wrapping class, `cook-shared` and `flavor-delta-card` styles, sticky Pancake Size in side-by-side picker pane |
| 626–705     | HTML — controls row (now has `id="controls-row"` + collapse toggle at far right), three picker cards in new order: Pancake Size (1), Batch & dry mix (2), Flavor combination (3) |
| 706–990     | Reference content (`<details>` accordions) — unchanged from v2.1.0 |
| 992–1048    | Theme switcher IIFE · Layout switcher IIFE |
| 1049–1118   | Card-scale switcher IIFE |
| 1119–1180   | Lookup tables (`BATCHES`, `SIZES`, `SHIELD_VOLUMES`, `DRY`, `WET`, etc.) |
| 1181–1350   | `FLAVORS` array (each entry has `cookGroup`) |
| 1351–1431   | `TOPPINGS` matrix — combo flavors and Triple cleaned to one-ingredient-per-line *(v2.1.1)* |
| 1432       | `CANDY_PREPS` |
| 1442–1480   | `state` object (now includes `wetLayout`, `spicesLayout`, `toppingsLayout`, `controlsCollapsed`) + localStorage restore |
| 1482–1535   | `parseUrlState()` and `updateUrlState()` — read/write `history.replaceState` *(v2.1.1)* |
| 1539–1830   | Shared helpers — `FLAVOR_INDEX` map, `getSortedSelectedFlavors`, `groupSelectedByCooking` (sorted by menu index), `getEffectivePrep`, `heatInfoForFlavor`, `effectiveHeatForGroup`, `distinctGreasesByGroup`, `totalYield`, `prepCalloutsFor`, `singlePrepNotes`, `dryBowlHtml`, `wetBowlHtml`, `spicesHtml`, `toppingsInnerHtml` (uses `topping-list`), `flavorCallouts`, `tierGridHtml`, `compareTiers` |
| 1834–1846   | `layoutSwitcherHtml`, `sideGridStyle` — new layout-switcher helpers *(v2.1.1)* |
| 1849–1935   | `flavorDeltaCardHtml`, `sharedCookingFlowHtml` — Cook-phase dedup helpers *(v2.1.1)* |
| 1937–2034   | `render()` — builds pickers, mode-aware behavior, calls `updateUrlState()` + `updateControlsHeight()` after each render |
| 2036–2150   | `renderSingleOutput()` — wraps title+yield in `.out-header` for sticky header |
| 2152–2408   | `renderFlightOutput()` — restructured: Dry, Wet, Spices, Toppings, Grease as discrete sections with per-section layout switchers; deduplicated Cook phase (Shared Cooking Instructions card + per-flavor delta sub-cards) |
| 2410–end    | Event listeners (mode/batch/bulk/flavor/size/candy + delegated wet/spices/toppings/tier-layout toggles + controls-collapse toggle; `updateControlsHeight()` on resize/toggle; `parseUrlState()` before initial render) |

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

`X.Y.Z` — `Z` = bug fix, `Y` = feature change, `X` = major. Current: **v2.1.1** (Phase B refinements: URL state encoding, sticky+collapsible top chrome, picker card reorder, restructured Setup phase with per-section layout switchers, deduplicated Cook phase, tier side-by-side fix, topping wrapping fix, menu-order rendering). v2.1.0 introduced Flight mode; v2.0.0 added the recipe card-size switcher. The v2 roadmap is in `v2_HANDOFF.md`; the next phase (mixed batch sizes per flavor + master shopping list) bumps to v2.2.0.

## License

Personal project. Recipe content belongs to the original manual author; the picker code is yours to do whatever with.
