# Janice's wording feedback — Eastsea Brother page (7 items) + site-wide font-weight sweep

## What changed (3 files)

### `lib/brandContent.js`

**Items 1, 2, 3, 7** — straightforward text updates: hero description
clause removed, intro body clause removed, fitCards subtitle replaced,
all 4 old FAQs replaced with your 3 new ones. One small fix flagged:
your shelf-life answer said "the freeze-dried treats **is**
shelf-stable" — corrected to "**are**" (subject-verb agreement).

**Item 4** — swatch colors. Rather than picking arbitrary colors, I
reused the **exact same palette already established** in the "Which
Fish For Your Furkid?" section just above this one on the same page:
White Fish `#E8CE85` (Pollack, Flatfish, Pollack Stick), Red Fish
`#E8916E` (Salmon), Whole Fish `#7FB0AA` (Capelin, Sandlance). Green
Lipped Mussels doesn't belong to any of those three existing
categories, so it gets its own new color (`#8DA47E`, a sage green)
rather than borrowing one that would misleadingly suggest it's grouped
with a category it isn't part of. Every size variant within one fish
keeps that fish's color — a size isn't a different color, so there was
no reason to vary it further within a card.

**Item 5** — Pollack Stick split into its own standalone card,
positioned after Sandlance and before Green Lipped Mussels as
requested. Pollack's card is now "2 sizes" instead of "3", and the
`seriesExcludes: ['Stick']` guard on its remaining two variants is no
longer needed (there's no Stick variant left in that card to
accidentally match against) so I removed it — one less thing for a
future edit to trip over. The new Pollack Stick card matches the exact
same real backend data it always did (`seriesIncludes: 'Pollack'`,
`variationIncludes: 'Stick'`), so nothing about which real product it
points to changed, only where it's displayed.

### `app/globals.css` + `app/cart/page.js`

**Item 6 + your follow-up ask** — the nav bar's font-weight was 800;
dropped to 600, same as you decided for the FAQ questions earlier.
Since you also asked me to check the *entire* site for any other
`font-weight: 800` and bring all of them down to 600 too: I found
**39 occurrences in `globals.css`** (everything from card titles and
badges to buttons, tags, table headers, form labels — the full list is
in my conversation reply, not repeated here) plus **2 inline instances
in `app/cart/page.js`** (the checkout customer-name display and the
"🔥 Popular right now" heading). All 41 are now 600. Nothing else was
touched — I specifically searched for the literal string
"font-weight: 800" / "fontWeight: 800" so this didn't accidentally
touch unrelated numbers (e.g. `max-width: 800px` on the subhero, which
I confirmed by hand is still untouched, or the Google Fonts `@import`
line which lists 800 as a downloadable weight variant but isn't an
applied style anywhere anymore — left as-is since removing it wasn't
part of what you asked and it's harmless either way).

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Real checks against the actual data: confirmed all 4 text items
  match exactly, confirmed the FAQ array (3 entries, grammar fix
  applied), confirmed every swatch color assignment matches the
  reasoning above and genuinely matches the fishGroups palette values
  (not just visually similar — checked the literal hex strings are
  identical).
- **Item 5 specifically verified**: Pollack now has exactly 2
  variants, Pollack Stick is a new standalone card in the exact
  requested position, and its matching data (`seriesIncludes`/
  `variationIncludes`) — the actual link to the real product in your
  database — is byte-identical to what it was before the split, so
  Add to Cart still finds the same real product.
- **Font-weight sweep verified exhaustively**: grepped the entire
  codebase (excluding `node_modules` and build artifacts) for every
  spelling variant of `font-weight: 800` after the change — zero
  remaining. Also manually confirmed the two things that legitimately
  still contain the digits "800" are unrelated (an unrelated
  `max-width: 800px`, and the font-loader import) rather than missed
  instances.

## Not yet verified
No live browser access from this sandbox — worth a visual pass on the
new Pollack Stick card's placement/spacing in the grid, and on how the
whole site reads now that so many elements dropped from 800 to 600 at
once (this was a genuinely wide-reaching change — 41 elements across
nav, buttons, cards, badges, forms, tables) to confirm nothing feels
*too* light now that it's applied everywhere at once, not just in the
one or two places we tested it first.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Janice feedback: Eastsea Brother page (7 items) + site-wide font-weight 800 to 600"`
6. `git push origin main`
