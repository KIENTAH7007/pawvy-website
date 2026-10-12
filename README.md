# Plaque Guard – 60g + 180g size picker

Add to Cart on Plaque Guard now opens the size-picker modal (same as ProJoint / ProHealth), card shows "From S$x".

Only one file changed: `lib/brandContent.js`

## Apply
```
cd pawvy-website
git checkout staging
git pull
# copy lib/brandContent.js from this zip over your existing one
git add lib/brandContent.js
git commit -m "Plaque Guard: add 180g variant, size-picker modal"
git push origin staging
```
Then, when happy on staging: `git checkout main && git pull && git merge staging -X theirs && git push origin main`

## Notes
- Matching: 60g = series contains "Plaque Guard" + variation contains "60g"; 180g = "180g". 60g is the default.
- The 180g uses the same photo as 60g for now. Drop a `sku-plaqueguard-180g.jpg` into `public/brand-features/lillidale/` and change the 180g `image` path (marked TODO).
- After deploy, click Add to Cart on Plaque Guard and confirm both sizes appear. If a size is missing, the Pawvy App variation text for it isn't "180g"/"180 g" – tell me the exact text.
