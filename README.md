# Pawvy Website — Homepage Cards, Testimonial Sizing, Product Naming, Variant Switcher Fix

Target branch: **staging**
Repo: `pawvy-website`

**Apply the separate "Pawvy App" zip first** — this patch's variant
switcher fix depends on its new `?ids=` filter.

Addressing your 5 points from testing, in order:

## 1. Homepage Need cards — bigger, 2 rows of 4 on desktop, "Joint" rename

- Desktop (≥900px): forced exactly 4 columns / 2 rows, with bigger
  padding, icon size, and label text.
- Mobile: **completely untouched** — you confirmed that already looks
  right, so the original flexible layout stays exactly as it was below
  that breakpoint.
- "Joints" → "Joint" (`lib/needTags.js`) — label only, the slug is
  unchanged so nothing you've already tagged needs redoing.

## 2. Testimonial image sizing — fixed the cropping, sizes below

**What was wrong:** the image area had a fixed 170px height regardless
of photo shape, which is why things looked cropped/cut off — a portrait
photo squeezed into a short band loses a lot.

**The fix:** switched to `aspect-ratio: 3/4` per photo (matches the
homepage's existing "Customer reviews" carousel exactly — same
proportion, so photos read consistently site-wide), applied to each
image individually rather than the card as a whole.

**Recommended sizes** (also now shown directly in the Pawvy App upload
fields, so you don't need to remember this):
- **1 image only**: 900×1200px (3:4 portrait).
- **2 images (before/after)**: same 900×1200px for each — they sit side
  by side on the card, each keeping its own portrait shape rather than
  being squashed into a shorter slice.

## 3. Testimonial product naming — now uses the same cleanup as everywhere else

Was showing the raw internal text (e.g. "L0101 Lillidale Supplement").
Now runs through `productDisplayName()` — the exact same helper that
already cleans up names on the Shop grid and product pages (strips the
SKU code, strips redundant brand name, formats consistently). Same
"Lillidale — Supplement" style naming you're used to seeing elsewhere.

## 4. Variant switcher not showing — found the real bug, not just a miss

You were right to ask why — I didn't skip it, but the original approach
had a real gap. Full explanation and fix are in the pawvy-app zip's
README (the `?ids=` addition) — short version: GiGwi's colors are
different `item_series` values in the database (matched by SKU prefix,
not a shared series), so my original "find siblings by matching
item_series" approach silently returned nothing for exactly the product
you tested with.

**The fix**: every card that resolves multiple real variants
(`BrandDeepDive.jsx`'s durability and fit cards, `FitCard.jsx`'s
hover-preview cards, `CategoryBrowser.jsx`'s GiGwi cards) now passes the
*exact* set of product IDs it already resolved directly in the link
(`?siblings=12,45,88`), instead of asking the product page to re-guess.
This works correctly regardless of how any given brand's catalog happens
to be structured — no more relying on an assumption that doesn't hold
for every brand.

## 5. Need card icons — 3 alternative sets to choose from

See my message for the actual icon options — didn't want to guess and
ship a set you might not like, so nothing's changed in the code for
this one yet. Once you pick, it's a one-line change per icon.

## Verification performed

- Full production build (`npm run build`) after all 5 changes — clean,
  no errors.
- Confirmed the variant-switcher fix against real seed data (see the
  pawvy-app README) — not just "should work in theory."
- All 7 changed files byte-diffed against what was actually build-tested
  — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files, preserving the same paths:
#   app/globals.css
#   app/shop/[id]/page.js
#   components/BrandDeepDive.jsx
#   components/CategoryBrowser.jsx
#   components/FitCard.jsx
#   components/ShopClient.jsx
#   lib/needTags.js

git add .
git commit -m "Homepage need cards bigger + 4/row desktop, fix testimonial image cropping, clean up testimonial product naming, fix variant switcher via explicit sibling IDs, rename Joints to Joint"
git push origin staging
```

## Worth checking specifically on S-Web once live

- Homepage need cards on a real PC-width browser — should be exactly 4
  per row, noticeably bigger than before.
- A GiGwi product page (the one you originally tested) — the variant
  switcher should now actually appear.
- A testimonial with 2 photos — should look like a proper before/after,
  not cropped.
- Testimonial product names — should read cleanly, not show raw
  SKU-prefixed text.
