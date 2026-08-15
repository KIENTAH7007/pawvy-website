# Fix: banner must always be full width, no side gaps — corrected approach

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

1 file changed: `app/globals.css`.

## What was wrong with the previous delivery

The last fix capped `max-width` to keep the container at a mathematically
exact 16:9 shape, centering it once a screen was wide enough to hit that
cap. That solved the empty-gap problem in one sense, but created a
worse one: **symmetric empty gaps on both sides**, visible on your own
screenshots comparing what you had vs. what you actually wanted (always
full width, zero gaps).

## The actual fix

Removed the `max-width` cap entirely — the banner is now always
`width: 100%`, full-bleed, no exceptions. Switched `object-fit` from
`contain` back to `cover`, so the image always completely fills the box
rather than leaving empty space when the box's proportions don't exactly
match the image.

**The honest tradeoff**: on an unusually wide monitor, the box (capped
at 70vh tall, but full width) is no longer a perfect 16:9 shape — so
`cover` will trim a little off the left/right edges of the image to
fill it completely. That's a normal, common pattern most hero banners
use, and a much smaller cost than the empty gaps this replaces.

## Verification performed

- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Confirmed the `max-width`/`margin: 0 auto` from the previous delivery
  are completely gone, and `object-fit` is back to `cover`.
- Byte-for-byte diff confirms the file in this zip matches what was
  cold-clone built and tested.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's `app/globals.css` into that folder (overwrite),
then:

```bash
git add .
git commit -m "Fix: banner always full width (no side gaps), accept minor edge cropping on wide screens instead"
git push origin staging
```
