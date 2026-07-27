import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shopApi } from '../../../lib/api';
import AddToCartSection from '../../../components/AddToCartSection';

// generateMetadata runs server-side per request — this is what actually
// gives each product its own real <title>/<meta description> for Google
// and link previews, instead of every product sharing one generic title
// (the actual thing the old client-only site could never do).
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { product } = await shopApi.product(id);
    const name = `${product.item_series}${product.variation ? ' — ' + product.variation : ''}`;
    return {
      title: `${name} | Pawvy`,
      description: product.description
        ? product.description.slice(0, 155)
        : `${name} by ${product.brand_name} — available now on Pawvy.co.`,
    };
  } catch {
    return { title: 'Product | Pawvy' };
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  let product;
  try {
    ({ product } = await shopApi.product(id));
  } catch {
    notFound();
  }

  return (
    <div className="product-detail-page">
      <Link href="/shop" className="back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        Back to shop
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.image_data ? (
            <img src={product.image_data} alt={product.item_series} />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-brand" style={{ color: product.brand_color || 'var(--orange)' }}>{product.brand_name}</div>
          <h1>{product.item_series}{product.variation ? ` — ${product.variation}` : ''}</h1>

          <div className="product-detail-price">
            {product.is_discount_active && <span className="was">${product.price_rrp_sg.toFixed(2)}</span>}
            ${product.effective_price_rrp_sg.toFixed(2)}
          </div>

          <AddToCartSection product={product} />

          {product.description && (
            <div className="product-detail-desc">
              <div className="label">Description</div>
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
