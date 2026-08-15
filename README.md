# Give the banner more room — precise calculation instead of a 70% guess

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

1 file changed: `app/globals.css`.

## Answering your actual question

The stats section (200+ Products, etc.) is **not** part of the ticker —
it's a separate section that just happens to come right after it in the
page. It was only visible in the first screen because the previous fix
used a conservative `70vh` guess for the banner's max height, which left
extra unused space that the stats section happened to peek into — not
because anything was deliberately reserving room for it.

## The fix — measured precisely, not guessed

Confirmed in a real browser that the nav bar is `position: fixed`,
meaning it floats over the page rather than taking up space in the
normal flow — so the banner doesn't actually need to leave room for it.
The only thing genuinely competing for space in that first screen is the
ticker. Measured its real height directly: **~60px**.

Changed the banner's height cap from a flat `70vh` guess to
`calc(100vh - 60px)` — precisely "the full screen, minus exactly what
the ticker needs." Confirmed directly in a real browser: the banner now
takes up meaningfully more vertical space (on a 900px-tall test
viewport, height went from 630px to 840px), and the stats section starts
at almost exactly the very bottom edge of the screen — not visible until
you scroll, and not needlessly wasting space either.

## Verification performed

- Measured the ticker's real rendered height in an actual Chromium
  browser rather than estimating from padding/font-size.
- Real end-to-end render test: banner + ticker + stats section together,
  confirmed the banner is genuinely wider/taller than before, confirmed
  the stats section's top edge lands within a pixel of the viewport's
  bottom edge (899.6px of 900px) — no meaningful part of it visible
  without scrolling.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff (explicit absolute paths, double-checked) confirms
  the file in this zip is identical to what was measured and tested.

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
git commit -m "Give banner more height — precise calc(100vh - ticker height) instead of a 70vh guess"
git push origin staging
```
