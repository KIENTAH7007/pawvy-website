# Pawvy Website — Shop Now Anchor, Calculator Styling, Seven Brands

Target branch: **staging**
Repo: `pawvy-website`

## What's fixed this round

### 1. Hero "Shop now" button now actually scrolls to the products

Real bug: the button links to `#shop`, and every other brand's card
type has an element with that id — but the custom Wild Balance
renderer never did, since it was built separately from those. Added
the same zero-height anchor marker used elsewhere, right before the
Casseroles section.

### 2. "Feed for how many days?" field styling

Real CSS bug, not a design inconsistency: the styling rule covered
`.wb-calc-row-full select` but never `.wb-calc-row-full input` — and
"Feed for how many days" is the one plain `<input>` in that row type
(Flavour and Pack Size are `<select>` elements, which is why they
looked fine). It was silently falling back to unstyled browser
default. Added the missing selector.

### 3. Word changes kept as-is

Per your note — nothing touched here, waiting on your and Janice's
review.

### 4a. "Seven brands, one standard"

Updated the homepage heading, plus 3 other places that said "six
brands" and would now be quietly wrong: the shop page's hero copy, and
two SEO meta descriptions (one of which also still named the old
6-brand list without Wild Balance in it — fixed that too).

### 4b. Real Wild Balance logo

Saved to `public/brand-logos/wildbalance.png`, wired into
`lib/brandSlugs.js`'s `BRAND_LOGOS` map — this is what was missing
and causing the broken-image icon. Resized to match the site's
existing 900px-wide logo convention (yours was 2000×1414 at 267KB;
resized to 900×636 at 48KB, well within range of the other 6 logos).

One thing worth a real visual check once this is live: each brand
logo has a manually-tuned `LOGO_SCALE` factor in `BrandGallery.jsx` to
compensate for how large or small it reads at the shared card height
(GiGwi and Lillidale get +50%, BetterBone and Salmoil get -10%, tuned
by eye per brand). I didn't add an entry for Wild Balance — it'll
render at the default, unscaled size — since I can't actually preview
rendering to judge whether it needs the same treatment. Worth a quick
look; if it reads too small or large next to the others, it's a
one-line addition.

### 4c. Wild Balance tagline

Added to `BrandGallery.jsx`'s `TAGLINES`, matching the short punchy
style of the other 6: *"Real food, cooked low and slow — no freezer,
no thawing, just open and serve."*

## Verification performed

- Full production build — clean, no errors.
- **Real end-to-end test**, backend + actual Next.js production
  server together, real fetched pages:
  - Confirmed the `#shop` link target now genuinely exists on the Wild
    Balance page (previously it didn't, anywhere).
  - Confirmed the CSS fix compiled correctly into the production
    stylesheet — the "Feed for how many days" input now shares the
    exact same selector rule as every other calculator field.
  - Confirmed "Seven brands, one standard" renders on the real
    homepage, and "Six brands" no longer appears anywhere in the
    rendered page.
  - Confirmed the real Wild Balance card renders with the real logo
    path, real tagline text, and correct "Shop Wild Balance" link.
  - Fetched the logo file directly and confirmed it serves correctly
    (HTTP 200, byte-identical to what was saved).
- All 12 changed/new files byte-diffed against what was actually
  tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files:
#   app/globals.css
#   app/page.js
#   app/shop/page.js
#   components/BrandDeepDive.jsx
#   components/BrandGallery.jsx
#   components/FitCard.jsx
#   components/ShopClient.jsx
#   components/WildBalanceDeepDive.jsx
#   lib/brandContent.js
#   lib/brandSlugs.js
#   public/brand-heroes/wild-balance-hero.jpg

# this is a NEW file:
#   public/brand-logos/wildbalance.png

git add .
git commit -m "Fix Wild Balance's Shop now anchor, calculator field styling; update to Seven brands sitewide; add real Wild Balance logo and tagline to the homepage gallery"
git push origin staging
```

Note: `BrandDeepDive.jsx`, `FitCard.jsx`, `lib/brandContent.js`, and
`public/brand-heroes/wild-balance-hero.jpg` are unchanged from what
you already patched in the last two rounds — included again just so
this is one complete, self-contained zip rather than something to
cross-reference against earlier deliveries. Safe to overwrite either
way.
