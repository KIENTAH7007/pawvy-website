# Feature: campaign multiplier shows on website (nav badge + account page)

## Context
You spotted the actual design flaw: campaigns weren't showing on the
website at all. Traced it down to two separate, stacked issues — not
just a display problem:

1. **Backend gap**: the website's own multiplier lookups never told
   the shared calculation which channel they were asking about, so a
   campaign scoped to "Website only" was invisible to the website
   entirely — regardless of what the UI did with the result.
2. **Frontend gap, on top of that**: even in the one case that *did*
   work (site-wide campaigns), both display spots explicitly discarded
   campaign info and only ever rendered the birthday case.

**Bonus find while investigating**: there's already a public,
no-login-required endpoint (`/api/public-content/campaign`) and a
matching frontend helper (`contentApi.activeCampaign()`) that were
clearly built for exactly this — showing a campaign to *any* visitor,
not just logged-in customers — but the frontend helper was never
actually called anywhere. Wiring that up means a campaign now shows to
browsing visitors too, not just people who've logged in, which is
closer to what you actually want ("clearly shows customers what
benefits they're getting").

This delivery is the **website half** — see the companion `pawvy-app`
delivery for the two backend endpoint fixes this depends on.

## What changed (2 files)

### `components/Nav.jsx`
- The old `birthdayBonus` state is now `promoBadge` — same idea, but
  covers both cases.
- **Not logged in**: now calls the public campaign endpoint (was never
  called before) — a campaign badge can show to any visitor, not just
  logged-in customers.
- **Logged in**: the backend already picks whichever of
  campaign-or-birthday is higher — this now renders whichever one it
  picked, instead of only ever rendering the birthday case.
- **Pill size — did not change**: this was your explicit ask. Both
  cases render through the exact same template —
  `{emoji} {multiplier}×B` — so "🎂 1.5×B" and "🎉 2×B" take up
  essentially the same space, same font, same padding. The only thing
  that differs is the emoji and the number itself; the full campaign
  name goes in the hover tooltip only, exactly the same pattern the
  birthday case already used (tooltip: "Your pet's birthday month
  bonus is active" before, now "Campaign: {name}" for the campaign
  case) — never in the visible pill text, so a long campaign name can
  never cramp the nav bar.

### `app/account/page.js`
Same idea, more room to work with (a full banner, not a small pill):
added a second banner variant for the campaign case, right below the
existing birthday one, reusing the same green "good news" banner
style (confirmed that style isn't birthday-specific, just a generic
positive-message look).

## Verified
- `npm run build` — passes clean, both locally and from a genuine
  fresh cold-clone simulation.
- Confirmed via real backend smoke tests (see companion `pawvy-app`
  delivery's README) that the underlying data this reads from is
  correct in every combination: anonymous visitor with a Website
  campaign active, logged-in customer with a Website campaign active,
  campaign correctly beating a lower birthday bonus, birthday
  correctly beating a lower campaign, and a POS-only campaign
  correctly **not** leaking into any website-facing display.
- Confirmed no leftover references to the old `birthdayBonus` variable
  name anywhere in the file.
- Confirmed the pill's visible text structure is identical between
  both cases — same component, same template, verified directly in
  the source rather than just visually eyeballing it.

## Not yet verified
No live browser access from this sandbox — worth a direct visual
check once deployed, on the actual screen widths you normally test on
(the note about not letting the pill get too long was specific and
important to you, and I can't fully confirm "how it feels" from code
alone).

## To apply
1. `git checkout main`
2. `git pull origin main`
3. Unzip this delivery on top of your local `pawvy-website` folder
4. `git add -A`
5. `git commit -m "Show active campaign on website (nav badge + account banner), for logged-in and anonymous visitors"`
6. `git push origin main`

## Companion delivery
This depends on a `pawvy-app` delivery (`server/routes/customers.js`,
`server/routes/publicContent.js`) that fixes the backend channel gap.
Apply both — without the backend fix, this website delivery would
still only correctly show site-wide campaigns, not Website-scoped
ones, since the underlying data wouldn't be there yet.
