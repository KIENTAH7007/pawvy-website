# Pawvy Website — Hardness Selector: Wider on PC/Tablet/Wide Mobile

Target branch: **staging**
Repo: `pawvy-website`

## What changed

`app/globals.css` — the hardness selector card is now wider on screens
≥700px, so all 3 pills fit on one row instead of the third one wrapping
to its own line.

**Why 700px specifically, not the 900px breakpoint used elsewhere on
this site for "desktop":** this project already measured a real
unfolded Samsung Fold 7 at exactly **794px** wide during earlier
testing. A 900px breakpoint would wrongly exclude that exact device —
700px safely includes it, along with standard tablets and PC, while
still excluding regular phones (which keep the original narrower card,
pills still allowed to wrap to a second row there — unchanged from
before, since that was already confirmed fine).

## Important limitation — please verify on the real site

**I could not get a real browser to pixel-measure this in my sandbox**
— network restrictions here block downloading an actual browser binary
to render and measure with (tried twice, confirmed genuinely blocked,
not just slow). So the 880px width is a **calculated estimate with
built-in safety margin**, not a pixel-verified measurement:

- Estimated minimum width needed (rough character-width math for the
  actual button text at 14px/600 weight, plus real padding/gap values
  from the CSS): **~756px**
- Width actually shipped: **880px** — roughly 15% of headroom above
  the estimate

This should comfortably fit, but please specifically check this on
S-Web once it's live, on an actual PC browser and (if you have access
to test it) an unfolded Fold 7 or tablet — if the third pill still
wraps for any reason, tell me and I'll widen it further or trim the
button padding slightly, rather than guessing again.

## Verification performed

- Full production build (`npm run build`) — clean, no errors.
- Confirmed only `app/globals.css` changed against the real current
  `origin/staging` (fetched fresh) — `HardnessSelector.jsx` (the
  component itself) is untouched this round, byte-identical to what's
  already live.
- The one file changed byte-diffed against what was actually
  build-tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite:
#   app/globals.css

git add .
git commit -m "Widen hardness selector card on PC/tablet/wide mobile so all 3 pills fit on one row"
git push origin staging
```
