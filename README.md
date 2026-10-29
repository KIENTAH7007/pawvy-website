# Pawvy Website – Remove referral placeholder
Removes the grey "e.g. KOKOHONEY" hint from the Referral code box on the Signup page and the guest checkout (cart). Wording only. No App change. Safe to push on its own.

```
cd pawvy-website
git checkout staging
git pull origin staging
```
Copy app/signup/page.js and app/cart/page.js from this folder into the repo (same paths). Not README.md, not the zip.
```
git add -A
git commit -m "Remove referral code placeholder"
git push origin staging
```
Then merge to main:
```
git checkout main
git pull origin main
git merge staging
git push origin main
```
