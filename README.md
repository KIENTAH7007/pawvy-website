# Fix: banner width shrinking on desktop — root cause confirmed in a real browser

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

1 file changed: `app/globals.css`.

## The real root cause, proven — not theorized

Your screenshot showing a persistent right-side gap even after the
previous "fix full width" delivery meant that delivery hadn't actually
addressed the real mechanism. Rather than guess again, I installed a
real Chromium browser (via Playwright) and directly measured what the
CSS actually produces.

**Confirmed the bug directly**: with `aspect-ratio: 16/9` and
`max-height: 70vh` set together, but no *explicit* `width` on the
element, real Chromium was deriving the width FROM the capped height —
shrinking the container to match the aspect ratio at that reduced
height, rather than keeping it at full width. Measured exactly:

```
Viewport: 1920px wide, 900px tall
Without explicit width: container = 1120px wide (58.3% — the bug)
With explicit width:100%: container = 1920px wide (100% — correct)
```

1120px is exactly `630px × 16/9` (630px being 70% of the 900px
viewport height) — direct proof the browser was computing width from
the capped height, not the other way around.

## The fix

Added an explicit `width: 100%` to `.banner-carousel`. An explicit width
always takes priority over one derived from `aspect-ratio` — this
removes the ambiguity entirely rather than hoping the browser resolves
it the way I expected.

## Verification performed

- Real, measured proof in an actual Chromium browser (not just a build
  pass): reproduced the exact bug with the previous CSS, then confirmed
  the fix resolves it, both with real pixel measurements.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms the file in this zip is identical to the
  exact CSS already measured and confirmed correct in the browser test
  above.

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
git commit -m "Fix: banner width shrinking on desktop — add explicit width:100%, confirmed in real browser"
git push origin staging
```
