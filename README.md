# Janice's wording feedback — round 3

**Context**: this delivery assumes you've already applied the previous
two zips (the full page.js Shop Now/FAQ button changes, and the
Light→Soft FAQ fix) — I checked your live GitHub `main` branch
directly and confirmed both are already there, so `page.js` in this
zip is unchanged from what's already deployed (included anyway for a
self-contained delivery, but it's a no-op if you apply it).

## What changed this round (3 files actually different)

### 1. `lib/brandContent.js`

**Item 1 — hero description**: you clarified you only wanted the
first sentence removed, not the whole thing. Restored the rest:

> Made from natural, food-safe ingredients, BetterBone provides a
> durable chewing experience that helps support dental hygiene by
> reducing plaque and tartar buildup, while satisfying a dog's
> natural chewing instinct.

(The removed sentence was: "Plant-based, biodegradable chews built to
satisfy a real chewer — without the guilt of another landfill-bound
plastic toy.")

**Item 3 — FAQ trimmed**: removed the last three questions (exclusive
distributor, where to buy, storage). BetterBone now has 8 FAQ entries
— just the 8 from your images, nothing else. The "What makes
BetterBone different from other dog chew toys?" question is now the
last one in the list.

### 2. `components/BrandDeepDive.jsx` + `components/CategoryBrowser.jsx`

**Item 2 — Shop Now now jumps straight to the product cards**, not
just the top of the section. Previously the `#shop` anchor sat at the
very top of the whole deep-dive block (before any brand-specific
content), so on brands with intro copy before their shop grid,
clicking Shop Now still left a scroll to do. Reworked per brand shape
so `#shop` sits directly at (or immediately before) the actual Add to
Cart cards:

- **BetterBone** (`durability` section): `id="shop"` moved directly
  onto the durability cards section itself — skips past the "Better
  Chew" intro copy entirely.
- **Puzzle Feeder / Eastsea Brother** (`fitCards`, single grid):
  `id="shop"` moved directly onto that section.
- **GiGwi** (`browser`/CategoryBrowser): `id="shop"` moved directly
  onto the category browser section, which contains the cards
  directly — no separate step.
- **Lillidale / Salmoil** (`fitCardGroups`, multiple grids): couldn't
  put `id="shop"` directly on the first group's own section, because
  that id is already used by other on-page navigation (Lillidale's
  pillar cards link to `#supplements` specifically — overwriting that
  id would've broken the pillar nav). Instead, added a zero-height
  invisible marker with `id="shop"` immediately before the first shop
  grid renders — so clicking Shop Now still skips past any intro
  content (pillars, before/after photos, recipe explainer) and lands
  right at the doorstep of the first real product grid, without
  touching the pillar nav's existing links.

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone with this exact delivery applied.
- **Structural check across all 6 brands** (not just eyeballed):
  wrote a script that walks each brand's actual `deepDive` config and
  confirms exactly one "shop-providing" section shape
  (`durability`/`fitCards`/`fitCardGroups`/`browser`) is present per
  brand — meaning there's no risk of two elements both claiming
  `id="shop"` on the same rendered page. All 6 brands: PASS.
- Confirmed via direct string checks against the real
  `BRAND_CONTENT` data (not visual inspection) that: the hero
  description no longer contains the removed sentence but still
  contains the rest, BetterBone's FAQ count dropped from 11 to 8 with
  the right 3 removed and the right one now last, and every fix from
  the previous two rounds (Soft, "BetterBone's proprietary", "Three
  Durability Levels", "Moderate" label) is still intact and wasn't
  accidentally reverted by this round's edits.

## Not yet verified
Same standing limitation — no live browser access from this sandbox,
so I can't confirm the actual scroll landing looks right visually.
You mentioned you'd test the Shop Now behavior yourself once deployed
— this round's change is specifically aimed at that feedback, so
worth a fresh look now that it targets the product cards directly
rather than the top of the section.

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Janice feedback round 3: restore hero description partially, trim BetterBone FAQ, Shop Now targets product cards directly"`
6. `git push origin main`
