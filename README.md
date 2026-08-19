# Pawvy Website — Phase 1: Product Click-Through + Shop-by-Need

Target branch: **staging**
Repo: `pawvy-website`

**Apply the separate "Pawvy App" zip first** — this website patch
calls its new `?item_series=` filter.

This is the big one: product card click-through (your customer feedback
item) plus the full Phase 1 Shop-by-Need build — homepage, Shop page
redesign, and the product detail page enhancements that came out of the
Option 1 vs Option 2 discussion.

## 1. Product card click-through (your customer feedback)

Clicking anywhere on a product card *except* Add to Cart now goes to
that product's real page. Done across every card style on the site:

- `ProductCard.jsx` (Shop page, Pawvy's Picks) — already had this from
  before, untouched.
- `BrandDeepDive.jsx` — BetterBone's durability cards, and the generic
  fit-card pattern (Puzzle Feeder, Salmoil, Eastsea Brother).
- `FitCard.jsx` — Lillidale's hover-preview cards. Clicking after
  hovering a colour swatch takes you to *that* colour's page specifically.
- `CategoryBrowser.jsx` — GiGwi's category grid.

For a single-variant card, this is unambiguous. For a card representing
several real variants (different sizes/colours), I added a small shared
helper (`pickPrimaryMatch` in `lib/matching.js`) that always prefers an
in-stock variant, falling back to the first match if none are in stock
— deliberately kept separate from `ProductAddButton`'s own internal
default-selection logic (already tested, in production) rather than
sharing it, so this change can't accidentally alter what Add to Cart
itself does.

## 2. Product detail page — Option 1 (your confirmed choice)

- **Sibling variant switcher**: real navigation between each size's own
  URL (not a single-page live-swap) — so every variant keeps its own
  shareable, indexable link, and reuses the description you've already
  written once rather than duplicating it. Uses the new `?item_series=`
  exact-match filter from the pawvy-app patch.
- **"Best for" line**, pulling from the field you can now set in
  Pawvy App.
- **Breadcrumbs** (Home / Shop / Brand / Product).
- **OOS "Notify me"** — added directly into `AddToCartSection.jsx`,
  wired to the waitlist endpoint from the earlier delivery.

## 3. Homepage restructure

- Removed the "200+ Products / 100% Vetted Quality" stats strip and the
  "Why Pawvy" section, per you and Janice's confirmed direction.
- Added **"What does your pet need help with?"** — 8 need cards in the
  confirmed order (Skin & Coat → Chew → Enrichment → Gut → Food →
  Dental → Grooming → Joints), each linking to `/shop?need=<slug>`.
- Added **Pawvy's Picks** — pulls from the `is_pawvy_pick` flag you can
  already set in Products & Pricing. Only renders if there's at least
  one pick set, so it won't show an empty section if nothing's flagged
  yet.
- The "Six Brands, One Standard" section is completely untouched, as
  agreed — not redesigned.
- `StatCounter.jsx` is no longer used anywhere on the site (that trust-
  metrics-showing-0 bug is now moot since the section itself is gone) —
  left the file in place rather than deleting it, in case it's wanted
  again later; it just doesn't affect the build either way since nothing
  imports it now.

## 4. Shop page — sidebar filters replace the dropdown entirely

Per your confirmation that it's fine to fully discard the dropdown:

- **Sidebar** with three real, functional filters: **Need** (chips),
  **Brand** (radio list), **Availability** (in-stock-only checkbox).
  Deliberately did *not* include Pet or Product Type filters from the
  original mockup — there's no real data behind those yet, and a filter
  that doesn't actually filter anything would be worse than not having
  it. Worth a conversation later if you want those built out for real.
- **`/shop?need=dental`** now works as its own real, shareable,
  server-rendered URL — clicking a homepage need card lands here,
  pre-filtered, with the Need chip already active.
- **Testimonials-first layout**: when a need is active, testimonials for
  that need render above the product grid (image-first, before/after
  split if a testimonial has two photos, single photo with no label if
  it only has one — matches what you set up in Marketing). Each
  testimonial's linked product shows a shoppable "Add to cart" row.
- **Active-need banner** with a one-click "clear" back to the full catalogue.
- **Breadcrumbs**, showing the active need's name when one is selected.
- The Need filter also syncs into the URL as you click chips (without a
  full page reload), so the page stays bookmarkable/shareable even after
  interacting with it client-side, not just on first load.

## 5. Nav bar

- Added **"Shop by Need"** between Home and Shop, linking to the
  homepage's need-cards section (`/#need-cards`) — same destination as
  the "Shop by Need" hero button from the earlier mockup, so this
  matches what you already approved rather than introducing a new
  pattern. **This is my own call, not something we explicitly discussed**
  — if you'd rather it go straight to `/shop` (letting the sidebar be
  the entry point instead of the homepage cards), easy to change, just
  let me know.
