# Favicon revision — opaque background (fixes dark-browser visibility)

## This delivery is for the Website folder (`pawvy-website`) only

1 file changed: `app/icon.png`.

## What changed and why

The original favicon was a transparent PNG — black icon, no background —
which meant dark-themed browsers showed it against their own dark tab
chrome, making it nearly invisible (exactly what you flagged).

Replaced with the opaque version you provided (black icon on `#F8F8F8`,
near-white) rather than the alternative (white icon on pure black).
Reasoning: the real fix here is opacity itself — baking a solid
background into the image means it always shows against a background
Pawvy controls, not whatever color the browser's chrome happens to be.
Between the two opaque options, light background is the more robust
choice specifically for dark-mode browsers — a pure black square risks
blending into dark chrome that's already near-black, which would
partially reintroduce the same problem just inverted. A light square
reliably stands out against dark chrome, and reads as a completely
normal favicon in light-theme browsers too.

## Verification performed

- Confirmed the source image is genuinely opaque (RGB, no alpha channel)
  before using it — this was the actual root-cause fix, not just a color
  swap.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Confirmed in the actual build output that Next.js generated the
  favicon route from the new image, and that the correct near-white
  background color survived the build unchanged.
- Byte-for-byte diff confirms the file in this zip matches what was
  cold-clone built and tested.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's `app/icon.png` into that folder (overwrite), then:

```bash
git add .
git commit -m "Favicon: switch to opaque background, fixes dark-browser visibility"
git push origin main
```

Railway auto-deploys from `main`. Browsers cache favicons fairly
aggressively — if it doesn't look updated right away, a hard refresh or
checking in a private/incognito window will show the real result.
