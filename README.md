# Eastsea Brother — swatch hex colors + half-pack design (Option B)

**Note**: this delivery is fully self-contained (complete files, not a
patch) — if you've already applied the earlier Eastsea Brother
delivery (font-weight sweep, Pollack Stick split, etc.), re-applying
this one is harmless; it just adds the two things below on top. If you
haven't applied that one yet, this single zip has everything.

## What changed (4 files)

### 1. `lib/brandContent.js`
- **Swatch hex colors** updated to your exact values: Pollack
  `#6FA6C9`, Salmon `#F1ABB5`, Flatfish `#F1BD83`, Capelin `#02A88F`,
  Sandlance `#B683C6`, Pollack Stick `#DBBE55`, Green Lipped Mussels
  `#314249`. Every size variant within one fish keeps that fish's
  color (a size isn't a different color) — verified each card's
  variants all share exactly one hex.
- **`halfPack: true` flag** added to the three smaller-size variants:
  Pollack 60g, Salmon 55g, Flatfish 55g. This is what the new visual
  treatment (below) hooks into. Their full-size siblings (125g/120g/
  110g) are untouched.

### 2. `components/FitCard.jsx` — Option B implemented
Any variant flagged `halfPack: true` now renders as a **half-filled
circle** instead of a plain solid dot — the same color as its
full-size sibling, just half of it, with the card's own cream
background showing through the other half via a hard-stop CSS
gradient. No new image/asset needed, purely CSS.

This component is shared with Puzzle Feeder (both brands use the same
"Find the one" card shape) — Puzzle Feeder's variants never set
`halfPack`, so nothing changes there; confirmed this directly rather
than assuming.

### 3. `app/globals.css`
New `.pf-swatch-half` rule — a very slightly stronger outline than the
plain swatch, since half the fill is transparent and needed a touch
more definition to still read clearly as a selectable dot. Also
contains the earlier font-weight 800→600 sweep from the previous
delivery, unchanged.

### 4. `app/cart/page.js`
Unchanged from what's already deployed (confirmed via a fresh clone
diff) — included for a fully self-contained delivery, this file is a
no-op if applied.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Real checks against the actual data: confirmed the `halfPack` flag
  sits on exactly the right 3 variants (not their full-size siblings,
  not any of the single-variant cards like Capelin/Sandlance/Pollack
  Stick/Green Lipped Mussels, which have no "half" concept at all),
  confirmed each half-pack variant's hex still matches its full-size
  sibling exactly (same fish = same color, just half-rendered),
  confirmed the real backend matching fields (`seriesIncludes` etc.)
  on those variants are untouched by this change.
- Confirmed Puzzle Feeder's cards (sharing the same `FitCard.jsx`
  component) are entirely unaffected — no variant there has `halfPack`
  set, so the conditional class/style logic evaluates to exactly the
  same plain swatch as before.
- Re-ran the core data checks against a genuine fresh `git clone` with
  this delivery applied, not just my working copy — all pass there
  too, and confirmed the earlier hex-color and Pollack Stick changes
  are still present alongside the new half-pack ones.

## Not yet verified
No live browser access from this sandbox — worth a visual check once
deployed to confirm the half-circle swatches read clearly at their
small size (18px) and look like an intentional design choice rather
than a rendering glitch, especially on the lighter colors (Pollack's
blue, Flatfish's orange) where the transparent half might be less
obviously "cut off" than on the darker Green Lipped Mussels color (not
that this one needs the treatment, single-variant card).

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Eastsea Brother: swatch hex colors + half-pack half-circle design"`
6. `git push origin main`
