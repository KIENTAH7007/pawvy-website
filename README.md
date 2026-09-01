# Pawvy Website — Nav Dropdown Now Correctly Shows Unhidden Brands

Target branch: **staging**
Repo: `pawvy-website`

## The problem

After unhiding Wild Balance, everywhere else on the site correctly
picked it up (homepage heading, gallery card, Shop page's brand
filter) — but the nav's Shop dropdown didn't. Root cause: last
round's fix fetched the brand list once in `app/layout.js` (a
server-side fetch), cached for 60 seconds via Next's ISR revalidation,
relying on that revalidation actually kicking in reliably. In
practice it didn't pick up the change the way expected.

## The fix

Moved the fetch out of the server-side layout entirely. `Nav.jsx`
(already a client component) now fetches the real, already-filtered
brand list itself, client-side, on mount — no server-side caching
layer to get right, genuinely fresh on every single page load. This
also has a nice side effect: it fully removes the need for the ISR
workaround from last round, so those previously-affected pages
(login, signup, blog, account, cart, etc.) are back to plain, simple
static generation — no revalidate window at all now, since the layout
doesn't fetch anything itself anymore.

## Verification — with a real browser, not just curl this time

Since this is now a client-side fetch, the nav dropdown's real content
only exists after the browser actually runs the JS — a plain `curl`
can't show it. Used a real headless Chromium browser (Playwright) to
verify properly:

- Confirmed the real `/api/shop/brands` network request fires and
  succeeds after page load.
- **Unhid** Wild Balance in a real seeded database, loaded the real
  page in a real browser, hovered the Shop nav item, and read the
  actual rendered dropdown DOM: all 7 real brands present, Wild
  Balance included.
- **Hid** Wild Balance again, reloaded, and confirmed the dropdown
  correctly shows exactly 6 brands with Wild Balance genuinely absent
  — the full round-trip, both directions, both real and correct.
- Along the way, caught and fixed two of my own test-setup mistakes
  before they could hide a real result: `NEXT_PUBLIC_API_BASE_URL` had
  to be set *before* building (it's baked into the client bundle at
  build time, not read at server start), and my own minimal test
  backend was missing the `cors()` middleware the real production
  server already has — confirmed by checking `server/index.js`
  directly rather than assuming.
- Full production build — clean.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files:
#   app/layout.js
#   components/Nav.jsx

git add .
git commit -m "Fix nav Shop dropdown not picking up an unhidden brand — fetch the real brand list client-side in Nav instead of relying on server-side ISR revalidation"
git push origin staging
```

## Worth a real check once live

Hide and unhide a brand via Pawvy App, and confirm the nav dropdown
reflects it correctly on the very next page load — no waiting window
this time, since there's no cache involved at all anymore.
