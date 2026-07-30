# Pawvy Website — patch: remove hero photo, fix marquee color + position

## What changed

1. **Hero background photo removed** — back to plain navy + morphing blobs, no
   photo. Deleted the `<img>` element in `app/page.js` and the now-unused
   `.hero-bg-photo` CSS. (`public/hero-bg.jpg` itself is left in place, just
   unreferenced — harmless to leave, or delete it yourself if you want the repo
   tidy.)

2. **Marquee ticker back to orange** (`#F36F4A`), reverted from the cream
   experiment.

3. **Marquee position fixed** — found the actual bug: the marquee ticker was
   nested *inside* the hero `<section>` (not a separate section after it), and
   since the hero has `min-height: 100vh`, the ticker was landing partway down
   the hero rather than at its bottom edge — which is exactly why the photo
   (when it was there) kept showing below the ticker.

   Fixed with a standard flexbox technique: the headline block now has
   `margin-top: auto; margin-bottom: auto`, which self-centers it in the space
   *above* the ticker, while the ticker sits flush against the very bottom
   edge of the hero section. No structural HTML changes needed for this part —
   just the two CSS lines.

### Files touched
- `app/page.js` — removed hero background photo `<img>`
- `app/globals.css` — marquee color reverted, hero-inner auto-margin centering
  fix, removed unused `.hero-bg-photo`

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes generated successfully.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Remove hero background photo, revert marquee to orange, fix marquee position"
git push origin main
```
Railway auto-deploys from `main` on push.
