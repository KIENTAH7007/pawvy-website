# Salmon matching fix — following your Pawvy App rename (115g/55g → 120g/60g)

## What changed (1 file, 1 focused edit)

### `lib/brandContent.js`
The Salmon product card's Add-to-Cart matching now searches for `"120"`
and `"60"` instead of the old `"115"`/`"55"` — matching the real product
text you renamed in Pawvy App. The customer-facing labels were already
"120g"/"60g" from the earlier decoupling workaround, so nothing changes
visually — this just makes the matching agree with what's actually in
the database now.

**The decoupling itself is fully removed**, per your "clean it one
shot" — the stale comment explaining why display and matching used to
be split is replaced with a short note of what changed and why, so
anyone reading this file later understands the history without the
old workaround still being live code.

**One small leftover, harmless**: the image file path still says
`sku-salmon-115.jpg` — that's just the filename on disk, not part of
the matching logic, so the photo still displays correctly regardless.
Renaming the actual file wasn't part of what you asked, so I left it
as-is, but flagging it in case you want file-naming consistency too
at some point — that would just be a file rename, not a logic change.

## Verified — this was your biggest worry, so tested accordingly
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- **Ran the actual matching algorithm** (copied verbatim from
  `ProductAddButton.jsx`, not reimplemented from memory) against
  simulated product records shaped exactly like what you described
  renaming them to — confirmed both the 120g and 60g variants
  correctly find their real product.
- **Confirmed Flatfish's own, unrelated 55g product is completely
  unaffected** — it also uses `variationIncludes: '55'` for its own
  matching, but scoped separately by `seriesIncludes: 'Flatfish'`, so
  Salmon's rename to "60" doesn't touch it at all. Verified this
  explicitly rather than just assuming the scoping is safe.
- Confirmed every other part of the page (all 7 fish cards, hex
  colors, the `#shop` anchor, pillar navigation) is completely
  untouched — this edit only touches the 2 lines for Salmon's
  matching terms and the surrounding comment.

## One thing I can't verify from here
I don't have direct access to your live production database, so I
built and tested this against simulated data shaped exactly like what
you described (`'FD Salmon 120g'`, `'Half FD Salmon 60g'`) — if the
actual renamed text in Pawvy App differs even slightly from that
(e.g. extra spacing, different capitalization — capitalization
shouldn't matter since the matching is case-insensitive, but worth
mentioning), it's worth a real click-through test on the live
Eastsea Brother page after deploying this, same as you'd normally do.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Fix Salmon matching to follow Pawvy App rename (115g/55g -> 120g/60g), remove obsolete decoupling"`
6. `git push origin main`
