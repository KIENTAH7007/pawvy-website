# HOTFIX — 4 brand pages returning server error (500)

## This is for the Website folder (`pawvy-website`) only

3 files: `lib/matching.js` (new), `components/ProductAddButton.jsx`,
`components/BrandDeepDive.jsx`.

## Root cause — confirmed with the real error, not guessed

The out-of-stock sort delivery added a helper in `BrandDeepDive.jsx`
that imported `findMatches` from `ProductAddButton.jsx`. That file is
marked `'use client'` (it needs React state for the interactive Add to
Cart modal) — and React's Server/Client Component boundary explicitly
forbids calling **any** function from a `'use client'` file inside
server-rendered code, even a plain function with zero hooks or state.
Confirmed via the actual thrown error, reproduced against real data
before writing this fix:

```
Error: Attempted to call findMatches() from the server but findMatches
is on the client. It's not possible to invoke a client function from
the server, it can only be rendered as a Component or passed to props
of a Client Component.
```

This explains exactly why 4 brands broke and 2 didn't:

- **Lillidale, Puzzle Feeder, Salmoil, East Sea Brother** — all use
  `BrandDeepDive.jsx`'s `fitCards`/`fitCardGroups` rendering path, which
  hit the broken import directly.
- **GiGwi** was unaffected because its `CategoryBrowser.jsx` is itself a
  Client Component with its own local copy of the matching logic — no
  cross-boundary import.
- **BetterBone** was unaffected because it uses a fixed durability-level
  selector, not `fitCards`/`fitCardGroups` — the broken code path never
  runs for it at all.

## The fix

Moved `findMatches` into a new file, `lib/matching.js`, with **no**
`'use client'` directive — a neutral, framework-agnostic module either
kind of component can safely import. `ProductAddButton.jsx` now imports
it from there and re-exports it (so `FitCard.jsx`'s existing import
keeps working completely unchanged), and `BrandDeepDive.jsx` imports it
directly from the new neutral file instead of from the client-only
component. One real source of truth, correctly placed — not a
workaround.

## Verification performed — real reproduction, not just a build pass

- Reproduced the exact failure first: started a real backend with real
  seed data, ran the actual Next.js dev server against it, and hit all 6
  brand pages directly — confirmed all 4 affected brands returned 500
  with the exact error above, and GiGwi/BetterBone returned 200,
  matching what you reported precisely.
- Applied the fix, reran the identical test: **all 6 brand pages now
  return 200**, zero errors in the server log.
- Confirmed the pages aren't just returning 200 with an empty shell —
  checked the actual rendered HTML contains real product cards with
  real content (e.g. Lillidale's ProJoint supplement card and its FAQ
  text).
- Real cold-clone build: fresh `git clone` → applied all 3 files →
  `npm install` → `npm run build` — passed with no errors.
- Re-ran the full reproduction test a second time against the
  cold-clone copy specifically, this time using an actual **production
  build** (`next start`, not dev mode) — all 6 pages still 200.
- Byte-for-byte diff confirms every file in this zip matches what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "Hotfix: 4 brand pages returning 500 — findMatches called across a Server/Client Component boundary"
git push origin main
```

Railway auto-deploys from `main`. Should bring all 4 pages back up
immediately once deployed.
