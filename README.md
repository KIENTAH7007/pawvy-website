# Pawvy Website — Multiple product photos

Deploy the **Pawvy App zip first**, then this one. Until a SKU has extra photos in the app, nothing looks different.

## What changes
- **Product page**: if a SKU has extra photos, a big photo with arrows, thumbnails underneath, and swipe on phones. No auto-rotation.
- **Shop grid cards**: arrows on desktop (click for the next photo, no hover effect), swipe + dots on phones. Clicking the photo itself still opens the product.
- **Grouped brand cards** (Lillidale, Salmoil, Puzzle Feeder, East Sea Brother, GiGwi): the card's cover stays as it is; photos added to the card's default SKU follow it with the same arrows / swipe.
- Better Bone's brand-page cards are a different card type and are unchanged this round (its Shop cards and product pages do get photos).

## Files (complete files, copy over the same paths)
app/globals.css, app/shop/[id]/page.js,
components/BrandDeepDive.jsx, CategoryBrowser.jsx, FitCard.jsx, ProductCard.jsx, ImageCarousel.jsx (NEW)

## Deploy to STAGING first
```
cd pawvy-website
git checkout staging
git pull
git merge main
# copy every file from this zip into the repo, same paths (replace when asked)
git add -A
git commit -m "Multiple product photos: gallery, shop arrows/swipe, grouped cards"
git push origin staging
```

## Then merge to MAIN
```
git checkout main
git pull
git merge staging
git push origin main
```
