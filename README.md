# Pawvy Website — Patch: fix FAQ answer not auto-opening from the link

Applies on top of `KIENTAH7007/pawvy-website` @ `main` (after the
sizing-guide-link patch). 2 files changed:
`components/FaqAutoOpen.jsx`, `app/shop/[id]/page.js`. Build verified
clean, including a full end-to-end test: cloned your real `main`
fresh, applied this exact patch zip, ran `npm install && npm run
build` from a cold start.

## Being upfront about this one

I don't have a way to reproduce the actual bug in my environment — the
`/brands/salmoil` route needs a live call to your Pawvy App backend
that isn't running in this sandbox, so I can't click through it myself
the way you did. I first ruled out the most obvious suspect (a
mismatched anchor id between the link and the FAQ item) by extracting
both strings directly from the file and confirming they're byte-for-
byte identical — that's not it.

What's left points at a timing/race issue during Next.js's client-side
navigation (clicking the link doesn't reload the page — Next swaps in
the new page's content in place), specifically two things that can each
independently cause exactly what you saw (link lands near the right
spot, but the answer stays collapsed):

1. **The FAQ item's opening code ran too early.** My first version
   checked for the target element exactly once, right when the
   component mounted. On a full page reload this is reliable; on
   Next's client-side navigation there can be a brief gap where the
   component has mounted but the specific `<details>` element isn't
   fully ready yet — the one-shot check can silently miss it and never
   try again.
2. **Next's own built-in "scroll to the hash" behavior** (a default
   feature of `next/link` when the destination URL has a `#anchor`)
   was running independently of ours, and could visually land the page
   in a way that looked like nothing happened, even if our code
   technically fired a moment later.

## What changed

**`components/FaqAutoOpen.jsx`** — instead of a single check on mount,
it now retries every 250ms for up to ~1.5 seconds (stopping early as
soon as it succeeds), so a brief timing gap during client-side
navigation no longer causes a silent miss.

**`app/shop/[id]/page.js`** — added `scroll={false}` to the sizing-guide
link, so Next's own built-in scroll-to-hash behavior stands down
entirely and only our code (which also opens the answer, not just
scrolls to it) handles the landing.

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Fix: FAQ answer not auto-opening from the sizing-guide link"
git push origin main
```

## What to check live after deploy

Same test as before — click "Not sure which size to get?" on a Salmoil
product page, confirm it lands on `/brands/salmoil` with the sizing FAQ
already **expanded**, not just scrolled to. If this specific fix
doesn't fully resolve it, the next thing worth checking is whether it's
consistent across browsers (Safari's `<details>`/`scrollIntoView`
timing occasionally differs from Chrome) — let me know exactly what you
see (does it still land at the FAQ section but collapsed, or does it
land somewhere else now?) and I can narrow further from there.
