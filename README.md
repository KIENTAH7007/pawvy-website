# Pawvy Website — Wild Balance Grouping Logic, Verified Against Real Data

Target branch: **staging**
Repo: `pawvy-website`

**This replaces just one file** in the "Wild Balance Dedicated Brand
Page" zip you haven't applied yet — everything else in that zip is
unchanged, confirmed byte-identical against what's already there. Only
`lib/wildBalanceGrouping.js` is different. Apply this after that zip
(or just swap this one file in before you patch either).

## What changed, and why

Your Products & Pricing screenshot showed something genuinely useful:
the real `item_series` values consistently include the category name —
`"WCAT280 Wild Balance Casseroles"`, `"WFCH200 Wild Balance Freshly
Cooked"`, `"WICY110 Wild Balance Ice Cream"`, `"WSBT100 Wild Balance
Natural Snacks"`. That's a more reliable signal than the original
version's description-text matching, which was only ever a safe
fallback for when nobody had confirmed real field values yet. Rewrote
the grouping to match on this confirmed real pattern first, keeping
description matching as a secondary check rather than dropping it
entirely.

## Verification performed — against your actual real data, not mock data

- **Typed in the exact 18 item_series/variation strings from your
  screenshot**, with description and need_tags left blank on purpose,
  to prove the new logic doesn't depend on either. All 18 real SKUs
  sorted correctly into their 4 sections. Correctly noticed Freshly
  Cooked Beef 400g doesn't exist in your real data yet (7 Freshly
  Cooked SKUs, not 8) — matches your real "18 active SKUs" counter
  exactly, no bug there.
- **Then went further and got a full, clean, real end-to-end test
  working** — ran the actual backend and actual Next.js frontend
  together against this exact real data, and fetched the real rendered
  page (took a few tries; hit some sandbox environment flakiness along
  the way, not code issues, and pushed through rather than settling for
  a partial result):
  - All 4 sections render correctly
  - Every real casserole flavour name appears exactly as in your
    screenshot
  - All 6 real chew names appear
  - **Every single real RRP price from your screenshot matches
    exactly** — S$7.50 casseroles, S$5.50/S$9.50 Freshly Cooked,
    S$9.00 yoghurt, and each chew's distinct price (S$14/S$23/S$15/
    S$10/S$20/S$13)
  - Both calculators' real form fields are present and correctly wired
  - "Beef 400g" correctly does not appear anywhere (matches reality —
    that SKU doesn't exist), while "Beef 200g" and both Chicken sizes
    render correctly
  - Zero runtime errors anywhere in the rendered page
- Full production build (`npm run build`) — clean, no errors.
- Confirmed every other file in the original delivery is untouched —
  byte-identical to what you already have, only this one file changed.

## How to apply

If you haven't applied the earlier "Wild Balance Dedicated Brand Page"
zip yet, just swap this file in before patching:

```bash
# after extracting the earlier zip's files, overwrite:
cp wildBalanceGrouping.js  <your-pawvy-website-repo>/lib/wildBalanceGrouping.js
```

Then follow the same git commands as before (staging, add, commit,
push) — no change to that process.
