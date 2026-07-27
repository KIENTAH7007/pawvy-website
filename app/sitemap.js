import { shopApi } from '../lib/api';
import { BRAND_SLUGS } from '../lib/brandSlugs';

// Next.js generates a real /sitemap.xml from this — includes every real
// product page and all 6 brand pages, not just the static top-level ones,
// so Google actually has a map to every indexable page on the site.
export default async function sitemap() {
  const base = 'https://pawvy.co';
  const staticPages = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/stockist`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const brandPages = Object.values(BRAND_SLUGS).map(slug => ({
    url: `${base}/brands/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  let productPages = [];
  try {
    const { products } = await shopApi.products({});
    productPages = products.map(p => ({
      url: `${base}/shop/${p.id}`,
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
