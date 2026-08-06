# Feature: Instagram Highlights redesign — plain photo grid

## What changed (3 files)

### 1. `components/InstagramGrid.jsx` — fully rewritten
Was a client component (`'use client'`) that loaded Instagram's
`embed.js` script and rendered each post as an official Instagram
embed blockquote. Now it's a plain presentational component (no
`'use client'` needed anymore — no hooks, no browser APIs, so it can
render as a Server Component) that maps `{ image, link }` items to
`<a href={link} target="_blank"><img src={image} /></a>`. No external
script, no dependency on Instagram's embed API.

### 2. `app/page.js`
- `igUrls` (the old `urls` array) renamed to `igItems`, sourced from
  the new `{ items: [...] }` shape returned by
  `contentApi.instagramPosts()`
- `<InstagramGrid urls={igUrls} />` → `<InstagramGrid items={igItems} />`

### 3. `app/globals.css`
Replaced the old `.ig-embed-grid`/`.instagram-media` rules (which
existed to force Instagram's own embed styling into rounded corners)
with new `.ig-grid`/`.ig-grid-item` rules for a plain image grid:
- **5 columns** on desktop, matching the reference layout you shared
  (down to 3 columns under 1100px, 2 under 640px, 1 under 420px)
- Square aspect ratio per photo (`aspect-ratio: 1/1`, `object-fit:
  cover`) so photos of any shape crop into a consistent grid
- A small hover zoom (`scale(1.06)`) as a subtle "this is clickable"
  affordance, consistent with hover treatments used elsewhere on the
  site

**Note on scope**: I only changed the grid mechanism itself — the
"Instagram" heading, the "Follow us at Pawvy_SG" text link above the
grid, and the "Visit our Instagram" fallback button (shown when there
are no photos) are all untouched, since your instructions were
specifically about the image+link grid, not that surrounding copy. If
you'd also like the section restyled to match the "Follow Us" pill
button treatment in your reference screenshot, happy to do that as a
separate follow-up — didn't want to assume that was part of this ask.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation with this exact delivery applied. `/`
  (homepage) is correctly `ƒ Dynamic` — server-rendered per request,
  not statically baked at build time — so a passing build here isn't
  hiding a stale cached version of the old embed code.
- **Structural verification of the rewritten component**: since this
  sandbox can't transpile JSX outside of the Next.js build pipeline,
  I verified the component's actual attributes directly (exactly one
  `target="_blank"`, one `rel="noopener noreferrer"`, one
  `loading="lazy"` per map iteration) and cross-checked that both CSS
  class names it uses (`ig-grid`, `ig-grid-item`) exist with matching
  rules in `globals.css` — plus the fact that this exact file compiled
  successfully through Next's own build, which validates the JSX
  syntax and confirms the prop shape (`items`) matches how
  `app/page.js` actually calls it.
- Confirmed no stray references to the old `urls` prop, the old
  `.ig-embed-grid`/`.instagram-media` CSS classes, or the Instagram
  embed script anywhere else in the codebase.

## Not yet verified
No live backend to fetch real photo data from in this sandbox, so I
couldn't load the actual homepage and see the grid rendered with real
images — worth a visual check once both this and the companion
`pawvy-app` delivery are live and you've uploaded a few photos via the
Marketing page.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Instagram Highlights: plain photo grid, replacing the live embed"`
6. `git push origin main`

## Companion delivery
This pairs with a `pawvy-app` delivery (`server/database.js`,
`server/routes/instagramPosts.js`, `server/routes/publicContent.js`,
`client/src/pages/Marketing.jsx`) that adds the image-upload admin UI
and the new API shape this component expects. Apply both together —
this website change alone will just show an empty section (or the
"Visit our Instagram" fallback button) until the backend change is
live and at least one photo is uploaded.
