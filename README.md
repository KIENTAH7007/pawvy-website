# SEO improvements: canonical tags + keyword-rich brand slugs (#3 + #4)

## This delivery is for the Website folder (`pawvy-website`) only

9 files changed, listed below. Nothing here touches `pawvy-app`.

## #3 — Canonical tags (done)

Added `alternates: { canonical: ... }` to every indexable page's metadata:
homepage, `/shop`, `/blog`, `/stockist`, every brand page, every product
page. (Account/cart/login/signup/verify pages are already excluded via
`robots.txt` and don't need one — they're not meant to be indexed.)

**Favicon — not included, needs a decision first.** The only logo assets
in `public/` (`pawvy-logo-navy.png` / `-white.png`) are wide wordmarks
(999×317px), not a square mark — cropping one into a favicon would look
wrong at 16×16/32×32px. Point me to a proper square brand mark, or
approve using the 🐾 emoji already used on the homepage as a placeholder,
and I'll add it in the next pass.

## #4 — Brand slug rename (done)

| Brand | Old slug | New slug |
|---|---|---|
| East Sea Brother | `eastsea-brother` | `eastsea-brother-freeze-dried-dog-treats` |
| GiGwi | `gigwi` | `gigwi-durable-dog-toys` |

Matches the style of the other 4 brands' existing slugs (already
keyword-rich). Reasoning: East Sea Brother sells freeze-dried treats (per
its own tagline in `lib/brandContent.js`); GiGwi's tagline is "playful
design, durable build."

### "Nothing broken" — what I actually checked

- Searched **both repos** for every hardcoded reference to `eastsea-brother`
  and `gigwi` in a URL context. Found exactly **one**: the homepage's
  "exclusive distributor of..." sentence (`app/page.js`) — updated to the
  new slug.
- `BrandGallery.jsx` (the homepage's brand cards) and `sitemap.js` both
  build brand links dynamically from `BRAND_SLUGS`, so they picked up the
  new values automatically — verified in the built output, not assumed.
- `pawvy-app` has zero references to either URL — confirmed via a full
  repo search, not skipped.
- **Added permanent redirects** (`next.config.js`) from both old slugs to
  the new ones, so anything you've already tested, bookmarked, or that
  got crawled today still resolves instead of 404ing. Safe to remove
  these in a few weeks once you're confident nothing still points at the
  old paths.
- Grepped the actual **compiled build output** (`.next/server/app`) for
  the old slug strings — zero stray references anywhere in what actually
  ships.

## Verification performed

- Real cold-clone build: fresh `git clone` → applied all 9 files together
  (as they'll actually ship) → `npm install` → `npm run build` — passed
  with no errors.
- Verified `BRAND_SLUGS` and the redirect config both resolve to the
  exact expected values by requiring the real files and printing them.
- Scanned the compiled `.next` build output directly for old-slug leftovers
  — none found.
- Byte-for-byte diff confirms every file in this zip matches what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "SEO: canonical tags on all indexable pages; keyword-rich slugs for Eastsea Brother & GiGwi with redirects"
git push origin main
```

Railway auto-deploys from `main` — no other steps needed.
