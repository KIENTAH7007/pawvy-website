# Pawvy Website — Distributor Badge → sr-only, Footer Trust Line

Target branch: **staging**
Repo: `pawvy-website`

## What changed

Per discussion: the visible "Official & exclusive Singapore distributor of
[Brand]" pill on each brand page didn't fit the hero design, and on
reflection isn't something a B2C customer actually needs to see — the
distinction between exclusive/non-exclusive matters for accuracy and SEO,
not for customer-facing trust-building.

**Resolution:**

1. **`app/brands/[slug]/page.js`** — the per-brand distributor line is now
   `sr-only` (visually hidden, same accessible-hiding technique already
   used for the homepage banner's off-screen H1 — real text in the page,
   invisible on screen, still read by search engines and screen readers).
   No wording changed, just no longer rendered as a visible pill.
2. **`app/globals.css`** — removed the now-unused `.subhero .distributor-badge`
   pill styling (was the "ugly" box KT flagged) — nothing to visually
   redesign now, since nothing shows.
3. **`components/Footer.jsx`** — added the generic trust line "Official
   distributor. Authentic products. Local support." under the existing
   footer tagline. This is visible, site-wide (footer renders on every
   page), and is the one customer-facing version of this messaging.
4. **`app/globals.css`** — added `.foot-trust` styling for the new footer
   line — smaller and slightly more muted than the main tagline so it
   reads as a secondary trust note, not competing with the primary
   footer copy.

## Why the footer line isn't also duplicated per-brand-page

Discussed and deliberately decided against it: the footer already makes
this text real, indexable HTML on every single page site-wide, so there's
no SEO gap to fill by repeating it. Repeating identical phrasing across
all six brand pages would actually work against the point of page-specific
content — it reads as generic boilerplate rather than something unique to
that page. The per-brand `sr-only` line, by contrast, is genuinely unique
per brand (BetterBone's says something different from GiGwi's), which is
exactly the kind of page-specific signal that's actually useful.

## Verification performed

- `npm install` + `npm run build` on a clean state — compiled
  successfully, all 17 routes generated, no errors.
- Confirmed `.sr-only` is the correct accessible-hiding CSS pattern
  (`position: absolute; clip: rect(0,0,0,0)` etc.), not `display: none`
  — meaning the text stays real, present, and readable by search engines
  and assistive tech, it's only invisible on screen. Same technique
  already in use elsewhere on the site, not a new pattern.
- Grepped the final files to confirm: the badge markup carries both
  `distributor-badge` and `sr-only` classes, the footer has the new
  `foot-trust` paragraph, and the CSS has the corresponding style with no
  leftover dead `.distributor-badge` pill styling.
- Byte-for-byte diffed all 3 changed files in this zip against what was
  actually build-tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# then copy/overwrite these files from this zip into your local
# pawvy-website folder, preserving the same paths:
#   app/brands/[slug]/page.js
#   app/globals.css
#   components/Footer.jsx

git add .
git commit -m "Distributor badge: hide visually (sr-only), keep for SEO/screen readers; add generic trust line to footer"
git push origin staging
```

Then on S-Web: each brand page should show no visible pill anymore
(hero looks the same as before the badge was ever added), and the
footer on every page should show a small second line under "We help you
make informed choices." reading "Official distributor. Authentic
products. Local support."
