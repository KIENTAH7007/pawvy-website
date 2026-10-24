# Pawvy Website – Referral Code at Checkout

This zip is COMPLETE for the website. It includes everything from
"Pawvy Website - Referral Code Signup and Free Delivery.zip" PLUS the new checkout field.
Apply this one INSTEAD of the earlier Website zip (if you already applied the earlier one, applying this on top is fine).
The App zip ("Pawvy App - Ambassador and Referral Codes.zip") is unchanged and must be deployed first.

## What's new
- Cart page: guests who tick "create a free Pawvy rewards account" see an optional "Referral code" box
  with the same live "Code accepted" tick as the signup page.
- A code typed here wins over the remembered link code (prefilled if a link was clicked).
- An invalid code is not sent. Logged-in customers don't see the field. Existing-email accounts ignore it.

## Git steps
```
cd pawvy-website
git checkout staging
git pull origin staging
```
Copy the code files from this folder (not README.md, not the zip) into the repo, keeping folders.
```
git add -A
git commit -m "Referral code and checkout referral field"
git push origin staging
```
Test on staging, then merge staging to main as usual.
