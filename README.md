# Pawvy Website — Testimonial Sizing Fix, Nav Wrap Fix, Icon Revert

Target branch: **staging**
Repo: `pawvy-website`

**Important — one file must be deleted, not just overwritten:**

```
rm components/NeedIcon.jsx
```

The SVG icon set is reverted in this patch (see item 3 below), so that
file is no longer used by anything. A zip can only add/overwrite files,
not delete them — if you don't remove it manually, it'll sit there
unused (harmless, but worth cleaning up).

## 1. Testimonial image sizing — now matches your two real reference cards exactly

700×930 was still bigger than it needed to be. Rather than guess again,
I pulled the actual real dimensions from the two cards you pointed to:

- **Single image** (homepage "Customer reviews" card): displays at
  **340×453px** on screen. `.testi-img-wrap` (single) now uses the exact
  same `aspect-ratio: 3/4` as that card, not a separate invented value.
- **Before/after** (Lillidale's existing before/after cards): these
  don't use aspect-ratio at all — they're a **fixed 340px height**, with
  the two photos splitting the width 50/50 (`.lil-ba-split`). Your
  Shop-by-Need testimonial split now uses that exact same pattern
  instead of my earlier "two 3:4 portraits side by side" approach,
  which is why it read as too tall/big before.

**Updated recommended upload sizes** (also reflected in the Pawvy App
hint text — see the separate pawvy-app zip):
- Single image only: **~500×667px**
- Before/after, each photo: **~350×640px** (tall and narrow — matches
  Lillidale's real proportions, not a portrait 3:4 shape)

## 2. "Shop by Need" nav wrapping into 2 lines — fixed

Real cause: the link's text had no `white-space: nowrap`, so once the
nav row got tight (adding a 3-word item pushed it over), the text
wrapped inside its own link instead of the row simply getting snug.
Added `white-space: nowrap` to all nav links (good practice generally,
not just this one) and trimmed the gap between items slightly
(34px → 26px) to give the new item room without anything else feeling
cramped.

## 3. SVG icons reverted, 3 new style options for you to review first

Reverted `lib/needTags.js`, `app/page.js`, and `components/ShopClient.jsx`
back to the emoji icons from before — same as they were prior to that
delivery. **Don't forget to also delete `components/NeedIcon.jsx`** (see
the note at the top of this README).

Attached a new mockup (`pawvy-icon-options-v2.html`) with **3 genuinely
different style directions**, not just tweaked shapes — same 8 concepts
throughout (bone, blue/yellow puzzle piece, stomach, bowl-with-food,
tooth, bathtub-with-bubbles, two crossing bones), rendered three ways:

1. **Filled solid** — bold single-color silhouettes, classic app-icon feel.
2. **Outlined line** — 2px stroke outlines, more minimal/modern.
3. **Duotone** — soft tinted circle background + solid accent icon on
   top, more dimensional, common on premium wellness brand sites.

No code changes for this yet — take a look, tell me a direction (or
mix-and-match specific icons across options if something in particular
stands out), and I'll refine and implement from there.

## Verification performed

- Full production build (`npm run build`) after every change — clean,
  no errors.
- Confirmed the real pixel dimensions of both reference cards directly
  from the actual CSS/computed values (340×453 for the homepage card,
  185×340 per half for the Lillidale card, computed from the site's
  real 1240px `.wrap` container width) rather than estimating from the
  screenshots alone.
- Confirmed every file changed this round against the real current
  `origin/staging` (fetched fresh) — exactly 4 files:
  `globals.css`, `page.js`, `ShopClient.jsx`, `needTags.js`.
- All 4 files byte-diffed against what was actually build-tested —
  identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# delete this file (see note at top):
rm components/NeedIcon.jsx

# then copy/overwrite these files, preserving the same paths:
#   app/globals.css
#   app/page.js
#   components/ShopClient.jsx
#   lib/needTags.js

git add .
git commit -m "Fix testimonial image sizing to match real reference cards exactly, fix nav wrap on Shop by Need, revert SVG icons pending style decision"
git push origin staging
```

## Worth checking on S-Web once live

- A testimonial with 1 photo — should look proportioned like the
  homepage's customer-review cards.
- A testimonial with 2 photos — should look like Lillidale's existing
  before/after cards (shorter, wider halves, not tall portraits).
- Hover "Shop by Need" in the nav at your normal browser width — should
  stay on one line now.
- Icons back to the original emoji set — open the attached mockup file
  and let me know which style direction to build next.
