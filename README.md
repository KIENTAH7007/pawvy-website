# Pawvy Website — patch: fix modal "jumping" bug, cleaner Size/Flavor picker

## Bug 1: modal jumping when mouse leaves the card
**Root cause:** the modal overlay uses `position: fixed`, which normally
positions relative to the browser viewport — but per CSS spec, if any
*ancestor* element has a `transform` set, fixed-position descendants
position relative to *that ancestor* instead. Both `.durability-card` and
`.pf-fit-card` apply `transform: translateY(-3px)` on `:hover`. So while
hovering the card, the modal was trapped inside the card's box (looked
"stuck" near the card); the instant your mouse left the card, that hover
transform disappeared, the containing block reverted to the real viewport,
and the modal visibly snapped to its correct centered position — the
"jumping" you saw.

**Fix:** the modal now renders through a React portal directly into
`document.body`, completely outside the card's DOM tree, so it's never
affected by the card's hover state. This is the standard fix for this exact
class of bug.

## Bug 2/Feedback: cleaner Size + Flavor picker
Replaced the flat "Soft Classic Mini / Soft Beef Mini / Soft Classic Small /
..." pill list with two dropdowns — Size and Flavor — matching the pattern
already on pawvy.co. Parses each real product's own `variation` text (e.g.
"Soft Classic Mini") into flavor + size automatically, so it stays correct
if sizes/flavors are added or removed from the catalog later — nothing
hardcoded.

This only applies to BetterBone-style "dynamic" cards (where the real
options aren't known ahead of time). Puzzle Feeder's cards — 2-3 known
colors — still use the simple pill list, since a full dropdown UI would be
overkill for "pick Green or Pink."

## Files touched
- `components/ProductAddButton.jsx` — portal + Size/Flavor picker
- `app/globals.css` — new `.fit-modal-selects`/`.fit-modal-field` styles

`npm run build` passes clean (Next.js 16, Turbopack). Manually swept for
unimported-reference bugs — nothing found. `react-dom` (needed for the
portal) is already a project dependency, no install step needed.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Fix modal jumping bug (portal to body), add Size/Flavor dropdown picker"
git push origin main
```
Railway auto-deploys from `main` on push.
