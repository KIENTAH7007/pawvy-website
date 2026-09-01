# Pawvy Website — Wild Balance: Intro Sections Built

Target branch: **staging**
Repo: `pawvy-website`

Builds the mockup you approved into real code — two sections now sit
between the hero and the Casseroles section: the intro (with the
3-card trust-pillar grid) and the feature split, exactly matching the
mockup's copy and layout.

## What's genuinely new in this delivery vs. the one you already patched

- **`lib/brandContent.js`** — added the real `intro` and `featureSplit`
  config for Wild Balance, same copy as the approved mockup. Both
  images deliberately left as placeholders (no `image` field set) —
  see "Adding the real photos later" below.
- **`components/BrandDeepDive.jsx`** — has one more change on top of
  the image-fallback fix you already applied: moved where Wild
  Balance's product sections render, so `intro`/`featureSplit` now
  correctly appear *before* Casseroles/Freshly Cooked/etc instead of
  after. This only affects Wild Balance — confirmed Puzzle Feeder
  (which uses `intro`/`featureSplit` itself) renders exactly as before.

**`components/FitCard.jsx` and `public/brand-heroes/wild-balance-
hero.jpg` are unchanged from the zip you already patched** — included
here again just so this is a complete, self-contained zip rather than
something you have to cross-reference against the last one. Safe to
overwrite either way.

## Adding the real photos later, once you have them

In `lib/brandContent.js`, find `intro:` and `featureSplit:` under
Wild Balance's config. Each currently has an `imageHint` (the
placeholder label text) but no `image` field. Once a photo's uploaded
to `public/brand-features/wild-balance/`, just add:

```js
image: '/brand-features/wild-balance/your-photo-name.jpg',
```

right alongside the existing `imageHint` line for whichever section —
no other change needed, the placeholder box automatically becomes the
real photo.

## Verification performed

- Full production build — clean, no errors.
- **Real end-to-end test**: ran the actual backend and actual Next.js
  production server together, fetched the real Wild Balance page, and
  confirmed the section order is genuinely correct (hero → intro →
  feature split → Casseroles), not just that the code looks right.
- Confirmed both placeholder boxes render with their labeled hint text
  correctly, and the real copy renders exactly as approved in the
  mockup.
- Confirmed all 4 product sections and the FAQ still render correctly
  after the reordering, zero errors.
- Confirmed Puzzle Feeder (a different brand using the same
  `intro`/`featureSplit` blocks) is completely unaffected by the
  reordering — fetched its real page, same content renders as before.
- All 4 files byte-diffed against what was actually tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files:
#   components/BrandDeepDive.jsx
#   components/FitCard.jsx
#   lib/brandContent.js
#   public/brand-heroes/wild-balance-hero.jpg

git add .
git commit -m "Add Wild Balance's intro and feature-split sections before the product cards, matching the approved mockup — images left as placeholders until real photos are ready"
git push origin staging
```
