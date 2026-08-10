import ShopClient from '../../components/ShopClient';
import { shopApi } from '../../lib/api';
import { buildOgMeta } from '../../lib/seo';

const TITLE = 'Shop | Pawvy';
const DESCRIPTION = 'Browse natural pet wellness products from BetterBone, Salmoil, Lillidale, Eastsea Brother, Puzzle Feeder and GiGwi.';

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/shop' },
  ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/shop' }),
};

// Server Component — fetches the initial product list server-side, so the
// HTML Google (and anyone sharing a link) actually sees already has real
// product names/prices in it, not an empty shell waiting on client JS.
// Interactive filtering/search still happens client-side after that, via
// ShopClient.
export default async function ShopPage() {
  const [{ products }, { brands }] = await Promise.all([
    shopApi.products({}),
    shopApi.brands(),
  ]);

  return <ShopClient initialProducts={products} brands={brands} />;
}
