# Pawvy Website — patch: 6 Puzzle Feeder product cards + scroll-to-highlight

## What changed

### 1. Puzzle Feeder — 6 product cards (was 3 consolidated cards)
Per Janice's direction, split into individual cards, 2 rows of 3:
- Row 1: Puzzle Feeder (Green/Pink), Puzzle Feeder Swirl (Purple), Puzzle Feeder Lite (Green/Orange)
- Row 2: Puzzle Lickpop (Green/Teal), Puzzle Tumbler (Orange-Green/Pink-Teal), Puzzle Mat (Green)

All real photos, swatch colors sampled directly from the product images. No CSS
grid changes needed — it already wraps 6 items into 2 rows automatically.

### 2. Card clicks now scroll-and-highlight instead of filter
You asked: clicking "Puzzle Mat" should jump to that product in the shop grid
below, not filter everything else out. Changed the mechanism:

- Each product card in the shop grid now carries `data-product-title` (its
  name)
- Clicking a durability/fit card now links with `?highlight=<name>` instead
  of `?q=<name>`
- On load, if a `highlight` param is present, the (still fully unfiltered)
  grid scrolls smoothly to the matching product and gives it a brief orange
  pulse (two quick pulses, ~2.2s) so it's obvious which one you clicked
- This replaces the old filter-based behavior everywhere it was used —
  BetterBone's Soft/Medium/Hard cards now do the same scroll-and-highlight
  instead of filtering, for consistency across both brand pages

### Files touched
- `lib/brandContent.js` — Puzzle Feeder `fitCards.items` expanded to 6 entries
- `components/BrandDeepDive.jsx` — card links use `?highlight=` now
- `components/ShopClient.jsx` — reads `highlight` param, scrolls + pulses
  instead of filtering
- `components/ProductCard.jsx` — added `data-product-title` attribute
- `app/globals.css` — `.product-card-highlight` pulse animation
- `public/brand-features/puzzlefeeder/fit-swirl.jpg`, `fit-tumbler.jpg`,
  `fit-mat.jpg` — new photos for the 3 new cards

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes generated
successfully. Also did a manual sweep of every changed file for the
unimported-reference class of bug that broke the last Puzzle Feeder deploy —
nothing found this time.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Split Puzzle Feeder into 6 product cards, switch card clicks to scroll-and-highlight"
git push origin main
```
Railway auto-deploys from `main` on push.
