# pawvy-website (Next.js)

Migrated from the previous plain Vite+React site to Next.js (App Router), specifically to fix
the SEO problem — the old site rendered everything client-side, meaning Google saw an empty page
until JavaScript ran. This is the same underlying issue that got the original Hostinger builder
ruled out at the very start of this project, just from a different tool.

## What actually changed vs. the Vite version

- **Shop, product, and brand pages are now genuinely server-rendered.** "View Source" on a
  product page now shows the real product name, price, and description — confirmed directly,
  not assumed — instead of an empty `<div id="root">`.
- **Each product page gets its own real `<title>`/meta description**, generated per-product
  server-side. The old site could only ever have one generic title for the whole site.
- **Real `/sitemap.xml` and `/robots.txt`**, both dynamically generated — the sitemap includes
  every real product and brand page, not just the static top-level ones.
- **Account, cart, login, signup, etc. are unchanged in behavior** — still fully client-rendered
  (correctly so — they're personalized pages with no SEO value), same logic, same API calls,
  same tested flows (password login, profile-completion bonus, referral links, cart upsell).
- No more custom Express server wrapper — Next.js has its own production server
  (`next start`), so `server.js` from the old version is gone entirely; simpler deploy.

## Two real bugs caught and fixed during the migration itself

1. **Cart hydration mismatch**: the old cart read `localStorage` synchronously during the
   initial render. That's fine for a pure client app, but in Next.js the server renders first
   (with no access to `localStorage`) and the browser then has to reconcile with what the server
   sent — reading storage synchronously would have caused a hydration error. Fixed by loading
   the cart in `useEffect` after mount instead.
2. **Async route params**: Next.js 15+ changed dynamic route `params` from a plain object to a
   `Promise` that must be awaited. Missing this caused product and brand pages to silently hit
   `notFound()` for products that genuinely existed — caught via live testing (confirmed the
   backend returned valid data, then found the real cause), not left as a mystery.

## Dependency note

Pinned to Next.js 16.2.11 (current stable) rather than an older 14.x line — checked `npm audit`
after installing and found the 14.x line has real, patched high-severity advisories with no
further non-canary releases being cut for it. Two remaining `npm audit` findings on 16.2.11
(`postcss`, `sharp`) are Next's own build-time tooling dependencies — `sharp` specifically is
for server-side image optimization, which this project doesn't use (`images.unoptimized: true`
in `next.config.js`, since product images are base64 data URLs, not files needing resizing).
`npm audit fix --force`'s suggested "fix" is actually a downgrade to Next 9.3.3 (a 2020-era
release) — not applied, since that would break nearly everything just built.

## Local development

```bash
npm install
cp .env.example .env.local
# edit .env.local — set NEXT_PUBLIC_API_BASE_URL to your pawvy-app backend URL
npm run dev
```

## Building & running in production mode locally

```bash
npm run build
npm start
```

## Deploying

Push this to the existing `pawvy-website` GitHub repo (replacing its current contents — see the
chat for exact steps), Railway auto-detects Next.js and handles build/start via
`package.json`'s `build`/`start` scripts automatically. Set `NEXT_PUBLIC_API_BASE_URL` in
Railway's environment variables, same as before.

## Testing done before this was packaged

- Full production build (`next build`) completed cleanly — 22 routes, all 6 brand pages
  pre-rendering their real content.
- Confirmed via raw `curl` (not just visual inspection) that the server-rendered HTML for home,
  shop, product, and brand pages contains real content *before* any JavaScript runs — the actual
  thing this migration exists to fix.
- Confirmed dynamic per-product `<title>`/description actually varies correctly per product.
- Confirmed `/sitemap.xml` includes a real product URL and `/robots.txt` correctly excludes
  personalized pages.
- Ran a complete live signup -> verify -> set-password -> returning-login round trip against the
  real backend, through the same API calls the new pages make — confirmed nothing broke in the
  migration.
- Confirmed every page (including all the previously-untested-here auth/account pages) returns a
  clean 200 with no server error.

## Project structure

```
app/
  layout.js          — root layout, SEO metadata defaults, wraps CartProvider/Nav/WhatsApp
  page.js            — Home (Server Component)
  shop/page.js       — Shop (Server Component fetches initial data, ShopClient handles interactivity)
  shop/[id]/page.js  — Product detail (Server Component, dynamic per-product metadata)
  brands/[slug]/page.js — Brand pages (all 6 pre-rendered, real filtered products)
  cart/, login/, signup/, verify/, login-verify/, set-password/, account/  — client-rendered, ported directly
  stockist/, contact/, blog/  — structural placeholders, real content to come
  sitemap.js, robots.js — dynamic SEO files
lib/
  api.js             — API helper (works from both Server and Client Components)
  CartContext.jsx     — cart state, hydration-safe
  brandSlugs.js       — brand-to-URL-slug mapping, matches the current live site exactly
components/
  Nav.jsx, ProductCard.jsx, QtyStepper.jsx, WhatsAppButton.jsx, HomeCTAButtons.jsx, AddToCartSection.jsx
```
