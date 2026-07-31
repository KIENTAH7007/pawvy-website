# Lillidale brand deep-dive — patch

## What this adds

The Lillidale brand page (`/brands/lillidale-natural-pet-supplement`) now has
a full deep-dive section between the existing hero and the existing FAQ:

1. **Pillars nav** — Supplements / Antimicrobial healthcare / Wellness, each
   with a photo, description, and jump-link.
2. **Before & after showcase** — 3 real customer stories (ProHealth,
   Plaque Guard + Dental Spray, Ear Cleanser), using the real photos you sent.
3. **Three shop grids** (one per pillar) — 13 SKUs total, each with a real
   product photo and an Add to Cart button. ProJoint and ProHealth show
   their 500g photo by default; picking a different size in the modal swaps
   the photo to match (built-in behavior of the existing explicit-variants
   picker — no new logic needed for that part).

No hero, FAQ, or CTA changes — those already exist on the shared brand-page
template and weren't touched.

## Files in this patch

- `components/BrandDeepDive.jsx` — **complete file.** Added three new
  section shapes: `pillars`, `beforeAfter`, `fitCardGroups` (a repeatable
  version of the existing `fitCards` shape, since Lillidale needed three
  separate shop grids instead of one). Existing shapes (chew, durability,
  intro, featureSplit, stats, checklist, fishGroups, fitCards) are
  untouched — Better Bone, Puzzle Feeder, and Eastsea Brother pages are
  unaffected.
- `lib/brandContent.js` — **complete file.** Only the `Lillidale` entry
  changed; every other brand's data is untouched.
- `app/globals.css` — **complete file.** Added new CSS classes at the very
  end (`.lil-pillars`, `.lil-before-after`, `.lil-fit-group`, `.eyebrow.on-
  dark`). Nothing existing was edited or removed.
- `public/brand-features/lillidale/*.jpg` — **27 new images**, all
  resized/compressed for web (2.0MB total, down from 19.7MB as received).
  No existing files touched.

No files are renamed or replaced, so there's nothing to manually delete
this time — plain unzip-and-replace covers everything.

## Before you deploy — one thing worth knowing

The Wellness range's `item_series`/`variation` naming was confirmed
directly from your Pawvy App Products screenshot (SKU code + "Lillidale
Grooming" in `item_series`, real name + size in `variation` — same pattern
as Eastsea Brother). The **Supplements and Antimicrobial healthcare**
`seriesIncludes` terms (ProJoint, ProHealth, Plaque Guard, Sanitizing
Spray, Ear Cleanser, Dental Spray, Eye Cleanser, Wound Care) are my best
guess from the product photos/packaging text — I don't have a confirmed
screenshot of those two groups' real `item_series` values.

I ran a local smoke test (rendering the component against fabricated
product rows shaped like your real data) and every one of the 13 cards
resolved correctly with zero "Unavailable" states — but that's fabricated
data, not your real catalog. Per the standing lesson from this session's
earlier bugs: **please do one real click-through on each of the 13 Add to
Cart buttons after this deploys** — especially the Supplements and
Antimicrobial groups. If any card shows "Unavailable," it almost certainly
means the real `item_series`/`variation` text doesn't contain the term I
guessed, and I'll need the actual field values to fix it (same as the
BetterBone/Eastsea Brother matching bugs earlier this session).

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip this patch on top of your local `pawvy-website` folder ("Copy and
Replace" when prompted), then:

```bash
git add -A
git commit -m "Add Lillidale brand deep-dive: pillars, before/after, 13-SKU shop grids"
git push origin main
```

Railway will auto-deploy from `main` on push. If it doesn't pick it up
automatically, use the manual Redeploy button on the Deployments tab
before digging into anything else — that's resolved this before.

## What I verified locally

- `npm run build` — clean, no errors.
- SSR smoke test of `BrandDeepDive` against fabricated product data shaped
  like your real records — all 13 cards render, zero crashes, zero
  "Unavailable" states.
- All 27 images compressed and confirmed to load correctly at their new
  paths.

## What I could not verify locally (no access to your live backend/DB)

- Whether the real `item_series`/`variation` text for Supplements and
  Antimicrobial healthcare actually contains the terms I guessed — see
  the flag above.
- Real stock levels / `stock_status` for any of the 13 SKUs.
