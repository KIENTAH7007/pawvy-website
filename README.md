# Janice's wording feedback — Salmoil (6 items) + GiGwi (5 items)

## Salmoil — `lib/brandContent.js`

**Items 1, 2, 3** — straightforward text updates: hero subtitle
(`tagline`), hero body with the flagged clause removed, and the "Not
just fish oil" section's subtitle.

**Items 4, 5, 6** — FAQ changes. Exclusive-distributor question
removed entirely (4 entries now, was 5). Refrigeration and cats
answers replaced with your exact new text. The size-guide FAQ entry
(150ml/250ml/500ml) is untouched — confirmed directly, since that's
what the product page's "Not sure which size to get?" links point to.

## GiGwi — `lib/brandContent.js`, `components/BrandDeepDive.jsx`, `app/globals.css`

**Items 7, 8, 9** — text updates: the "full range" section subtitle,
"actually" removed from the intro heading, and all three value-card
bodies revised per your exact wording (one full replacement, two
trims).

**Item 10** — two parts:
- Content fix: "first nights home" → "first night home" (no 's'),
  done.
- **Background removed**: the colored square behind each toy icon
  (Ball/Chew/Plush/Enrichment) is now transparent — just the toy
  itself, per Janice's note. I kept the card's colored top-border
  stripe (red/green/white/blue), since that's a separate design
  element from the icon background and wasn't what was flagged.
- **Plush/Enrichment enlarged**: I checked the actual CSS first —
  Ball, Chew, Plush, and Enrichment all use the *exact same* icon
  container size and image-fill percentage already, so this wasn't a
  CSS sizing bug. The size difference Janice is seeing comes from the
  source PNG files themselves (Plush/Enrichment's images apparently
  have more built-in transparent padding around the toy than Ball/
  Chew's do). Rather than needing new image files, I added a visual
  scale-up (1.35×) specifically to these two icons, via a new
  `iconScale` field that only Plush and Enrichment have — Ball and
  Chew are completely untouched, confirmed directly.
  **Caught one thing while building this**: the icon container had
  `overflow: hidden`, which would have silently clipped the enlarged
  images right back down to their original size, quietly defeating
  the whole fix. That property existed to keep the (now-removed)
  colored background's corners clean — with the background gone,
  there's nothing left for it to usefully clip, so I removed it. The
  resulting overflow beyond the icon's nominal box is very small
  (roughly 2–3px per side, given the actual box math) and sits well
  within the 16px gap before the card's title text, so there's no
  collision risk with anything below it.
  **1.35× is an estimate**, not measured pixel-by-pixel against the
  actual image files (I can't visually inspect image proportions from
  code) — flagging this as the one piece of item 10 most worth a
  visual check after deploy, and it's a single easy number to nudge
  in `lib/brandContent.js` if it's not quite right.

**Item 11** — all 4 old FAQs replaced with your 3 new ones.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Real checks against the actual data for every single item — not
  visual inspection: confirmed exact text matches, confirmed FAQ
  counts and content, confirmed `iconScale` is present on Plush/
  Enrichment only and absent on Ball/Chew.
- Confirmed `categoryIntro` (the section item 10 touches) is used
  exclusively by GiGwi — no risk to any other brand page from the
  component/CSS changes.
- Confirmed the Salmoil size-guide FAQ entry, referenced by the
  product page's "Not sure which size to get?" links, is untouched.

## Not yet verified
No live browser access from this sandbox — item 10 is the one thing
here that's a genuine visual judgment call (the 1.35× scale estimate,
and whether the small icon overflow reads cleanly) rather than
something I can fully confirm from code. Worth a direct look once
deployed.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Janice feedback: Salmoil (6 items) + GiGwi (5 items) incl. category icon backgrounds/sizing"`
6. `git push origin main`
