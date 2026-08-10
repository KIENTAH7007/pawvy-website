import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shopApi } from '../../../lib/api';
import { displayBrandName, brandSlug } from '../../../lib/brandSlugs';
import { BRAND_CONTENT, faqSlug } from '../../../lib/brandContent';
import { productDisplayName, productTitleTag } from '../../../lib/productDisplayName';
import AddToCartSection from '../../../components/AddToCartSection';

// generateMetadata runs server-side per request — this is what actually
// gives each product its own real <title>/<meta description> for Google
// and link previews, instead of every product sharing one generic title
// (the actual thing the old client-only site could never do).
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const { product } = await shopApi.product(id);
    // <title> keeps the brand name (productTitleTag) since search
    // results/link previews don't show the separate brand-tag chip the
    // on-page card does — worth the keyword there. The meta description
    // and on-page content use the brand-free clean name instead.
    const cleanName = productDisplayName(product);
    return {
      title: `${productTitleTag(product)} | Pawvy`,
      description: product.description
        ? product.description.slice(0, 155)
        : `${cleanName} by ${displayBrandName(product.brand_name)} — available now on Pawvy.co.`,
      alternates: { canonical: `/shop/${id}` },
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
  const name = productDisplayName(product);

  return (
    <div className="product-detail-page">
      <Link href="/shop" className="back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        Back to shop
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.image_data ? (
            <img src={product.image_data} alt={name} />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-brand" style={{ color: product.brand_color || 'var(--orange)' }}>{displayBrandName(product.brand_name)}</div>
          <h1>{name}</h1>

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

          {(() => {
            // sizeGuideFaqQuestion can be a plain string (applies to every
            // SKU of the brand — e.g. Salmoil, where every product is a
            // fish-oil bottle) or a function of the product that returns
            // the matching FAQ question string, or null to skip the link
            // for that specific product (e.g. Lillidale, where only the
            // three Supplements SKUs have a real sizing decision — see
            // the comment on Lillidale's entry in lib/brandContent.js).
            const raw = BRAND_CONTENT[product.brand_name]?.sizeGuideFaqQuestion;
            const question = typeof raw === 'function' ? raw(product) : raw;
            if (!question) return null;
            return (
              <Link
                href={`/brands/${brandSlug(product.brand_name)}#${faqSlug(question)}`}
                className="size-guide-link"
              >
                Not sure which size to get? See our sizing guide →
              </Link>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
