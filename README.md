# GiGwi — 11 new SKUs categorized into product cards (Aug 2026 batch)

## This delivery is for the Website folder (`pawvy-website`) only

Only one file changed: `lib/brandContent.js`. Nothing here touches `pawvy-app`.

## What changed

All 11 SKUs from `GiGwi_New_SKU_template.xlsx` added to the GiGwi shop-by-
category browser (`BRAND_CONTENT['GiGwi'].deepDive.browser.tabs`):

| SKU | Category | Card | Change |
|---|---|---|---|
| 4165 | Ball | Orange Tennis Ball | Added as a new **M (D - 6.4CM)** variant on the *existing* group card (per your remark — combined, not a new card) |
| 9131 | Ball | Fox with Spiky Ball | New single card |
| 4109 | Plush | Koala with Backpack | New single card |
| 4425 | Plush | Elephant with Rope Tail | New single card |
| 4426 | Plush | Crocodile with Rope Tail | New single card |
| 4464 | Plush | Giraffe with No Stuffing | New single card |
| 6073 | Plush | Skunk with Sponge Squeaker | New single card |
| 6862 | Plush | Lion Cloth | New single card |
| 9134 | Plush | Fox with Crinkle Paper | New single card |
| 9135 | Plush | Frog with Crinkle Paper | New single card |
| 9127 | Enrichment | Wild Hunter Green Monster | New single card |

## Why these cards won't show up yet — and that's correct

`CategoryBrowser.jsx` already has this exact behavior built in and
commented (`components/CategoryBrowser.jsx`, the `anyMatch` check): a card
whose SKU doesn't match any *active* (`is_active = 1`) product just
doesn't render — it doesn't show as broken or "Unavailable", it's simply
invisible. Since all 11 SKUs are currently Archived in Pawvy App, these
cards will sit invisible on the live site until you flip each one back to
Active once real stock lands in Singapore — at that point they'll appear
automatically, no further code change needed. Confirmed this is genuinely
how the matching logic behaves (read the actual matching code, not
assumed) before relying on it here.

## One assumption I made — please confirm

**`featured: false`** on all 10 new single cards (the Orange Tennis Ball
M variant doesn't have its own `featured` flag — that's set once per
card, and the card is already `featured: true`). Your SKU sheet didn't
specify which of these should launch featured, so I defaulted to
`false` (unfeatured — appears in normal, non-priority order once shown)
rather than guess. If any should launch featured, it's a one-word flip
per card — let me know which ones.

## Verification performed

- Confirmed each of the 11 SKUs appears exactly once across the whole
  GiGwi config (no accidental collision with an existing card's
  `skuPrefix`).
- **Real cold-clone build**: fresh `git clone` of `pawvy-website` → applied
  this exact file → `npm install` → `npm run build` — passed with no
  errors.
- Card counts verified before/after: Ball 12→13, Plush 36→44, Enrichment
  11→12 — matches exactly what was added, nothing missing or duplicated.
- Byte-for-byte diff confirms the file in this zip is the identical file
  that was cold-clone built above (not a re-edited copy).

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's `lib/brandContent.js` into that folder (overwrite),
then:

```bash
git add .
git commit -m "GiGwi: add 11 new SKUs (Aug 2026 batch) to Ball/Plush/Enrichment cards"
git push origin main
```

Railway auto-deploys from `main` — no other steps needed. Since all 11
SKUs are still Archived in Pawvy App, this push is safe to do any time
before the stock actually arrives; nothing will appear on the live site
until you activate each SKU.
