# Pawvy Website – product card photos fill the whole thumbnail

Removes the beige frame around product photos on the product cards (shop grid, brand pages). The photo is already trimmed + squared by the app, so it now fills the card's image area edge to edge. The thumbnail background is white (same as the photos), so a photo that can't be trimmed never shows beige bars.

One file changed: `app/globals.css` (the `.product-card .thumb` rules only: background ivory → white, image padding 10px → 0). Requires the earlier "Trimmed Product Images" deliveries (already applied).

## Apply
```
cd pawvy-website
git checkout staging
git pull origin staging
# copy app/globals.css from this zip over the existing one
git add app/globals.css
git commit -m "Product cards: photo fills thumbnail edge to edge (no beige frame)"
git push origin staging
```
Check on staging: BetterBone / GiGwi grids on desktop and mobile, and a card with a "New" or "Low stock" tag. To undo: revert that single commit.

Not changed: bundle cards, the product detail page, Lillidale/brand-page cards (those were already edge to edge).
