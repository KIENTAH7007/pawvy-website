import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shopApi } from '../../../lib/api';
import { brandNameFromSlug, BRAND_SLUGS } from '../../../lib/brandSlugs';
import ShopClient from '../../../components/ShopClient';

// Pre-render all 6 brand pages at build time — real HTML for each, not
// generated on the fly per visitor. Matches the current live site's exact
// URL slugs (see lib/brandSlugs.js) so any existing SEO value carries over.
export async function generateStaticParams() {
  return Object.values(BRAND_SLUGS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brandName = brandNameFromSlug(slug);
  if (!brandName) return { title: 'Brand | Pawvy' };
  return {
    title: `${brandName} | Pawvy`,
    description: `Shop ${brandName} products on Pawvy.co — Singapore's exclusive distributor.`,
  };
}

// Structurally real (fetches this brand's actual products server-side,
// real HTML/SEO value) even though the visual design here is a
// placeholder — reuses ShopClient (same interactive grid as the main shop
// page) pre-filtered to one brand, rather than a static "coming soon"
// page with nothing real on it.
export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brandName = brandNameFromSlug(slug);
  if (!brandName) notFound();

  const { brands } = await shopApi.brands();
  const brand = brands.find(b => b.name === brandName);
  if (!brand) notFound();

  const { products } = await shopApi.products({ brand_id: brand.id });

  return (
    <div>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 0' }}>
        <Link href="/shop" style={{ fontSize: 13, color: '#666' }}>&larr; All brands</Link>
        <h1 style={{ marginTop: 8, color: brand.color }}>{brand.name}</h1>
        <p style={{ color: '#666', fontSize: 14 }}>
          Full brand page coming soon. In the meantime, here's what's currently available.
        </p>
      </div>
      <ShopClient initialProducts={products} brands={brands} />
    </div>
  );
}
