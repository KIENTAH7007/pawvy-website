# Homepage banner — simplified to a full-bleed clickable image

## The mystery circle/X, explained
That was the banner's close button, which I'd positioned top-right —
turns out that's roughly where the nav bar's own icons (cart, help)
sit too, since the nav is fixed at the top of the viewport. The button
was rendering there and visually colliding with the nav, which is
exactly why it looked like a stray, unexplained icon rather than
something that made sense in context. Removed entirely as part of
this redesign (see below for why that's fine, not just a workaround).

## What changed

### `components/HomepageBanner.jsx` — fully rewritten
Down to the essentials, per your direction:
- **No eyebrow, no headline text, no buttons, no close button** — the
  uploaded image is the entire banner now. Your design team owns the
  whole visual through what they hand over; this component doesn't
  overlay any of its own text or UI on top of it anymore.
- **No dimming scrim** — previously there was a dark gradient over the
  image so the (now-removed) text stayed readable. Gone, so the image
  shows at full strength, exactly as you asked.
- **The entire banner is now one big link** to whatever URL is set in
  "Links to" in the Pawvy App — clicking anywhere on the image takes a
  visitor straight to the new brand's page. Replaces the old
  "Discover more" button entirely, rather than sitting alongside it.
- **No manual close button** — this was a deliberate call, not just
  simplification for its own sake: since the banner isn't a modal (it
  never blocked anything below it) and the nav bar above it stays
  fully clickable the whole time, a visitor who doesn't want to click
  through can just scroll past or use the nav like normal. Removing it
  also resolves the stray-icon issue directly, rather than just
  repositioning it somewhere else.
- **A subtle hover zoom** on the image (barely-there scale-up) — the
  one small addition, purely as a "this is clickable" cue now that
  there's no button telegraphing that anymore.
- **The headline field still exists in the admin form** (untouched,
  not removed from Pawvy App) — it's just not shown visually on the
  banner anymore. Repurposed as the image's `alt` text instead, so it
  still has a use (accessibility/screen readers) rather than becoming
  dead weight.
- **The scroll-jump-on-refresh fix from the previous delivery is
  unaffected** — that fix lives in this same file and had nothing to
  do with the buttons/text being removed, so it's still in here,
  confirmed directly in the diff.

### `app/globals.css`
Removed every CSS rule tied to the elements that no longer exist
(scrim, close button, eyebrow, headline, action buttons) — confirmed
zero orphaned references remain anywhere in the codebase. What's left
is just the container and the image, plus the new subtle hover effect.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Grepped the entire codebase for every removed class name
  (`wb-takeover-scrim`, `-close`, `-inner`, `-eyebrow`, `-headline`,
  `-actions`) — zero matches remain anywhere.
- Confirmed the banner correctly links to `banner.link`, confirmed the
  headline correctly becomes the image's `alt` text (with a sensible
  fallback when no headline was set), and confirmed the
  inactive/`null` cases still render nothing, same as before.
- Confirmed via `git diff` that the scroll-restoration fix's actual
  logic is untouched by this rewrite — only the surrounding
  button/text markup around it changed.

## Not yet verified
No live browser access from this sandbox — worth a look at how the
hover zoom feels in practice, and confirming the close-icon confusion
is genuinely resolved now that nothing renders near the nav bar.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Homepage banner: simplified to a full-bleed clickable image, no overlay text/buttons/close"`
6. `git push origin main`
