# Revert: restore the original hero design on the live site

## This is for the Website folder (`pawvy-website`) only, and is meant
## for `main` (production) specifically — apply this on its own, separate
## from the ongoing carousel work, which now continues on staging (see
## the separate staging setup guide).

1 file changed: `app/page.js`.

## What this does

Restores the exact original hero section — paw badge, the "Wellness
products that..." typewriter heading, the brand-link paragraph, and the
two CTA buttons — undoing the banner carousel swap on the live site
specifically, so customers stop seeing the in-progress redesign while
it's still being refined.

Deliberately built to have **zero dependency on the banner-carousel
backend work** — this version doesn't fetch or reference banners at all,
so it works correctly regardless of whatever state the banner endpoints
are in. No coordinated backend change needed; this is a清omplete,
self-contained revert.

The carousel component (`components/HomepageBanner.jsx`) and its CSS are
left untouched in the repo — just no longer called from the homepage.
Nothing to clean up there; it simply becomes dormant until it's brought
back in through the staging → production promotion once it's ready.

## Verification performed

- Diffed directly against the actual git history version of this file
  from before the carousel work began — confirmed the only differences
  are the intentional ones (banner code removed) plus one correct,
  deliberate exception: kept the updated Eastsea Brother URL slug from a
  later SEO fix, rather than blindly reverting past it too.
- Real server test: real backend, real Next.js server, confirmed 200
  status, zero errors, and the old hero's distinctive elements (paw
  badge, "Explore the brands" CTA, single H1) all present in the actual
  rendered HTML.
- Real cold-clone build: fresh `git clone` of the actual current
  production repo → applied the file → `npm install` → `npm run build`
  — passed with no errors.
- Byte-for-byte diff confirms the file in this zip matches what was
  built and tested above.

## To apply

```bash
cd /path/to/your/pawvy-website
git checkout -- . && git clean -fd && git pull origin main
```

Unzip this delivery's `app/page.js` into that folder (overwrite), then:

```bash
git add .
git commit -m "Revert homepage hero to original design while carousel work continues on staging"
git push origin main
```

Railway auto-deploys from `main` — pawvy.co should show the original
design again shortly after.
