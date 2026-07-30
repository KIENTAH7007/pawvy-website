# Pawvy Website — patch: homepage hero photo + Puzzle Feeder Lite photo swap

## What changed

### Homepage hero
- **New photo** — `public/hero-bg.jpg` replaced with the wider PetExpo booth shot
  (more headroom, both of you clearly visible, nothing cropped tight against the top)
- **Blobs enlarged ~15%** from the previous (smaller) size — main blob 440px→506px,
  and the other three scaled the same amount
- **Marquee ticker background changed to cream** (`#F5F2EB`) instead of orange, so it
  doesn't clash with the orange booth counter in the photo — this was from the earlier
  round, included again since this is a full-file delivery

### Puzzle Feeder
- **"Puzzle Feeder Lite" card photo swapped** to the orange Lick Bowl Lite variant
  (was green) — gives the 3 "Choose Your Fit" cards visual variety instead of all
  reading green

### Files touched
- `public/hero-bg.jpg` — replaced
- `public/brand-features/puzzlefeeder/fit-lite.jpg` — replaced
- `app/globals.css` — blob sizes, marquee background

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes generated successfully.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Update homepage hero photo, enlarge blobs, swap Puzzle Feeder Lite card photo"
git push origin main
```
Railway auto-deploys from `main` on push.
