import ShopClient from '../../components/ShopClient';
import { shopApi } from '../../lib/api';
import { buildOgMeta } from '../../lib/seo';
import { NEED_CATEGORIES, needLabel } from '../../lib/needTags';

const TITLE = 'Shop | Pawvy';
const DESCRIPTION = 'Browse natural pet wellness products from BetterBone, Salmoil, Lillidale, Eastsea Brother, Puzzle Feeder and GiGwi.';

export async function generateMetadata({ searchParams }) {
  const { need } = await searchParams;
  const validNeed = NEED_CATEGORIES.some(n => n.slug === need) ? need : null;
  if (validNeed) {
    const label = needLabel(validNeed);
    const title = `${label} | Shop by Need | Pawvy`;
    const description = `Shop Pawvy products for ${label.toLowerCase()} — vetted across all six brands.`;
    return {
      title,
      description,
      alternates: { canonical: `/shop?need=${validNeed}` },
      ...buildOgMeta({ title, description, path: `/shop?need=${validNeed}` }),
    };
  }
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: '/shop' },
    ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/shop' }),
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

  const [{ products }, { brands }, testimonialsResult] = await Promise.all([
    shopApi.products(validNeed ? { need: validNeed } : {}),
    shopApi.brands(),
    validNeed ? shopApi.testimonials(validNeed).catch(() => ({ testimonials: [] })) : Promise.resolve({ testimonials: [] }),
  ]);

  return (
    <ShopClient
      initialProducts={products}
      brands={brands}
      initialNeed={validNeed}
      initialTestimonials={testimonialsResult.testimonials}
    />
  );
}
