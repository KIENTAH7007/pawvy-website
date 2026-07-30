# Pawvy Website — HOTFIX: Puzzle Feeder page crash

## The bug
`components/BrandDeepDive.jsx` had `import { Fragment } from 'react'` but the JSX
still referenced `React.Fragment` — `React` itself was never imported as a namespace,
so this threw `ReferenceError: React is not defined` the moment the intro section
actually rendered.

**Why this passed `npm run build` locally but crashed live:** the `/brands/[slug]`
route is server-rendered on demand (marked `ƒ` in the build output), not statically
prerendered — so the buggy line never actually executed during `next build`'s static
generation step. It only ran at real request time on Railway, which is why the crash
only showed up once you loaded the live page.

## The fix
Changed `<React.Fragment key={i}>...</React.Fragment>` to `<Fragment key={i}>...</Fragment>`,
using the import that was already there. One line changed, one file.

I also did a full manual sweep of the rest of `BrandDeepDive.jsx` (and the other
touched files) for the same class of bug — no other stray unimported references found.

Rebuilt and verified clean with `npm run build`.

## How to apply
```bash
git checkout main
git pull origin main
# unzip this file, "Copy and Replace" when prompted
git add -A
git commit -m "Hotfix: fix ReferenceError crashing the Puzzle Feeder page (React.Fragment -> Fragment)"
git push origin main
```
Railway auto-deploys from `main` on push.
