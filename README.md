# Fixes: New badge styling + banner scroll-jump on refresh

## Fix 1 — New badge, bigger and Pawvy Orange

### What changed (`app/globals.css`)
One shared rule (`.new-tag`) used across all 3 places the New badge
appears (shop grid, GiGwi's grouped cards, and the shared card on
your other 5 brand pages) — a single CSS change fixes it everywhere
at once, regardless of which specific product/page you were looking
at when you noticed it:

| | Before | After |
|---|---|---|
| Font size | 10.5px | 12.5px |
| Padding | 4px × 10px | 6px × 14px |
| Background | blue (`#3B82F6`) | Pawvy Orange (`var(--orange)`) |
| Text color | white | cream (matches how orange is used elsewhere, e.g. buttons) |
| Shadow | none | subtle orange-tinted drop shadow, for extra pop |

## Fix 2 — banner causing a scroll jump on refresh

### The actual root cause
This is a genuine browser behavior, not a bug specific to how the
banner was built: browsers remember scroll position by raw **pixel
offset** across a page reload (`history.scrollRestoration` defaults to
`'auto'`), not by *what content* was at that position. Turning the
banner on makes the homepage taller by inserting a full-viewport
section **above** everything else. So "the same pixel offset as
before" — which the browser tries to restore on refresh — now lands
somewhere inside the old hero instead of at the top, because
everything shifted down.

### What changed (`components/HomepageBanner.jsx`)
Two things, both standard fixes for this exact class of bug:
1. **Disables the browser's automatic scroll-position restoration**
   (`history.scrollRestoration = 'manual'`) going forward, so this
   can't happen again on future loads — scoped as a general
   protection, not tied to whether a banner happens to be active.
2. **Explicitly corrects the scroll position on this specific load**,
   scoped to only when the banner is actually active — scroll
   restoration happens very early in the page load, before React even
   hydrates, so simply disabling it going forward isn't enough to fix
   an *already* misplaced position on the load where you're seeing the
   bug; this actively resets it back to the top.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Confirmed the exact `.new-tag` CSS values changed as described.
- Confirmed the new `useEffect` in `HomepageBanner.jsx` is called
  unconditionally, before the component's early return — required by
  React's rules for hooks, checked directly rather than assumed.

## Not yet verified
No live browser access from this sandbox — the scroll-jump fix in
particular is the kind of thing that's easiest to fully confirm by
actually reproducing the original bug steps (banner on, page already
open and scrolled, hit refresh) and confirming it now lands at the
top. Worth that specific test after deploy.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Fix: New badge size/color, banner scroll-jump on refresh"`
6. `git push origin main`
