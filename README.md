# Pawvy Website – Faster Images and First Banner

## What it does
- Homepage banner: only the FIRST banner's image downloads at page load (high priority). The next slide's image is fetched
  after the first has loaded, then each slide as it comes up. Phones/tablets still get their own smaller banner versions.
- Product cards, category covers, cart and bundle thumbnails ask for the small 480px trimmed photo; product pages and brand
  pages keep the large version. Card photos also load lazily.
No wording or layout changes.

## Deploy order
After the App zip is live (it works before that too, just without the speed-up).

## Git steps
```
cd pawvy-website
git checkout staging
git pull origin staging
```
Copy the code files from this folder into the repo, keeping the folders (NOT README.md, NOT the zip):
app/bundles/[id]/page.js, app/cart/page.js, components/CategoryBrowser.jsx, components/HomepageBanner.jsx,
components/ProductCard.jsx, components/ShopClient.jsx, lib/api.js
```
git add -A
git commit -m "Small product thumbnails, first banner priority"
git push origin staging
```
Check the homepage and shop page on staging, then merge to main:
```
git checkout main
git pull origin main
git merge staging
git push origin main
```
