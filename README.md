# Archived SKUs disappearing instead of showing "Unavailable" + shop hero text fix

## 1. Fixed — archiving a GiGwi SKU now removes its card, not "Unavailable"

Root cause: a card with zero matching live products used to render a
permanent disabled "Unavailable" placeholder. That was meant as a
build-time signal ("this shouldn't happen, go check the matching"), but
it's the wrong behavior for the ongoing lifecycle — an intentionally
archived SKU will *always* fail to match, forever, so it would sit on the
page permanently looking broken instead of just being gone.

Now: a single-product card with no live match, or a grouped card where
*every* size has no live match, simply doesn't render. A grouped card
where *some* sizes are still live keeps showing, with just the archived
size disabled and labeled "(unavailable)" inside the picker — that part
was already correct, built into `ProductAddButton.jsx` from an earlier
brand, no change needed there.

One tradeoff worth knowing: this also means a genuine matching bug (SKU
still exists in the Pawvy App, but the text match failed) now looks
identical to an intentionally archived product — the card just quietly
doesn't appear either way. That's why the click-through ask in the last
README matters: it's the only way to catch "silently missing because of
a real bug" versus "silently missing because you archived it on purpose".

## 2. Fixed — Shop page hero text was unreadable

`.shop-hero h1` had an explicit cream color set, but the paragraph right
under it ("Every product, across all six brands...") never got a color
rule, so it fell back to the default dark body text — invisible against
the navy hero background. Added `.shop-hero-inner p` with a light color.
This affects the main /shop page only, not any brand page.

## Files in this patch

- `components/CategoryBrowser.jsx` — only the single-card and group-card
  rendering logic changed (skip instead of placeholder). Matching logic
  itself, the shuffle, and the tab switching are untouched.
- `app/globals.css` — one new rule, `.shop-hero-inner p`. Nothing else
  touched.

## Verified locally

- `npm run build` — clean.
- Direct test of the exact scenario you hit: a SKU with no matching
  product in the live list now resolves to `null` and the card doesn't
  render, while a SKU that's still live continues to resolve and show
  normally.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local folder, then:

```bash
git add -A
git commit -m "Hide archived GiGwi SKUs instead of showing Unavailable, fix shop hero text color"
git push origin main
```
