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
    return <p style={{ color: 'crimson' }}>Out of stock</p>;
  }

  return (
    <>
      {product.stock_status === 'low_stock' && <p style={{ color: '#e6a700', fontSize: 13 }}>Low stock — order soon</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <input
          type="number" min="1" value={qty}
          onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          style={{ width: 60, padding: 8 }}
        />
        <button
          onClick={() => { addItem(product, qty); router.push('/cart'); }}
          style={{ padding: '10px 20px' }}
        >
          Add to Cart
        </button>
      </div>
    </>
  );
}
