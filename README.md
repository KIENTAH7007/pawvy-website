# Salmoil selector — tabs now stretch to fill the full image height

## What changed

The 5 tabs used their natural content height with gaps between them,
which fell short of the image column's height (set by the image's
aspect-ratio), leaving the gap you circled in yellow.

- `.sal-tabs` now stretches to the full height of its grid row (`height:
  100%`), and each `.sal-tab` gets `flex: 1` so all 5 grow equally to
  fill that height exactly — no matter how tall the image column ends up
  being.
- Content inside each tab is now vertically centered, so the extra room
  doesn't just pad the bottom of each pill.
- Bumped the text sizes for a bit more presence now that each tab has
  more room: recipe label 11px → 12.5px, ingredient name 15.5px → 19px.

## File in this patch

- `app/globals.css` — only the `.sal-tabs`/`.sal-tab`/`.sal-tab-recipe`/
  `.sal-tab h4` rules changed. Nothing else touched.

## Deploying

```bash
git checkout main
git pull origin main
```

Unzip on top of your local folder, then:

```bash
git add -A
git commit -m "Stretch Salmoil selector tabs to match image height, bump text size"
git push origin main
```
