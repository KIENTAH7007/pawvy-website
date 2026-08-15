# TEMPORARY: exact pixel width diagnostic for the Fold 7

## This is for the Website folder (`pawvy-website`) only, targeting
## `staging`. Remove alongside the previous tier badge once resolved.

3 files: `app/globals.css` (unchanged from before), `app/page.js`,
`components/DebugWidth.jsx` (new).

## Why this exists

Your screenshot confirmed the tier badge shows "MOBILE tier" on the
genuinely-unfolded Fold 7 — real, ground-truth proof that Samsung's
actual browser reports something ≤760px, meaningfully narrower than the
883-984px generic spec research suggested. That's useful, but "760px or
narrower" is a range, not the exact number I need to set the real
breakpoint correctly on the next try.

## What this adds

A second, small black badge showing the literal
`window.innerWidth` value in pixels — the exact number, not just which
range it falls in.

## What I need from you

Same as before: apply this, open S-Web on the Fold 7 unfolded, and send
a screenshot showing this new badge (should appear just below the
colored tier one). That exact number lets me set the real breakpoint
precisely, in one more delivery.

## Verification performed

- Real render test: started the actual built site, loaded it at a known
  700px test viewport, and confirmed the badge correctly displayed
  "window.innerWidth = 700px" — proving the live value, not a
  placeholder.
- Real cold-clone build: fresh `git clone` → applied all 3 files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms all 3 files in this zip match what was
  cold-clone built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "TEMP: add exact pixel width diagnostic for Fold 7"
git push origin staging
```
