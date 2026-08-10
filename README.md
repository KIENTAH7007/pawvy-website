# SEO: Open Graph, Twitter Cards, JSON-LD structured data

## This delivery is for the Website folder (`pawvy-website`) only

23 files total — most were already delivered in earlier sessions (SEO
canonical tags, product naming, GiGwi sort order, favicon revision, image
bucket migration) and are unchanged from what you already applied; only
the files below have new changes from this delivery. Safe to unzip the
whole thing either way.

## What this delivers

**New shared helper** — `lib/seo.js`:
- `buildOgMeta()` — builds the `openGraph`/`twitter` metadata object the
  same way on every page, so nothing drifts between pages.
- `buildProductJsonLd()` — Product structured data: **name, description,
  image, brand, url only** — deliberately no `offers` (price/
  availability), per your call: prices/discounts change often enough
  that a stale cached price in Google's results risked looking
  untrustworthy or triggering a manual review, for a benefit that wasn't
  worth that risk yet. Easy to add later if you change your mind — one
  field in one function.
- `ORGANIZATION_JSON_LD` — site-wide Organization schema, rendered once
  in the root layout.

**New file** — `public/og-default.jpg`: the logo+tagline image you sent,
used as the fallback share image for every page that doesn't have a more
specific one (homepage, shop grid, blog, stockist).

**Per-page OG/Twitter images, each using the most specific real image
available:**
- Homepage / shop / blog / stockist → the default logo image
- Brand pages → that brand's own existing hero photo (already on disk
  from earlier work — no new asset needed)
- Product pages → that specific product's own photo (via the bucket),
  falling back to the default logo image for the rare product with no
  photo uploaded yet

**Product JSON-LD** rendered directly on the product detail page.

## Verification performed — real, not just a build pass

This one matters more than usual to actually prove, since metadata tags
don't show up as errors if they're silently wrong — a build can pass
while `og:image` quietly points at the wrong thing. So beyond the
standard cold-clone build, I ran a genuine end-to-end test:

1. Started a real instance of the `pawvy-app` backend locally (seeded
   database, a real inserted test product with a description and an
   image path).
2. Built and started the actual `pawvy-website` production server,
   pointed at that real backend.
3. Fetched the real rendered HTML of a product page, a brand page, and
   the homepage, and confirmed:
   - Product page: `<title>`, `og:title`, `og:description`,
     `twitter:*`, and the Product JSON-LD block all show the correct
     product-specific values, and `og:image`/JSON-LD `image` point at
     that product's own photo — not the default.
   - Brand page (GiGwi): `og:image` correctly uses GiGwi's own hero
     photo, not the site default.
   - Homepage: `og:image` correctly falls back to the default logo
     image.
   - Exactly one Organization JSON-LD block and exactly one Product
     JSON-LD block present on the product page — no duplication.
4. Ran this full test a second time against the cold-clone-built copy
   specifically, not just the working directory, with a fresh test
   product to rule out any leftover state.
5. Byte-for-byte diff confirms the files in this zip match what was
   cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "SEO: Open Graph, Twitter Cards, and Product/Organization JSON-LD"
git push origin main
```

Railway auto-deploys from `main`. To see the real result once live, the
most reliable check is Facebook's Sharing Debugger or Twitter's Card
Validator (both let you paste a URL and see exactly what they'll render)
— WhatsApp/iMessage previews can lag behind a cache that takes a bit to
refresh after a deploy.
