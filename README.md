# Desktop banner ratio: 16:7 → 16:8

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

1 file changed: `app/globals.css`.

## What changed

Desktop banner container is now `aspect-ratio: 16 / 8` instead of
`16 / 7` — a bit taller, giving more room for design safe-zones (like
clearing the fixed nav bar) while still keeping the ticker visible
without scrolling on the most common resolutions.

## Real measured trade-off

```
1920x1080 (very common):                    fits, no scroll
1920x900  (browser window, not fullscreen): needs 120px scroll
1440x900  (common laptop):                  fits, no scroll
2560x1080 (ultra-wide monitor):             needs 260px scroll
```

Fits 2 of the 4 common sizes tested — a middle ground between 16:7
(fits 3 of 4, but tighter for design safe-zones) and the original 16:9
(fits 1 of 4).

## Verification performed

- Real browser measurement across the same 4 viewport sizes tested
  throughout this whole process, confirming the actual rendered result
  matches the math exactly.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms the file in this zip matches what was
  cold-clone built and tested above.

## To apply

Apply together with the companion App-side delivery.

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
git commit -m "Desktop banner: change aspect ratio to 16:8, more room for nav-bar safe zone"
git push origin staging
```

Once live, upload new 1920×960px (16:8) desktop images via S-App,
keeping critical content at least 90-100px from the top edge to clear
the nav bar.
