# Pawvy Website — Brand Order, Wild Balance Wording, Calculator Fixes

Target branch: **staging**
Repo: `pawvy-website`

## 1. Brand order

Updated `BRAND_SLUGS` to: BetterBone → Lillidale → Puzzle Feeder →
Wild Balance → Eastsea Brother → Salmoil → GiGwi. This automatically
propagates everywhere that sorts by it — homepage gallery, Shop page's
brand filter sidebar, StockistDirectory.

**One real gap found and fixed while checking this**: `Nav.jsx`'s Shop
dropdown had no sort logic at all — it just rendered whatever order
the API returned (alphabetical), completely ignoring your intended
sequence. Added the same sort there too, so the nav now matches
everywhere else.

## 2. Janice's wording revisions — points 1, 2, 3, 4, 5, 6, 7, 9, 10 done

All applied to `lib/brandContent.js` and the two calculator
components, matching your numbering.

**Point 6 — the Casseroles calculator specifically.** You asked me to
check whether "Wild Balance [Protein]" would work on mobile there too.
I tested this for real rather than guess — took an actual screenshot
at a 375px mobile viewport with the longest casserole name selected
("Salmon, Chicken & Pear"). It forces the two result stats to stack
into a second row, exactly the problem you flagged. Freshly Cooked's
short names (Duck, Chicken, Salmon, Beef) don't have this problem —
confirmed with its own screenshot, stays clean on one line. So Freshly
Cooked got the new "Wild Balance [Protein]" label as requested;
Casseroles kept "needed".

**A real, separate bug found and fixed while testing this**: the "Add
packs to Cart" button (with the new longer "packs" wording) was
genuinely overflowing on mobile — the price was getting visibly cut
off at the edge of the button. Confirmed with a real measurement
(`scrollWidth` vs `clientWidth`), not just eyeballing it. Root cause
was a CSS specificity conflict: the shared `.fit-add-btn` class (used
by every brand's Add to Cart button) was silently overriding my
mobile-specific sizing rule because it came later in the stylesheet.
Fixed by increasing my selector's specificity so it reliably wins
regardless of file order, plus a slightly smaller font size on mobile
specifically for this longer button text. Confirmed fixed with a
before/after screenshot and measurement — zero overflow now, and
confirmed desktop is completely unaffected.

## 3. Point 8 — needs your input, not a website code fix

That paragraph (starting "...no cold-chain storage required...") is
the Frozen Yoghurt product's `description` field — something you enter
directly in Pawvy App, not text living in this website's code. I can't
change it from here. You'll need to edit that product's description
in Pawvy App directly.

## Verification performed

- Full production build, multiple times through this round as changes
  were made — clean each time.
- **Real end-to-end test**: real backend, real Next.js production
  server, real fetched pages. Confirmed via direct text search:
  every wording change landed correctly (checked the exact new
  strings, not just that old ones were gone), the FAQ question text,
  the chews section opener, the "280g" removal, and the intro body's
  new ending.
- **Real browser testing with Playwright** (not just curl) for the
  layout-sensitive parts — mobile screenshots at 375px width for both
  calculators, desktop screenshots to confirm no regression, and
  direct `scrollWidth`/`clientWidth` measurements to prove the button
  overflow was real and then genuinely fixed, not just visually
  eyeballed.
- Confirmed the real brand order renders correctly on the homepage
  gallery (checked the actual logo sequence in the rendered HTML).
- All 6 changed files byte-diffed against what was actually
  tested — identical.

## How to apply

```bash
git checkout staging
git pull origin staging

# copy/overwrite these files:
#   app/globals.css
#   components/CasseroleCalculator.jsx
#   components/FreshlyCookedCalculator.jsx
#   components/Nav.jsx
#   lib/brandContent.js
#   lib/brandSlugs.js

git add .
git commit -m "Reorder brands sitewide (incl. a nav dropdown sort gap found along the way); apply Janice's Wild Balance wording revisions; fix a real mobile button text overflow found while testing"
git push origin staging
```

---

## Your infrastructure question — copying production data to S-App

Genuinely possible, and there's already a real mechanism this could
build on: `server/jobs/backup.js` already runs daily and emails the
raw SQLite database file as an attachment to a dedicated backup inbox
— not a summary, the actual real `.db` file production is running on.
That's the natural starting point: grab the latest
`pawvy-backup-YYYY-MM-DD.db` attachment, and that's a genuine, current
copy of production's real data.

**Where I can't give you a fully confident answer**: getting that file
*into* S-App's actual running environment depends on what Railway
specifically lets you do with a service's files/volume — whether there's
a file upload option in its dashboard, whether it needs a redeploy to
pick up a replaced file, that kind of thing. I don't have visibility
into your actual Railway dashboard to check this directly.

**Two ways I could help, depending on what Railway allows:**
- If Railway lets you directly replace a file in a running service's
  volume, this might just be a manual download-then-upload each time
  you want fresh data, no code needed.
- If Railway doesn't easily allow that, I could build a small,
  staff-only admin endpoint in pawvy-app — "restore database from an
  uploaded backup file" — so you could grab that day's backup email
  attachment and drop it into S-App directly through Pawvy App's own
  admin UI, without needing raw Railway file access at all.

**One thing worth flagging either way**: a full production copy
includes real customer data — names, emails, order history. Even for
internal staging use, that's real personal information sitting
somewhere it wouldn't otherwise be. Worth being intentional about who
has access to S-App and treating it with the same care as production
if you go this route, rather than a bigger concern to solve right now
— just worth having in mind.

Let me know which direction makes sense once you've had a look at
what Railway offers, and I can build the second option if needed.
