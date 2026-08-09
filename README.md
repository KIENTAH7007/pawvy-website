# Homepage hero — morphing blobs reduced 50%

Sorry this one slipped through without being packaged the first time
— the change was sitting correctly in my working copy the whole time,
just never got zipped and sent. Confirmed directly against your live
`main` branch before rebuilding this: it genuinely never went out.

## What changed (1 file)

### `app/globals.css`
Every blob dimension on the homepage hero halved — both the base
(mobile) sizes and the desktop `clamp()` sizes in the `@media
(min-width: 1024px)` block, since the desktop rule is what actually
governs what you see on a normal browser window and would have
otherwise silently overridden the mobile-sized halving alone:

| | Before | After |
|---|---|---|
| Main blob (mobile) | 506px | 253px |
| Main blob (desktop) | clamp(1000–1400px) | clamp(500–700px) |
| b2 (mobile) | 322px | 161px |
| b2 (desktop) | clamp(680–950px) | clamp(340–475px) |
| b3 (mobile) | 219px | 110px |
| b3 (desktop) | clamp(460–640px) | clamp(230–320px) |
| b4 (mobile) | 265px | 132px |
| b4 (desktop) | clamp(540–760px) | clamp(270–380px) |

Scoped to `.hero .blob` specifically, which only applies to the
homepage — confirmed this doesn't touch any brand page (they use a
separate `.subhero` class with their own blobs, untouched here).

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Confirmed the diff is isolated to exactly these 8 size declarations
  — nothing else in the file touched.
- Confirmed against your live `main` branch that the original
  (un-halved) values were still there before this delivery, so this
  is genuinely new, not a duplicate of something already applied.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Homepage hero: reduce morphing blob sizes by 50%"`
6. `git push origin main`
