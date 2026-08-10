# GiGwi — Product Cards now sort New → Featured → Alphabetical

## This delivery is for the Website folder (`pawvy-website`) only

Only one file changed: `components/CategoryBrowser.jsx`.

## What changed

The GiGwi brand page's "Shop by category" product cards previously sorted
**Featured (shuffled) → declaration order**. Worth flagging: the
non-featured tier was never actually alphabetical before this — it just
followed whatever row order the cards happened to be listed in inside
`lib/brandContent.js` (which loosely traces back to your original SKU
sheet), not a real sort. This delivery makes it genuinely three tiers:

1. **New** — any card with a currently `is_new_active` product (the same
   flag that already drives the "New" badge on the card itself), sorted
   alphabetically
2. **Featured** — unchanged behavior, still reshuffled fresh on every
   page load
3. **Everything else** — now genuinely alphabetical by card name (this
   part is the actual fix vs. before)

**A card that's both New and Featured lands in the New tier**, not
duplicated in both — otherwise a brand-new SKU you also mark Featured
would get buried back into the shuffled Featured group instead of
leading the page, which defeats the point of the New tier.

Cards for archived/unmatched SKUs are still completely excluded, same as
before (unchanged behavior) — this was already handled correctly and
untouched by this change.

## Verification performed

- **Real cold-clone build**: fresh `git clone` → applied this file (+ the
  GiGwi 11-SKU delivery from earlier, so both are tested together as
  they'll actually ship) → `npm install` → `npm run build` — passed with
  no errors.
- **Real logic test** (pure re-implementation of the exact ordering code,
  run against synthetic cards) confirming:
  - New tier sorts alphabetically
  - A card that's both New and Featured lands in the New tier only, not
    duplicated
  - The "everything else" tier is genuinely alphabetical now
  - A card with no matching active product is still correctly excluded
    entirely (not shown broken)
- Byte-for-byte diff confirms the file in this zip is the identical file
  that was cold-clone built above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's `components/CategoryBrowser.jsx` into that folder
(overwrite), then:

```bash
git add .
git commit -m "GiGwi: sort product cards New -> Featured -> Alphabetical"
git push origin main
```

Railway auto-deploys from `main` — no other steps needed. This is safe to
apply independently of the "11 New SKUs" delivery — once you activate
any of those 11 SKUs later, they'll automatically show with the New
badge and sort to the top, no further changes needed here.
