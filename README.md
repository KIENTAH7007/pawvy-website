# Pawvy Website — hotfix: BetterBone "Unavailable" + caption copy

## The bug
Every BetterBone card showed "Unavailable" because the dynamic product
matching searched for `"BetterBone"` (no space) against `item_series`, but
per your own project convention, the backend/database key for this brand is
**"Better Bone" — with a space**. "BetterBone" (no space) is only the
marketing/display spelling, mapped via `displayBrandName()` on the frontend.
Searching for the wrong spelling meant it could never match a real product,
same failure mode as the earlier Puzzle Feeder bug, different root cause
(brand naming convention this time, not the dash-separator issue).

## The fix
One-word change in `lib/brandContent.js`: `seriesIncludes: 'BetterBone'` →
`seriesIncludes: 'Better Bone'` on all three durability levels.

## Also changed
The caption text under each card (was "BetterBone Soft/Medium/Hard Chew —
No Nylon, Hypoallergenic") is now:
- Soft → "40% softer than nylon"
- Medium → "15% softer than nylon"
- Hard → "The real deal"

Rebuilt and verified clean with `npm run build`.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Hotfix: fix BetterBone Unavailable bug (brand naming), update card captions"
git push origin main
```
Railway auto-deploys from `main` on push.
