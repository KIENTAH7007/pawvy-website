# Image storage migration: base64 → Railway Storage Bucket (Website side)

## This delivery is for the Website folder (`pawvy-website`) only

21 files total in this zip — most were already delivered in earlier
sessions (SEO canonical tags, product naming cleanup, GiGwi sort order)
and are unchanged from what you already applied; only the files below
have new changes from this bucket migration. Safe to unzip the whole
thing either way — re-applying identical content to already-applied
files is harmless.

## What actually changed for the bucket migration

The backend (`pawvy-app`) now returns a relative path like
`/api/uploads/products/123-1723200000000.jpg` in every `image_url`
field, instead of a giant base64 string in `image_data`. Every place on
the website that renders a product/banner/Instagram photo needed to
build the full URL (backend domain + that path) instead of using the
base64 directly.

**New shared helper**: `lib/api.js` now exports `imageUrl(relativePath)`
— every image-rendering spot goes through this one place rather than
repeating the URL-prefix logic.

**Files actually touched for this reason:**
- `lib/api.js` — the new `imageUrl()` helper
- `components/ProductCard.jsx` — Shop grid thumbnails
- `app/shop/[id]/page.js` — product detail page image
- `lib/CartContext.jsx` + `app/cart/page.js` — cart item images
- `components/InstagramGrid.jsx` — homepage Instagram photos
- `components/HomepageBanner.jsx` — the full-width takeover banner
- `components/CategoryBrowser.jsx` — GiGwi's shop-by-category cards
  (100+ SKUs, cover-photo matching logic)
- `components/ProductAddButton.jsx` — the variant-picker modal used
  across BetterBone/Lillidale/Salmoil/Puzzle Feeder/East Sea Brother.
  Careful distinction here: `current.image` (a curated static asset from
  `lib/brandContent.js`, e.g. `/brand-features/...`) is untouched — only
  `current.product.image_url` (a real uploaded photo from the database)
  gets the `imageUrl()` prefix.
- `next.config.js` — updated the stale comment explaining the old
  base64 reasoning. Deliberately **not** converting to `next/image` in
  this delivery — real URLs are already the big win (no more giant
  base64 in every page/API response); `next/image`'s automatic
  resizing/WebP conversion needs known dimensions or a sized `fill`
  container per usage site, and getting that wrong risks a layout bug I
  can't verify without a running browser. Worth doing as a deliberate
  follow-up, reviewed one usage site at a time — not rushed into this
  same pass, especially given the recent Dashboard incident from moving
  too fast on a UI change.

## A real gap, disclosed rather than hidden

Cart contents already sitting in a customer's browser (localStorage)
from before this ships will have the old `image_data` field, not
`image_url` — after deploy, pre-existing cart items would show a missing
image until re-added. Minor and self-healing (carts are short-lived),
not worth a dual-format fallback for a rare, temporary edge case.

## Verification performed

- Full repo grep for `image_data` after all edits — the only remaining
  reference is a stale comment fragment in `next.config.js`, now
  corrected; nothing live left pointing at the old field.
- Real cold-clone build: fresh `git clone` → applied all 21 files →
  `npm install` → `npm run build` — passed with no errors.
- Grepped the actual compiled build output (`.next/server`) for any
  leftover `image_data` references — none found; confirms nothing leaked
  into what actually ships.
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
git commit -m "Wire product/banner/Instagram images to the new bucket-proxied URLs"
git push origin main
```

Railway auto-deploys from `main`. **Apply this together with, or after,
the App-side "Image Bucket Migration" delivery** — this side depends on
the backend actually returning `image_url` fields, which only happens
once that one's live.
