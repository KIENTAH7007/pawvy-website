# Pawvy Website – 600px Photos
One-line change: product cards, category covers, cart and bundle thumbnails now ask for the 600 px photo (was 480).
Product pages and brand pages still use the 1000 px photo. Deploy after the App zip.

## Git steps (staging)
```
cd pawvy-website
git checkout staging
git pull origin staging
```
Copy lib/api.js from this folder into the repo (same path). NOT README.md, NOT the zip.
```
git add -A
git commit -m "Small product photos 600px"
git push origin staging
```
Check the shop page on staging (product photos load, sharp).

## Git steps (merge to main)
```
git checkout main
git pull origin main
git merge staging
git push origin main
```
