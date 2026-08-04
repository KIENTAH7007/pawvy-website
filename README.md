# Feature: Lillidale feeding/dosage guide (Salmoil-style)

## What changed
Two files:

1. **`lib/brandContent.js`**
   - Added `sizeGuideFaqQuestion` to Lillidale's brand content block.
     Unlike Salmoil (a plain string, since every Salmoil SKU is a
     fish-oil bottle and the sizing question applies brand-wide),
     Lillidale's is a **function** of the product — only the 3
     Supplements SKUs (ProJoint, ProHealth, Plaque Guard) have a real
     feeding-by-weight decision to make, not the other 15 grooming/HOCl
     SKUs. The function checks the product's `item_series` +
     `variation` text for "ProJoint", "ProHealth", or "Plaque Guard"
     and returns the matching FAQ question, or `null` to skip the link.
   - Added one new FAQ entry, `'How much should I feed, and how long
     will each size last?'`, containing five tables total: a
     feeding-by-weight table + a size-duration table each for ProHealth
     and ProJoint, and one combined table for Plaque Guard. Same
     `faq-table`/`faq-table-wrap` CSS classes Salmoil already uses — no
     CSS changes needed.

2. **`app/shop/[id]/page.js`**
   - The "Not sure which size to get? See our sizing guide →" link now
     supports `sizeGuideFaqQuestion` being either a plain string
     (Salmoil's existing behavior, unchanged) or a function that's
     called with the current `product` and returns a question string
     or `null` (Lillidale's new behavior). If `null`, no link renders
     for that product — so the 15 non-Supplement Lillidale SKUs show no
     size-guide link at all, exactly as before.

## Why a function instead of just adding Lillidale as a string
A plain string would have put the "see our sizing guide" link on
**every** Lillidale product page, including grooming and HOCl
products that have no feeding table to link to — clicking through
would land on an unrelated FAQ answer. The function form scopes the
link to only the 3 products it's actually relevant to.

## Plaque Guard sizing note
The source FAQ/duration numbers you sent reference a 70g pack, but the
real, current size (confirmed against the live Lillidale Singapore
storefront) is 60g. Scaled the day-count figures down proportionally
(×60/70) rather than using the 70g numbers as-is — e.g. "140 days" at
70g becomes "~120 days" at 60g. Marked with "~" since it's a scaled
estimate, not a number from Lillidale's own documentation.

## Verified
- `npm run build` — passes clean. `/shop`, `/shop/[id]`, and
  `/brands/[slug]` are all marked **ƒ (Dynamic)** — server-rendered on
  demand, not statically prerendered at build time — so the build
  doesn't attempt to reach the live backend at all, and passing here
  is a real signal, not a false one.
- **Real logic smoke test** (not just `node --check`): imported the
  actual `sizeGuideFaqQuestion` function and ran it against 6
  fabricated product records shaped exactly like real
  `/api/shop/products` rows (`item_series` + `variation`) — 3 from
  Supplements (should get a link) and 3 from Grooming/HOCl (should
  not). All 6 passed.
- Confirmed the FAQ question string used inside the function and the
  one used as the FAQ array key are character-identical, so the
  generated anchor id (`faqSlug`) actually matches between the product
  page's link and the brand page's `<details>` element.
- **Regression check**: re-ran Salmoil's existing `sizeGuideFaqQuestion`
  (still a plain string) through the same code path to confirm the
  change to `app/shop/[id]/page.js` didn't break it.
- **HTML well-formedness check** on the new FAQ answer's embedded
  table markup (tag-matching pass across all 5 tables) — passes clean,
  since malformed HTML inside `dangerouslySetInnerHTML` wouldn't throw
  a JS error, it'd just render wrong silently.

## Not yet verified (couldn't be, from this sandbox)
No network access to the live Railway-hosted backend from here, so I
could not visually load the actual rendered page in a browser. The
build passing + the logic/HTML checks above cover everything that can
be verified without a live backend, but a real click-through — landing
on a ProHealth product page, clicking the link, confirming it scrolls
to and auto-expands the right FAQ answer with all three tables
legible — is still worth doing once this is live, per the standing
project practice of not fully trusting a clean build alone.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
   ("Copy and Replace") — only touches the two files above
4. `git add -A`
5. `git commit -m "Add Lillidale feeding/dosage guide (ProHealth/ProJoint/Plaque Guard)"`
6. `git push origin main`

Railway auto-deploys `pawvy-website` from `main` on push.
