# Modal reorder + compact mobile grid patch (+ status on the nav bug)

## 1. Fixed — ProJoint/ProHealth modal size order

Display order is now 200g / 500g / 2kg. 500g stays pre-selected and stays
the default card photo (before you tap Add to Cart) — I didn't want
reordering the display to silently change which size/photo shows by
default, so I added a `default: true` flag on the 500g variant in the data
and taught `ProductAddButton.jsx` to prefer that flagged variant for the
initial selection, falling back to "first in stock" the way it always did
if nothing's flagged. This only affects Lillidale's cards — Puzzle
Feeder/Eastsea Brother's explicit-variant cards don't use `default` and
behave exactly as before.

## 2. Fixed — 2 columns on compact mobile

`.pf-fit-grid` (the shared shop-grid class every brand's Add to Cart cards
use) now shows 2 columns below 620px instead of collapsing to 1. Wide
mobile (620–900px, already 2 columns) and desktop (3 columns) are
untouched, per your "others are all okay" note. Added a bit of extra
tightening below 460px (smaller gap, smaller card text) so 2-up doesn't
feel cramped on the narrowest phones.

Since this is the shared class, it also affects BetterBone/Puzzle
Feeder/Eastsea Brother's cards the same way — worth a quick look at those
too after deploy, though the change is small (column count + spacing
only).

## 3. Not fixed yet — the stuck hamburger menu

I wasn't able to reproduce or diagnose this one with confidence, and I'd
rather say so than guess-patch the site's global nav — a wrong guess there
risks breaking navigation everywhere, not just Lillidale.

What I checked: `Nav.jsx`'s mobile drawer code looks structurally correct
— it renders Home, Shop (with all 6 brand links), Stockist, Contact, Blog,
and login/account, and closes on route change or overlay click. I tried
to actually load a real brand page locally to watch it happen, but the
site needs your live Railway backend to server-render `/brands/[slug]`
(it fetches real product/brand data on every request), and my sandbox
can't reach that — so I could only review the code, not reproduce the bug.

To actually fix this I'd need a bit more to go on — whichever of these you
can grab would help a lot:
- Does it happen on **every** brand page, or specifically Lillidale?
- Does it happen on non-brand pages too (home, shop, stockist)?
- What device/browser, and roughly what screen width?
- A short screen recording of it happening, if easy to grab — that would
  probably let me spot it immediately from the code.

## Files in this patch (all complete files)

- `components/ProductAddButton.jsx` — added the `default` flag support to
  `findMatches`'s caller (small, backwards-compatible; other brands
  unaffected).
- `components/BrandDeepDive.jsx` — card cover photo now also respects the
  `default` flag instead of always using the first array item.
- `lib/brandContent.js` — only the `Lillidale` entry changed (variant
  order + `default: true` flags).
- `app/globals.css` — only the `.pf-fit-grid` responsive rules changed.

No images in this patch — nothing to re-add there.

## Verified locally

- `npm run build` — clean.
- SSR smoke test confirms: ProJoint/ProHealth cards still show the 500g
  photo by default despite the new 200g/500g/2kg display order, and no
  new "Unavailable" states introduced.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local folder, then:

```bash
git add -A
git commit -m "Reorder Lillidale size picker, 2-col compact mobile grid"
git push origin main
```
