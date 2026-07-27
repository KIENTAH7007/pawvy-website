'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/CartContext';

// Small client island — just the interactive part of the product page.
// The product name/price/description around this stays server-rendered.
export default function AddToCartSection({ product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const outOfStock = product.stock_status === 'out_of_stock';

  if (outOfStock) {
    return <p style={{ color: 'crimson', fontWeight: 700 }}>Out of stock</p>;
  }

  return (
    <>
      {product.stock_status === 'low_stock' && <p style={{ color: '#8a6300', fontSize: 13, fontWeight: 700 }}>Low stock — order soon</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <div className="qty-stepper">
          <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <input
            type="number" min="1" value={qty}
            onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 14, color: 'var(--navy)', border: 'none', background: 'transparent' }}
          />
          <button type="button" onClick={() => setQty(q => q + 1)}>+</button>
        </div>
        <button
          onClick={() => { addItem(product, qty); router.push('/cart'); }}
          className="btn btn-orange"
        >
          <span>Add to Cart</span>
        </button>
      </div>
    </>
  );
}
