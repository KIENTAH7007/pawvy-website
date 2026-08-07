# Homepage hero background photo — the lake &amp; husky image, 15% opacity

## What changed (3 files)

### `public/hero-bg.jpg`
Your chosen image, replacing what turned out to be an **orphaned,
unused placeholder file already sitting at this exact path** — I
found it while looking for where to put this, referenced nowhere in
the code. Rather than add a redundant new file, I replaced its
content directly. Resized/compressed to 2400×1600, 483KB (actually
smaller than the placeholder it replaced, which was 780KB) — full
resolution isn't needed for a background image sitting behind text at
15% opacity, and this keeps the homepage's load time unaffected.

**Source**: the Unsplash photo you uploaded (`jf-brou-...-unsplash.jpg`).
Unsplash's license permits commercial use without requiring
attribution, so this is fine to use as-is — flagging the source here
just for your own records.

### `app/page.js`
Added the background photo `<img>` as the very first element inside
the hero section, using the exact same pattern your brand pages
already use for their own hero photos (`<img ... className="subhero-bg-photo" />`)
— just a homepage-specific class name since the sizing/positioning
needed differ slightly (full 100vh hero vs. the brand pages' shorter
subhero).

### `app/globals.css`
New `.hero-bg-photo` rule: `opacity: .15`, positioned to fill the
hero (`inset: 0`, `object-fit: cover`), `z-index: 0`. Checked the
existing z-index values for the blobs (also 0), the text content (1),
and the paw badge (2) before picking this — since the photo is
inserted first in the DOM and shares the same z-index as the blobs,
it correctly sits behind them and everything else, without needing to
touch any of those existing values.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Confirmed the actual file at `public/hero-bg.jpg` is a valid JPEG
  at the path the code references — not just that the code compiles.
- Confirmed the opacity value in the CSS is exactly `.15` (15%), and
  traced the z-index stacking against every other layered element in
  the hero to confirm the photo renders behind the blobs and hero
  text, not on top of them.

## Not yet verified
No live browser access from this sandbox — you've already seen this
exact image/opacity combination live in the interactive mockup I sent
earlier, so this should match what you approved there, but worth a
quick real-site check after deploy as always.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Homepage hero: add background photo at 15% opacity"`
6. `git push origin main`
