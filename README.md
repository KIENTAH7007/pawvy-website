# Pawvy Website — Terms & Conditions: Real Delivery/Returns Specifics

Target branch: **staging** (this is on top of the privacy/terms pages already patched there)
Repo: `pawvy-website`

Replaces the two flagged placeholder sections with your confirmed real
policy:

- **Delivery**: orders mailed out within 2 working days of confirmation.
- **Returns**: 7-day return window from purchase (explicitly tied to
  the same 7-day BUTTONS hold period, so the policy explains itself
  rather than looking like an arbitrary number). Unopened items
  returnable in that window; opened food/treats only for exchange if
  spoilt, with evidence requested.

Also removed the now-resolved "Flagging for KT" placeholder boxes and
the CSS style constant that only existed to render them.

## Verification performed

- Full production build — clean.
- Real fetched page, confirmed the new specific text renders correctly
  ("7 days of purchase", "2 working days", the spoilt/evidence
  language) and confirmed the old placeholder flags are completely
  gone.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   app/terms/page.js

git add .
git commit -m "Fill in real Delivery/Returns specifics in Terms & Conditions"
git push origin staging
```
