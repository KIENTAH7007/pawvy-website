# Pawvy Website — Eastsea Brother brand page (full deep-dive)

## What's in this patch

Full deep-dive for the Eastsea Brother brand page, built and confirmed through
preview iteration:

1. **Intro** — "Eastsea Brother" hero, real photo (hand releasing fish back
   into the water)
2. **Freeze-dried feature split** — real product jars photo, copy focused
   entirely on freeze-dried (all half-dried mentions removed per your call)
3. **"Which Fish For Your Furkid?"** — 3 category blocks (White/Red/Whole
   Fish), each a single atomic unit (fish icons + name + colored line +
   benefit text all grouped together) so it can't visually break apart on
   narrow screens — this fixes the real bug you caught in the first version,
   where the fish row and the category brackets were two separate elements
   that only lined up by coincidence at desktop width
4. **"Shop by Fish"** — 6 product cards (Pollack, Salmon, Flatfish, Capelin,
   Sandlance, Green Lipped Mussels), each with a real Add to Cart button,
   reusing the exact same system already live on BetterBone and Puzzle
   Feeder — no new code needed for this part, just new data

### Pollack, Salmon, Flatfish each open a size picker
Same modal system as BetterBone. One thing worth double-checking once this
is live: **Salmon's larger size shows "120g" to the customer**, but the
underlying lookup searches for "115" — you confirmed the database still says
`EFDF-S115` even though the real product is now 120g, and you didn't want
that touched. So the customer-facing label and the actual database search
are deliberately different values here. If the database ever does get
renamed to 120g, this one line (`variationIncludes: '115'` in
`lib/brandContent.js`) would need updating to match.

### Files touched
- `lib/brandContent.js` — full `deepDive` block for `'East Sea Brother'`
- `components/BrandDeepDive.jsx` — added a new `fishGroups` section renderer
  (the "Which Fish" category blocks); `fitCards` (the shop cards) needed no
  code changes at all, just data
- `app/globals.css` — `.fish-groups*` styles
- `public/brand-features/eastseabrother/*` — all real photos: intro hero,
  product jars, 5 fish cartoon icons, and 10 product SKU photos

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes
generated successfully. Manually swept the new code for the
unimported-reference class of bug that's bitten a couple of earlier
deploys — nothing found this time, but as always with anything that
depends on real catalog data, worth a proper click-through once it's live:
check all 3 size-picker cards resolve correctly, and confirm the "Which
Fish" section holds together at mobile widths.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Add Eastsea Brother brand page deep-dive (intro, freeze-dried feature, Which Fish, shop by fish)"
git push origin main
```
Railway auto-deploys from `main` on push.
