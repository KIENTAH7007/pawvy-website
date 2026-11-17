# Pawvy Website - Better Bone hardness rename (Soft -> Light, Medium -> Moderate)

The Better Bone durability cards and Add to Cart find products by the hardness word in the product's Variation.
This patch makes each level accept BOTH the old and the new word, so nothing changes until you rename, and nothing breaks after:
- Soft level: matches "Soft" or "Light"
- Moderate level: matches "Medium" or "Moderate"
- Hard level: matches "Hard"
The size/flavour picker strips whichever hardness word the product uses (Light Veggie Mini -> flavour Veggie, size Mini).
Card titles shown to customers are NOT changed in this patch (still Soft / Moderate / Hard).

Files (complete, replace as-is):
- lib/brandContent.js
- components/BrandDeepDive.jsx
- components/ProductAddButton.jsx

## Staging
```
git checkout staging
git pull
git merge main
# copy the 3 files from this zip over the repo (same paths)
git add lib/brandContent.js components/BrandDeepDive.jsx components/ProductAddButton.jsx
git commit -m "Better Bone: accept Light/Moderate hardness wording alongside Soft/Medium"
git push origin staging
```

## Merge to main (do this BEFORE renaming products in the app)
```
git checkout main
git pull
git merge staging
git push origin main
```

## Then rename in the app
Products & Pricing: change Variation (e.g. "Soft Classic Mini" -> "Light Veggie Mini"). Keep "Better Bone" in Item Series and keep the pattern <Hardness> <Flavour> <Size>.
