# Pawvy Website — Revert: remove click-to-show-description on brand page cards

Reverts the previous "Show product descriptions on brand page cards"
patch. Applies on top of `KIENTAH7007/pawvy-website` @ `main`. Build
verified clean via full end-to-end test: cloned your real `main`
fresh, applied this exact patch zip, ran `npm install && npm run
build` from a cold start.

**No apology needed — this happens, and reverting cleanly is a normal
part of trying things out.**

## What this does

Removes the feature entirely from dedicated brand pages
(`/brands/[slug]`) — cards go back to exactly how they behaved before:
click Add to Cart, single-variant products add instantly, multi-variant
products open the existing size/flavor picker modal (no description in
it). No click-anywhere-to-see-description behavior anymore.

**Untouched, as requested**: the Shop page (`/shop`) still works
exactly as it did before any of this — click a product card there,
still lands on `/shop/[id]`, description still shows on that page. That
was never part of what got reverted.

## What changed

- **`components/ProductAddButton.jsx`** — reverted to its plain form
  (no `forwardRef`, no `openInfo()`, no description text in the modal).
  Back to exactly what it was before.
- **`components/BrandDeepDive.jsx`** — durability cards, fit cards, and
  fit-card-groups reverted to their original inline markup, no
  click-to-open-info wrapper.
- **`components/CategoryBrowser.jsx`** — GiGwi cards reverted the same
  way.
- **`app/globals.css`** — removed the `.fit-modal-description` rule
  that was only there for this feature.

## One manual step this zip can't do — please delete this file

`components/DeepDiveCards.jsx` was a **new file** added for this
feature, and nothing imports it anymore after this revert. A zip
"copy and replace" can only add/overwrite files, never delete them —
so after applying this patch, please manually delete
`components/DeepDiveCards.jsx` from the repo.

I checked what happens if this step gets missed: the build still
compiles clean either way (it's just an unused file sitting there,
nothing references it), so it's not urgent or breaking — just tidiness.
Delete it whenever's convenient.

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
rm components/DeepDiveCards.jsx
git add -A
git commit -m "Revert: remove click-to-show-description on brand page cards"
git push origin main
```

Also apply `pawvy-app-patch.zip` (same flow, other repo) — reverts the
matching backend change.

## What to check live after deploy

Visit any brand page — click a card's image/title, confirm nothing
happens (no modal opens) unless it's a multi-variant product, in which
case the original size/flavor picker still opens as before, just
without any description text in it. Click Add to Cart directly — same
behavior as always (instant-add or picker modal, depending on the
product).
