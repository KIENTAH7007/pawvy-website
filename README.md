# GiGwi cards — always show your Excel name, always navy button

## Root cause

Grouped cards were built from scratch and correctly showed `card.name`
(your Excel's Card Name column). Single-SKU cards, though, were reusing
the site's shared `ProductCard` component — the same one the main `/shop`
page uses — which always shows the raw `item_series` straight from the
database (SKU code, vendor name, and all). That's why "Red/Purple
Signature Ball" (your curated name) sat right next to "3019 SkipDawg —
Neon Glow Ball" (raw database text) on the same row. Same root cause
explained the button color mismatch: `ProductCard` uses the sitewide
orange `.add-btn`, while the grouped cards used `ProductAddButton`'s navy
`.fit-add-btn`.

## The fix

Single and grouped cards now render through the exact same code path — a
single card is treated as a "group" with one variant. Concretely:

- Every card always displays `card.name` (your Excel name) as the title.
  `item_series` is never shown to the customer here.
- Every card always uses `ProductAddButton`, so every button is the same
  navy `.fit-add-btn` — a single real variant skips straight to Add to
  Cart with no picker popup, so there's no behavior change for those,
  just the button color.
- This only affects GiGwi's category browser. `ProductCard` itself is
  untouched, so the main `/shop` page and every other brand's grid still
  look exactly as they did.

As you already suspected: the cart record was never affected by any of
this — it's always tied to the real matched product (its real
`item_series`, `id`, price), regardless of what label the card displays.
This was purely a display-layer fix.

## File in this patch

- `components/CategoryBrowser.jsx` — complete file. Removed the
  `ProductCard`/`useCart` imports (no longer needed — `ProductAddButton`
  handles its own cart access), merged the single-card and group-card
  render paths into one `GiGwiCard` component.

## Verified locally

- `npm run build` — clean.
- SSR smoke test using fabricated products with a deliberately "wrong"
  raw `item_series` (mimicking what you saw — vendor name baked in) to
  confirm the fix actually holds: the raw text never appears anywhere on
  the page, your Excel names show for every card (single and grouped),
  and all 12 rendered buttons use the navy `.fit-add-btn` class with zero
  instances of the orange `.add-btn`.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local folder, then:

```bash
git add -A
git commit -m "Fix GiGwi card naming/button color: always use Excel name, always navy Add to Cart"
git push origin main
```
