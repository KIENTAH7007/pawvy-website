# Desktop banner ratio: 16:9 → 16:7

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

1 file changed: `app/globals.css`.

## What changed

The desktop banner's container shape is now `aspect-ratio: 16 / 7`
instead of `16 / 9`. Only the desktop tier — mobile (2:3) and tablet
(4:3) are untouched, unaffected by this.

## Why this actually needed a code change

The container's shape is set in CSS, independent of whatever image gets
uploaded — `object-fit: cover` always scales/crops any image to fill
whatever shape the CSS defines. Uploading a 16:7 image without this
change would have kept the container at 16:9 and just cropped the new
image to fit that same shape; the banner's height wouldn't have changed
at all. Now that the container itself is 16:7, a real 16:7 image will
display close to its natural shape rather than fighting against a
mismatched box.

## Verification performed

- Real browser test across the same 4 common desktop viewport sizes
  measured before, confirming the actual result matches the math
  exactly: fits without scrolling at 1920×1080, 1920×900, and 1440×900;
  only a small 100px scroll remains at 2560×1080 (down from 420px at
  16:9) — real, measured improvement, not just a calculation.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms the file in this zip matches what was
  cold-clone built and tested above.

## To apply

Apply together with the companion App-side delivery (updates the
Marketing page's hint text to match).

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
git commit -m "Desktop banner: change aspect ratio to 16:7, reduces height so ticker fits without scrolling on most common resolutions"
git push origin staging
```

Once this is live, upload a new 1920×840px (16:7) desktop image via
S-App for each banner to see it displayed correctly.
