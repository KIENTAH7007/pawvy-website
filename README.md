# Salmoil brand deep-dive — patch

## What this adds

The Salmoil brand page (`/brands/salmoil-...`) now has a full deep-dive
section between the existing hero and the existing FAQ:

1. **Intro** — brand story + 3 value cards (Aluminum Bottle, ASC Certified,
   Functional Blend), using your real collage photo, shown uncropped.
2. **Interactive recipe selector** — click any of the 5 recipe cards (or
   hover, on desktop) and the real product photo on the right swaps
   instantly. This is genuinely interactive, not just a static image —
   built as its own small client component (`RecipeSelector.jsx`) since
   the rest of the page is server-rendered.
3. **5 recipe cards** (Kidney/Gut/Dental/Coat/Joint Wellness) — each opens
   a real Add to Cart modal with your 3 real sizes (150ml/250ml/500ml),
   defaulting to 250ml, photo swaps per size with nothing cropped.

No hero, FAQ, or CTA changes — those already exist on the shared brand-page
template and weren't touched.

## Files in this patch

- `components/BrandDeepDive.jsx` — **complete file.** Two changes: (1) the
  existing `intro` shape gained an optional `values` field that renders a
  3-card grid below it — Salmoil uses this, BetterBone/Puzzle Feeder don't
  set it so nothing changes for them; (2) added rendering for the new
  `selector` shape, delegated to `RecipeSelector.jsx`. `fitCardGroups`
  (used for the 5 recipe cards) is the same shape already built for
  Lillidale — no changes needed there.
- `components/RecipeSelector.jsx` — **new file.** The interactive
  hover/click selector. Pulled into its own client component (`"use
  client"`) because `BrandDeepDive.jsx` is a Server Component and
  `useState` needs a client boundary — this was actually a build error
  I hit and fixed locally, not a design choice up front.
- `lib/brandContent.js` — **complete file.** Only the `Salmoil` entry
  changed; every other brand's data is untouched.
- `app/globals.css` — **complete file.** Added new CSS classes at the very
  end (`.intro-value-*`, `.sal-selector*`, `.sal-tab*`). Nothing existing
  was edited or removed.
- `public/brand-features/salmoil/*.jpg` — **21 new images** (intro photo +
  5 selector photos + 5 recipes × 3 sizes), all compressed for web.
  No existing files touched.

Nothing is renamed, so plain unzip-and-replace covers it.

## Before you deploy — one thing worth knowing

Same flag as Lillidale's first patch: the `seriesIncludes` terms below
(Kidney Wellness, Gut Wellness, Dental Wellness, Coat, Joint Wellness,
size numbers) are my best guess from the product photos/packaging text —
not confirmed against a real screenshot of Salmoil's actual
`item_series`/`variation` values in the Pawvy App. I ran a local smoke
test against fabricated data shaped like your real records and all 15
size/recipe combinations resolved correctly with zero "Unavailable" — but
that's fabricated data, not your real catalog.

**Please do one real click-through on all 5 recipes × 3 sizes after this
deploys.** If any shows "Unavailable," it means the real
`item_series`/`variation` text doesn't contain the term I guessed — same
class of issue as Lillidale's Sanitising Spray/2kg bugs, and the fix is
the same (loosen or correct the term once we know the real text).

## What I verified locally

- `npm run build` — clean.
- SSR smoke test of `BrandDeepDive` against fabricated product data shaped
  like real records — all 5 recipes × 3 sizes render, zero crashes, zero
  "Unavailable" states, 250ml confirmed as the default cover photo despite
  150ml being listed first.

## What I could not verify locally (no access to your live backend/DB)

- Whether the real `item_series`/`variation` text actually contains the
  terms I guessed — see the flag above.
- Real stock levels / `stock_status` for any of the 15 SKUs.
- The interactive selector's hover/click behavior on a real touch device —
  logic is straightforward (same click-to-set-state pattern used
  elsewhere) but worth a quick look on your phone after deploy.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip this patch on top of your local `pawvy-website` folder ("Copy and
Replace" when prompted), then:

```bash
git add -A
git commit -m "Add Salmoil brand deep-dive: intro, interactive recipe selector, 5-recipe shop grid"
git push origin main
```

Railway will auto-deploy from `main` on push. If it doesn't pick it up
automatically, use the manual Redeploy button on the Deployments tab
before digging into anything else.
