# 🥞 Pancake Flight Picker

A single-file, zero-dependency web app that turns the **Master Pancake Flight Manual** (a malted-diner pancake recipe) into a point-and-click recipe picker. No build step, no install — just open the HTML file in a browser.

Two files in this project:

- `Ultimate_Malted_Pancakes_Flight_Picker_v1.15.0.html` — the picker app
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

Both switchers persist in `localStorage`.

**Reference docs** (collapsible at bottom): Bulk Pantry Mix recipe + jar storage, vocabulary cheat sheet (Hint / Drop / Smidgen / Pinch / Dash / Tad + Scant / Fat modifiers + Shield Rule), mixing & resting rules, Shield Rule with precise volumes per pancake size, ladle prep (45–60 sec ice-bath rule), advanced tips (warm-water fat bath, Microplane nutmeg, pine-nut toasting, Candy Crushing Protocol, Shield Application Mechanism), cooking order + between-batch cleanup, liquid troubleshooting, flipping technique, syrup grade reference, component sourcing guide.

## Running it locally

```bash
# Either double-click the HTML file, or:
open  Ultimate_Malted_Pancakes_Flight_Picker_v1.15.0.html   # macOS
xdg-open Ultimate_Malted_Pancakes_Flight_Picker_v1.15.0.html # Linux
start Ultimate_Malted_Pancakes_Flight_Picker_v1.15.0.html   # Windows
```

That's it. No server, no install, no internet. Works on Mac, Windows, Linux, iOS Safari, Android Chrome. The entire app is one HTML file (~1400 lines) with inline CSS and vanilla JS.

The companion `.html` manual opens the same way in a browser. To import into Word: File → Open → select the manual HTML; Word preserves the tables, headers, and bullet hierarchy.

## Project layout

```
pancake-flight-app/
├── Ultimate_Malted_Pancakes_Flight_Picker_v1.15.0.html  # the app
├── Ultimate_Malted_Pancakes_Manual.html                 # source-of-truth reference doc
└── README.md                                            # this file
```

## How the code is organized

All in the picker HTML file. Approximate landmarks (line numbers from v1.15.0):

| Lines       | What lives there |
|-------------|------------------|
| 1–230       | `<style>` block — design tokens (CSS custom properties + dark theme overrides), pickers, output cards, tier badges, reference accordion, layout/theme switchers, print rules |
| 230–530     | HTML structure — controls row (layout + theme switchers), three picker cards, output card, all `<details>` reference sections, component-sourcing table |
| 530–670     | Reference content (vocabulary cheat sheet, Shield Rule + Precise Shield Volumes, ladle prep, advanced tips, etc.) — all inside `<details>` accordions |
| 670–725     | `<script>` opens · Theme switcher IIFE · Layout switcher IIFE (both persist to `localStorage`) |
| 725–790     | Lookup tables: `BATCHES`, `BULK_OPTS`, `SIZES`, `SHIELD_VOLUMES`, `DRY`, `WET`, `BULK_SCOOP`, `FAT`, `SPICE` |
| 790–960     | `FLAVORS` array — 12 flavor objects with spices/fat/syrup/tiers/flags |
| 960–1040    | `TOPPINGS` per-flavor-per-size matrix |
| 1040–1110   | `state`, `render()`, picker UI building |
| 1110–1380   | `getEffectivePrep()`, `renderOutput()` — the big function that assembles the recipe HTML from state |
| 1380–end    | Event listeners on the picker buttons |

### Data model

Each entry in `FLAVORS[]` looks like this:

```js
{
  id: 'caramel',
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
2. Add an entry to `TOPPINGS[<flavor-id>]` — an array of 5 entries (one per pancake size), each an array of topping lines.
3. If it uses caramel, set `hasCaramel: true`. If it uses toffee, set `hasToffee: true`. Either flag enables the corresponding prep picker + heat logic.
4. Done — it shows up in the flavor picker automatically.

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

`X.Y.Z` — `Z` = bug fix, `Y` = change, `X` = major. Current: **v1.15.0** (dark mode + theme switcher).

## License

Personal project. Recipe content belongs to the original manual author; the picker code is yours to do whatever with.
