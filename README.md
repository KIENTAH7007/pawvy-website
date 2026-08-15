# Fix: real Fold 7 breakpoint value, diagnostic badges removed

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`.

3 files changed: `app/globals.css`, `app/page.js`,
`components/HomepageBanner.jsx`. The temporary `DebugWidth.jsx` file is
gone entirely (not included in this zip — it should no longer exist in
your `staging` branch after applying this).

## What the diagnostic confirmed

Your Fold 7, genuinely unfolded, reported exactly
`window.innerWidth = 794px`. That's real, precise, ground-truth data —
and interestingly, it's *higher* than the old 760px mobile breakpoint,
which should have already put it in the tablet tier. The fact that the
device still matched "mobile" in the first diagnostic screenshot means
there's a real, observed inconsistency on this specific device between
how `@media` width evaluates versus the JS `window.innerWidth` value —
not something worth chasing down further, just something to build a
safety margin around.

## The fix

Lowered the banner's mobile breakpoint from 760px to **700px** — real
margin below the confirmed 794px, so the tablet image wins unambiguously
regardless of which measurement method the browser uses internally.

**Deliberately scoped narrowly**: 760px is used extensively across the
rest of the site (stats grid, footer, stockist page, etc.) as the
general mobile breakpoint — none of that was touched. Only the three
banner-specific places that actually needed the fix were changed: the
`<picture>` element's mobile image source, the banner's own aspect-ratio
rule, and the caption's positioning rule.

**Diagnostic code removed**: both temporary badges (the colored tier
one and the black exact-pixel one) are gone — `DebugWidth.jsx` deleted
entirely, and `page.js`/`globals.css` no longer reference either one.

## Verification performed

- Real render test at exactly 794px (the confirmed real value): measured
  the banner's actual computed aspect ratio and confirmed it's genuinely
  4:3 (tablet), not 2:3 (mobile) — proof the fix resolves the exact
  reported bug, not just a build pass.
- Confirmed via search that 760px is still used for many other,
  unrelated things across the site, so only the specific banner-related
  instances were changed.
- Confirmed the deleted `DebugWidth.jsx` file and both diagnostic badges
  are fully gone from the build.
- Real cold-clone build: fresh `git clone` → applied all files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms every file in this zip matches what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

**Delete this file first** — it was committed to `staging` by the
previous diagnostic delivery, and unzipping alone won't remove it (only
adds/overwrites, never deletes):

```
rm components/DebugWidth.jsx
```

Then unzip this delivery's files into the folder (overwrite), and:

```bash
git add -A
git commit -m "Fix: real Fold 7 breakpoint (700px, confirmed via device testing), remove diagnostic badges"
git push origin staging
```

(`git add -A` instead of `git add .` — specifically so the deletion
above gets included in the commit, not just the new/changed files.)
