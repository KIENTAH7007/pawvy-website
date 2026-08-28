import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shopApi, imageUrl } from '../../../lib/api';
import { displayBrandName } from '../../../lib/brandSlugs';
import { productDisplayName } from '../../../lib/productDisplayName';
import { formatPrice } from '../../../lib/formatPrice';
import { buildOgMeta } from '../../../lib/seo';
import { needLabel } from '../../../lib/needTags';
import AddBundleSection from '../../../components/AddBundleSection';

// Stage 1 bundle — no separate bundle price stored anywhere. Everything
// shown here (each component's price, the total, whether it's in stock)
// is computed live server-side from the real products at request time
// (see pawvy-app's shop.js) — this page just displays what that endpoint
// already worked out, same as the product detail page does for a single
// product.
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { bundle } = await shopApi.bundle(id);
    const title = `${bundle.name} | Pawvy`;
    const description = bundle.description
      ? bundle.description.slice(0, 155)
      : `${bundle.name} — a curated set of ${bundle.products.length} products from Pawvy, ${formatPrice(bundle.total_price)} total.`;
    const canonicalPath = `/bundles/${bundle.id}`;
    return {
      title,
      description,
      alternates: { canonical: canonicalPath },
      ...buildOgMeta({ title, description, path: canonicalPath, image: bundle.image_url ? imageUrl(bundle.image_url) : (bundle.products[0]?.image_url ? imageUrl(bundle.products[0].image_url) : undefined) }),
    };
  } catch {
    return { title: 'Bundle | Pawvy' };
  }
}

export default async function BundlePage({ params }) {
  const { id } = await params;
  let bundle;
  try {
    ({ bundle } = await shopApi.bundle(id));
  } catch {
    notFound();
  }

  return (
    <main className="bundle-detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span className="sep">/</span>
        <Link href="/shop">Shop</Link><span className="sep">/</span>
        <span className="current">{bundle.name}</span>
      </nav>

      <div className="bundle-detail">
        {bundle.need_tag && <div className="bd-tag">Bundle · {needLabel(bundle.need_tag)}</div>}
        <h1 className="bd-title">{bundle.name}</h1>
        {bundle.description && <p className="bd-desc">{bundle.description}</p>}

        {bundle.image_url ? (
          <div className="bd-hero">
            <img src={imageUrl(bundle.image_url)} alt={bundle.name} />
          </div>
        ) : (
          <div className="bd-images">
            {bundle.products.map(p => (
              <div key={p.id} className="bd-image-cell">
                {p.image_url
                  ? <img src={imageUrl(p.image_url)} alt={productDisplayName(p)} />
                  : <span className="bd-image-fallback">{displayBrandName(p.brand_name)}</span>}
              </div>
            ))}
          </div>
        )}

        <div className="bd-components">
          {bundle.products.map(p => (
            <div className="bd-row" key={p.id}>
              <div className="thumb">
                {p.image_url
                  ? <img src={imageUrl(p.image_url)} alt="" />
                  : <div className="thumb-fallback" />}
              </div>
              <div className="info">
                <div className="brand">{displayBrandName(p.brand_name)}</div>
                <div className="name">{productDisplayName(p)}{p.qty > 1 ? ` × ${p.qty}` : ''}</div>
              </div>
              <div className="price">
                {p.is_discount_active && <span className="was">{formatPrice(p.price_rrp_sg * p.qty)}</span>}
                {formatPrice(p.effective_price_rrp_sg * p.qty)}
              </div>
            </div>
          ))}
        </div>

        <div className="bd-total-row">
          <span className="label">Bundle total</span>
          <span className="amount">{formatPrice(bundle.total_price)}</span>
        </div>

        <AddBundleSection bundle={bundle} />

        <p className="bd-note">Adds each of the {bundle.products.length} products above to your cart individually, at their real current prices.</p>
      </div>
    </main>
  );
}
