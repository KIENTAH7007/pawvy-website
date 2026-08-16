# TEST: desktop-only max-width + auto-detected background color

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`. This is explicitly a TEST per your request — see the
## "If it doesn't work" section below for the exact one-line revert.

2 files changed: `app/globals.css`, `components/HomepageBanner.jsx`.

## What this does

**Desktop only** (confirmed scoped correctly — mobile and tablet tiers
explicitly reset `max-width: none`, since they never had this problem
in the first place): the banner no longer stretches infinitely wide on
very wide monitors. It's capped at a genuine 16:9 shape, computed
directly from the same height limit already in place
(`(100vh - 60px) * 16/9`), and centered once a screen is wide enough to
hit that cap.

**Auto-detected background color**: whatever shows beyond that cap is no
longer a flat navy — it's computed live, per banner, by sampling the
actual left/right edge pixels of that banner's own desktop image via an
in-browser canvas, averaging them into a single blended color. This
updates automatically as the carousel rotates between banners with
different color schemes.

## Why mobile/tablet never had this problem (your question)

Both tiers use `max-height: none` — no competing height limit fighting
the aspect-ratio at all, so the container simply grows to whatever
height its own ratio computes, unconstrained. Desktop is the only tier
where `aspect-ratio` and `max-height` compete for the same space, which
is the actual mechanism behind the cropping/shrinking you saw.

## Honest note on verification

Every individual piece was tested with real, passing tests:

- The exact color-averaging algorithm — run in an actual Chromium
  browser against a real test image with precisely known edge colors
  (red left edge, blue right edge), and it computed the exact
  mathematically-expected average.
- The max-width CSS — measured in a real browser across 4 different
  viewport widths (2560px, 1920px, 900px, 500px), confirming it
  correctly caps and centers on wide desktop screens, and correctly
  does NOT apply on tablet/mobile.
- The backend's CORS headers — confirmed present via a real HTTP
  request (required for the canvas to read pixel data from a
  cross-origin image at all; without it, the color detection would
  silently fail closed to the default navy, not crash).
- A real production build — passed with no errors.

**What I could not complete**: a single end-to-end test with the real
color-detection running live end-to-end on the actual rendered page (two
servers + a real browser navigating to it) kept hitting an environment
limitation in my own sandbox where background processes die between
steps — not a code problem, a testing-environment one I hit repeatedly
throughout this whole project. Given every individual piece is proven
correct in isolation, I'm confident in this delivery, but the one thing
I want to be upfront about is that the very last "watch it all work
together live" step is the one I couldn't personally complete before
sending this. This is exactly why you're testing it directly rather
than me just asserting it's done.

## If it doesn't work — the exact revert

In `app/globals.css`: remove `max-width: calc((100vh - 60px) * 16 / 9);`
and `margin: 0 auto;` from the `.banner-carousel` rule, and remove the
two `max-width: none;` resets in the tablet media query. In
`components/HomepageBanner.jsx`: remove the `edgeColors` state, the
color-detection `useEffect`, and the `style={...}` prop on the
`<section>`. That's the complete revert — nothing else depends on any
of this.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "TEST: desktop-only banner max-width with auto-detected blended background"
git push origin staging
```
