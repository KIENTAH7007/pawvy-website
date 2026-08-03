# GiGwi brand deep-dive — patch

## What this adds

The GiGwi brand page now has a full deep-dive section between the
existing hero and the existing FAQ:

1. **Intro** — brand story (Hong Kong, 2010, "Reinventing Playtime",
   spotlighting the GiGwi Signature Ball) + 3 value cards from the retail
   flyer you sent (Safety Certified, Multiple Materials in One Toy, Made
   to Be Loved).
2. **Toys that cover every need** — 4 category cards (Ball, Chew, Plush,
   Enrichment) explaining why each matters for a dog, using your 4 real
   product photos as icons.
3. **Shop by category** — the main piece. 5 tabs (Ball, Chew, Plush,
   Enrichment, Cat), each showing real products pulled live from the
   catalog by SKU prefix, generated directly from your
   `GIGWI_WEBSITE_WORKING_FILE.xlsx`. 82 cards total: 57 single-product
   cards (plain Add to Cart, same as every other product on the site) and
   25 SKUs grouped into 10 size-picker cards (same modal pattern as
   Lillidale/Salmoil, but every photo comes straight from the database —
   nothing curated, since there's no per-SKU photo for 100+ products).
   Featured items lead each category, reshuffled to a random order on
   every page load; everything else follows in your sheet's order.

No hero, FAQ, or CTA changes — those already exist on the shared
brand-page template.

## Files in this patch

- `components/BrandDeepDive.jsx` — added rendering for two new shapes:
  `categoryIntro` (the 4-card benefits grid) and `browser` (delegates to
  the new `CategoryBrowser.jsx`). Nothing else in this file changed —
  every other brand's sections are untouched.
- `components/CategoryBrowser.jsx` — **new file.** This is the real work:
  a client component that filters GiGwi's full product list by SKU
  prefix per category, builds single-product cards (reusing the exact
  same `ProductCard` component the main Shop page uses) and grouped
  size-picker cards (reusing `ProductAddButton`, GiGwi's variants just
  don't set a curated `image`, so it falls through to the real database
  photo automatically — no code change needed there). Also handles the
  featured-shuffle-on-load behavior.
- `lib/brandContent.js` — only the `GiGwi` entry changed. The `browser.tabs`
  data block was **generated directly from your Excel**, not hand-typed —
  see the note below on what that means for fixing things.
- `app/globals.css` — only the new `.cat-intro-*`/`.gigwi-browser`/
  `.gigwi-cat-tab` rules added at the end.
- `public/brand-features/gigwi/*` — the 4 category icons (backgrounds as
  you provided, none re-processed) and the intro photo.

Nothing is renamed, so plain unzip-and-replace covers it.

## Important — this brand's matching risk is bigger than usual

Every other brand matches on a distinctive product *name* fragment
("Sanitising", "Kidney Wellness"). GiGwi matches on a **bare 4-digit
number** — the SKU prefix — because that's what your Excel gave me, and a
name-based match across 100+ arbitrary toy names isn't realistic. A
4-digit number is more exposed to accidental collisions (e.g. if that
same number happens to appear elsewhere in a product's real
`item_series`/`variation` text) than a name would be.

I validated everything I could without your real backend:
- Re-checked the Excel itself for the two issues you already fixed
  (duplicate size, orphaned singleton) — both confirmed clean.
- Ran a direct match test against 97 fabricated products shaped like
  your real records, one per Excel row — **all 82 cards, all 25 grouped
  variants, zero missing matches, zero ambiguous (more-than-one-match)
  collisions.**

But fabricated data isn't your real catalog. **Please click-test all 5
category tabs after this deploys** — this is the single most important
thing to check before treating this page as done, more so than any other
brand so far.

## If something needs fixing after deploy

Since the `browser.tabs` data was generated from your spreadsheet, **the
fastest fix for almost anything wrong** (a card in the wrong category, a
missing product, a wrong size label) is usually: **update the Excel and
send it back to me** — I'll re-generate that block rather than hand-edit
individual entries, which keeps the generated data trustworthy instead of
drifting from the spreadsheet over time.

## Verified locally

- `npm run build` — clean.
- SSR smoke test of the Ball tab (the default active one) — all 12 cards
  present, zero "Unavailable", zero "No image".
- Direct logic-level test of the matching function against all 97
  fabricated products across all 5 categories (not just the visible
  tab) — 82/82 cards resolved, 0 missing, 0 ambiguous.

## What I could not verify locally (no access to your live backend/DB)

- Whether GiGwi's real `item_series` format actually contains the SKU
  prefix the way I've assumed (a plain substring match) — this is the
  main open risk, see above.
- Real stock levels / `stock_status` for any SKU.
- The featured-shuffle behavior on a real page load (logic is
  straightforward — Fisher-Yates on mount — but worth a glance).

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip this patch on top of your local `pawvy-website` folder ("Copy and
Replace" when prompted), then:

```bash
git add -A
git commit -m "Add GiGwi brand deep-dive: intro, category benefits, live shop-by-category browser"
git push origin main
```

Railway will auto-deploy from `main` on push. If it doesn't pick it up
automatically, use the manual Redeploy button on the Deployments tab
first.
