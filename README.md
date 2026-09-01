# Pawvy Website — Point 8 Wording, Without Touching SEO

Target branch: **staging**
Repo: `pawvy-website`

## The idea, confirmed against the real code first

You're right that trimming `product.description` in Pawvy App would
cost SEO — confirmed exactly why: that field powers both the meta
description tag *and* the full on-page text on the product's own
canonical detail page (`/shop/219-...`). Trimming it there for real
would genuinely reduce what Google indexes for that page.

But the Wild Balance **brand** page is a completely different page,
showing the same product in a different context. There's no reason it
has to display the same text — so `FrozenYoghurtToggle.jsx` (the
component that renders this product specifically on the brand page)
now shows a short, curated excerpt hardcoded in the website's own
code, instead of the raw database field. The real `product.description`
in Pawvy App is completely untouched — you don't need to change
anything there.

## Verification — the part that actually matters here

Seeded a real product with your real, full, unedited description text,
ran the real backend and production Next.js server together, and
fetched both pages for real:

- **The brand page's actual visible `<p>` tag** shows the short
  excerpt, ending cleanly at "110g." — none of the trimmed phrases
  present.
- **The product's own detail page** — both its visible on-page text
  *and* its `<meta name="description">` tag — still show the complete,
  original, untouched text, word for word. Nothing about its SEO
  changed at all.

(One thing worth mentioning since it briefly confused my own first
check: Next.js embeds the full product data in a hidden payload on
every page for client-side use — a naive text search across the whole
page will "find" the full description there even on the brand page.
That's expected and harmless; what matters is the actual visible `<p>`
tag, which I checked directly.)

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   components/FrozenYoghurtToggle.jsx

git add .
git commit -m "Show a curated excerpt for the Frozen Yoghurt product on the Wild Balance brand page, leaving the real product.description (and its SEO value on the product's own page) completely untouched"
git push origin staging
```
