# Salmoil fixes — cream bars, Odor Control matching, modal image + width

## 1. Fixed — cream bars on the selector image

The container's height was fixed independent of the poster images' actual
shape, so `object-fit: contain` left visible background on the sides. Set
the container's `aspect-ratio` to exactly match your poster photos
(900×1273) instead — now it fills edge-to-edge with nothing visible
around it.

## 2. Fixed — Dental Wellness showing "Unavailable"

Yes, exactly the right read, and the right fix. The card still *displays*
"Dental Wellness" to customers (unchanged) — only the internal matching
term changed, from `'Dental Wellness'` to `'Odor Control'`, since that's
apparently what the real database calls this recipe. Display name and
matching term are two separate fields in the data (`name` vs.
`seriesIncludes` on each variant) specifically so this kind of fix doesn't
require touching what customers see — same pattern used for the other
Salmoil recipes and every other brand.

## 3. Fixed — modal showing the wrong photo, and pills wrapping

**Wrong photo, real cause found in the code (not a guess this time):**
`ProductAddButton.jsx`'s modal has always preferred a product's *real*,
already-uploaded photo from the Pawvy App (`image_data`) over my curated
photo, whenever one exists — this is deliberate for every other brand, so
that updating a photo in the Pawvy App reflects on the website
automatically without needing a code deploy. For Salmoil, some of these
SKUs apparently already have an old/generic photo uploaded, which is what
was showing instead of what you sent me.

Fix: added a `forceImage` flag, set to `true` on all 15 Salmoil size
variants only. When set, the modal always uses my curated photo
regardless of what's in `image_data`. Every other brand's modals are
completely unaffected — I checked this in isolation before shipping it
(their `image_data` still wins when present, same as before).

One thing worth deciding, not something I can decide for you: if a Salmoil
SKU's photo in the Pawvy App gets updated later, the website **won't**
pick it up automatically anymore for that SKU — it'll keep showing my
curated photo until code changes. That's the tradeoff `forceImage` makes.
If you'd rather have Salmoil follow the same "Pawvy App photo always wins"
behavior as everything else, the fix is simpler: just clear or replace
whatever's currently in `image_data` for those SKUs, and remove
`forceImage` from the data. Let me know if you'd prefer that instead.

**Pills wrapping:** modal widened from 420px to 480px max-width, and the
3 size pills now share the row evenly (`flex: 1 1 0`) instead of wrapping
based on their individual width — so 150ml/250ml/500ml sit on one line
even when one has a longer "(out of stock)" label attached. This is a
shared style, so it improves every brand's modal the same way, not just
Salmoil's.

## Files in this patch (all complete files)

- `components/ProductAddButton.jsx` — the `forceImage` support and the
  widened/aligned pill row. Nothing else in this file changed.
- `lib/brandContent.js` — only the `Salmoil` entry changed: Dental
  Wellness's `seriesIncludes` fixed, and `forceImage: true` added to all
  15 variants.
- `app/globals.css` — only `.sal-selector-image`, `.fit-modal`, and
  `.fit-modal-options` rules changed.

No images changed this round.

## Verified locally

- `npm run build` — clean.
- SSR smoke test reproducing your exact Odor Control scenario (fake
  product named "Salmoil Odor Control" in the database) — resolves
  correctly, zero "Unavailable".
- Isolated the `forceImage` logic and tested both cases directly: Salmoil
  (forceImage set, real `image_data` present) correctly uses the curated
  photo; a simulated other-brand case (no `forceImage`, `image_data`
  present) correctly still uses the live database photo, confirming nothing
  else broke.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local folder, then:

```bash
git add -A
git commit -m "Fix Salmoil selector image crop, Odor Control matching, modal photo + pill layout"
git push origin main
```
