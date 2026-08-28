'use client';

import { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/formatPrice';

// Small client island, same reasoning as AddToCartSection.jsx — the
// bundle name/description/component list around this stays server-
// rendered, only this button needs client-side cart access. Adds each
// real component individually via the exact same addItem() every other
// Add to Cart button on the site uses — a bundle is a curated shortcut,
// not a special cart concept, so there's no new cart logic here at all.
export default function AddBundleSection({ bundle }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddAll() {
    bundle.products.forEach(p => addItem(p, p.qty));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!bundle.in_stock) {
    return (
      <div className="bd-oos">
        One or more products in this bundle are currently out of stock —
        check the list above to see which one, or add the in-stock items
        to your cart individually instead.
      </div>
    );
  }

  return (
    <button type="button" className="bd-cart-btn" onClick={handleAddAll}>
      {added ? 'Added to cart ✓' : `Add all to cart — ${formatPrice(bundle.total_price)}`}
    </button>
  );
}
