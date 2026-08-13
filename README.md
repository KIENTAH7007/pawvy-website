# Out-of-stock product cards sink to the bottom — dedicated brand pages

## This delivery is for the Website folder (`pawvy-website`) only

2 files changed: `components/CategoryBrowser.jsx`, `components/BrandDeepDive.jsx`.

## The actual rule (per your clarification)

A product card only sinks to the bottom once **every** variant inside it
is out of stock — a card with two sizes where only one is sold out stays
in its normal position. This applies whether the card has one SKU or
several.

## Two genuinely different systems, both covered

**GiGwi** (`CategoryBrowser.jsx`) already had a New → Featured →
Alphabetical sort from earlier work. Out-of-stock is now a higher-priority
partition on top of that — the existing New/Featured/Alphabetical logic
runs identically within the in-stock group and again within the
all-OOS group, so a genuinely new arrival that happens to be sold out
still sorts sensibly among other OOS cards rather than the New/Featured
logic just disappearing for that tier.

**The other 5 brands** (Better Bone, Lillidale, Puzzle Feeder, East Sea
Brother, Salmoil) use a different, simpler content structure
(`fitCards`/`fitCardGroups` in `lib/brandContent.js`) that never had any
dynamic sorting at all — cards just rendered in whatever order they were
declared in. This delivery adds *only* the out-of-stock rule to those,
deliberately not inventing a new sort scheme nobody asked for. Applied
to:
- `fitCards.items` (Puzzle Feeder, East Sea Brother — flat list)
- Each group's `items` inside `fitCardGroups` (Lillidale, Salmoil —
  sorted independently within each sub-section like "Supplements",
  never mixed across sections)

**Better Bone specifically has no applicable cards** — its product page
uses a fixed 3-option durability-level selector (Soft/Moderate/Hard),
not a browsable grid of independent products. There's nothing to sort
there; flagging this so it's clear it wasn't missed, just doesn't apply.

## Verification performed

- Real logic test (pure re-implementation of both exact algorithms, run
  against synthetic data) confirming:
  - GiGwi: a two-size card with one size out and one available correctly
    stays in the in-stock tier, not sunk
  - GiGwi: a fully out-of-stock single-SKU card and a fully out-of-stock
    multi-size card both correctly sink
  - The other-brands algorithm: a partial-OOS item stays in place, a
    fully-OOS item sinks to the end, a fully-available item is
    unaffected
- Real cold-clone build: fresh `git clone` → applied both files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms both files in this zip match what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "Sink out-of-stock product cards to the bottom on brand pages (only when ALL variants are OOS)"
git push origin main
```

Railway auto-deploys from `main`. Apply together with the companion
App-side delivery (Shop grid, POS, Order Portal) for the full picture.
