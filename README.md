# Salmoil selector — fix the cream bars for real this time

## What was actually wrong

My last fix set `aspect-ratio: 900/1273` on `.sal-selector-image`, which
was correct — but I'd also left a `max-height: 620px` on it from an
earlier version. That cap fought the aspect-ratio: on a wide screen, the
box's natural aspect-ratio height would be taller than 620px, so the cap
shrank it — but the *width* stayed at 100% of its column. That mismatch
is exactly what caused the side bars: `object-fit: contain` fit the image
to the (too-short) height and centered it, leaving cream showing on both
sides.

## The fix

Removed the `max-height` cap (desktop and the mobile override) entirely.
`aspect-ratio` alone now fully controls the box's height based on its
width, so it stays exactly proportional to your real photos with nothing
fighting it. Since the box ratio now matches the photos exactly, the
image fills edge-to-edge with zero gap.

## File in this patch

- `app/globals.css` — only the two `.sal-selector-image` rules changed
  (desktop and the `max-width: 900px` mobile breakpoint). Nothing else
  touched.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local folder, then:

```bash
git add -A
git commit -m "Fix Salmoil selector image cream bars (remove conflicting max-height)"
git push origin main
```
