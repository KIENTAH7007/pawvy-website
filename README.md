# Pawvy Website — Patch: table-format Salmoil dosage/size FAQ answers

Applies on top of `KIENTAH7007/pawvy-website` @ `main`. Three files
changed: `lib/brandContent.js`, `app/globals.css`,
`app/brands/[slug]/page.js`. Build verified clean — including a full
end-to-end test: cloned your real `main` fresh, applied this exact
patch zip on top, ran `npm install && npm run build` from scratch. Not
just checked against my working copy.

## What changed

You asked for the two dosage/size FAQ answers to render as tables
instead of paragraphs — easier to scan and refer back to. That needed
one structural change plus the content itself:

**`app/brands/[slug]/page.js`** — FAQ answers now render as real HTML
(`dangerouslySetInnerHTML`) instead of plain text. This is safe here
because FAQ answers are first-party content you and I write, never
user input — there's no injection risk. Plain-text answers (every other
FAQ on every other brand page) render identically either way, since
plain text is valid HTML with no tags. I checked every existing FAQ
answer across all brands for stray `<`/`&` characters that could break
under this change — none found.

**`lib/brandContent.js`** — the two dosage FAQs on the Salmoil page are
now real `<table>` markup:
- "How much Salmoil should I give my dog?" — pet weight → daily dose
- "Which Salmoil size should I get?" — bottle size × pet weight → how
  many days it lasts, plus a one-line takeaway on which size to pick

**`app/globals.css`** — added `.faq-table` styling matching the FAQ
section's dark navy palette, and made it horizontally scrollable on
narrow screens (the size table has 6 columns, which won't fit on a
phone at readable font size — it scrolls instead of squishing).

## How this was verified (no live backend in my environment)

`/brands/salmoil` needs a live API call to your Pawvy App backend to
resolve the brand and its products — not available in my sandbox. So
instead of guessing, I verified two ways:
1. Extracted the two new table strings directly from the file and
   confirmed every HTML tag is properly opened and closed (7 rows / 2
   columns for the dosage table, 4 rows / 6 columns for the size
   table — both balanced).
2. A full clone-patch-build end-to-end test: cloned your actual `main`
   fresh into a scratch folder, applied this exact patch zip on top,
   ran `npm install && npm run build` from a cold start — clean, no
   errors. This catches any JS syntax errors the table strings might
   have introduced (none did).

I'd still ask for a real click-through after deploy, same as always,
since balanced tags don't guarantee it *looks* right — just that it
won't crash.

## Git commands

```bash
git checkout main
git pull origin main
# unzip this patch on top ("Copy and Replace")
git add -A
git commit -m "Salmoil FAQ: table-format dosage and size guides"
git push origin main
```

## What to check live after deploy

Visit `/brands/salmoil`, expand both dosage FAQs, confirm both tables
render cleanly on desktop and on a narrow phone screen (the 6-column
size table should scroll sideways rather than break the layout).
