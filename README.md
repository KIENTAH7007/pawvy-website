# Pawvy Website – Referral Bonus 200B
Only wording changes: "150 BUTTONS" -> "200 BUTTONS" in the referral messages (signup, cart checkout field, account page). The signup-bonus "150 BUTTONS" wording is unchanged.

```
cd pawvy-website
git checkout staging
git pull origin staging
```
Copy app/signup/page.js, app/cart/page.js, app/account/page.js from this folder into the repo (same paths). Not README.md, not the zip.
```
git add -A
git commit -m "Referral bonus wording 200B"
git push origin staging
```
Merge to main (after staging check):
```
git checkout main
git pull origin main
git merge staging
git push origin main
```
