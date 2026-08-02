# Nav fix + a note on items 1 & 2

## Important — please read before re-testing items 1 & 2

I checked my own source files and both changes from the last patch are
still there, exactly as delivered — 200g/500g/2kg order in
`lib/brandContent.js`, and the 2-column mobile rule in `app/globals.css`.
Since your git push and manual redeploy both succeeded, the most likely
explanation is your browser (or a CDN in front of Railway) serving a
cached copy of the page.

**Before assuming anything's still broken, please try:** a hard refresh
(Ctrl+Shift+R / Cmd+Shift+R), or open the Lillidale page in a fresh
incognito/private window on your phone. If it's still showing 500g first
or 1 card per row after that, let me know and I'll dig further — but I
wanted to flag this as the likely explanation rather than blindly
re-patch code that's already correct.

## 3. Fixed — the stuck hamburger menu

Found it, and it's the exact same bug class as an Add to Cart modal bug
fixed earlier this session, just in the site nav instead: `position:
fixed` gets trapped inside the nearest ancestor that has a `transform`
set (or `filter`/`will-change`), and ends up positioned relative to THAT
element's box instead of the real viewport. On a page you've scrolled
down, a trapped "fixed" drawer can end up rendered mostly or entirely
above/outside the visible screen — showing just a sliver (in your case,
"Home") and behaving stuck, because the DOM and React state are actually
fine, it's purely a CSS positioning problem.

**Fix**: the mobile drawer + overlay are now portaled directly into
`document.body` (via `createPortal`), exactly like `ProductAddButton.jsx`
already does for the Add to Cart modal. This makes `position: fixed`
resolve against the true viewport regardless of what any page's content
does with transforms — reveal-on-scroll animations, card hover effects,
anything. Since this happens on every page (not just brand pages), this
should fix it everywhere in one shot.

## File in this patch

- `components/Nav.jsx` — complete file. Only change: the mobile
  overlay/drawer JSX now renders through a `Portal` component (same
  pattern, copied comment-for-comment from `ProductAddButton.jsx`) instead
  of inline inside `<nav>`. No other logic touched — same links, same
  open/close behavior, same scroll-lock.

## Verified locally

- `npm run build` — clean.
- Couldn't fully click-test this one interactively (the site needs your
  live Railway backend to server-render pages, which my sandbox can't
  reach), but the fix itself is a proven, already-working pattern in this
  exact codebase — not a guess. Please do a real click-through after
  deploy: navigate anywhere, scroll down, open the hamburger, and confirm
  you see the full menu and can close it normally.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local folder, then:

```bash
git add -A
git commit -m "Fix mobile nav drawer getting trapped by ancestor transforms"
git push origin main
```
