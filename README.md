# Pawvy Website — Problem-Based Bundles (Stage 1)

Target branch: **staging**
Repo: `pawvy-website`

**Apply the separate "Pawvy App" zip first** — this depends on its new
`/api/shop/bundles` endpoints.

Builds exactly the design from the approved mockup (minus the "together"
image tile, per your call to drop it).

## What's in this patch

### Bundle card, in the Shop-by-Need grid (`components/ShopClient.jsx`)

When a need has an active bundle, it now shows right in the product
grid alongside the individual products it's made from — spans 2 grid
columns, marked out with an orange border and a "Bundle" tag. Shows the
tiled component images, what's included, the real total price, and an
"Add bundle to cart" button. If any component is out of stock, the
button is replaced with a clear "currently unavailable" note instead.

Fetched server-side (`app/shop/page.js`) alongside testimonials, so a
shared `/shop?need=dental` link shows the bundle in the very first
server-rendered HTML too, not just after client JS runs.

### Bundle detail page (`app/bundles/[id]/page.js`, new)

Click into a bundle and see the full breakdown: each real component
with its own image, brand, name, and price, a real total, and one "Add
all to cart" button. Per your decision, this only shows each
component's own image — no separate "together" composite shot, since
bundles can have 3-4+ products and a fixed extra slot didn't scale, and
the Shop-by-Need page already has testimonials doing the trust-building
work above.

### "Add bundle to cart" (`components/AddBundleSection.jsx`, new)

Loops over the bundle's real components and adds each one to the cart
individually via the exact same `addItem()` every other Add to Cart
button on the site already uses — genuinely no new cart logic. Verified
this handles the edge case of adding the same bundle twice correctly
(merges quantities into the existing 2 cart lines rather than creating
4 duplicate lines).

## Verification performed

- Full production build (`npm run build`) — clean, no errors, and
  `/bundles/[id]` shows up correctly as a new route.
- **Real logic test of the cart-merging behavior**, using the actual
  `addItem` reducer logic from `CartContext.jsx`: confirmed adding a
  bundle's components produces the correct cart lines with correct
  quantities; confirmed the resulting cart total exactly matches the
  bundle's `total_price`; confirmed adding the *same* bundle a second
  time correctly doubles the existing quantities rather than creating
  duplicate lines.
- Confirmed every changed/new file against the real current
  `origin/staging` (fetched fresh) — exactly 6 files.
- All 6 byte-diffed against what was actually build-tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files, preserving the same paths:
#   app/globals.css
#   app/shop/page.js
#   components/ShopClient.jsx
#   lib/api.js
#   app/bundles/[id]/page.js        <-- NEW FILE
#   components/AddBundleSection.jsx <-- NEW FILE

git add .
git commit -m "Problem-based bundles (Stage 1): bundle card in Shop-by-Need grid, detail page, add-to-cart via existing cart"
git push origin staging
```

## Worth checking on S-Web once live

- Create a bundle in Pawvy App tagged to a need you're actively
  testing, then visit that need's Shop page — the bundle card should
  appear in the grid.
- Click into the bundle, confirm the detail page shows every component
  with the correct real price and a correct total.
- Click "Add bundle to cart" (from either the grid card or the detail
  page) and confirm the cart ends up with the right products and
  quantities, totalling the bundle's shown price.
- Try a bundle where one component is out of stock — confirm it shows
  as unavailable rather than a broken/incorrect Add to Cart.
