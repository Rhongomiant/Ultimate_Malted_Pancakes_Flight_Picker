# 🥞 Pancake Flight Picker

A single-file, zero-dependency web app that turns the 24-page **Master Pancake Flight Manual** (malted-diner pancake recipe) into a point-and-click recipe picker. No build step, no install — just open `index.html` in a browser.

## What it does

The original manual is a binder of cross-referenced tables: 4 batch sizes × 12 flavor combinations × 5 pancake sizes, plus separate charts for ingredients, toppings, syrup pairings, and cooking rules. The picker collapses that into 4–5 clicks and shows exactly what you need for the combination you chose.

**You pick:**
1. Batch size (Quarter / Half / Three-Quarter / Full)
2. Flavor combination (12 options, from Plain to Toffee + Caramel + Chocolate)
3. Pancake size / ladle (0.5 oz mini → 4.0 oz plate-sized)
4. **Caramel preparation** — only shown for caramel-containing flavors (Flash-frozen 10-min → normal heat; Deep-frozen → lower heat)
5. Starting from scratch ingredients OR bulk pantry mix

**It outputs:**
- Exact dry ingredients (or "scoop X cups of bulk mix")
- Wet bowl + correct fat for that flavor
- Spices with batch-scaled measurements
- Pan grease type
- Topping amounts for the chosen pancake size + Max Combined Volume Limit
- Flavor-aware cooking callouts: 🛡 Batter Shield, 🛡🛡 Double Shield, 🌡 Heat warnings, 🧈 Unsalted-butter reminder, 🥓 Bacon timing, 🍌 Banana thickness, 🌰 Pine nut toasting, 🧊 Caramel prep
- Quality Tier chart (🥇 Best / 🥈 Good / 🥉 OK / ❌ Avoid) — syrup grade + ingredient pairings
- 6-step cooking checklist tailored to the selection
- Print button (hides pickers, prints only the recipe)

**Reference docs** (collapsible at bottom): Bulk Pantry Mix recipe + jar canning rules, vocabulary cheat sheet, mixing/resting rules, liquid troubleshooting, flipping technique, cooking order + between-batch cleanup, storage & leftovers, advanced tips (water bath fats, nutmeg tools, pine nut toasting, etc.), syrup grade reference, component sourcing guide, ladle reference.

## Running it locally

```bash
# Either double-click index.html, or:
open index.html       # macOS
xdg-open index.html   # Linux
start index.html      # Windows
```

That's it. No server, no install, no internet. Works on Mac, Windows, Linux, iOS Safari, Android Chrome. The whole app is one HTML file (~940 lines) with inline CSS and vanilla JS.

## Project layout

```
pancake-flight-app/
├── index.html    # the whole app (HTML + CSS + JS in one file)
└── README.md     # this file
```

## How the code is organized

All in `index.html`. Roughly:

| Lines (approx) | What lives there |
|----------------|------------------|
| 1–200          | `<style>` block — pickers, output cards, tier badges, reference accordion |
| ~200–390       | HTML structure — pickers, output card, all `<details>` reference sections |
| ~400–445       | `BATCHES`, `SIZES`, `DRY`, `WET`, `BULK_SCOOP`, `FAT`, `SPICE` lookup tables |
| ~445–690       | `FLAVORS` array — 12 flavor objects with spices/fat/syrup/tiers/flags |
| ~690–760       | `TOPPINGS` per-flavor-per-size matrix |
| ~760–end       | `render()` + `renderOutput()` + event listeners |

### Data model

Each entry in `FLAVORS[]` looks like this:

```js
{
  id: 'caramel',
  label: 'Caramel Only',
  strategy: 'BATTER SHIELD required. Add flake salt on top after flipping.',
  spices: [
    { name: 'Sea Salt Flakes', amounts: SPICE.seaSalt },   // 4-element array, one per batch size
  ],
  pickOneSpices: { ... }   // optional: a "choose ONE" group (used by Banana Nut Only)
  fat: 'Melted Ghee',
  panGrease: 'Pure Avocado Oil',
  syrup: 'Grade A Very Dark Strong',
  shield: true,            // shows the Batter Shield warning
  doubleShield: true,      // shows the Double Shield warning (Triple only)
  hasCaramel: true,        // triggers the Caramel Prep picker + heat logic
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
  cinnamon: ['Pinch (1/16 tsp)', 'Dash (⅛ tsp)', 'Scant ¼ tsp (3/16 tsp)', '¼ tsp'],
  nutmeg:   ['Drop (1/64 tsp)',  'Smidgen (1/32 tsp)', 'Scant Pinch (3/64 tsp)', 'Pinch (1/16 tsp)'],
  // ...
};
```

