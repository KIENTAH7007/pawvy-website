# Round 2 fixes — Salmoil FAQ order + GiGwi color/FAQ title

## What changed (2 files)

### `lib/brandContent.js`

**Item 1 — Salmoil FAQ reordered and one title renamed**: now
Refrigeration → Cats → "How much Salmoil should I give my dog/cat?"
(renamed from "...my dog?") → Size guide. Confirmed the size-guide
entry (referenced by the product page's "Not sure which size to get?"
links) still resolves correctly — reordering doesn't affect that link
since it matches by exact question text, not position.

**Item 3 — GiGwi's first FAQ question** renamed to "My dog does not
play with toy. Why?" — answer content unchanged.

### `components/BrandDeepDive.jsx`

**Item 2 — GiGwi's "EVERY DOG NEEDS ALL FOUR" eyebrow color fixed.**
Turned out to be a one-line inline style override: the standard
`.eyebrow` CSS class already defaults to your orange
(`var(--orange)`) for both the small dash and the text — which is
why the dash was already showing correctly. This one section
specifically had `style={{ color: 'var(--lime, #B4D93C)' }}` hardcoded
on top of that, overriding just the text to a lime green. Removed the
override entirely; it now falls back to the same orange the dash (and
every other section's eyebrow on the site) already uses, rather than
hardcoding the value redundantly.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Confirmed the Salmoil FAQ array is in the exact requested order,
  still exactly 4 entries, and the dosage-table content under the
  renamed question is completely unchanged — only the title moved.
- Confirmed the lime-color override is fully gone from the codebase
  (grepped for it directly) and that this specific `eyebrow` line now
  matches the same plain pattern used by every other section on the
  site (durability, fishGroups, fitCards, etc.) — not a special case
  anymore.
- Confirmed GiGwi's FAQ still has exactly 3 entries, with only the
  first question's title changed.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Salmoil FAQ reorder + rename, GiGwi eyebrow color fix, GiGwi FAQ title"`
6. `git push origin main`
