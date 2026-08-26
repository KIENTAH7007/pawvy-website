# Pawvy Website — Need Card Icons Enlarged, Nav Dropdown, Custom Icon Set

Target branch: **staging**
Repo: `pawvy-website`

Covers points 1, 3, 4, 5 from your feedback (#2 intentionally skipped
per your note).

## 1. (Sizing question — answered in chat, no code change needed here)

Homepage testimonial cards display at **340×453px** (3:4 portrait) on
screen. Recommended upload size reduced to 700×930px (see the separate
pawvy-app zip) — 900×1200 was larger than necessary.

## 3. Need card icons enlarged 15%

Desktop icon size: 44px → 50px, card size unchanged as asked
(`app/globals.css`).

## 4. Nav "Shop by Need" now has a hover dropdown

Same pattern as the existing "Shop" brand dropdown — hover to see all 8
categories, click any to go straight to that filtered Shop-by-Need page.
Done for both desktop hover and the mobile drawer (collapsible submenu,
same as the existing mobile Shop submenu). `components/Nav.jsx`.

## 5. Custom icon set (Chew, Enrichment, Gut, Food, Grooming, Joint)

Built as real SVG icons rather than emoji — `components/NeedIcon.jsx`.
Emoji couldn't reliably represent what you asked for (there's no
"two bones joined" or "bathtub with bubbles" emoji, and rendering
varies by device/OS anyway), so this is a proper small custom icon
component instead:

- **Chew** → single bone silhouette.
- **Enrichment** → puzzle piece (kept the shape, per your note that it's
  the color you wanted changed, not the concept) — now blue-to-yellow
  gradient fill instead of the previous emoji's default coloring.
- **Gut** → rounded stomach-organ silhouette.
- **Food** → bowl with a small mound of food/kibble inside.
- **Dental** → tooth (unchanged concept, now same SVG style as the rest).
- **Grooming** → bathtub outline with bubbles above.
- **Joint** → two bone shapes crossing at an angle, visually distinct
  from the single Chew bone.
- **Skin & Coat** → kept the sparkle concept (not flagged for change),
  same SVG treatment for visual consistency with the other seven.

Icons render in the site's orange accent color, matching the rest of
the design system. Used on both the homepage need cards and the Shop
sidebar's Need filter chips — one component, two places, so they can
never drift apart from each other.

**Worth knowing:** these are a first pass at the shapes you described,
hand-built as simple geometric SVGs rather than professionally
illustrated icons. If anything doesn't read clearly at actual size once
you see it live, easy to adjust — just let me know which one and what's
off.

## Verification performed

- Full production build (`npm run build`) — clean, no errors.
- Confirmed every file changed this round against the real current
  `origin/staging` (fetched fresh) — exactly 6 files: `globals.css`,
  `page.js`, `Nav.jsx`, `ShopClient.jsx`, `needTags.js`, and the new
  `NeedIcon.jsx`. Nothing else was touched.
- All 6 files byte-diffed against what was actually build-tested —
  identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files, preserving the same paths:
#   app/globals.css
#   app/page.js
#   components/Nav.jsx
#   components/ShopClient.jsx
#   components/NeedIcon.jsx   <-- NEW FILE
#   lib/needTags.js

git add .
git commit -m "Enlarge need card icons 15% on desktop, add Shop by Need nav dropdown, replace emoji with custom SVG icon set"
git push origin staging
```

## Worth checking on S-Web once live

- Hover "Shop by Need" in the nav — dropdown with all 8 categories
  should appear, same feel as hovering "Shop".
- Homepage need cards — icons should look noticeably bigger than
  before, cards themselves the same size.
- Take a look at all 8 icons at actual size, especially Joint (two
  crossing bones) and Grooming (bathtub + bubbles) since those are the
  most custom shapes — flag anything that doesn't read clearly.
