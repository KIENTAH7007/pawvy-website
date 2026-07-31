# Pawvy Website — patch: Add to Cart buttons on Puzzle Feeder cards

## What changed

Per Janice's suggestion, replaced the "click card → scroll to shop" behavior on
Puzzle Feeder's 6 product cards with a direct **Add to Cart** button.

- **Single-SKU cards** (Puzzle Feeder Swirl, Puzzle Lickpop, Puzzle Mat) — button
  adds straight to cart, no modal
- **Multi-variant cards** (Puzzle Feeder, Puzzle Feeder Lite, Puzzle Tumbler) —
  button opens a modal: pick a color/option, the product photo updates to match,
  then confirm to add. Real price shown on the confirm button too.

### One data-accuracy note (flagged in chat, repeating here for the record)
- **Puzzle Lickpop** turned out to be one product (its green/teal look is one
  item's two-tone design, not two SKUs) — no picker needed, direct add
- **Puzzle Feeder Lite's "Orange" option** is catalogued under a different
  product name ("Puzzle Lick Bowl Lite") rather than being a color of the same
  item — doesn't affect the picker UX, just means the modal option is correctly
  labeled rather than implying a literal color-of-same-product relationship

### How it resolves real products
`brandContent.js` is static and doesn't know live product IDs (those come from
the database and can change), so each variant carries a `match` string — a
search term resolved against the live shop API at click time to get the real
product (id, price, photo). This means:
- Prices shown are always live, not hardcoded
- If a product goes out of stock or gets renamed, the button will show
  "Unavailable" rather than silently adding the wrong thing
- No risk of stale/wrong SKUs being added to cart from static data going out
  of sync with the catalog

### Files touched
- `lib/brandContent.js` — `fitCards.items[].colors` replaced with
  `variants[]`, each with `label`, `hex`, `match` (search term), `image`
- `components/BrandDeepDive.jsx` — fit cards are now plain cards (not links)
  with `<FitCardActions>` rendering the button
- `components/FitCardActions.jsx` — **new file**, button + modal + cart logic
- `app/globals.css` — `.fit-add-btn`, `.fit-modal*` styles
- `public/brand-features/puzzlefeeder/fit-feeder-green.jpg`,
  `fit-feeder-pink.jpg`, `fit-lite-green.jpg`, `fit-lite-orange.jpg`,
  `fit-tumbler-orange.jpg`, `fit-tumbler-pink.jpg` — new per-variant photos
  for the modal

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes generated
successfully. Manually swept every changed file for unimported-reference bugs
(the class of bug that broke the last Puzzle Feeder deploy) — nothing found.

**Note:** BetterBone's Soft/Medium/Hard durability cards are untouched — this
change only applies to Puzzle Feeder's 6 fit cards, since that's what was
asked. Happy to bring Add to Cart to BetterBone too if you want the same
treatment there.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Add Add to Cart buttons + variant picker modal to Puzzle Feeder cards"
git push origin main
```
Railway auto-deploys from `main` on push.
