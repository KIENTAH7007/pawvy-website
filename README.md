# Pawvy Website – bigger product images

Every product photo on pawvy.co (shop grid, product page, brand pages and their size-picker modals, bundles, cart, category browser) now requests the trimmed square version from the app (`?trim=1`), so products look bigger in their cards with no information cropped. Banners, testimonials, Instagram and social-share images are unchanged.

Files changed (11): lib/api.js (new `productImageUrl`), components/BrandDeepDive.jsx, CategoryBrowser.jsx, FitCard.jsx, FrozenYoghurtToggle.jsx, ProductAddButton.jsx, ProductCard.jsx, ShopClient.jsx, app/cart/page.js, app/shop/[id]/page.js, app/bundles/[id]/page.js

REQUIRES the "Pawvy App - Trimmed Product Images" zip deployed to the app. Safe in either order; without it, images just look as they did before.

## Apply
```
cd pawvy-website
git checkout staging
git pull origin staging
# copy the files from this zip over the same paths
git add -A
git commit -m "Product images: request trimmed square photos so products look bigger"
git push origin staging
```
Then check on staging: GiGwi and BetterBone grids (the Suppa Puppa and Soft Classic/Beef Mini cards from your screenshots), a product page, a Lillidale size-picker modal, and the cart. Go live later with `git checkout main && git pull origin main && git merge staging -X theirs && git push origin main && git checkout staging`.

Notes: the Lillidale cards that use a curated photo from the site's own files (not from Pawvy App) are not affected. If any single photo looks off, tell me which product.
