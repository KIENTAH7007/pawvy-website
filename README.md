# Pawvy Website — patch: Which Fish design fixes + case-insensitive matching

## What changed

1. **Removed "White Fish" / "Red Fish" / "Whole Fish" labels** from the
   Which Fish section per your markup — the colored line now sits directly
   under the fish icons, right above the benefit text.

2. **Fish icons and names enlarged 25%** (icon height 80px→100px, name text
   12.5px→15.6px) per your circled markup.

3. **Matching made case-insensitive** — defensive fix, regardless of what
   turns out to be causing the "Out of stock" issue on Eastsea Brother. If
   the database ever has different capitalization than expected (e.g.
   "pollack" vs "Pollack"), this would previously fail silently; now it
   won't.

## On the "Out of Stock" issue
Not fixed in this patch, because the evidence points to it being a real
data issue, not a code bug — every option across all 6 completely
different fish types is being *found* successfully (if matching were
broken, you'd see "Unavailable," not "Out of stock"), just flagged as zero
stock. That's consistent with Eastsea Brother being newly onboarded and
stock quantities not yet entered into Pawvy App's Inventory module, not a
matching failure. Worth confirming directly in Inventory before assuming
either way — if real stock shows there, it's on me to dig further.

## Files touched
- `components/ProductAddButton.jsx` — case-insensitive matching
- `components/BrandDeepDive.jsx` — removed category label
- `app/globals.css` — 25% larger fish icons/names

`npm run build` passes clean.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Which Fish design fixes, case-insensitive product matching"
git push origin main
```
Railway auto-deploys from `main` on push.
