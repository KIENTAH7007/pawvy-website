# Tweak: Instagram grid — 5 columns → 4, staying at the standard site width

## What changed (1 file, 1 line)

### `app/globals.css`
`.ig-grid` — `grid-template-columns` changed from `repeat(5,1fr)` to
`repeat(4,1fr)`. That's it.

(My first attempt at this also widened the section's container to
push the size increase further — you asked me to drop that in favor
of keeping everything visually consistent with the rest of the site,
so this version does exactly that. `app/page.js`, which had the
container-widening class in that first attempt, is back to matching
what's already deployed — no change needed there at all.)

## The result
- Before (5 columns): ~219px per box
- After (4 columns, same standard 1240px width as every other
  section): ~278px per box — **+27% bigger**, with zero risk of this
  section looking out of step with the hero, stats, brand gallery, or
  anything else on the page, at any screen width.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  cold-clone simulation.
- Confirmed the box-size math directly against the real CSS values.
- Confirmed no other file actually needed to change — `app/page.js`
  is identical to what's already live.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Instagram grid: 5 columns to 4, staying at standard site width"`
6. `git push origin main`
