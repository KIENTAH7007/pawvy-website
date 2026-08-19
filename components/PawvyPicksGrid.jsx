'use client';

// Small client island for the homepage's Pawvy's Picks section (Aug
// 2026) — app/page.js is a Server Component (real HTML for SEO, per its
// own top comment), so it can't call useCart() itself. This wraps just
// the interactive add-to-cart part; the products themselves are still
// fetched server-side in page.js and passed in as a prop, so the picks
// still show up in the very first server-rendered HTML for
// Google/link-previews, same principle as every other server-fetched
// section on this page.
import { useCart } from '../lib/CartContext';
import ProductCard from './ProductCard';

export default function PawvyPicksGrid({ products }) {
  const { addItem } = useCart();
  if (!products || products.length === 0) return null;
  return (
    <div className="product-grid">
      {products.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
    </div>
  );
}