### Heat / Caramel Preparation logic

This is the one piece of business logic that goes beyond the PDF:

- The PDF hardcodes lower temperatures for `Toffee + Caramel` (325°F) and `Triple` (300–325°F) but doesn't lower the temp for `Caramel Only` or `Caramel + Chocolate`.
- The picker overrides this with a rule: **heat depends on caramel preparation, not on flavor**. Any caramel-containing flavor + `caramelPrep === 'deep'` → lower temp. `caramelPrep === 'flash'` → normal 375°F.
- The picker for caramel preparation only appears when `flavor.hasCaramel` is true.
- Triple keeps a slightly lower "deep" temp (300–325°F vs 325°F for the others), preserving the PDF's intent for the most complex combination.

If you want to revert to the PDF's behavior, change the `useLowHeat` computation in `renderOutput()`.

## Extending the project

### Add a new flavor

1. Add a new object to `FLAVORS[]` with the structure shown above.
2. Add an entry to `TOPPINGS[<flavor-id>]` — an array of 5 entries (one per pancake size), each an array of topping lines.
3. If it uses caramel, set `hasCaramel: true` to enable the prep picker + heat logic.
4. Done — it shows up in the flavor picker automatically.

### Add a new batch size

You'd need to extend all the 4-element arrays in `DRY`, `WET`, `SPICE`, `FAT`, `BULK_SCOOP` to 5 elements and add an entry to `BATCHES[]`. That's a lot of measurement math — the PDF only provides 4 sizes.

### Add a new pancake size / ladle

Add an entry to `SIZES[]` with a `maxCombined` value. Add a 6th row to every entry in `TOPPINGS[]`. (Note: the PDF's `TOPPINGS` for combo candy flavors are extrapolations, since the PDF only specifies one explicit combo formula at 1.0 oz Triple. Existing extrapolations live in the file with a comment.)

### Change the styling

All CSS lives in the `<style>` block at the top. Look for the `:root` custom properties:

```css
--accent: #b45309;    /* main orange */
--accent-soft: #fde9c8;
--good: #166534;
--warn: #b91c1c;
```

## What's NOT in this picker

The picker captures everything from the PDF, but a few things live only in the **reference sections** at the bottom (the collapsible `<details>` accordions) rather than reacting to picker selections:
- Mason jar canning/storage rules
- Vocabulary cheat sheet (Drop / Smidgen / Pinch / Dash / Scant)
- Storage & leftover rules
- Advanced ingredient nuances (vanilla paste vs extract, Microplane nutmeg technique, etc.)
- Component sourcing recommendations (King Arthur, Saco, Nielsen-Massey, etc.)

These are static reference docs, not picker outputs.

## Honest caveats

- **Combo candy toppings are extrapolations.** The PDF only gives one explicit combo formula (Triple at 1.0 oz = 2 chips + 2 caramel bits + 1 pinch toffee). For other candy combo sizes, the picker shows per-ingredient max amounts with "stay under Max Combined" rather than fabricating exact totals. This is more honest but less prescriptive.
- **Caramel Prep heat logic** is a user-driven refinement of the PDF, not literal PDF content (see "Heat / Caramel Preparation logic" above).
- **No automated tests.** Verification is manual against the PDF.

## Sharing it

The whole app is one self-contained HTML file. Send `index.html` via email/iMessage/Slack/AirDrop — the recipient double-clicks it and it works. No install steps.

If you want to host it on a URL: drop it in Nextcloud public share, Netlify Drop, a static nginx pod, or any static host. There's no backend to deploy.

## Source

Based on **The Master Pancake Flight Manual** (24-page PDF, malted-diner profile, optimized for a beginner cook making custom "flavor flights" with buttermilk powder + 2% Lactaid milk).

## License

Personal project. Recipe content belongs to the PDF authors; the picker code is yours to do whatever with.
