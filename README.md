# TEST #2: max-height:none on desktop (reverting test #1 entirely)

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`. Replaces the max-width + auto-color delivery entirely —
## that whole approach is reverted, not layered on top of.

2 files changed: `app/globals.css`, `components/HomepageBanner.jsx`.

## What changed

- **Fully reverted test #1**: no more `.banner-carousel-inner`, no more
  `max-width`, no more the whole color-detection `useEffect` — back to a
  single `<section className="banner-carousel">`, exactly as it was
  before that experiment began.
- **New test #2**: desktop now uses `max-height: none`, same as
  mobile/tablet already had. No height cap at all — the banner is always
  a genuine, uncropped 16:9 shape, full width, guaranteed zero cropping
  ever (same guarantee mobile/tablet already had).

## Real trade-off — measured, not assumed

This brings back the original problem the height cap was built to solve.
Measured directly in a real browser across common screen sizes:

```
1920x1080 (very common desktop resolution): needs 60px scroll for ticker
1920x900  (browser window, not fullscreen): needs 240px scroll
1440x900  (common laptop resolution):        fits fine, no scroll
2560x1080 (ultra-wide monitor):              needs 420px scroll
```

Worth being direct about: 1920x1080 is one of the single most common
desktop resolutions in general use, and it already needs some scroll
under this approach — this isn't only an unusual-monitor problem.

## Verification performed

- Real cold-clone build: fresh `git clone` → applied both files →
  `npm install` → `npm run build` — passed with no errors.
- Real browser measurement across 4 common viewport sizes, quoted above.
- Confirmed no leftover references to the removed color-detection state
  or the two-layer structure anywhere in either file.
- Byte-for-byte diff confirms both files in this zip match what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite — this replaces
the max-width test entirely), then:

```bash
git add .
git commit -m "TEST #2: max-height:none on desktop, revert max-width + color-blend experiment entirely"
git push origin staging
```
