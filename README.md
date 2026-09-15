# Pawvy Website — Privacy Policy & Terms and Conditions

Target branch: **staging**
Repo: `pawvy-website`

Part of the PDPA / Spam Control Act compliance work. Adds the two
pages that were referenced but didn't exist — your signup consent
checkbox literally said "See our Privacy Policy" with nothing for it
to link to.

## What's in this patch

- **New pages**: `/privacy` and `/terms`, both grounded in what Pawvy
  actually does — checked directly in the code rather than using
  generic boilerplate: real customer data fields (including pet
  details like allergies/birthday), Stripe and Resend named as the
  only data processors, and an accurate note that the site uses
  browser local storage rather than cookies for sessions/cart (no
  tracking or analytics cookies are used at all — confirmed by
  checking for any analytics/tracking scripts in the codebase; there
  are none).
- **Signup page**: the consent checkbox's "Privacy Policy" reference
  is now a real, working link (opens in a new tab so it doesn't lose
  the in-progress signup form). The exact text stored as the audit
  trail (`pdpa_consent_text`, saved with each signup) is unchanged —
  only the on-page display was updated.
- **Cart guest checkout**: same treatment — added a Privacy Policy
  link to the guest consent text, which didn't reference one before.
- **Footer**: both pages linked from every page on the site.

## Two things intentionally left general — need your input

In the Terms & Conditions, both the **Delivery** and **Returns &
Refunds** sections use general "contact us" language rather than
specific numbers, clearly flagged inline in the page itself. These are
real business decisions (return window, whether opened food/treats
can be returned, who covers return shipping, delivery timeframe) that
I shouldn't set on your behalf. Once you confirm the specifics, I can
tighten this language or split them into their own dedicated pages —
happy to do either.

## A note on legal review

I'm not a lawyer, and this carries real regulatory weight. I've
grounded both documents in your actual data practices rather than
generic templates, but I'd suggest a quick lawyer review before
treating this as final — especially since it's customer-facing legal
text, not internal tooling.

## Verification performed — real browser testing, not just curl

Two of the three places these links needed to appear (the signup form,
the cart's guest checkout form) are client-rendered and genuinely
don't appear in a plain page fetch — caught this and used a real
headless browser to verify properly instead of trusting an
inconclusive result:

- Confirmed both `/privacy` and `/terms` build cleanly as static pages
  and return 200 when fetched for real.
- Confirmed the signup form's consent text has a real, working
  Privacy Policy link — checked with a real browser after the page
  fully loads.
- Confirmed the cart's guest checkout consent text has the same —
  had to seed a real cart item first, since the checkout form (and its
  consent text) only renders once there's something to check out, not
  on an empty cart.
- Confirmed the footer link appears correctly on every page.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   app/cart/page.js
#   app/signup/page.js
#   components/Footer.jsx

# these are NEW files:
#   app/privacy/page.js
#   app/terms/page.js

git add .
git commit -m "Add Privacy Policy and Terms & Conditions pages, link them from signup/checkout consent text and the footer — PDPA/Spam Control Act compliance"
git push origin staging
```
