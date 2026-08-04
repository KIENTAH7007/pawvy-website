# Feature: Lillidale feeding/dosage guide — v2, CSS-only tab selector

## Why this version exists
First version (already deployed) combined all three products'
tables into one long FAQ answer — you found it hard to read, having
to scroll/search past two irrelevant products' tables to find your
own. Second option considered was splitting into three separate FAQ
entries, but that just moves the clutter into the FAQ list itself
(more questions to scan). This version keeps ONE FAQ entry, but adds
a tab selector *inside* the answer — click your product, see only
that table.

## What changed (3 files this time)

1. **`lib/brandContent.js`**
   - `sizeGuideFaqQuestion` is still a function (same reasoning as
     before — only the 3 Supplements SKUs get the "size guide" link,
     not the other 15 grooming/HOCl SKUs), but now all three products
     resolve to the SAME single FAQ question again, since there's only
     one combined entry.
   - The FAQ answer itself now contains a small tab selector: three
     radio inputs (visually hidden) + three `<label>`s styled as pill
     buttons (ProHealth / ProJoint / Plaque Guard), followed by three
     content panels. Clicking a label checks its radio; CSS sibling
     selectors show only the matching panel and highlight the active
     label. **No JavaScript** — same "prefer a native/declarative
     mechanism over a JS-dependent one" approach already used
     elsewhere on this site (the FAQ auto-open behavior in
     `components/FaqAutoOpen.jsx` is the precedent). Defaults to
     ProHealth shown (radio #1 has `checked` in the raw HTML).

2. **`app/globals.css`**
   - New rules under `.feed-tabs` — hides the radio inputs, styles the
     labels as pill/tab buttons, and uses `:checked ~` general-sibling
     selectors to show only the matching `.feed-panel` and highlight
     the active label. ~18 lines added, nothing else touched.

3. **`app/shop/[id]/page.js`**
   - Unchanged from the previous delivery — still supports
     `sizeGuideFaqQuestion` as either a string (Salmoil) or a function
     (Lillidale). Included again here since this delivery replaces the
     first one; if you already applied the first zip, this file's
     content is identical to what you already have.

## Why not a real `<select>` dropdown
A native `<select>` can't switch which content block is visible
without JavaScript — there's no CSS-only way to react to an `<option>`
being chosen. Styled radio buttons (pill/tab buttons here) are the
closest CSS-only equivalent that still gives a one-click "pick your
product, see just that" experience without introducing a JS
dependency into what's otherwise static content data.

## Verified
- `npm run build` — passes clean, same as before (`/shop/[id]` and
  `/brands/[slug]` still correctly `ƒ Dynamic`, not statically
  prerendered, so the build has no live-backend dependency).
- Real logic test: confirmed exactly ONE feeding-related FAQ entry
  exists (not three), all three products resolve to that same shared
  question, and the link-suppression logic for non-Supplement products
  still works (tested against fabricated ProHealth/ProJoint/Plaque
  Guard/Lazy Wash/Ear Cleaner records).
- HTML well-formedness check on the new tab markup (tag-matching
  pass) — passes clean.
- **Structural id cross-check**: every radio `id`, every label `for`,
  and every panel's `data-panel` value line up exactly (3/3/3, all
  matching), and every radio id used in the HTML has a corresponding
  `#id:checked` rule in the CSS — checked by parsing both files
  programmatically rather than eyeballing it.
- Regression check: Salmoil's existing (string-form)
  `sizeGuideFaqQuestion` still resolves correctly.

## Not yet verified (no live backend access from this sandbox)
Same limitation as before — I can't load the actual page in a browser
to visually confirm clicking a tab really swaps the panel. Everything
that can be checked without a live browser has been checked (HTML
well-formedness, CSS/HTML id cross-referencing, the actual selector
logic reasoning below), but a real click-through after deploy is
still worth doing.

**If you want extra confidence before trusting this blind**: open the
live page after deploy, open browser dev tools, and manually add
`checked` to the ProJoint radio in the Elements panel (or just click
its label) — you should see the ProHealth panel disappear and the
ProJoint panel appear, with the ProJoint label turning orange. That's
the whole mechanism working as one click.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
   ("Copy and Replace") — this REPLACES the previous feeding-guide
   delivery's changes to `lib/brandContent.js` and `app/shop/[id]/page.js`
   with this version, and adds the new `app/globals.css` rules.
4. `git add -A`
5. `git commit -m "Redesign Lillidale feeding guide as single FAQ entry with CSS-only tab selector"`
6. `git push origin main`

Railway auto-deploys `pawvy-website` from `main` on push.
