# Pawvy Website — Bundle Card & Detail Page Refinements

Target branch: **staging**
Repo: `pawvy-website`

**Apply the separate "Pawvy App" zip first** — this depends on its new
`image_url` field in the bundle response.

Addresses points 1, 3, 4, and the website half of 5 from your feedback.

## 1. Description now shows on the card

If a bundle has a description filled in, it now shows right on the
grid card (between the title and the includes list) — not just on the
detail page like before. Still fully optional; a bundle with no
description just skips this line, same as before.

## 3. "Includes" is now a real list, not a joined string

Was rendering as one run-on line — `Includes: Supplement — Plaque
Guard 60g + HOCl — Dental Care 250ml`. Now each product gets its own
row with a bullet point, genuinely easier to scan at a glance.

## 4. Bundle title made bigger and bolder

Was 16px, same weight as a regular product name — didn't read as a
card title at all. Now 20px and bold, clearly distinct from the body
text around it.

## 5. Optional single hero image — website side

Both the grid card and the detail page now check for the bundle's own
`image_url` first. If you've uploaded one in Pawvy App, that single
photo shows instead of the auto-tiled grid of component product
photos. If you haven't, both places fall back to exactly the tiled
display that was already there — nothing breaks or looks different for
a bundle without a custom photo.

Also updated the bundle detail page's share-preview image (what shows
up if someone shares a bundle link on WhatsApp/social) to prefer the
bundle's own photo when set, falling back to the first component's
photo otherwise.

## Verification performed

- Full production build (`npm run build`) — clean, no errors.
- **Real test of the hero-image-vs-tiled-fallback branching logic**,
  covering every real falsy state a value could actually be in
  JavaScript (`null`, `undefined`, empty string) — confirmed all three
  correctly fall back to the tiled display, and only a real populated
  `image_url` triggers the single-hero-image path.
- Confirmed every changed file against the real current
  `origin/staging` (fetched fresh) — exactly 3 files:
  `globals.css`, `ShopClient.jsx`, and the bundle detail page.
- All 3 byte-diffed against what was actually build-tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files, preserving the same paths:
#   app/globals.css
#   components/ShopClient.jsx
#   app/bundles/[id]/page.js

git add .
git commit -m "Bundle card/detail refinements: show description, list-style includes, bigger title, optional single hero image with tiled fallback"
git push origin staging
```

## Worth checking on S-Web once live

- A bundle with a description filled in — should now show on the grid
  card, not just the detail page.
- The includes list — should read as separate bulleted lines, not one
  run-on sentence.
- The bundle title on the card — should look noticeably more like a
  real title now.
- Upload a hero photo to one bundle in Pawvy App, leave another
  without — confirm the first shows the single photo and the second
  still shows the tiled component photos, on both the grid card and
  the detail page.
