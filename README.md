# Pawvy Website - Referral Code Signup and Free Delivery

Part 2 of 2 (deploy AFTER the "Pawvy App - Ambassador and Referral Codes" zip).

## What's in it
- **Signup page**: optional "Referral code" field with a live "Code accepted" tick (or a friendly "couldn't find that code"). Filled in automatically from a link and remembered for 30 days.
- **Short addresses**: `pawvy.co/join` (signup page) and `pawvy.co/r/CODE` (signup with the code filled in).
- **Account page**: big referral code with **Copy code** and **Copy link** buttons (link is `pawvy.co/r/CODE`). Special ambassadors also see **Ambassador stats** (friends joined / made a purchase / BUTTONS earned - counts only, never names or emails).
- **Nav chip and Shop page bar**: fixed wording "S$60 for free delivery" (no more "Add S$X").
- **Cart**: free delivery is now checked AFTER BUTTONS are applied; the "Add S$X more for free shipping" line is removed; ambassadors can redeem without the 30% cap.

## Files (copy these code files only, NOT this README or the zip)
- app/account/page.js
- app/cart/page.js
- app/globals.css
- app/signup/page.js
- app/join/page.js (new)
- app/r/[code]/page.js (new folder `r`, inside it a folder literally named `[code]`)
- components/Nav.jsx
- components/ShopClient.jsx
- lib/api.js
- lib/referral.js (new)

## Git steps
```
git checkout staging
git pull origin staging
# copy the files above into the repo, same paths (create the new folders app/join and app/r/[code])
git add -A
git commit -m "Referral code field + /join + /r/CODE, copy code/link, ambassador stats, fixed free-delivery wording, free delivery after BUTTONS"
git push origin staging
```
Then merge to main when tested (your usual pattern):
```
git checkout main
git pull origin main
git merge staging -X theirs
git push origin main
git checkout staging
```

## Wording for Janice's pass
Anywhere the site says free delivery over S$60 (FAQ, Terms), add "after BUTTONS are applied" - the order is now: items, BUTTONS, then the S$60 free-delivery check.
