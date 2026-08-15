# Push the banner carousel to STAGING (not main)

## This delivery is for the Website folder (`pawvy-website`) only,
## targeting the `staging` branch specifically.

4 files: `components/HomepageBanner.jsx`, `app/page.js`,
`app/globals.css`, `lib/api.js`.

Same exact carousel + Show/Hide caption toggle already delivered and
tested earlier — no code changes, just re-packaged to go onto `staging`
instead of `main`, since staging ended up showing the old reverted hero
rather than the carousel.

## To apply — note the branch

```bash
cd /path/to/your/pawvy-website
git checkout staging
git pull origin staging
git checkout -- . && git clean -fd
```

Unzip this delivery's files into that folder (overwrite), then:

```bash
git add .
git commit -m "Push banner carousel + caption toggle to staging for image design review"
git push origin staging
```

Railway's staging environment auto-deploys from this branch — should
update automatically once pushed. `main`/production is untouched;
pawvy.co keeps showing the reverted hero as expected.

## To apply — do this together with the companion App-side delivery

The two only work correctly together — apply both to `staging` before
checking Staging Pawvy Website (S-Web).
