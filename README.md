# Pawvy Website — Patch (Homepage visuals + Guest checkout)

Applies on top of `KIENTAH7007/pawvy-website` @ `b7da22d` (current `main`
at the start of this session — "Fix GiGwi card naming/button color").

Build verified clean: `npm run build` — 0 errors, all routes compiled.

**This patch pairs with `pawvy-app-patch.zip` delivered alongside it —
apply both together.** The guest-checkout feature (item 4 below) spans
both repos; applying only this half will still let checkout proceed
correctly either way, but the "create a free rewards account" checkbox
won't actually create anything until the backend patch is applied too.

---

## Correction from the last delivery

I previously described the single PDPA checkbox as "forcing account
creation" and fixed it purely on the frontend, without having seen
`pawvy-app`. Now that I've checked: the backend **never** created an
account from website checkout, checkbox or not — so nothing was actually
forced. The real issues were the checkbox's wording overpromising ("...
and create a Pawvy rewards account for me") and the login→signup dead
end. Both are still fixed here, but I also built real backend support
(in the paired patch) so the "create an account" option now genuinely
does something, rather than just being honest wording with no effect
behind it.

---

## What changed

### 1. Homepage brand logos — centered + resized
`components/BrandGallery.jsx`, `app/globals.css`

- `.logostage` now has `justify-content: center` (was vertically centered
  only, not horizontally).
- Added a `LOGO_SCALE` map so each brand's logo can be sized independently
  on top of the shared 60px base `max-height`:
  - Lillidale **+50%**, GiGwi **+50%**
  - Puzzle Feeder **+20%**
  - BetterBone **−10%**, Salmoil **−10%**
  - East Sea Brother unchanged
- Applied via an inline `max-height` override per logo `<img>` — no new
  CSS classes needed, easy to re-tune (just edit the numbers in
  `LOGO_SCALE`) if any of these need adjusting after a live look.

### 2. Homepage hero background photo
`app/page.js`, `app/globals.css`, `public/hero-bg.jpg`

- Replaced the (unused, leftover) `public/hero-bg.jpg` with the trade-show
  photo you sent, added behind the existing blobs at **20% opacity** —
  same visual pattern already used on brand pages (`.subhero-bg-photo`,
  25% there), just a dedicated `.hero-bg-photo` class at 20%.
- **On "upscale to the maximum, make it clearer"**: I ran a 2x Lanczos
  upscale (1600×781 → 3200×1562) plus a mild sharpen/contrast pass. This
  is a classic upscale, not true AI super-resolution — I tried to fetch a
  couple of open super-res models (FSRCNN/ESPCN) from GitHub to do a
  proper AI upscale, but neither was reachable from this environment's
  network allowlist, so this is the best clarity improvement achievable
  here. At 20% opacity behind the blobs the difference is mostly moot,
  but flagging it in case you want a true AI upscale run through an
  external tool before it's used anywhere at full strength.

### 3. "Why Pawvy" section image
`app/page.js`, `app/globals.css`, `public/why-pawvy.jpg`

- Replaced the blob+paw-emoji placeholder in `.why-visual` with your
  photo, filling the existing rounded square card via `object-fit: cover`.
  The source image (1491×1557) is already close to square, matches the
  box's `aspect-ratio: 1` well — no cropping guesswork needed.
- **Mobile fix**: there was an existing mobile-only override
  (`@media (max-width: 860px)`) forcing the box to a 16:9 aspect ratio —
  harmless with the old blob placeholder, but visibly cropped a real
  photo down to a thin strip on phones. Removed that override so it
  stays 1:1 at every screen size, as requested.

### 4. Guest checkout
`app/cart/page.js`, `app/login/page.js`, `app/signup/page.js`

**On the cart page**, the single PDPA checkbox is now two:
1. *"I agree to Pawvy collecting my details to process this order.
   (Required)"* — the only one that blocks checkout, same as before
   (this is legitimately required to process anyone's order).
2. *"Also create a free Pawvy rewards account for me…"* — new, optional,
   defaults to checked so nothing changes for anyone who doesn't notice
   it. **This now genuinely creates or links a real account** — see the
   paired `pawvy-app` patch — sends the same verify-account email as
   normal signup, 150 BUTTONS bonus lands on verification.

Unchecking #2 shows an orange warning line: *"You're checking out as a
guest — you won't earn BUTTONS on this order, and you'll need to
re-enter your details next time. You can still create an account later
using this same email."* Wording is a first draft — happy to adjust tone
or add anything you want.

**On the login → signup handoff**: when you type an email that isn't a
customer, `/login` still sends you to `/signup`, same as before — but
now there's a "Check out as guest instead" link near the bottom of the
signup page. Clicking it shows the same benefits-lost warning as above,
and on confirm sends you back to `/cart` with nothing created. A `?next=`
param is wired through `/cart → /login → /signup` so this always lands
back on the page you started from (currently only `/cart` links into
this flow, but the plumbing supports other entry points later without
more rework).

The checkout request body now sends `create_account: true/false` as a
separate field from `pdpa_consent`, with `pdpa_consent_text` phrased to
match whichever the customer chose — matches exactly what the paired
backend patch expects.

---

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Homepage: center + resize brand logos, hero bg photo, Why Pawvy photo; real guest checkout with optional account creation"
git push origin main
```

Railway will auto-deploy on push, as usual. **Apply the `pawvy-app`
patch too** (same git flow, other repo) for the account-creation
checkbox to actually take effect.

## What to check live after deploy (both patches applied)

- Homepage: logos centered, Lillidale/GiGwi visibly bigger, BetterBone/
  Salmoil visibly smaller, hero photo faintly visible behind the blobs,
  Why Pawvy section shows your photo.
- Add an item to cart while logged out, fill in guest details, leave
  "Also create a free Pawvy rewards account" checked, complete a
  test-mode payment → check the Customers admin page for a new
  unverified account.
- Same flow, but uncheck it → complete payment → confirm no account
  shows up, order still records correctly.
- From `/login`, type an email that isn't a customer → land on
  `/signup?next=/cart` → click "Check out as guest instead" → confirm →
  should land back on `/cart`.
