# TEMPORARY: diagnostic badge to find the real Fold 7 issue

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`. Remove this once we've found the real answer — see below.

2 files changed: `app/globals.css`, `app/page.js`.

## Why this exists

Checked real specs: the Fold 7's unfolded viewport (883-984px depending
on source) should land correctly within the tablet tier (761-1024px) —
so on paper, your Fold 7 should already be showing the tablet image, not
mobile. Ruled out caching too (confirmed via hard refresh/incognito).
Since the numbers say it should work but your actual device says
otherwise, the fastest way to find the real answer is to see exactly
what your device reports, directly — not guess from research further.

## What this does

A small colored badge pinned near the top of the homepage, showing
literally which breakpoint tier the page currently thinks it's in —
using the *exact same* media queries as the real `<picture>` element,
so it's testing the identical mechanism, not a simplified stand-in:

- 🔵 Blue = "DESKTOP tier"
- 🟢 Green = "TABLET tier"
- 🔴 Red = "MOBILE tier"

## What I need from you

Once this is deployed to staging, open S-Web on the Fold 7, **unfolded**,
and send me a screenshot showing the badge. Whatever color/text it shows
is the real, ground-truth answer — from there I can fix the actual
breakpoint value precisely, instead of continuing to guess from generic
spec research.

## Verification performed

- Tested the badge itself in a real browser at the exact widths in
  question (984px and 883px — both real numbers found for the Fold 7)
  and confirmed it correctly shows "TABLET tier" at both, plus correctly
  shows "MOBILE" at 700px and "DESKTOP" at 1200px as a sanity check on
  the mechanism itself.
- Real cold-clone build: fresh `git clone` → applied both files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms both files in this zip match what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "TEMP: add diagnostic tier badge to find real Fold 7 breakpoint value"
git push origin staging
```

Once we've got the answer from your screenshot, I'll send a follow-up
delivery that both fixes the real breakpoint AND removes this badge.
