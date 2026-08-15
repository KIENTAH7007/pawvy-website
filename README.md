# Fix: empty gap beside the banner on wide monitors

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

1 file changed: `app/globals.css`.

## What was wrong

The previous fix (capping the banner's height so the ticker fits in the
first screen) capped `max-height` but left `width: 100%` unconstrained.
On a wide monitor, those two together no longer add up to a true 16:9
shape — the container was wider than a real 16:9 box at that height, so
`object-fit: contain` had to add empty space on the side to avoid either
stretching or cropping the actual image. That's the gap you saw.

## The fix

Added a matching `max-width`, calculated directly from the height cap
(`70vh * 16 / 9`) — so the container itself always stays a genuine 16:9
shape, at any screen size. Once a screen is wide enough to hit that cap,
the banner is centered (`margin: 0 auto`) instead of stretching further
and creating empty space.

Practical effect: on most standard desktop monitors (not just ultra-wide
ones), the banner will now typically show as a centered, properly-
proportioned box rather than stretching full-bleed edge-to-edge — this
is expected and correct, not a regression. It's what actually makes
"nav + banner + ticker fit in the first screen, with no ugly gaps"
possible at the same time.

## Verification performed

- Traced the math by hand: confirmed the max-width is always exactly
  proportional to the max-height, so the container can never end up
  wider-than-16:9 relative to its own height again.
- Confirmed the tablet and mobile breakpoints explicitly reset
  `max-width: none` alongside their existing `max-height: none`, so this
  fix only affects the desktop tier — nothing changes for phones or
  tablets.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
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
git commit -m "Fix empty gap beside banner on wide monitors — cap width proportionally to the height cap"
git push origin staging
```
