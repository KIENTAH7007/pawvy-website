# Pawvy Website — hotfix: real root cause of the Eastsea Brother "Out of Stock" bug

## The actual bug (confirmed via your screenshots)
For Eastsea Brother, `item_series` is just the SKU code ("EFDF-P125") — the
real fish name and size ("FD Pollack 125g") lives in the `variation` column
instead. Puzzle Feeder and BetterBone happen to store it the other way
(descriptive name in `item_series`), which is why the exact same matching
code worked there and silently failed here — it was only ever checking
`item_series`, so "Pollack" never matched "EFDF-P125" at all.

**Fixed:** matching now checks `item_series` and `variation` combined,
so it works regardless of which field a given brand's data entry puts the
descriptive name in — no more guessing per-brand conventions.

## A second bug found while fixing the first
Separately: when a product genuinely couldn't be found at all (0 matches),
the code was showing the exact same "Out of Stock" button as when a real
product *was* found but had zero inventory — same visible symptom, two very
different causes. Now genuinely-unmatched products show "Unavailable"
instead, so this distinction is visible again if anything like this comes
up on a future brand.

## Why this wasn't caught by `npm run build`
Same reason as the earlier `React.Fragment` bug — this only executes at
real request time with real catalog data, which a local build can't
exercise. This is genuinely why the "does it build" check alone was never
sufficient for anything touching live product matching, and why every
catalog-dependent feature in this project has needed a live check anyway.

## Files touched
- `components/ProductAddButton.jsx` — `findMatches()` checks both fields;
  `noOptionsAtAll` now correctly reflects whether anything actually matched

`npm run build` passes clean. This change is purely additive for
BetterBone/Puzzle Feeder (checking an extra field can only surface matches
that were already being found there — no regression risk).

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Fix product matching to check both item_series and variation fields"
git push origin main
```
Railway auto-deploys from `main` on push.
