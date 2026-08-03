# Pawvy Website — Patch: Janice's wording revisions + homepage fixes

Applies on top of `KIENTAH7007/pawvy-website` @ `2a6c260` (the guest
checkout + logo/hero patch you already applied). Build verified clean.

**No pawvy-app patch needed for most of this** — except item 6 (phone
field), which pairs with a one-file `pawvy-app-patch.zip` delivered
alongside this. Apply both together for that one.

---

## 1. Marquee not animating on Janice's PC — not a bug, likely a setting

I checked the code carefully and there's no per-machine bug here. There's
one line in `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .marquee-track, .blob, ... { animation: none !important; }
}
```

This is an intentional accessibility feature, already in the code from
before — if the operating system has "Reduce Motion" turned on (macOS:
System Settings → Accessibility → Display; Windows: Settings →
Accessibility → Visual effects → Animation effects), every animation on
the site — the marquee, the morphing blobs, the typewriter effect — is
disabled site-wide, on purpose, for people sensitive to motion.

**My guess**: Janice's PC has this OS-level setting enabled. Worth her
checking that setting first — nothing to fix in code unless you want to
override this accessibility behavior (not recommended, but let me know
if you'd rather I remove it).

## 2. Stats strip after hero
`app/page.js`

Replaced the four stat cards (was: 6 Brands / 107+ Retail Partners /
1000+ Happy Pets / 100% Vetted Quality) with:
- **200+** Products
- **100%** Vetted Quality
- **5⭐** Reviews
- **5+** Years in Singapore

Same animated count-up behavior as before, just new numbers/labels.

## 3. Brand card wording
`components/BrandGallery.jsx`

- BetterBone: "biodegradable" → "ingestible"
- East Sea Brother: "Korean-made treats" → "Human-grade treats"
- Lillidale: full tagline replaced with "Nutritionist-formulated pet
  care, from all-natural supplements to hygiene care products."
- Puzzle Feeder and Salmoil/GiGwi taglines untouched, per your note.

## 4. Why Pawvy — item 03
`app/page.js`

Removed "As the exclusive distributor, " from the opening of that line.
Now reads: *"We vet every brand before it reaches you — no marketplace
guesswork."*

## 5. Instagram handle
`app/page.js`

"Follow us at @Pawvy_SG" → "Follow us at Pawvy_SG" (link/URL unchanged,
just the visible "@" removed).

## 6. Get in touch section
`components/EnquiryForm.jsx`, `app/globals.css`, + paired `pawvy-app`
patch

- Phone field: label changed from "Phone (optional)" to "Phone", and now
  `required` on the form — **this pairs with a matching backend change**
  (in `pawvy-app-patch.zip`) so someone can't just skip validation by
  hitting the API directly; both sides now reject a submission with no
  phone number.
- Left-side contact block (`hello@pawvy.info`, `+65 9689 4853`,
  `Singapore`) — un-bolded, from `font-weight: 800` to `400`.

## 7. Hero background reverted
`app/page.js`, `app/globals.css`

Removed the trade-show photo entirely — back to plain navy with the
morphing blobs, as it was before that patch. I've left the actual
`public/hero-bg.jpg` file in the repo (unused, harmless) rather than
deleting it, in case you want to reuse it somewhere else later; let me
know if you'd rather I remove the file too.

## 8. Testimonial cards — real photos + bigger stars
`app/page.js`, `app/globals.css`, `public/testimonials/*.jpg`

Added the four photos you sent, matched to their reviewer (Sparky,
Macholefrenchie, Megan, Freya), and enlarged the stars roughly 2.5x
(14px → 36px).

**On "try not to crop them"**: all four photos you sent are portrait
orientation and — happy coincidence — share almost exactly the same
aspect ratio (~3:4, within 1% of each other across all four). Instead of
the small circular avatar I first mocked up (which definitely would have
cropped these), I restructured the card into a full-width photo panel
across the top with the same 3:4 aspect ratio, so each photo displays
essentially in full — the ~1% difference between the photos' exact
ratios and the card's fixed ratio is imperceptible. Stars/quote/name
moved into a padded section below the photo.

If you send photos with a very different aspect ratio in future (e.g. a
wide landscape shot), let me know and I'll either adjust the panel ratio
to fit or switch that card to a letterboxed/contain layout so nothing
gets cut off.

**Follow-up redesign**: the marquee-widening fix wasn't good enough, so
this replaces the auto-scrolling marquee for testimonials entirely with
a new component, `components/TestimonialCarousel.jsx` — a paginated
carousel with left/right arrow buttons instead of infinite auto-scroll.
Card size reverted back to the original 340px/22px gap.

- **PC and wide mobile** (>480px): 2 cards per page, arrows page through
  both pages (4 reviews ÷ 2 = 2 pages), wrapping around at the ends.
- **Compact screens** (≤480px): 1 card per page, arrows page through all
  4 individually.
- Breakpoint is tracked live via `matchMedia`, so rotating a device or
  resizing a browser window updates the layout immediately, not just on
  first load.
- Small dot indicators between the arrows show which page you're on —
  a minor addition on top of what was asked, easy to remove if you'd
  rather keep it to just the two buttons.
- No filler/duplicate cards anymore — since it's paginated rather than
  looping, it only ever shows real reviews, so this scales cleanly
  whenever more reviews get added later (pages just increase).

---

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Homepage: Janice's wording revisions, stats update, real testimonial photos + bigger stars, hero bg revert"
git push origin main
```

Also apply `pawvy-app-patch.zip` (same flow, other repo) for the phone
field to be enforced server-side too.

## What to check live after deploy

- Homepage: new stats numbers, updated brand card wording, "As the
  exclusive distributor" gone from Why Pawvy 03, Instagram line without
  the @, un-bolded contact info, hero back to plain navy+blobs.
- Testimonial cards show the real photos uncropped (or close to it) and
  stars are visibly bigger.
- Contact form: try submitting with phone blank — should be blocked
  both by the browser (required field) and, if you bypass that, by the
  API itself once the app-side patch is applied.
- Ask Janice to check her OS's "Reduce Motion" / animation setting for
  item 1.