- Removed **Blog** (per the original UX review's recommendation to pull
  it from nav until there's real content behind it) — the `/blog` route
  itself is untouched, just no longer linked from the nav.
- Done in both the desktop nav and the mobile drawer.

## Verification performed

- **Real production build** (`npm run build`) at every stage of this
  patch — after card click-through, after the PDP changes, after the
  homepage restructure, after the Shop page redesign, and after the nav
  changes — confirming no syntax errors, no broken imports, and no
  Server/Client Component boundary violations (this codebase has hit
  that exact class of bug before — see the comment at the top of
  `lib/matching.js` for the story — so I was specifically watching for
  it given how much of this patch touches Server Components).
- **Real logic tests** (not just build-passing) for the pieces most
  likely to have a subtle bug: confirmed `NEED_CATEGORIES`' order
  exactly matches the backend's canonical sequence; confirmed
  `pickPrimaryMatch` actually prefers an in-stock variant over an
  out-of-stock one, correctly falls back to the first match when
  *nothing's* in stock, and returns `null` (not a crash) for an empty
  match list.
- Every file in this zip byte-diffed against what was actually
  build-tested — identical, and the same true for the separate pawvy-app zip.

## What's NOT in this patch

- The waitlist admin-side (counts badge, email list) — already delivered
  and applied earlier; this patch only adds the *public-facing* trigger
  (the "Notify me" form) that calls it.
- Automatic restock emails — still flagged as a separate, unconfirmed
  follow-up.
- Pet / Product Type filters — no real data yet, deliberately not faked.

## How to apply

```bash
git checkout staging
git pull origin staging

# then copy/overwrite these files from this zip into your local
# pawvy-website folder, preserving the same paths:
#   app/globals.css
#   app/page.js
#   app/shop/[id]/page.js
#   app/shop/page.js
#   components/AddToCartSection.jsx
#   components/BrandDeepDive.jsx
#   components/CategoryBrowser.jsx
#   components/FitCard.jsx
#   components/Nav.jsx
#   components/ShopClient.jsx
#   lib/api.js
#   lib/matching.js
#   components/PawvyPicksGrid.jsx   <-- NEW FILE
#   lib/needTags.js                 <-- NEW FILE

git add .
git commit -m "Phase 1: product card click-through, homepage need cards + Pawvy's Picks, Shop-by-Need sidebar filters + testimonials, PDP variant switcher + Best For + breadcrumbs, nav update"
git push origin staging
```

## Worth testing specifically on S-Web once it's live

- Click a product card anywhere except Add to Cart, on each brand page
  (BetterBone, Lillidale, GiGwi, Puzzle Feeder/Salmoil/Eastsea Brother)
  and on the Shop page — should land on that product's real page.
- Homepage need cards — click one, confirm it lands on `/shop?need=...`
  pre-filtered with the right Need chip active.
- A product with real variants — confirm the switcher shows all
  siblings and correctly marks the current one active.
- An out-of-stock product — confirm the "Notify me" form appears and
  actually submits (check the waitlist badge in Products & Pricing
  afterward).
- Pawvy's Picks — flag a product as a pick in Products & Pricing, refresh
  the homepage, confirm it shows up (and that the section stays hidden
  if nothing's flagged).
