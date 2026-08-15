# Homepage banner carousel — Website side (with Show/Hide caption toggle)

## This delivery is for the Website folder (`pawvy-website`) only

4 files changed: `components/HomepageBanner.jsx`, `app/page.js`,
`app/globals.css`, `lib/api.js`.

This supersedes the earlier "Homepage Banner Carousel" delivery — same
carousel, plus support for the new per-banner Show/Hide caption toggle
(set in Pawvy App's Marketing page).

## What's new in this version

Added a standard `.sr-only` CSS utility class — visually hidden, but
still real, readable text for screen readers and search engines (not
`display: none`, which would hide it from those too).

When a banner's caption is toggled off in the admin, its headline
`<h1>`/`<p>` now gets this class applied — the text is still genuinely
in the page (still the real H1 for the first banner in carousel order,
still usable as the image's `alt` text), it's just not rendered visibly
over the banner image. When toggled on, renders exactly as before —
visible caption, same styling.

## Everything from the original carousel delivery, unchanged

- Old generic hero section fully removed; ticker relocated below the
  carousel
- Real auto-rotating carousel, pauses on hover and keyboard focus
- Each banner links to its `link_url`, falling back to the brand gallery
- Only the first banner in order ever carries the real `<h1>`
- Zero-banner fallback keeps a real H1 on the page even with nothing
  configured yet

## Verification performed

- Real end-to-end test: started an actual backend with a banner set to
  caption-hidden, ran the real Next.js server, and confirmed in the
  literal rendered HTML that the H1 exists with the real headline text
  AND has the `sr-only` class applied — genuinely present for SEO,
  genuinely invisible on screen.
- Real cold-clone build: fresh `git clone` → applied all 4 files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms every file in this zip matches what was
  cold-clone built and tested above.

## To apply

Apply together with the companion App-side delivery — the two only work
correctly together. If you already applied the earlier version of this
delivery, just apply this one on top — it's the complete, current state
of all 4 files, not a diff.

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "Homepage banner: support per-banner caption visibility toggle"
git push origin main
```

Railway auto-deploys from `main`.
