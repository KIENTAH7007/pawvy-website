# Pawvy Website — patch: fix Add to Cart, extend to BetterBone, remove bottom shop section

## ⚠️ One manual step — delete an old file
This patch **replaces** `components/FitCardActions.jsx` with `components/ProductAddButton.jsx`.
Unzipping and "Copy and Replace" only adds/overwrites files — it won't delete
the old one. Please manually delete `components/FitCardActions.jsx` after
unzipping, or it'll sit there unused (harmless, but worth tidying up since
nothing imports it anymore).

## What changed

### 1. Fixed the "Unavailable" bug
Root cause: the previous version searched for a combined string like
`"Puzzle Feeder — Green"`, but that exact string never exists in the
database — `item_series` and `variation` are separate columns, and the dash
is only inserted for display (in `ProductCard.jsx`). So the search could
never match anything.

Fixed by matching `item_series` and `variation` as two separate fields, using
the product list the page already fetches server-side (`ProductAddButton.jsx`)
— no live fetch needed anymore, which also removes a source of flakiness.
Also now respects `stock_status`: an out-of-stock option is disabled and
labeled "(out of stock)" instead of being addable.

### 2. Confirmed: inventory/sales-ledger automation already exists
No new backend work needed — checked `server/routes/checkout.js` directly.
The Stripe webhook already:
- Inserts a real row into the `sales` ledger
- Deducts `inventory_levels` (the same table POS/wholesale/consignment sales
  also deduct from — one shared source of truth)
- Handles BUTTONS earn/redeem
- Does all of this atomically, exactly once per order (idempotent against
  Stripe's duplicate webhook retries)

**One honest caveat, from the code's own comments:** stock isn't reserved
while a customer is mid-checkout, so two people buying the last unit at the
exact same moment could theoretically both succeed. That's a known,
deliberate tradeoff already documented in the code (locking/holding stock
during checkout is a meaningfully harder problem), not something introduced
today.

### 3. BetterBone now has Add to Cart too
Instead of hardcoding guessed sizes/flavors, each Soft/Medium/Hard card
dynamically discovers whatever real BetterBone products actually exist with
that hardness in their variation text, and lists them as options with their
own real photos and prices. Stays correct automatically if the catalog
changes — no guessing involved.

### 4. Removed the "Shop this brand" section from the bottom of brand pages
Now that every card has its own Add to Cart, the separate shop grid at the
bottom was redundant. Page now ends: deep-dive sections → FAQ → CTA → Footer.

**Found and fixed a real problem while doing this:** removing that section
would have left three navy sections stacked back-to-back with no visual
break (FAQ → "Have a question?" CTA → Footer, all `var(--navy)`). Added a
light (ivory) variant for the CTA band, scoped to brand pages only via a
modifier class — the Stockist page uses the same CTA style and keeps its
existing navy treatment untouched.

### Files touched
- `components/ProductAddButton.jsx` — **new**, replaces `FitCardActions.jsx`
- `components/BrandDeepDive.jsx` — durability cards + fit cards both use
  the new button; accepts `products` prop
- `components/ShopClient.jsx` — removed the now-dead scroll-highlight code
- `components/ProductCard.jsx` — removed the now-unused `data-product-title`
- `lib/brandContent.js` — fixed matching fields (separate series/variation
  checks instead of one combined string), added dynamic matching for
  BetterBone
- `app/brands/[slug]/page.js` — removed shop section, added
  `cta-band-light` class
- `app/globals.css` — modal/button styles, `.cta-band-light`, removed dead
  `.product-card-highlight` and `.brand-shop-section`

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes
generated successfully. Manually swept every changed file for
unimported-reference bugs (the class of bug that broke an earlier deploy) —
nothing found.

**Worth testing live once pushed:** the Add to Cart buttons, modal variant
picker, and BetterBone's dynamic option discovery all depend on your real
product data — worth clicking through a few cards on both BetterBone and
Puzzle Feeder pages to confirm everything resolves correctly.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
rm components/FitCardActions.jsx   # see note at the top of this README
git add -A
git commit -m "Fix Add to Cart matching bug, extend to BetterBone, remove bottom shop section"
git push origin main
```
Railway auto-deploys from `main` on push.
