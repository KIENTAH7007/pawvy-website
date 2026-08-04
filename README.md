# Pawvy Website — Patch: link product pages to the Salmoil sizing FAQ

Applies on top of `KIENTAH7007/pawvy-website` @ `main`. 5 files
changed/added. Build verified clean via a full end-to-end test: cloned
your real `main` fresh, applied this exact patch zip, ran
`npm install && npm run build` from a cold start.

## What changed

You asked for a real clickable link from each Salmoil product page to
the sizing FAQ table, instead of repeating the sizing explanation in
every product's description. Here's how it works:

1. **`lib/brandContent.js`** — added `faqSlug()`, a small helper that
   turns an FAQ question into a stable URL anchor (e.g.
   `#which-salmoil-size-should-i-get...`). Also added a
   `sizeGuideFaqQuestion` field on Salmoil's brand content, pointing at
   the exact FAQ question to link to.
2. **`app/brands/[slug]/page.js`** — each FAQ `<details>` now has an
   `id` built from that same `faqSlug()` function, so it's a valid
   link target.
3. **`components/FaqAutoOpen.jsx`** *(new file)* — a small client
   component that, when the page loads with a matching URL hash, opens
   that FAQ item and smoothly scrolls it into view. Native `<details>`
   elements don't auto-open just because a link points at them — the
   browser would scroll to the closed question, and the person would
   still have to click it themselves. This makes the link actually land
   on the visible answer.
4. **`app/shop/[id]/page.js`** — every Salmoil product page now shows
   *"Not sure which size to get? See our sizing guide →"* right below
   the description, linking to `/brands/salmoil#<slug>` — which opens
   straight to the size table. This is driven by the
   `sizeGuideFaqQuestion` field, so it only appears for brands that
   have one configured (currently just Salmoil) — nothing to maintain
   per-product, and it'll automatically work for any future brand you
   add the same field to.
5. **`app/globals.css`** — small style for the new link (orange, matches
   the site's link/CTA color).

## Descriptions updated too — `salmoil-descriptions.md`

Since the sizing explanation now lives behind a real link that appears
automatically, I simplified the closing line in all 6 recipe
descriptions back down to a plain "Available in 150ml, 250ml, or
500ml." — no need to reference the guide in the text itself anymore, or
it'd say the same thing twice back-to-back (once in your typed
description, once in the auto-generated link right below it).
Re-download the updated file, same filename.

## Why this approach instead of an HTML link inside the description text

I considered making the *description field itself* support a clickable
link (same trusted-HTML approach as the FAQ answers). Decided against
it: descriptions are typed by hand into a plain textarea across 217
SKUs, and turning that field into an HTML-rendering one means any
stray `<` or `&` someone types casually later could break the layout.
The FAQ answers are a much smaller, more carefully-authored set where
that trade-off is easier to manage. Keeping the link as a separate,
code-driven element next to the description avoids that risk entirely
and, as a bonus, doesn't need retyping into all 18 SKUs — it just works
once the brand has `sizeGuideFaqQuestion` set.

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Salmoil: link product pages to the sizing FAQ, with auto-open + scroll"
git push origin main
```

## What to check live after deploy

Open any Salmoil product page — confirm the "Not sure which size to
get?" link appears below the description, and clicking it lands on the
`/brands/salmoil` page with the sizing FAQ already expanded and
scrolled into view (not just a plain jump to a closed question).
