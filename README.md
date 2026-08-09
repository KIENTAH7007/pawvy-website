# Feature: "New" badge visuals + homepage takeover banner

Companion to a `pawvy-app` delivery (schema, admin UI, and every
backend endpoint this depends on) — apply both together.

## Part 1 — "New" badge, shown on every product surface

Three different card components on this site relate to product data
in three genuinely different ways, so each needed its own treatment:

- **`components/ProductCard.jsx`** (shop grid) — already reads
  `p.is_discount_active` directly off the product object; `is_new_active`
  works the same way, one new badge in the corner of the thumbnail.
- **`components/CategoryBrowser.jsx`** (GiGwi's grouped cards) — one
  card here can represent *several* variant SKUs (different colors of
  the same toy). Shows New if **any** of them currently is, since a
  customer would still discover that SKU by opening the card and
  picking a variant.
- **`components/FitCard.jsx`** (the other 5 brands' product cards) —
  this one doesn't get pre-matched product data at all; it only knows
  which real product a variant maps to at Add-to-Cart time, via
  matching logic (`findMatches`) that lived privately inside
  `ProductAddButton.jsx`. Exported that function so `FitCard` could
  reuse the *exact* same matching to check `is_new_active` ahead of
  render — rather than writing a second, possibly-drifting copy of the
  same logic.

`app/globals.css` — one new `.new-tag` rule, reused across all three
contexts above.

## Part 2 — Homepage takeover banner

### `components/HomepageBanner.jsx` (new file)
Renders admin-uploaded content in the same full-width takeover shape
you approved in the earlier mockup, but built with **Pawvy's own
navy/orange/cream palette**, not hardcoded to Wild Balance's own green
— since this needs to work for whichever brand launches next, not just
the first one. Has a close button; dismissing is per-page-view only
(no persistence), which fits a launch banner meant to be seen rather
than a cookie notice that should stay dismissed forever.

### `app/page.js`
Fetches the active banner server-side (same pattern as the ticker and
Instagram sections already use), renders `<HomepageBanner>` **above**
the existing hero. Confirmed directly via `git diff` that this is a
pure addition — zero lines of the existing hero were touched or
removed.

### `lib/api.js`
One new line, `contentApi.homepageBanner()`, same shape as the
existing `activeCampaign`/`instagramPosts` helpers.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Confirmed every CSS class the new banner component uses
  (`wb-takeover`, `wb-takeover-bg`, etc.) has a matching rule in
  `globals.css` — checked directly, not assumed.
- Ran the component's actual conditional logic against every
  realistic scenario: an active banner (renders correctly), an
  inactive one from the backend, a `null` response (the backend fetch
  failed and was caught, same `.catch(() => null)` pattern already
  used for ticker/Instagram — confirms this can never crash the
  homepage if the banner API is briefly unreachable), the closed
  state, and a banner with no headline set.
- Confirmed via `git diff` that `app/page.js`'s existing hero content
  has **zero** removed lines — this is provably additive only.
- Ran a dedicated cross-repo test (see the companion `pawvy-app`
  delivery) confirming the backend's actual JSON response shape lines
  up field-for-field with what this component expects.

## Not yet verified
No live browser access from this sandbox — worth a real look once
deployed at how the takeover feels in practice (timing of the close
button, whether the scrim/gradient reads well over a real uploaded
photo rather than the fabricated test image used here).

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "New Badge visuals across all product cards + homepage takeover banner"`
6. `git push origin main`

## Companion delivery
Pairs with a `pawvy-app` delivery (schema, admin CRUD for both
features, and every backend endpoint this reads from). Apply both —
this website delivery alone will show nothing new until the backend
piece is live too.
