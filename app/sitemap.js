import { shopApi } from '../lib/api';
import { brandSlug } from '../lib/brandSlugs';
import { productUrl } from '../lib/productDisplayName';

// Next.js generates a real /sitemap.xml from this — includes every real
// product page and all visible brand pages, not just the static top-level
// ones, so Google actually has a map to every indexable page on the site.
export default async function sitemap() {
  const base = 'https://pawvy.co';
  const staticPages = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/stockist`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  // Aug 2026: was built from the static BRAND_SLUGS list (every brand
  // that exists in code, full stop) — meaning a brand hidden via the
  // hidden_on_website toggle (e.g. Wild Balance, prepped ahead of stock
  // arriving) would still get a real sitemap.xml entry, even though the
  // page itself already 404s while hidden. A curious visitor checking
  // the raw sitemap file could still notice the URL exists. Now built
  // from the real /api/shop/brands response instead — the same endpoint
  // that already excludes hidden brands — so a hidden brand has zero
  // footprint anywhere on the site until it's switched back on.
  let brandPages = [];
  try {
    const { brands } = await shopApi.brands();
    brandPages = brands.map(b => ({
      url: `${base}/brands/${brandSlug(b.name)}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // Same reasoning as productPages below — don't fail the whole
    // sitemap build if the backend is briefly unreachable.
  }

  let productPages = [];
  try {
    const { products } = await shopApi.products({});
    productPages = products.map(p => ({
      url: `${base}${productUrl(p)}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch {
    // If the backend is unreachable at build time, ship the sitemap
    // without product URLs rather than failing the whole build — static
    // pages are still worth having indexed.
  }

  return [...staticPages, ...brandPages, ...productPages];
}
