# Fix gap between banner and ticker + mobile ratio 4:5 → 2:3

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

1 file changed: `app/globals.css`.

## 1. Gap between banner and ticker — real cause found, not guessed

`.marquee` had `margin-top: 48px` — a leftover from when the ticker
used to be nested *inside* the old hero section, spacing it from the
CTAs above it. Now that the ticker is a direct sibling right after the
banner carousel, that same margin created exactly the gap you saw.
Removed — confirmed via a repo-wide search that `.marquee` is only used
in this one place, so nothing else is affected.

## 2. Mobile banner ratio: 4:5 → 2:3

Per your feedback that 4:5 felt too small on the mobile screen — 2:3
gives noticeably more vertical space (2:3 ≈ 0.67 width:height vs. 4:5's
0.8, so the banner reads taller and more prominent). Admin hint text
updated to match (see companion App-side delivery).

## Verification performed

- Confirmed via search that `.marquee` has exactly one usage in the
  whole codebase, so removing its margin can't have broken anything
  elsewhere.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms the file in this zip matches what was
  cold-clone built and tested.

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
git commit -m "Fix gap between banner and ticker (leftover margin), change mobile ratio to 2:3"
git push origin staging
```
