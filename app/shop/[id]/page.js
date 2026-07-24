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
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 20px' }}>
      <Link href="/shop" style={{ fontSize: 13, color: '#666' }}>&larr; Back to shop</Link>

      <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 240, height: 240, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, aspectRatio: '1 / 1' }}>
          {product.image_data ? (
            <img src={product.image_data} alt={product.item_series} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 12, color: '#999' }}>No image</span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 12, color: product.brand_color || '#999', fontWeight: 600 }}>{product.brand_name}</div>
          <h1 style={{ margin: '4px 0' }}>{product.item_series}{product.variation ? ` — ${product.variation}` : ''}</h1>

          <div style={{ margin: '12px 0', fontSize: 22 }}>
            {product.is_discount_active ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: 15, marginRight: 8 }}>${product.price_rrp_sg.toFixed(2)}</span>
                <span style={{ fontWeight: 700 }}>${product.effective_price_rrp_sg.toFixed(2)}</span>
              </>
            ) : (
              <span style={{ fontWeight: 700 }}>${product.price_rrp_sg.toFixed(2)}</span>
            )}
          </div>

          <AddToCartSection product={product} />

          {product.description && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #eee' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                Description
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333', whiteSpace: 'pre-wrap' }}>
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
