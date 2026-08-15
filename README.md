# Third banner image tier + fix ticker-below-fold on desktop — Website side

## This delivery is for the Website folder (`pawvy-website`) only,
## targeting `staging`.

2 files changed: `components/HomepageBanner.jsx`, `app/globals.css`.

## 1. Third image tier: tablets/unfolded foldables (4:3)

The `<picture>` element now has three sources, evaluated narrowest to
widest so the browser correctly picks the first match:

- ≤760px (phone) → mobile image, 2:3
- ≤1024px (tablet/unfolded foldable) → tablet image, 4:3
- wider → desktop image, 16:9

## 2. Fixed: ticker required scrolling to see on PC

Real cause: the desktop banner used `aspect-ratio: 16/9` with no height
limit — on a wide monitor, that computes to a genuinely tall box (a
1920px-wide banner at 16:9 is 1080px tall), which could push the ticker
below the first screen entirely. Added `max-height: 70vh` on desktop
specifically, so the banner never takes up more than 70% of the visible
window height, leaving room for the nav bar and ticker to both be
visible without scrolling on typical screens. Tablet and mobile tiers
don't need this cap — their aspect ratios are naturally much shorter
relative to their (narrower) width, so this was never an issue for them.

## Verification performed

- Real end-to-end test: started a real backend with a banner that has
  all three images set, ran the real Next.js server, and confirmed in
  the literal rendered HTML that both `<source>` elements are present,
  in the correct order, with the correct URLs.
- Traced the CSS cascade by hand across all three breakpoints to confirm
  the max-height only applies on desktop and doesn't leak into the
  tablet or mobile tiers.
- Real cold-clone build: fresh `git clone` → applied both files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms both files in this zip match what was
  cold-clone built and tested above.

## To apply

Apply together with the companion App-side delivery.

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "Add tablet banner image tier, fix desktop banner pushing ticker below the fold"
git push origin staging
```
