import ShopClient from '../../components/ShopClient';
import { shopApi } from '../../lib/api';
import { buildOgMeta } from '../../lib/seo';
import { NEED_CATEGORIES, needLabel } from '../../lib/needTags';
import { brandCountWords, joinBrandNames, displayBrandName } from '../../lib/brandSlugs';

const TITLE = 'Shop | Pawvy';

export async function generateMetadata({ searchParams }) {
  const { need } = await searchParams;
  const validNeed = NEED_CATEGORIES.some(n => n.slug === need) ? need : null;
  // generateMetadata runs in its own execution context, separate from
  // ShopPage() below — doesn't share that function's fetch, needs its
  // own. Real, already-filtered count (Aug 2026, per KT) so this stops
  // needing a manual update every time a brand launches or gets hidden
  // — same reasoning as the homepage's "Seven brands, one standard".
  const { brands } = await shopApi.brands().catch(() => ({ brands: [] }));
  const brandsPhrase = brandCountWords(brands.length).toLowerCase();
  if (validNeed) {
    const label = needLabel(validNeed);
    const title = `${label} | Shop by Need | Pawvy`;
    const description = `Shop Pawvy products for ${label.toLowerCase()} — vetted across all ${brandsPhrase}.`;
    return {
      title,
      description,
      alternates: { canonical: `/shop?need=${validNeed}` },
      ...buildOgMeta({ title, description, path: `/shop?need=${validNeed}` }),
    };
  }
  const description = `Browse natural pet wellness products from ${joinBrandNames(brands.map(b => displayBrandName(b.name)))}.`;
  return {
    title: TITLE,
    description,
    alternates: { canonical: '/shop' },
    ...buildOgMeta({ title: TITLE, description, path: '/shop' }),
  };
}

// Server Component — fetches the initial product list (and, when a need
// is active, testimonials for it) server-side, so the HTML Google (and
// anyone sharing a /shop?need=dental link) actually sees already has real
// content in it. Interactive filtering still happens client-side after
// that, via ShopClient.
export default async function ShopPage({ searchParams }) {
  const { need } = await searchParams;
  const validNeed = NEED_CATEGORIES.some(n => n.slug === need) ? need : null;

  const [{ products }, { brands }, testimonialsResult, bundlesResult] = await Promise.all([
    shopApi.products(validNeed ? { need: validNeed } : {}),
    shopApi.brands(),
    validNeed ? shopApi.testimonials(validNeed).catch(() => ({ testimonials: [] })) : Promise.resolve({ testimonials: [] }),
    validNeed ? shopApi.bundles(validNeed).catch(() => ({ bundles: [] })) : Promise.resolve({ bundles: [] }),
  ]);

  return (
    <ShopClient
      // key forces a genuinely fresh component instance per need — without
      // this, navigating client-side from /shop?need=chew to
      // /shop?need=skin-coat via the nav dropdown updates this page's
      // props correctly (new server-fetched products/testimonials), but
      // ShopClient's internal useState(initialNeed) only reads that value
      // on first mount, so needFilter (and everything else) stayed stale
      // — the URL changed but nothing on screen did. Remounting resets
      // every piece of local state (needFilter, brandFilter, search,
      // testimonials, products) to match the newly fetched data.
      key={validNeed || 'all'}
      initialProducts={products}
      brands={brands}
      initialNeed={validNeed}
      initialTestimonials={testimonialsResult.testimonials}
      initialBundles={bundlesResult.bundles}
    />
  );
}
