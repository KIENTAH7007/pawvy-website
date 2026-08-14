# Custom cursor: fix the "laggy" feel — Option 4 (Magnetic hover)

## This delivery is for the Website folder (`pawvy-website`) only

1 file changed: `components/CustomCursor.jsx`. No CSS changes needed —
see below for why.

## What was wrong, and what changed

The ring was deliberately programmed to lag behind the mouse (a lerp/
easing loop, chasing the dot rather than tracking it) — that's exactly
what a customer flagged as making the site feel laggy. Removed that
loop entirely: both the dot and the ring now update instantly, 1:1 with
the mouse, every `mousemove` event. No more chase.

The "special/obvious" feel now comes from the ring's existing expand-
and-glow reaction when hovering over links, buttons, and cards — that
behavior (and its color, already `#F36F4A`) was already correct in
`globals.css` and needed no changes. It only triggers on the discrete
hover-enter/leave state, not during ordinary mouse movement, so it
doesn't reintroduce the original complaint.

## Verification performed

- Confirmed structurally: the lerp/chase loop and its
  `requestAnimationFrame` call are gone; both dot and ring now update
  directly inside the mousemove handler; the hover-expand and dynamic-
  element-detection logic (MutationObserver, for product cards etc.
  that load after the page's initial mount) are untouched.
- Real cold-clone build: fresh `git clone` → applied the file →
  `npm install` → `npm run build` — passed with no errors, confirming
  valid JSX syntax.
- Byte-for-byte diff confirms the file in this zip matches what was
  cold-clone built and tested.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's `components/CustomCursor.jsx` into that folder
(overwrite), then:

```bash
git add .
git commit -m "Cursor: remove chase lag, instant tracking with hover-expand reaction (Option 4)"
git push origin main
```

Railway auto-deploys from `main`.
