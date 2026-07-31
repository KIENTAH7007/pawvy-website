# Lillidale brand deep-dive — fix + before/after redesign patch

This replaces the previous Lillidale patch delivery. If you already applied
that one, this is a straight overwrite — same files, updated content.

## What changed since the last patch

**1. Fixed the "Unavailable" bugs you found live:**
- ProJoint & ProHealth 2kg — was matching the exact text "2kg"; now also
  accepts "2 kg" and "2000g" as valid matches (`ProductAddButton.jsx` gained
  a new `variationIncludesAny` option for this — small, reusable addition,
  doesn't affect any other brand's cards).
- Sanitizing Spray — now matches both "Sanitising" (the spelling actually
  on the product photo) and "Sanitizing".
- Ear Cleanser / Dental Spray — loosened to shorter, safer keywords ("Ear",
  "Dental") since the exact phrases weren't matching your real data.
- Wound Care — corrected the displayed size from 100ml to 65ml.

**2. Removed the pillar bullet-point lists** (Supplements/Antimicrobial/
Wellness cards) per your markup — cards now just show the photo,
description, and jump-link.

**3. Rebuilt the before/after section — Option C, with your two tweaks:**
- Trimmed real blank white space out of the ProHealth and Plaque Guard
  photos (Plaque Guard's originals were ~65% blank — cropped that out).
- Taller frame (340px vs. the old 190px) so images actually read clearly.
- **Plaque Guard card now stacks Before/After top-to-bottom** instead of
  side-by-side, since those photos are landscape to begin with.
- **Every card now has a "Before"/"After" (or "Day 1"/"Day 7") pill directly
  on the image**, not just in the text underneath.

## Files in this patch (all complete files)

- `components/BrandDeepDive.jsx` — before/after section updated (tag pills,
  vertical-split support). Nothing else in this file changed since the
  last patch.
- `components/ProductAddButton.jsx` — added `variationIncludesAny` support
  to `findMatches()`. This is a small, backwards-compatible addition — every
  other brand's cards (BetterBone, Puzzle Feeder, Eastsea Brother) are
  unaffected since they don't use this new option.
- `lib/brandContent.js` — only the `Lillidale` entry changed.
- `app/globals.css` — only the `.lil-*` rules at the end changed (taller
  split frame, image tag pills, vertical variant, pillar-list rule
  removed).
- `public/brand-features/lillidale/*.jpg` — `prohealth-before/after.jpg`
  and `plaqueguard-before/after.jpg` are replaced with trimmed versions
  (blank space cropped out). Everything else is unchanged from the last
  patch — just re-included here so this zip is a complete, self-contained
  overwrite.

Nothing is renamed, so plain unzip-and-replace covers it — no manual
deletion needed.

## Still an open question, same as last time

The Sanitizing/Ear Cleanser/Dental Spray fix is a best-effort loosening,
not a confirmed fix — I still don't have a screenshot of those three SKUs'
real `item_series`/`variation` text. If any of them still show
"Unavailable" after this deploys, that's the next thing to check directly
in the Pawvy App's Products search.

## What I verified locally

- `npm run build` — clean.
- SSR smoke test reproducing your exact reported failures (2kg written as
  "2 kg", Sanitising spelling, etc.) — all 13 cards now resolve, zero
  "Unavailable".
- Confirmed the vertical split renders for Plaque Guard and the tag pills
  render on all 6 before/after images.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local `pawvy-website` folder ("Copy and Replace"),
then:

```bash
git add -A
git commit -m "Fix Lillidale matching bugs, redesign before/after (Option C)"
git push origin main
```

Railway auto-deploys from `main`. If it doesn't pick it up, use the manual
Redeploy button on the Deployments tab first.

## Please click-test again after this deploys

Same ask as last time, now narrower:
- The 13 Add to Cart buttons, especially Sanitizing Spray / Ear Cleanser /
  Dental Spray / 2kg sizes — since those are the loosened/hedged fixes.
- The before/after section on both desktop and mobile widths, to make sure
  the taller frame and the Plaque Guard stacked layout look right at your
  actual screen sizes.
