# Janice's wording feedback — BetterBone page + all-6-brand hero buttons

**Update after first draft**: the puppy-safety FAQ answer (transcribed
directly from your image) said "Light BetterBone durability," but
BetterBone's real durability labels are Soft/Moderate/Hard — no
"Light." You confirmed this should read "Soft." Fixed in this version.

## What changed (3 files)

### 1. `lib/brandContent.js` — BetterBone-specific
- **Hero description removed** (item 1): `description` for Better Bone
  is now `""`. The hero `<p className="desc">` only renders when
  `content.description` is truthy (see `app/brands/[slug]/page.js`
  below), so this cleanly removes the line without leaving an empty
  `<p></p>` in the page. The `<title>`/meta-description tag still
  falls back correctly to the generic "Shop {brand} products..."
  sentence, since an empty string is falsy in the `content?.description
  || fallback` check in `generateMetadata()` — so this doesn't leave
  the page with a blank SEO description either.
- **Durability heading** (item 4): "Different Durability Levels" →
  "Three Durability Levels".
- **Center card label** (item 5): the `label` shown on the card
  changed from `'Medium'` to `'Moderate'` — the CSS already applies
  `text-transform: uppercase` to this field (checked
  `.durability-label` in `app/globals.css`), so it renders as
  "MODERATE" automatically, no CSS change needed. Important: I left
  `variationIncludes: 'Medium'` **unchanged** — that field is the
  actual search term matched against real product data in the
  database (`B0102Mi`-style SKUs literally contain "Medium" in their
  variation text), so changing it would break the Add to Cart button
  for that card. Only the customer-facing label changed.
- **FAQ section rewritten** (item 6): transcribed all 8 Q&As from your
  images into real content (not pasted as images, as requested). The
  three existing Pawvy-operational FAQs (exclusive distributor,
  stockist info, storage) were kept and moved to the end, since none
  of the 8 images covered that ground and they're still relevant
  info. The old placeholder "Is BetterBone safe for puppies?" answer
  was replaced by the fuller one from your image 1 (same question,
  better answer) rather than kept as a duplicate.
- **Image 2 edit applied**: "our proprietary" → "BetterBone's
  proprietary" in the "What is BetterBone made from?" answer.

### 2. `components/BrandDeepDive.jsx` — applies to all 6 brands
Added a zero-height, invisible `<div id="shop">` as the very first
thing rendered in the deep-dive block (right after the hero, before
any brand-specific section). This is what the new "Shop now" button
scrolls to.

**Why not just point it at the existing durability/fitCards/etc.
section anchors directly?** Each brand uses a different section shape
(BetterBone: `durability`, Lillidale/Puzzle Feeder/Salmoil: various
`fitCardGroups` shapes, Eastsea Brother: `fitCards`, GiGwi:
`browser`), and some of those anchors are already linked to by other
on-page navigation — e.g. Lillidale's pillar nav cards link to
`#supplements`/`#antimicrobial`/`#wellness` specifically. Repurposing
any of those would break that existing navigation. A single dedicated
`#shop` anchor works identically across all 6 brands without touching
anything that already relies on the existing anchors.

### 3. `app/brands/[slug]/page.js` — applies to all 6 brands
- **"Ask about {Brand}" → "Shop now"** (item 2), now links to `#shop`
  instead of `#enquiry-cta`.
- **"Find a stockist" → "FAQ"** (item 3), now links to `#faq` (the
  FAQ section's existing id) instead of routing to `/stockist`.
- Also guarded the hero description paragraph with
  `{content.description && ...}` so BetterBone's now-empty description
  doesn't render an empty `<p>` tag (a minor cleanliness fix that
  falls out of item 1, not a separate ask).

## Verified
- `npm run build` — passes clean, both from my working copy and from
  a genuine fresh `git clone` with the delivered files applied on top
  (full cold-start simulation, not just a local check).
- Real logic tests against the actual `brandContent.js` data (not
  just visual inspection): confirmed BetterBone's description is
  empty, the durability heading text, the Moderate label change while
  `variationIncludes` stays `'Medium'`, the FAQ count (11: 8 new + 3
  kept) and exact content of specific answers, the "our proprietary"
  → "BetterBone's proprietary" swap, and that all 6 brands still have
  both a `deepDive` block and a non-empty `faqs` array — meaning the
  new Shop Now / FAQ buttons always have a real target to scroll to on
  every brand page, not just BetterBone's.
- Confirmed no id collision: no brand's existing content defines an
  anchor named `shop`, and the new `#shop` div's target doesn't
  interfere with any brand's existing section anchors.
- Confirmed the `href="#shop"` / `href="#faq"` button targets match
  the actual rendered element ids exactly.

## Not yet verified (no live backend access from this sandbox)
Same standing limitation as previous deliveries — I can't load the
actual pages in a browser. You mentioned you'll patch and test the
Shop Now button's scroll landing yourself and let me know if it needs
adjusting, so no action needed from me on that here.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
   ("Copy and Replace") — only touches the three files above
4. `git add -A`
5. `git commit -m "Janice feedback: BetterBone page wording + Shop now/FAQ hero buttons across all 6 brand pages"`
6. `git push origin main`

Railway auto-deploys `pawvy-website` from `main` on push.

## Note on scope
This delivery only covers BetterBone's page-specific changes (items
1, 4, 5, 6) plus the shared hero button changes (items 2, 3) that
apply everywhere. It does NOT touch the other 5 brands' individual
page content — if Janice has separate feedback for those, that's a
follow-up delivery.
