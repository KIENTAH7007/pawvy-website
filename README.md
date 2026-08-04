# Pawvy Website — Patch: show product descriptions on brand pages

Applies on top of `KIENTAH7007/pawvy-website` @ `main`. 4 files changed,
1 new file. Build verified clean via full end-to-end test: cloned your
real `main` fresh, applied this exact patch zip, ran
`npm install && npm run build` from a cold start.

**Pairs with `pawvy-app-patch.zip` — apply both.** This half is
useless without that one: the actual root cause was that brand pages
never fetched the description field at all.

## The real root cause

Descriptions already showed correctly on `/shop/[id]` (the dedicated
product page) but never on brand pages, regardless of whether a card
had a variant-picker modal or not. I checked the backend before
touching any frontend code: the API endpoint brand pages use to fetch
their product list (`GET /api/shop/products`) simply never included
the `description` column in its query — only the single-product
endpoint (`GET /api/shop/products/:id`) did. No amount of frontend
work would have surfaced something the page never had access to in the
first place.

## What changed

**`pawvy-app` (paired patch)** — added `p.description` to the list
endpoint's SELECT. Verified with a real request against the real
route (not just a syntax check): seeded a description on one product,
confirmed it round-trips through `/api/shop/products` correctly, and
that every other product correctly has no description. Re-ran that
exact test against the freshly cloned + patched repo, not just my
working copy.

**`components/ProductAddButton.jsx`** — now built with `forwardRef` and
exposes an `openInfo()` method. The existing variant-picker modal (the
one that already showed for multi-variant products) now also displays
the description of whichever variant is currently selected — updates
live if someone changes the size/flavor pick. The Add to Cart button's
own click behavior is completely unchanged: still instant-add for a
single-variant product, still opens the same modal for multi-variant.

**`components/DeepDiveCards.jsx`** *(new file)* — every card across
every brand page (BetterBone's durability cards, Puzzle
Feeder/Lillidale/Salmoil's fit cards, GiGwi's category cards) now has
its image/title area wired to call that `openInfo()` — separate from
the Add to Cart button. This is what answers your actual question:
**cards that used to go straight to instant-add with no modal at all
now open the info modal (showing the description) when you click the
image or title — the Add to Cart button itself still instant-adds with
zero extra clicks, unchanged.** Cards that already had a modal just
gained the description text inside it.

This had to be a new file, not added directly into
`components/BrandDeepDive.jsx`: these cards need `useRef` and
`onClick`, which requires `'use client'` — but `BrandDeepDive.jsx` is
a Server Component (it doesn't have that directive, and adding hooks
directly into it broke the build). `BrandDeepDive.jsx` just imports and
renders these new components, the same way it already does with
`RecipeSelector`/`CategoryBrowser`.

**`components/CategoryBrowser.jsx`** — GiGwi's card component already
lived in its own file, so this one just got the same `openInfo()` wiring
added directly, no extraction needed.

**`app/globals.css`** — small addition: `.fit-modal-description` for
the new description text inside the modal.

## An honest limitation of this delivery

I don't have a way to simulate real clicks/JS execution in this
sandbox. I've verified: the build compiles clean (structural
correctness), and the actual data fix with a real request against a
real route (the description genuinely flows through now). What I have
NOT done is watch a browser actually open the modal on a card click —
given how the FAQ auto-open bug played out (looked right on paper,
didn't work first time in your browser), I don't want to overstate
confidence here. Worth a real click-through on a few different card
types (a BetterBone single-variant card, a multi-variant one, and a
GiGwi card) after deploy.

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Show product descriptions on brand page cards, click-to-open on every card type"
git push origin main
```

Also apply `pawvy-app-patch.zip` (same flow, other repo) — required for
this to actually show anything, since descriptions won't reach the page
at all without it.

## What to check live after deploy

- A card that used to instant-add with no modal (e.g. most BetterBone
  durability cards) — click the image/title, confirm the info modal
  opens showing the description (once one exists for that product —
  remember only BetterBone and Salmoil have descriptions filled in so
  far). Click Add to Cart directly (not the image) — confirm it still
  instant-adds with no modal, unchanged.
- A multi-variant card (Puzzle Feeder, Lillidale, Salmoil) — click
  through different size/flavor options inside the modal, confirm the
  description text updates to match whichever variant is selected.
- A GiGwi card — same click-to-open-info check.
- A product with no description filled in yet — confirm the modal
  still works fine (image, variant picker, Add to Cart), just without a
  description block, rather than showing something broken/empty-looking.
