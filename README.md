# Product naming cleanup (#5) + favicon

## This delivery is for the Website folder (`pawvy-website`) only

6 files changed/added, listed below.

## Favicon

Added your black logomark (`4785_U_Pawvy_Brandguid_PD_PM_06.png`) as
`app/icon.png` — Next.js's file-based convention auto-generates the
favicon route from it, confirmed in the actual build output
(`.next/server/app/icon.png` + the static asset). Used the black version
since it stays visible against the light tab-bar background virtually
every browser uses, light or dark page theme. Didn't touch the white
version — let me know if you specifically want a dark-mode-only variant
added later, that's a separate small addition.

## Naming cleanup (#5)

**Nothing in Pawvy App changed.** `item_series` stays exactly as stored
everywhere — POS, Portal, Sales Ledger, Invoices, and critically GiGwi's
CategoryBrowser (which matches all 100+ of its cards by searching for
the bare SKU number inside `item_series` — renaming the stored field
would have broken that matching outright).

New file `lib/productDisplayName.js` does the cleanup at display time
only: strips the leading SKU code and the redundant brand name (handling
the real "GiGiw" typo found in the data) from `item_series`, leaving the
actual product-line words + variation. Falls back to `variation` alone
for brands like East Sea Brother, where `item_series` is a pure internal
code with no readable words at all.

**Wired into every customer-facing spot that showed the raw string** —
found by grepping the whole codebase for `item_series`, not just the two
places from the original ask:
- Shop grid card title + image alt (`ProductCard.jsx`)
- Product detail page `<h1>`, image alt, and meta description
  (`app/shop/[id]/page.js`)
- Cart item name + image alt (`app/cart/page.js`)
- Order confirmation line items (`app/checkout/success/page.js`)

**`<title>` tags keep the brand name** (via the new `productTitleTag()`
helper) since search results and link previews don't show the separate
brand-tag chip the on-page card does — e.g. `"GiGwi Plush Friendz —
Dinosaur Backpack | Pawvy"`. Everywhere else uses the brand-free clean
name since the brand's already shown as its own tag right above it.

### Two rough edges in the source data (not a bug in this fix)

SKUs `7519` ("GiGwi with Silvervine Ring") and `7527` ("GiGwi with
Leatherette") are missing a product-line name in `item_series` itself —
they render as "with Silvervine Ring — Raccoon" (starts with a lowercase
"with"). Nothing to strip because the words just aren't there. Worth a
quick check in Pawvy App to see if that's a data-entry gap — if you add
the missing line name there (e.g. "GiGwi **Rookie Hunter** with
Silvervine Ring"), this display logic picks it up automatically, no code
change needed.

## Verification performed

- Ran the actual naming rule against **all 217 real SKUs across all 6
  brands** (not a hand-picked sample) before ever wiring it into a page —
  215 clean, the 2 above flagged automatically by the check script.
- After building the real module, re-ran a validation pass against the
  already-confirmed samples to make sure nothing drifted moving from a
  test script into the real file — matched exactly.
- Real cold-clone build: fresh `git clone` → applied all 6 files (plus
  every prior SEO delivery, tested together as they'll actually ship) →
  `npm install` → `npm run build` — passed with no errors.
- Confirmed in the actual build output that Next.js generated the
  favicon route from `app/icon.png`.
- Byte-for-byte diff confirms every file in this zip matches what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "Website: clean product display names (SEO) + favicon"
git push origin main
```

Railway auto-deploys from `main` — no other steps needed. Safe to apply
independently of, or together with, the earlier SEO delivery (canonical
tags + brand slugs) — no overlap between the two.
