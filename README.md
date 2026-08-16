# Fix: background color wasn't showing in the side gaps — real structural bug

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`. Still the same TEST from before — this replaces that
## delivery, doesn't add to it.

2 files changed: `app/globals.css`, `components/HomepageBanner.jsx`.

## The actual bug in the previous delivery

Your screenshot showed the side gaps as plain cream, not a blended
color — and the real cause was a genuine CSS mistake, not a detection
failure. The previous version put `max-width` (which caps the box) AND
`background-color` (the detected blend) on the exact same element,
centered using `margin: 0 auto`.

That doesn't work: `margin` is space *outside* an element's own box, and
`background-color` only ever paints *inside* it. So the gap beside a
margin-centered box always shows whatever's behind it — in this case,
the page's own cream background — no matter what color that element
itself was set to. The color-detection code was very likely working
correctly the whole time; it just had nothing to actually paint onto in
that specific area.

## The real fix — two layers, not one

Split into two elements:

- `.banner-carousel` — the **outer** layer. Always full width, and its
  background is what genuinely fills the side gaps now.
- `.banner-carousel-inner` — the **inner**, narrower, width-capped,
  centered box that holds the actual image and slides.

Confirmed directly in a real browser: the outer element now spans the
full viewport width with the detected color correctly painted across
it, while the inner element sits centered and capped within it — not
just built, actually measured.

## Verification performed

- Real browser test: rendered the exact two-element structure with a
  known background color, confirmed the outer element spans the full
  2560px test viewport with that color applied, and the inner element
  is correctly narrower and centered within it.
- Confirmed the zero-banner fallback state (`.banner-fallback`) has its
  own independent `min-height` rule, completely unaffected by this
  restructuring.
- Real cold-clone build: fresh `git clone` → applied both files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms both files in this zip match what was
  cold-clone built and tested above.

## If it doesn't work — the exact revert

Move `aspect-ratio`, `max-height`, `max-width`, and `margin: 0 auto`
back onto `.banner-carousel` directly, delete the
`.banner-carousel-inner` rule and its two media query overrides, and in
`HomepageBanner.jsx` remove the wrapping
`<div className="banner-carousel-inner">` (un-nesting its contents back
into the outer `<section>` directly). That's a full revert to the
previous (broken) single-layer version — from there, follow the earlier
delivery's revert notes to go back to no max-width at all.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite — this replaces
the previous max-width test entirely), then:

```bash
git add .
git commit -m "Fix: two-layer structure so the detected background color actually shows in the side gaps"
git push origin staging
```
