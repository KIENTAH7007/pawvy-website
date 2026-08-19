import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shopApi, imageUrl } from '../../../lib/api';
import { displayBrandName, brandSlug } from '../../../lib/brandSlugs';
import { BRAND_CONTENT, faqSlug } from '../../../lib/brandContent';
import { productDisplayName, productTitleTag } from '../../../lib/productDisplayName';
import { formatPrice } from '../../../lib/formatPrice';
import { buildOgMeta, buildProductJsonLd } from '../../../lib/seo';
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
    const title = `${productTitleTag(product)} | Pawvy`;
    const description = product.description
      ? product.description.slice(0, 155)
      : `${cleanName} by ${displayBrandName(product.brand_name)} — available now on Pawvy.co.`;
    return {
      title,
      description,
      alternates: { canonical: `/shop/${id}` },
      // Each product's own photo for the share preview — falls back to
      // the site default (buildOgMeta's own default) for the rare
      // product that hasn't had a photo uploaded yet.
      ...buildOgMeta({ title, description, path: `/shop/${id}`, image: product.image_url ? imageUrl(product.image_url) : undefined }),
    };
  } catch {
    return { title: 'Product | Pawvy' };
  }
}

export default async function ProductPage({ params, searchParams }) {
  const { id } = await params;
  const { siblings: siblingsParam } = await searchParams;
  let product;
  try {
    ({ product } = await shopApi.product(id));
  } catch {
    notFound();
  }
  const name = productDisplayName(product);

  // Sibling variants (Aug 2026, per KT — "Option 1: default variant +
  // switcher" from the click-through discussion) — same item_series,
  // different size/flavor. Real navigation between each variant's own
  // page/URL rather than a single-page live-swap: simpler, and every
  // variant still gets its own real, indexable, shareable URL.
  //
  // Prefers the explicit ?siblings=id,id,id from the card that linked
  // here (the card already resolved its own exact match set correctly,
  // however that brand's data happens to be organized — GiGwi's colors
  // are genuinely different item_series values, matched by SKU prefix,
  // not a shared series — see CategoryBrowser.jsx). Falls back to an
  // item_series exact-match lookup only for direct/bookmarked URLs that
  // arrive with no siblings context at all.
  let siblings = [];
  const explicitIds = (siblingsParam || '').split(',').map(s => s.trim()).filter(Boolean);
  if (explicitIds.length > 1) {
    try {
      const { products: bulk } = await shopApi.products({ ids: explicitIds.join(',') });
      siblings = bulk;
    } catch {
      // fall through to item_series below
    }
  }
  if (siblings.length <= 1 && product.item_series) {
    try {
      const { products: sameSeriesProducts } = await shopApi.products({ item_series: product.item_series });
      siblings = sameSeriesProducts;
    } catch {
      // Non-fatal — page still works fine with just the current variant,
      // just without the switcher row.
    }
  }
  const showSwitcher = siblings.length > 1;

  const jsonLd = buildProductJsonLd({
    name,
    description: product.description || `${name} by ${displayBrandName(product.brand_name)}`,
    image: product.image_url ? imageUrl(product.image_url) : 'https://pawvy.co/og-default.jpg',
    brandName: displayBrandName(product.brand_name),
    url: `https://pawvy.co/shop/${id}`,
  });

  return (
    <div className="product-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span className="sep">/</span>
        <Link href="/shop">Shop</Link><span className="sep">/</span>
        <Link href={`/brands/${brandSlug(product.brand_name)}`}>{displayBrandName(product.brand_name)}</Link><span className="sep">/</span>
        <span className="current">{name}</span>
      </nav>

      <Link href="/shop" className="back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        Back to shop
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          {product.image_url ? (
            <img src={imageUrl(product.image_url)} alt={name} />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-brand" style={{ color: product.brand_color || 'var(--orange)' }}>{displayBrandName(product.brand_name)}</div>
          <h1>{name}</h1>

          {product.best_for && (
            <div className="product-detail-bestfor">Best for: {product.best_for}</div>
          )}

          <div className="product-detail-price">
            {product.is_discount_active && <span className="was">{formatPrice(product.price_rrp_sg)}</span>}
            {formatPrice(product.effective_price_rrp_sg)}
          </div>

          {showSwitcher && (
            <div className="product-detail-variants">
              <div className="label">Choose your size</div>
              <div className="variant-switcher">
                {siblings.map(sib => (
                  <Link
                    key={sib.id}
                    href={`/shop/${sib.id}`}
                    className={`variant-btn${sib.id === product.id ? ' active' : ''}${sib.stock_status === 'out_of_stock' ? ' oos' : ''}`}
                  >
                    {sib.variation || productDisplayName(sib)}
                    {sib.stock_status === 'out_of_stock' && <span className="variant-oos-tag">Out of stock</span>}
                  </Link>
                ))}
              </div>
            </div>
          )}

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
