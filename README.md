# Pawvy Website — patch: 3 fixes to the BetterBone deep-dive

## What changed

1. **Medium dog photo swapped** — new centered husky photo in the Medium durability
   card, replacing the skewed one. Cropped to the same 4:5 ratio as the other two.

2. **Durability cards now link into the shop grid below**, using the existing hover
   state as the click affordance:
   - Clicking any of the 3 cards (Soft / Medium / Hard) scrolls down to
     `#brand-products` and pre-searches the shop grid for that hardness level
   - Search stays scoped to BetterBone only (added a `brandId` prop to `ShopClient` so
     a search triggered this way — or any search on a brand page — doesn't pull in
     matches from other brands)
   - From there the customer can add straight to cart, same as normal browsing

3. **Section divider between FAQ and "Shop this brand"** — wrapped the shop section in
   its own `<section>` with an ivory background (same alternating-background pattern
   used throughout the rest of the page), so it no longer blends into the cream FAQ
   section above it.

### Files touched
- `public/brand-features/betterbone/durability-medium.jpg` — replaced
- `components/BrandDeepDive.jsx` — durability cards are now `next/link` links
- `components/ShopClient.jsx` — added `brandId` prop + reads `?q=` on mount for the
  deep-link from the durability cards
- `app/brands/[slug]/page.js` — shop section now wrapped in `<section className="brand-shop-section">`, passes `brandId` to both `ShopClient` and `BrandDeepDive`
- `app/globals.css` — `.brand-shop-section` background, `.durability-card` updated for
  link/anchor behavior

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes generated
successfully, no Suspense-boundary issues with the new `useSearchParams` usage.

**Note:** the hover→shop-search behavior only works on the live site (it's real
routing/search, not something a static preview can demonstrate) — worth clicking
through once this is live to confirm it feels right.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Fix BetterBone medium photo, link durability cards to shop search, add shop section divider"
git push origin main
```
Railway auto-deploys from `main` on push.
