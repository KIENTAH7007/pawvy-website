# Pawvy Website — Descriptive Product URLs + BetterBone Hardness Selector

Target branch: **staging**
Repo: `pawvy-website`

Both items you confirmed, ready together.

## 1. Descriptive product URLs

Every product page URL now includes a readable slug —
`/shop/142-betterbone-soft-classic-small` instead of just `/shop/142`.

**How it works, and why it's genuinely zero-risk:**
- `lib/productDisplayName.js` gained two small helpers: `productSlug()`
  (turns the existing clean display name into a lowercase, hyphenated
  string) and `productUrl()` (combines the ID and slug into the final
  URL). Reuses the same name-cleanup logic already powering every
  product's on-page title — there's only one place that decides what a
  product is "called," not two competing naming schemes.
- The product page (`app/shop/[id]/page.js`) only ever reads the
  **leading digits** of the URL segment to look the product up —
  everything after the first hyphen is purely cosmetic. That means:
  - A bare old-style link like `/shop/142` (no slug at all) still works
    exactly as before — nothing breaks for any link already out there.
  - If a product's name changes later and an old shared link goes
    stale, the page still loads correctly — it just shows outdated
    text in the address bar, the same trade-off every major
    e-commerce site accepts for this pattern.
- Updated every place on the site that links to a product page to use
  the new descriptive URL: the Shop grid, GiGwi's category browser,
  Lillidale's hover cards, BetterBone's durability cards, the generic
  fit-card pattern (Puzzle Feeder/Salmoil/Eastsea Brother), and the
  sitemap (so Google discovers the readable URLs directly, not just the
  bare IDs).

**Found and fixed a real bug while I was in there:** the sibling
variant switcher's links weren't carrying the `?siblings=` parameter
forward. That meant clicking from one GiGwi color to another could
silently lose the switcher on the next page, since GiGwi's colors don't
share an `item_series` the fallback logic could rediscover on its own.
Every switcher link now carries the full sibling set forward, so the
switcher stays intact no matter how many times you hop between variants.

## 2. BetterBone hardness selector

A new small interactive selector sits above the three durability cards
on the BetterBone page: **"How does your dog chew?"** with three
buttons. Clicking one smoothly scrolls to and briefly highlights the
matching card (a soft orange glow, fades after ~1.8s).

**Deliberately reuses your existing content, doesn't invent new copy:**
the three button labels are exactly the captions already on your
durability cards — "Teething puppy, senior dog," "Average chewer,"
"Heavy chewer, constant gnawing." This is genuinely just making
guidance you already wrote interactive, not writing new
recommendations.

New file: `components/HardnessSelector.jsx`. Small, self-contained,
only touches the BetterBone durability section — nothing else on the
site is affected by this piece.

## Verification performed

- **4 real logic tests** for the URL system, run against realistic
  product shapes covering every brand's actual naming convention
  (Better Bone, GiGwi, Lillidale, East Sea Brother): confirmed every
  generated URL starts with the correct numeric ID; confirmed every
  generated URL correctly round-trips back to its ID when parsed;
  confirmed old bare-ID links (no slug) still parse correctly; confirmed
  the slug text itself is clean (no double-hyphens, no invalid
  characters).
- **Confirmed the hardness selector's scroll-target IDs exactly match**
  the durability cards' actual IDs for all three real BetterBone levels
  (Soft/Moderate/Hard) — both sides use the identical
  `label.toLowerCase()` expression, so there's no way for them to drift
  out of sync.
- **Caught and fixed a real CSS bug before it shipped**: my first pass
  accidentally added a second, conflicting `.durability-card` rule
  instead of extending the existing one, which would have silently
  dropped the card's existing hover-lift animation. Merged into the one
  true rule instead — verified only one `.durability-card` base rule
  exists in the final CSS.
- Full production build (`npm run build`) — clean, no errors, after
  every change.
- All 9 changed/new files byte-diffed against what was actually
  build-tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files, preserving the same paths:
#   app/globals.css
#   app/shop/[id]/page.js
#   app/sitemap.js
#   components/BrandDeepDive.jsx
#   components/CategoryBrowser.jsx
#   components/FitCard.jsx
#   components/ProductCard.jsx
#   lib/productDisplayName.js
#   components/HardnessSelector.jsx   <-- NEW FILE

git add .
git commit -m "Descriptive product URLs (ID+slug, backward compatible), BetterBone interactive hardness selector"
git push origin staging
```

## Worth checking on S-Web once live

- Click into any product from the Shop page, a brand page, and a
  Shop-by-Need result — URL should show a readable slug after the ID
  in each case.
- Try a bare old-style link manually (e.g. type `/shop/142` directly,
  no slug) — should still load the correct product.
- On a GiGwi product with color siblings, click between 2-3 different
  colors in a row — the switcher should stay visible and correct the
  whole way, not disappear after the first click.
- On BetterBone's page, click each of the three selector buttons —
  should scroll to and briefly highlight the matching card each time.
