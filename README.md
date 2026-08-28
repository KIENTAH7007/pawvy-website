# Pawvy Website — Bundle Card Restructured to Match ProductCard

Target branch: **staging**
Repo: `pawvy-website`

## What changed

The bundle card's layout is now a vertical stack, mirroring
`ProductCard.jsx`'s own structure exactly, instead of the previous
side-by-side (image left, info right) layout:

1. Tag row (Bundle badge, + an "unavailable" tag if applicable)
2. Full-width square image
3. Bundle name (kept prominent — see note below)
4. Description (if filled in) + the bulleted includes list
5. Price
6. Add bundle to cart

## The actual fix for the cropping issue

The hero image now uses `object-fit: contain` inside a full-width
square box — the exact same treatment `ProductCard.jsx` already uses
for every regular product photo, which is why those never look
cropped. The old side-by-side layout squeezed the image into a narrow
42%-width column with `object-fit: cover`, which is what was cutting
photos off. That's gone now — the image always shows in full,
letterboxed if its proportions don't match the square box rather than
cropped to fill it.

## One judgment call worth flagging

Your mapping put the bundle name where "BETTERBONE" sits on a regular
product card — I read that as describing **position/order**, not
literally asking to shrink the name down to small-pill size, since
that would undo the "make the title bigger and bolder" fix from a
couple of rounds ago. So the name is now positioned like a product
card's title (above the price, below the image) but kept at the same
large, bold size as before. Let me know if you actually wanted it
shrunk to match the tiny brand-tag styling instead — easy to adjust
either way.

## Verification performed

- Full production build (`npm run build`) — clean, no errors.
- Grepped the whole codebase for any leftover reference to the classes
  this removed (`.bundle-card-hero`, `.bundle-card-price-row`,
  `.bundle-card-info`) — none found, nothing orphaned.
- Confirmed the exact CSS line responsible for fixing the cropping
  (`object-fit: contain` inside the square `.thumb` box) is present and
  matches `ProductCard`'s own image treatment.
- Confirmed both changed files against the real current
  `origin/staging` (fetched fresh) — exactly the 2 expected.
- Both byte-diffed against what was actually build-tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   app/globals.css
#   components/ShopClient.jsx

git add .
git commit -m "Restructure bundle card to match ProductCard's vertical layout, fixing hero image cropping"
git push origin staging
```

Worth a fresh look on S-Web at the same Dental Care Kit bundle from
your screenshot — the image should now show in full, and the whole
card should read much closer to a regular product card.
