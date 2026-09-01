# Pawvy Website — Wild Balance Intro Photos

Target branch: **staging**
Repo: `pawvy-website`

Both placeholder boxes now show your real photos.

## What's in this patch

- **Intro section** (first placeholder): the golden retriever with the
  Cazuelas Caseras tin.
- **Feature split section** (second placeholder): the dachshund with
  the casserole tins and real ingredients.

Both resized/optimized to match the site's existing photo convention —
your files were 1.1MB and 2.3MB; now 93KB and 161KB, no visible
quality loss at the size they actually display.

## One thing worth a quick look — not fixed, just flagging

The second photo has "Slow-cooked, irresistible and easy to serve"
baked directly into the image itself. That's separate from the real
page heading/copy already sitting next to it ("Built from real meat,
real vegetables, real spices"), so a visitor would see two different
pieces of messaging side by side rather than one photo simply
illustrating the text. Not necessarily a problem — plenty of sites mix
a photo's own caption with different surrounding copy — but wanted to
flag it clearly rather than silently assume it's fine, in case you'd
rather use a version without the text baked in, or adjust the nearby
heading to match. Let me know either way.

## Verification performed

- Full production build — clean.
- **Real end-to-end test**: real backend, real production Next.js
  server, real fetched page — confirmed both real image paths appear
  in the actual rendered HTML (not just the config), and confirmed
  both image files genuinely serve correctly (HTTP 200, byte-identical
  to what was saved).
- Confirmed the placeholder boxes are completely gone from these two
  sections — the only remaining `img-placeholder` elements on the page
  are the unrelated product cards (Casseroles, Freshly Cooked, Chews),
  which is expected since no real products were seeded in this test
  round, not a sign anything's still missing here.
- All 3 files (config + 2 images) byte-diffed against what was
  actually tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   lib/brandContent.js

# these are NEW files:
#   public/brand-features/wild-balance/intro-dog-eating.jpg
#   public/brand-features/wild-balance/feature-ingredients.jpg

git add .
git commit -m "Add Wild Balance's real intro and feature-split photos, replacing the two placeholder boxes"
git push origin staging
```
