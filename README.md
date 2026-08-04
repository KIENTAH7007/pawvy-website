# Pawvy Website — Patch: robust CSS-based fix for FAQ auto-expand

Applies on top of `KIENTAH7007/pawvy-website` @ `main`. 3 files
changed: `app/globals.css`, `app/shop/[id]/page.js`,
`components/FaqAutoOpen.jsx`. Build verified clean, including a full
end-to-end test (fresh clone of your real `main`, patch applied, cold
build) — and I additionally confirmed the new CSS rule is actually
present in the compiled output, not just the source file.

## What I found from fetching your live URL directly

I fetched `salmoil-fish-oil-for-dogs#which-salmoil-size...` directly —
the server-rendered content is 100% correct: both tables are there,
the FAQ answers are exactly what they should be. So this was never a
deploy or content problem. It's purely about what happens in the
browser *after* the page loads.

## Why the previous JS-retry fix likely didn't work

Both of my previous attempts assumed the fix needed to be JavaScript
that runs after the page loads and finds+opens the element. The
problem with that whole approach: I was debugging blind (no way to
reproduce Next.js's exact client-side navigation timing in my
environment), so I was guessing at *which* timing issue, not fixing a
confirmed one. Rather than try a third guess in the same direction, I
switched to a fundamentally different mechanism that removes the
timing question entirely.

## The actual fix: CSS `:target`, not more JavaScript timing

`:target` is a native CSS feature — the browser automatically applies
it to whichever element's `id` matches the current URL's `#fragment`.
Critically, this is **re-evaluated declaratively whenever the URL
changes**, regardless of *how* it changed (full page load, or Next's
client-side routing) — there's no mount timing, no "did my effect run
before or after the element existed" question, because it isn't JS at
all.

`app/globals.css`:
```css
.faq-item:target .faq-answer { display: block !important; }
.faq-item:target .plus { transform: rotate(45deg); }
.faq-item { ... scroll-margin-top: 110px; }
```

This forces the answer visible whenever that FAQ item is the URL's
target — independent of whether the `<details>` element's `open`
attribute is set by anything else. It cannot silently fail to fire the
way a JS effect can.

`components/FaqAutoOpen.jsx` — kept, but simplified. It still sets the
real `open` attribute (so the item is also semantically/accessibly
marked open, and stays open if the person browses elsewhere on the
page afterward), but it's no longer load-bearing for *visibility* —
that's now guaranteed by CSS regardless of whether this JS runs
successfully. I also removed the scrolling code from it entirely.

`app/shop/[id]/page.js` — removed `scroll={false}` from the sizing-
guide link, so Next's own built-in scroll-to-hash behavior handles
positioning again (that part was likely working fine before — I'd
disabled it out of caution while debugging, not because I'd confirmed
it was the problem).

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Fix FAQ auto-expand with CSS :target instead of JS-only timing"
git push origin main
```

## What to check live after deploy

Same test as before. This time, even if scroll positioning is slightly
off, the answer itself should show as expanded — that part no longer
depends on JS timing at all, so if it's still collapsed after this, the
next thing to check would be the actual anchor id in the page's HTML
source (e.g. via "View Page Source" or DevTools) to make sure it
matches the link's fragment exactly, which would point to something
different than what I've been assuming.
