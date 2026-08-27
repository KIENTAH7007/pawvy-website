# Pawvy Website — Hardness Selector, Bordered Card Treatment

Target branch: **staging**
Repo: `pawvy-website`

Applies the "Bordered card" option you picked from the 3 mockups.

## What changed

Same selector, same behavior (click an option → scroll to and
highlight the matching durability card) — only the visual presentation
changed, to make it actually register as something to interact with:

- Now sits in its own **white card with a 2px orange border**, clearly
  separated from the surrounding page content rather than blending into
  the section's text flow.
- Added a small **paw icon** next to the question.
- Added a **subtitle** — "Tap an option to jump to the right pick" —
  directly nudging that this is interactive.

`components/HardnessSelector.jsx` and `app/globals.css` — no other
files touched.

## Verification performed

- Full production build (`npm run build`) — clean, no errors.
- Confirmed no leftover references to the old CSS class
  (`.hardness-selector-label`) anywhere in the codebase — fully
  replaced, not just added alongside.
- Confirmed against the real current `origin/staging` (fetched fresh)
  that exactly these 2 files changed this round.
- Both files byte-diffed against what was actually build-tested —
  identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   app/globals.css
#   components/HardnessSelector.jsx

git add .
git commit -m "Hardness selector: bordered-card visibility treatment (per approved mockup)"
git push origin staging
```
