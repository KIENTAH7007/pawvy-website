# Pawvy Website — Patch: real Salmoil dosage/size FAQ answers

Applies on top of `KIENTAH7007/pawvy-website` @ `main` (after the
testimonial carousel patch). One file changed: `lib/brandContent.js`.
Build verified clean.

## What changed

On the Salmoil brand page (`/brands/salmoil`), FAQ section:

- **"How much Salmoil should I give my dog?"** — was a generic
  "depends on weight, check the label" placeholder. Replaced with your
  actual dosage-by-weight numbers (1 tsp @ 5kg up to 3.5 tsp @ 30kg,
  flat 1 tsp for cats).
- **New FAQ added**: "Which Salmoil size should I get — 150ml, 250ml,
  or 500ml?" — answers using your "finish within 2–3 months once
  opened" guidance, translated into which size fits which pet weight.

## Why this lives here, not in each product's Description field

The dosage/size guide applies identically across all 6 recipes and all
18 SKUs — it's about the pet's weight, not which recipe they're on.
Pasting the same guide into 18 separate product descriptions would
create heavy duplicate content across those pages, which works against
the SEO goal of this whole project (search engines de-value near-
identical pages). The brand page's FAQ section is genuinely shared
content that already existed for exactly this kind of question — so
this fixes a placeholder that was already there rather than adding new
surface area.

## A separate thing I noticed while in this file — not touched, just flagging

The Salmoil recipe selector on this same page only lists 5 recipes
(Kidney, Gut, Dental/Odor Control, Coat, Joint) — Recipe 3 (100% Vegan /
Linseaoil) isn't in there at all, and doesn't have a
`selector-vegan.jpg` image prepared. This looks like it was built
before Recipe 3 existed in the real catalog, or the image was never
supplied. Your database has all 6 recipes confirmed (SR1–SR6, 3 sizes
each), so this is a real gap — just out of scope for this patch since
it needs a new photo from you first. Let me know if you want this
added; it's a small change once I have the image.

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Salmoil brand page: real dosage/size FAQ answers"
git push origin main
```

## What to check live after deploy

Visit `/brands/salmoil`, scroll to the FAQ section, expand "How much
Salmoil should I give my dog?" and the new sizing question — confirm
the numbers read correctly.
