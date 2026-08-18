# Pawvy Website — Quick Wins Patch (S$ formatting, distributor accuracy, trust metrics)

Target branch: **staging**
Repo: `pawvy-website`

## What's in this patch

### 1. S$ price formatting (new shared helper)
- New file: `lib/formatPrice.js` — single `formatPrice(value)` helper, returns e.g. `S$18.90`.
- Wired into all 8 places prices were rendered: `CategoryBrowser.jsx`, `ShopClient.jsx`,
  `ProductCard.jsx`, `ProductAddButton.jsx`, `Nav.jsx`, `checkout/success/page.js`,
  `cart/page.js`, `shop/[id]/page.js`.
- `formatPrice(null)` / `formatPrice(undefined)` return `''` (blank, not "S$0.00").
  `formatPrice(0)` correctly still returns `S$0.00` (a genuine free/zero price should
  still display, not disappear).

### 2. Distributor-claim accuracy fix
Pawvy is the **exclusive** distributor for 5 of its 6 brands — GiGwi is the one
exception (official but not exclusive). The site previously made a blanket
"exclusive distributor" claim in several site-wide spots that don't distinguish
by brand, which is incorrect once GiGwi is included.

- **Site-wide/aggregate claims** (describe the whole business across all 6 brands,
  so can't correctly say "exclusive") — changed from "exclusive" to "official":
  - `app/page.js` — marquee fallback facts
  - `components/HomepageBanner.jsx` — zero-banner fallback H1
  - `lib/seo.js` — Organization JSON-LD meta description
- **Per-brand claims** (can and should say "exclusive" for the 5 brands where it's
  true) — newly wired up, previously not rendered anywhere despite the data
  already existing (`exclusive: true/false` per brand in `lib/brandContent.js`):
  - `app/brands/[slug]/page.js` — added a distributor badge under each brand's
    tagline/description, reading "Official & exclusive Singapore distributor of
    [Brand]" for the 5 exclusive brands, or "Official Singapore distributor of
    [Brand]" for GiGwi.
  - Same file's SEO meta-description fallback (only used if a brand is missing
    a `description` in `brandContent.js` — not currently the case for any real
    brand) now also respects the `exclusive` flag instead of hardcoding
    "exclusive distributor".
  - The fallback content object used for a brand with **no** entry in
    `brandContent.js` at all now defaults `exclusive: false` instead of `true`
    — so an unconfigured brand can never accidentally claim exclusivity.
- New CSS for the badge added to `app/globals.css` (`.subhero .distributor-badge`).

**Note on the "five vs six brands" inconsistency you mentioned:** every hardcoded
brand-count mention I could find in this codebase already correctly says "six"
(total brands carried). I could not find a "five" anywhere in the website code.
If you're still seeing that number somewhere on the live site, it's likely coming
from admin-entered content (e.g. Pawvy App marketing/ticker text) rather than
this codebase — worth double-checking where exactly you saw it so I can chase
the right place next time.

### 3. Trust metrics showing as "0" bug (real bug the UX review flagged)
- `components/StatCounter.jsx` — previously initialized its displayed number to
  `0` and only counted up via `IntersectionObserver` once JS ran. If JS failed
  to load, or hadn't loaded yet, the number stayed at `0` indefinitely.
- Fixed: now initializes to the real `target` value, so the correct number is
  what's in the very first render (SSR and no-JS safe). The animated count-up-
  from-0 effect still plays normally for users once they scroll it into view
  with JS working.

## Verification performed (real, not just "build passed")

- `npm install` on a clean state, then `npm run build` — **compiled successfully**,
  all 17 routes generated with no errors, both before and after the final
  `formatPrice` null-handling fix (ran the build twice).
- `formatPrice()` unit-sanity-checked directly via `node --input-type=module`
  against real and edge-case inputs (`18.9`, `20`, `'26.50'`, `null`, `undefined`,
  `0`) — confirmed `S$18.90` / `S$20.00` / `S$26.50` / `''` / `''` / `S$0.00`.
- Searched the full repo for every remaining `${...toFixed(2)}` / `` `$${...}` ``
  price-shaped pattern after the edits — none left outside `formatPrice.js` itself.
- Searched the full repo for every "exclusive" mention — confirmed exactly the
  3 site-wide spots (fixed) and the per-brand data flag (now wired up), no others.
- Byte-for-byte diffed every file in this zip against the actual files that were
  build-tested in the working clone — all identical.

## What this patch does NOT include

- Footer links (Shipping/Returns/FAQ/Privacy/Terms) — intentionally held back,
  pending real policy content from KT (see separate conversation).
- Nothing homepage-structural (need cards, Pawvy's Picks section, hero rebuild) —
  that's Phase 1 work, not part of this quick-wins patch.

## How to apply

```bash
git checkout staging
git pull origin staging

# then copy/overwrite these files from this zip into your local pawvy-website
# folder, preserving the same paths:
#   app/brands/[slug]/page.js
#   app/cart/page.js
#   app/checkout/success/page.js
#   app/globals.css
#   app/page.js
#   app/shop/[id]/page.js
#   components/CategoryBrowser.jsx
#   components/HomepageBanner.jsx
#   components/Nav.jsx
#   components/ProductAddButton.jsx
#   components/ProductCard.jsx
#   components/ShopClient.jsx
#   components/StatCounter.jsx
#   lib/formatPrice.js   <-- NEW FILE
#   lib/seo.js

git add .
git commit -m "Quick wins: S$ price formatting, distributor-claim accuracy (exclusive vs official per brand), trust metric zero-flash fix"
git push origin staging
```

Then test on S-Web (`pawvy-website-staging.up.railway.app`) — specifically worth
checking:
- Prices show `S$` everywhere (shop grid, product page, cart, checkout success,
  free-shipping banner in nav)
- Each brand page (BetterBone, Lillidale, Puzzle Feeder, Eastsea Brother, Salmoil)
  shows the new "Official & exclusive Singapore distributor of [Brand]" badge
- GiGwi's brand page shows "Official Singapore distributor of GiGwi" — **no**
  "exclusive" wording
- Homepage looks unchanged structurally (only the zero-banner fallback text
  changed, which you likely won't see live since banners are active)
