# Pawvy Website — Bundle Card Polish (Image Size, Padding, Price Match, Brand Labels)

Target branch: **staging**
Repo: `pawvy-website`

## 1. Image sized down

Was scaling to a full square matching the card's own width (which,
since a bundle card spans 2 grid columns, made it roughly 2x the size
of a regular product card's image). Capped to `max-height: 260px` now
— closer to a single product card's image size, still `object-fit:
contain` so nothing gets cropped, just doesn't blow up as large.

## 2. More breathing room from the border

Text was using the same padding value as a regular single-width
product card, which read as too tight once spread across a card twice
as wide. Added extra horizontal padding specifically for the bundle
card (title, description, includes list, price, note, and the tag row
at the top all now sit further from the edge).

## 3. Price styling — found and fixed the actual bug

**This wasn't just a style mismatch, it was a real CSS bug.** The
existing price styling is written as `.product-card .price` — a rule
that only applies to a `.price` element *inside* something with the
class `.product-card`. The bundle card's outer element is `.bundle-card`,
not `.product-card`, so that rule never matched at all — the bundle's
price was rendering with zero special styling, not just "different"
styling. Added a proper `.bundle-card .price` rule with the exact same
values (weight 900, 19px, Fraunces, navy), so it now genuinely matches
instead of just resembling.

## 4. Includes list now shows the brand per item

Was just the product name — "Plaque Guard 60g". Now prefixed with the
brand, e.g. "Lillidale Plaque Guard 60g", "BetterBone Soft Classic
Large ×2" — exactly the format you asked for.

## Verification performed

- Full production build (`npm run build`) — clean, no errors.
- Confirmed both `.bundle-card .price` and `.product-card .price` now
  exist as independent rules with identical values, proving the
  scoping bug is actually fixed rather than just papered over.
- Real test of the brand-prefixed includes format against realistic
  product data — confirmed it produces exactly "Lillidale Plaque Guard
  60g" / "BetterBone Soft Classic Large ×2" style output.
- Confirmed both changed files against the real current
  `origin/staging` (fetched fresh) — same 2 files as the last few
  bundle rounds, nothing else touched.
- Both byte-diffed against what was actually build-tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   app/globals.css
#   components/ShopClient.jsx

git add .
git commit -m "Bundle card polish: smaller image, more padding from border, fix price styling scope bug, show brand per item in includes list"
git push origin staging
```

Worth a look at the same Dental Care Kit bundle again — the price
should now visually match "S$38.00" on a regular card exactly (same
size, weight, and font), the image should be noticeably smaller, and
each includes line should show its brand.
