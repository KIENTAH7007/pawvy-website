# Pawvy Website — Design Standardization: Wild Balance + Site-Wide Pricing

Target branch: **staging**
Repo: `pawvy-website`

## What this delivers, per your design review

1. **Wild Balance rebuilt on the real shared components** — real `<FitCard>`,
   real square full-width card images (fixes the cropping/cutoff you saw),
   real navy `.fit-add-btn`, no more price omitted at brand-page level
   inconsistency, no more custom bespoke card markup.
2. **BetterBone's "How does your dog chew?" pattern reused for Wild
   Balance's chew recommender** — the actual `HardnessSelector.jsx`
   component, generalized with optional props (defaults exactly match
   BetterBone's current hardcoded text, so its own page is unaffected),
   not a lookalike.
3. **Real pricing added to every curated brand page** (BetterBone,
   Lillidale, Puzzle Feeder, Salmoil, East Sea Brother, Wild Balance),
   matching GiGwi's exact format — confirmed against the real GiGwi code
   before writing this, not guessed.

## Files removed

- `lib/wildBalanceGrouping.js` — Wild Balance's product matching now
  goes through the same real `seriesIncludes`/`variationIncludes`
  config every other brand uses (in `lib/brandContent.js`), not a
  custom description-text matcher.
- `components/ChewSelector.jsx` — replaced by `ChewRecommender.jsx`,
  a thin wrapper around the real `HardnessSelector.jsx`.

## Two real bugs found and fixed while doing this — worth knowing about

**1. A client/server component boundary crash.** `WildBalanceDeepDive.jsx`
is a Server Component, and importing `findMatches` from
`ProductAddButton.jsx` (a `'use client'` file) crashed the page with a
real 500 error — exactly the class of bug `lib/matching.js`'s own
comment already warns about. Fixed by importing from the boundary-safe
`lib/matching.js` instead, in `WildBalanceDeepDive.jsx` and both
calculators.

**2. A genuinely confusing one:** adding price to `FitCard.jsx` alone
left Lillidale and Salmoil silently unaffected. Turns out
`BrandDeepDive.jsx` has **two separate card implementations sharing the
same `pf-fit-card` CSS class** — the singular `fitCards` config (Puzzle
Feeder, East Sea Brother) renders through the real `<FitCard>`
component, but the plural `fitCardGroups` config (Lillidale, Salmoil)
has its **own separate inline card markup**, written directly in
`BrandDeepDive.jsx`, that never went through `FitCard.jsx` at all. This
took real digging to track down — confirmed with actual debug markers
in the rendered HTML, not just re-reading the code — since both paths
produce visually identical output, so nothing *looked* wrong from the
outside. Fixed by adding the same price logic to that second inline
block too. Also added a code comment there explaining this so it isn't
rediscovered the hard way again.

## Verification performed — real, not assumed

- Full production build (`next build`) — clean, no errors, multiple times
  through this process as real bugs were found and fixed.
- **Ran the real backend and real production Next.js server together**
  (`next start`, not just dev mode) against real seeded data for Wild
  Balance and BetterBone, then fetched all 7 brand pages for real:
  Wild Balance, BetterBone, Lillidale, Puzzle Feeder, Salmoil, East Sea
  Brother, GiGwi — all return 200, zero errors on any of them.
- **Confirmed real price actually renders on every brand**, not just
  that the code compiles — extracted the actual price text from each
  page: Wild Balance (S$7.50), BetterBone (From S$20.00), Lillidale
  (From S$27.00), Puzzle Feeder (From S$55.90), Salmoil (From S$24.90),
  East Sea Brother (From S$24.90).
- Confirmed BetterBone's hardness selector still scrolls/highlights
  correctly, unaffected by the generalization.
- Confirmed the old dead CSS/classes (`calc-cart-btn`, `pcard`,
  `chew-selector`) are completely gone from Wild Balance's output.
- All 10 changed files byte-diffed against what was actually tested —
  identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files:
#   app/globals.css
#   components/BrandDeepDive.jsx
#   components/FitCard.jsx
#   components/HardnessSelector.jsx
#   components/WildBalanceDeepDive.jsx
#   components/CasseroleCalculator.jsx
#   components/FreshlyCookedCalculator.jsx
#   components/FrozenYoghurtToggle.jsx
#   lib/brandContent.js

# this is a NEW file:
#   components/ChewRecommender.jsx

# these 2 files should be DELETED:
rm lib/wildBalanceGrouping.js
rm components/ChewSelector.jsx

git add .
git commit -m "Standardize Wild Balance on real shared FitCard/HardnessSelector components; add real pricing to every curated brand page's cards, matching GiGwi's format; fix a client/server boundary crash and a second, undiscovered card-rendering path missing the new price logic"
git push origin staging
```

## Worth a real look on S-Web once live

- Wild Balance's product images should now fill the card properly, no
  more cropping.
- Every brand page's cards should show a price now — a genuinely
  visible, site-wide change worth a quick look across all 6.
- BetterBone's chew selector should behave exactly as before.
- Wild Balance's chew recommender should scroll to and briefly
  highlight the matching card when you tap an option.
