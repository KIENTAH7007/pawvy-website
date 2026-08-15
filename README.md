# Per-device banner images + homepage nav bar fix — Website side

## This delivery is for the Website folder (`pawvy-website`) only,
## targeting the `staging` branch.

3 files changed: `components/Nav.jsx`, `components/HomepageBanner.jsx`,
`app/globals.css`.

## 1. Nav bar always solid navy on the homepage

Light-colored banner images were washing out the nav bar text, since it
starts transparent and only turns solid navy (`#14213D`) after
scrolling. Now forced solid specifically on the homepage (`/`) at all
times — every other page (shop, stockist, brand pages, account) keeps
its existing transparent-then-solid-on-scroll behavior completely
unchanged.

## 2. Per-device banner images (`<picture>` element)

Each banner now serves the right image for the device automatically,
using a native `<picture>` element — no JavaScript needed, and phones
never even download the desktop image:

- Screens ≤760px wide get the mobile image (if one was uploaded)
- Everything else gets the desktop image
- If no mobile image was uploaded for a banner, it just uses the
  desktop image everywhere, exactly as before

Dropped the earlier "universal 16:9 + object-fit:contain" approach
entirely, per your decision to go with Option A instead — the container
now sizes to `aspect-ratio: 16/9` on desktop and `4/5` on mobile,
matching each device's actual intended image shape.

## A real bug found and fixed along the way

While rebuilding the CSS for this, a **production build failure**
surfaced: an earlier delivery had used `//` (JavaScript-style) comments
inside `app/globals.css` — invalid syntax in plain CSS, which only
supports `/* */` block comments. This silently broke the whole
stylesheet. Found via a real `npm run build` failure (not something
that would show up in a normal dev-server preview), traced to the exact
12 lines, and fixed by converting them to proper CSS comment syntax.
Confirmed the rebuild passes cleanly afterward.

## Verification performed

- Real end-to-end test: started an actual backend with a banner that
  has both a desktop and mobile image, ran the real Next.js server
  against it, and confirmed in the literal rendered HTML that the
  `<picture>` element correctly contains the mobile `<source>` and the
  desktop `<img>`, and the real headline renders as the actual `<h1>`
  — not the fallback state.
- Real cold-clone build: fresh `git clone` → applied all 3 files →
  `npm install` → `npm run build` — passed with no errors.
- Byte-for-byte diff confirms every file in this zip matches what was
  cold-clone built and tested above.

## To apply

Apply together with the companion App-side delivery — the two only work
correctly together.

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "Homepage: always-solid nav bar, per-device banner images, fix CSS comment syntax bug"
git push origin staging
```

Railway's staging environment auto-deploys from `staging`.
