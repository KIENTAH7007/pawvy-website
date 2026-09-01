# Pawvy Website — Wild Balance: Images Fixed, Text Fixed, New Hero

Target branch: **staging**
Repo: `pawvy-website`

## What's fixed

### 1. Product images now showing (the real bug)

Every other curated brand (Lillidale, BetterBone, Puzzle Feeder) hand-
curates a static photo per variant, uploaded once to
`/public/brand-features/...` and set directly in `lib/brandContent.js`'s
config. Wild Balance's config never got that treatment — no `image`
field was ever set on any variant, since the actual intent was always
to pull whatever's already uploaded for each real SKU in Pawvy App
automatically (same as GiGwi). That gap meant every card except Frozen
Yoghurt (which uses a different, already-correct code path) fell
through to the placeholder.

Fixed in `FitCard.jsx` and the second inline card implementation in
`BrandDeepDive.jsx` (the one Lillidale/Salmoil use — added the same
fallback there too for consistency, even though their configs already
specify images): both now fall back to the real matched product's
`image_url` whenever a variant doesn't have its own static `image` set.

### 2. Casserole card text

Changed from "NO FREEZER, NO THAWING — JUST SERVE" to "280g" — matches
the pack-size convention other brands' cards use for this line.

### 3. New hero photo

Replaced with the image you sent. It was 9.2MB at 3278×1655 — far too
heavy for a web hero background (every other brand's hero photo is
265–545KB). Resized to 1600px wide and compressed to 148KB, well
within the range of the existing hero images, no visible quality loss
at the size it's actually displayed.

## Verification performed

- Full production build — clean, no errors.
- **Real end-to-end test, not just a build check**: seeded a real
  product with a real `image_url` set, ran the actual backend and
  actual Next.js production server together, and confirmed via a real
  fetched page that the image fallback genuinely works — the real
  uploaded photo renders (`<img src="http://.../wb-anchovy-test.jpg">`),
  not the placeholder.
- Confirmed the fitFor text change renders correctly ("280g" shows,
  the old text is completely gone).
- All 4 changed files byte-diffed against what was actually tested —
  identical.

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
git commit -m "Fix Wild Balance product images falling back to placeholder (no image field was ever set in config); change casserole card text to pack size; replace hero photo"
git push origin staging
```

---

## Separate: intro sections mockup (item #3 — not code yet)

Attached as its own HTML file, per your request — this is **just a
mockup for your review**, nothing here touches real code yet.

Researched all 6 existing brand pages' patterns before drafting this.
Puzzle Feeder — closest in scope to Wild Balance (a curated,
few-category brand, not GiGwi's 100+ SKU catalogue) — uses two
sections before its product cards: an `intro` (large image + copy,
with an optional 3-card "values" grid below) and a `featureSplit`
(second image + copy block, alternating side). The mockup follows this
exact real pattern and real CSS, not an invented layout.

**Section 1 (intro + values):** brand story — real food, FEDIAF
formulation, the no-freezer convenience — plus 3 trust-pillar cards
(No Freezer/No Thawing, FEDIAF-Formulated, Exclusive to Pawvy). Uses
your real hero photo.

**Section 2 (feature split):** a closer look at real ingredients —
real proteins, real vegetables, single-ingredient chews. **This one
needs a real photo** — I don't have separate Wild Balance ingredient
photography beyond the one hero shot, so this section uses a clearly
labeled placeholder. Worth deciding whether you have another photo
Wild Balance can supply, or whether this second section should be
cut/reworked around what we actually have.

Take a look and let me know what to adjust — copy, section count,
whether the feature-split section is worth keeping if we don't have a
second photo — and I'll only touch real code once this is confirmed.
