# Janice's wording feedback — Lillidale page (13 items + FAQ replacement)

One combined delivery per your instruction — the 13 copy/layout items
plus the full FAQ replacement, done in one pass.

## What changed (3 files)

### `lib/brandContent.js` — Lillidale's content block

**Items 1, 3** — Supplements and Wellness pillar-card body text updated.

**Item 2** — handled together with item 11: since the pillar link text
is auto-generated from each pillar's own `heading` field ("Shop
{heading} ↓" — see the component change below), I renamed the
Antimicrobial pillar's heading from "Antimicrobial healthcare" to
"Antimicrobial Care" so it automatically produces "SHOP ANTIMICROBIAL
CARE" as you specified, rather than "SHOP ANTIMICROBIAL HEALTHCARE".

**Item 4** — "Real results" subtitle updated.

**Items 5, 6, 7** — testimonial card titles/product name/source
updated. Note on item 7: the old source line described BOTH how
Plaque Guard and Dental Spray were used ("mixed into meals daily...
between brushes") — that descriptive detail is gone along with the
rest of the line per your instruction to stop at the handle, not just
the visible text before it.

**Item 8** — added a `productImages` field to each of the 3
testimonial entries, reusing the same product photos already used on
the shop cards elsewhere on this page (no new images needed). The
Plaque Guard + Dental Spray card shows both product photos since two
products are named in that story.

**Items 9, 10** — Supplements sub text and all 3 product names updated.

**Items 11, 12** — Antimicrobial section eyebrow/heading/sub updated,
plus "Ear Cleanser" → "Ear Cleaner" in the shop card (this also
required the matching rename in item 5's testimonial, done together).

**Item 13** — Wellness section heading/sub updated.

**FAQ section** — fully replaced with your 7 new Q&As, with the
existing "How much should I feed, and how long will each size last?"
entry kept exactly as-is and moved to last, per your instruction (it's
what the "Not sure which size to get?" links on the ProHealth/ProJoint/
Plaque Guard product pages point to — removing or reordering it would
have broken those links, so I left its content and position
untouched other than being last in the list).

Two things worth flagging on the FAQ content itself:
- **"Why does Lillidale use pelletized feed?"** contained a
  markdown-style link (`[text](url)`) in your source — since FAQ
  answers render as raw HTML, not markdown, I converted it to a real
  `<a>` tag, pointing to your `lillidale.sg` blog post, opening in a
  new tab so customers aren't pulled away from Pawvy without warning.
  I also turned the numbered "1./2." list into a real HTML ordered
  list rather than plain numbered text.
- **Small grammar fix**: "we recommend adding Lillidale ProHealth to
  fully **supports** their gut" → "to fully **support** their gut"
  (subject-verb agreement). Flagging this explicitly rather than
  silently changing wording, in case you'd rather it match your
  source text exactly.

### `components/BrandDeepDive.jsx`
- **Item 2**: pillar link text changed from "Jump to {heading}
  ↓" to "Shop {heading} ↓" — the existing CSS already uppercases this
  text automatically, so no separate uppercase handling was needed in
  the component.
- **Item 8**: testimonial cards now render a row of small product
  photo thumbnails above the product name label when `productImages`
  is present on that entry.

### `app/globals.css`
- New styles for the item-8 product-image thumbnails on testimonial
  cards (`.lil-ba-product-thumbs`, `.lil-ba-product-thumb`).
- New styles for ordered lists and links inside FAQ answers
  (`.faq-item .faq-answer ol/li/a`) — needed for the pelletized-feed
  FAQ's numbered list and external link, which didn't have any
  existing styling to fall back on.

## Verified
- `npm run build` — passes clean, including a genuine cold-clone
  simulation (fresh `git clone`, `npm install` from scratch, delivered
  files applied on top, build run again).
- Real logic tests against the actual data (not visual inspection):
  confirmed all 13 items individually, confirmed the FAQ array is
  exactly 8 entries (7 new + 1 kept) in the right order, confirmed the
  4 old FAQs are gone, confirmed the size-guide entry's internal tab
  structure is untouched and `sizeGuideFaqQuestion` still correctly
  resolves to it.
- **Confirmed the display-name-only renames (ProJoint → "ProJoint -
  Joint Supplement", Ear Cleanser → Ear Cleaner, etc.) did NOT touch
  the real backend matching fields** (`seriesIncludes` and friends) —
  those are separate from the customer-facing `name` field, so Add to
  Cart still works off the real database text, unaffected by any of
  today's renames. Also confirmed the pillar/shop-grid anchor ids
  (`supplements`/`antimicrobial`/`wellness`) are unchanged, so the
  `#shop` button and pillar navigation from previous rounds still work.
- HTML well-formedness check (tag-matching pass) on every new
  multi-paragraph/list FAQ answer, plus the untouched size-guide entry
  as a regression check — all clean.

## Not yet verified
No live browser access from this sandbox — worth a visual pass on the
new testimonial product-image thumbnails (do they look right at that
size, on mobile) and the pelletized-feed FAQ's numbered list/link
styling, since neither had a prior visual reference on this site to
compare against.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Janice feedback: Lillidale page — 13 copy/layout items + full FAQ replacement"`
6. `git push origin main`
