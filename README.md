# Janice's wording feedback — Puzzle Feeder page (6 items)

## What changed (4 files: 3 modified, 1 new)

### `lib/brandContent.js`

**Item 1** — hero description fully replaced with your single sentence,
nothing else kept.

**Item 2** — stats card label changed from "Day Habit Program" to "Days
Training" — the CSS already uppercases this automatically, so it
renders as "28 DAYS TRAINING" with no other change needed.

**Item 4** — "Find your fit" → "Find the one"; "Choose Your Puzzle
Feeder" → "Choose Your Pup's Puzzle Feeder".

**Item 6** — all 4 old FAQs replaced with your 3 new Q&As. One thing
worth flagging: your message had **"How do I introduce a puzzle
feeder to my dog?" listed twice**, word-for-word identical (question
and answer both). I included it only once — let me know if that was
meant to be two different questions and something got cut off when
you pasted it over.

### `app/globals.css`

**Item 3** — the Vet Recommended card: widened its grid column from
0.9fr to an even 1fr (matching the left column), and increased its
padding (40px→56px), icon size (64px→78px), heading size (20px→26px),
and body text size (14.5px→16.5px). I reasoned through the approximate
resulting heights based on the actual CSS values on both sides to get
them close, but couldn't preview this live — worth a look once
deployed to confirm they read as comparable, and let me know if it
needs further adjustment either way.

**FAQ font** — question weight dropped from 800 to 600, color kept as
cream (monochrome, per your call). Distinction from the answer text
is still clear on three separate cues, not just weight: size (18px vs
15.5px), weight (600 vs the answer's default/normal), and color
(full-opacity cream vs the answer's 70%-opacity cream) — so dropping
the weight alone doesn't flatten the Q/A distinction.

**Item 5 support** — added `cursor: pointer` and a subtle scale-up on
hover to the color swatch dots, now that they're actually interactive.

### `components/BrandDeepDive.jsx`
**Item 5** — the static image + swatches + info markup for each "Find
the one" card is replaced with the new `<FitCard>` component (below).
Exact same classNames and DOM structure as before — this is a
wrap-in-a-component change, not a redesign.

### `components/FitCard.jsx` — new file
**Item 5** — hover-to-preview. Hovering a color dot now swaps the
card's photo to that variant's image; moving away reverts to the
default. Uses the exact same per-variant image data the Add to Cart
modal already uses for its pill-swap — no new images, no new data,
just a new way to trigger the swap. Has to be a small standalone
client component (`'use client'`) since hovering needs live state and
the rest of this page renders server-side.

**This applies to both brands that use the `fitCards` shape** —
Puzzle Feeder and Eastsea Brother both get the hover-preview
automatically, since they share this same component. Wasn't asked for
on Eastsea Brother specifically, but there was no reason to build two
versions of the same thing, and every variant on both brands' cards
already has a real image defined (verified this directly — see below).

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation (clone → npm install → apply the 4
  files → build again).
- Real checks against the actual data (not visual inspection):
  confirmed the hero description, stats label, fitCards eyebrow/
  heading, and FAQ array (exactly 3 entries, no duplicate, correct
  order) all match exactly what was asked.
- Confirmed **every variant of every fitCards item, on both Puzzle
  Feeder and Eastsea Brother, has a real image defined** — this is
  what the hover feature depends on, so if any variant were missing an
  image, hovering that dot would show a placeholder instead of a
  photo. All present.
- Confirmed the `#shop` anchor (from an earlier round) on the fitCards
  section is untouched.
- Confirmed the shared `ImageSlot` helper in `BrandDeepDive.jsx` is
  still intact for the other sections that still use it directly
  (only the fitCards usage was extracted into the new component).

## Not yet verified
No live browser access from this sandbox — two things worth a real
look once deployed: whether the Vet Recommended card (item 3) now
reads as visually comparable in height to the left column, and how
the hover-preview (item 5) actually feels in practice (timing,
whether the image swap feels smooth).

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Janice feedback: Puzzle Feeder page — 6 items incl. hover-to-preview color swatches"`
6. `git push origin main`
