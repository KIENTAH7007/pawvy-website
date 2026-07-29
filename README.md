# Pawvy Website — patch: BetterBone brand page deep-dive (final, with real photos)

## What changed
Three new sections on the **BetterBone brand page**, between "Why Pawvy carries BetterBone"
and the FAQ:

1. **The Better Chew** — intro copy + hero photo (the husky)
2. **Different Durability Levels** — Soft / Medium / Hard, combined into one set of cards
   per your call: each card is the lifestyle dog photo with the matching packaging shot
   inset as a small badge in the corner, plus a "bite meter" (3 dots) showing intensity
   and the full product name below. Replaces the earlier two-separate-grids version.
3. **Find The Bone** — navy CTA band, "Chew-sing Guide" button now links to `#faq` on
   the same page. Once you add the actual Chew-sing Guide content to the FAQ section,
   this can be pointed at that specific FAQ item if you want a tighter anchor — just say
   the word.

All 7 images you sent are in, cropped and compressed:
- `chew-hero.jpg` — the husky, for The Better Chew
- `durability-soft.jpg` / `-medium.jpg` / `-hard.jpg` — the three dog lifestyle photos
- `pack-soft.jpg` / `-medium.jpg` / `-hard.jpg` — the three packaging badge shots

Everything's under `public/brand-features/betterbone/` and referenced directly in
`lib/brandContent.js` — no more placeholder boxes on this page.

### Files touched
- `lib/brandContent.js` — `deepDive` content block, now with real image paths
- `components/BrandDeepDive.jsx` — combined durability+product card layout
- `app/brands/[slug]/page.js` — added `id="faq"` for the Chew-sing Guide link
- `app/globals.css` — updated styles for the combined card (image badge overlap)
- `public/brand-features/betterbone/*.jpg` — 7 new image files

`npm run build` passes clean (Next.js 16, Turbopack) — all 22 routes generated successfully.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Add BetterBone brand page deep-dive sections with real photos"
git push origin main
```
Railway auto-deploys from `main` on push.
