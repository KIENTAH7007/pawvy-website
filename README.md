# Fix: checkout confirmation page content cut off behind the nav bar

## This delivery is for the Website folder (`pawvy-website`) only

1 file changed: `app/checkout/success/page.js`.

## What was wrong

Real bug, not a one-off glitch: the page has 5 different render states
(loading, error, cancelled, confirming, and the actual success state you
saw). Four of them use `margin: '140px auto 40px'` on their outer div to
clear the site's fixed nav bar. The success state — the one a customer
actually sees after paying — was the only one still using `margin: '60px
auto'`, not enough to clear the nav bar, which is exactly why "Thank you
for your order!" appeared cut off at the top in your screenshot.

## The fix

Changed that one value to match the other four states exactly
(`140px auto 40px`), so a customer always sees the full confirmation
regardless of which state the page happens to be in when they land on
it.

## Verification performed

- Confirmed all 5 states in the file now use the identical margin value
  (previously only 4 did).
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms the file in this zip matches what was
  cold-clone built and tested.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's `app/checkout/success/page.js` into that folder
(overwrite), then:

```bash
git add .
git commit -m "Fix: checkout confirmation page content cut off behind nav bar"
git push origin main
```

Railway auto-deploys from `main`. This is safe to apply independently
of, or together with, the App-side email/Stripe-fee fixes from the same
round of testing.
