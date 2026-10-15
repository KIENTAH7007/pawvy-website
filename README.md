# Pawvy Website – product cards stay aligned (Low stock / Out of stock)

Problem: on phones "Low stock" wrapped onto two lines in the top tag row, making that card's photo and text sit lower than its neighbours (and it squeezed/clipped the brand chip). Same risk for "Out of stock".

Fix:
- The Low stock / Out of stock chip now sits in its own fixed-height slot under the price on EVERY card (empty when in stock), so all cards in a row line up on phone, tablet and desktop.
- The top row only holds the brand chip, which is never clipped or shown with "…". Slightly smaller type on phones so "East Sea Brother" still fits on one line; on an extremely narrow screen it wraps instead of being cut.

Files: `components/ProductCard.jsx`, `app/globals.css`. Applies to the shop grid and wherever ProductCard is used (e.g. cart upsell).

## Apply
```
cd pawvy-website
git checkout staging
git pull origin staging
# copy components/ProductCard.jsx and app/globals.css from this zip over the existing ones
git add components/ProductCard.jsx app/globals.css
git commit -m "Product cards: reserve fixed stock-chip slot so cards align; never clip brand chip"
git push origin staging
```
Check on staging: a Low stock item and an Out of stock item next to normal ones, on phone (compact + wide), tablet and desktop.
