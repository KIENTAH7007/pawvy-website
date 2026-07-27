'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import QtyStepper from './QtyStepper';

// Shared between the Shop grid and Cart's upsell section — identical to
// the Vite version, just using next/link instead of react-router-dom.
export default function ProductCard({ product: p, onAdd }) {
  const [qty, setQty] = useState(1);
  const outOfStock = p.stock_status === 'out_of_stock';

  return (
    <div className="product-card" style={{ opacity: outOfStock ? 0.6 : 1 }}>
      <Link href={`/shop/${p.id}`}>
        <div className="card-tags">
          <span className="brand-tag" style={{ color: p.brand_color || 'var(--navy)' }}>{p.brand_name}</span>
          {(p.stock_status === 'low_stock' || outOfStock) && (
            <span className={`stock-tag ${outOfStock ? 'out' : 'low'}`}>{outOfStock ? 'Out of stock' : 'Low stock'}</span>
          )}
        </div>
        <div className="thumb">
          {p.image_data ? (
            <img src={p.image_data} alt={p.item_series} />
          ) : (
            <span className="no-img">No image</span>
          )}
        </div>
        <div className="info">
          <h3>{p.item_series}{p.variation ? ` — ${p.variation}` : ''}</h3>
          <div className="price">
            {p.is_discount_active && <span className="was">${p.price_rrp_sg.toFixed(2)}</span>}
            ${p.effective_price_rrp_sg.toFixed(2)}
          </div>
        </div>
      </Link>

      <div className="info" style={{ paddingTop: 0 }}>
        <div className="cart-row">
          <QtyStepper value={qty} onChange={setQty} disabled={outOfStock} />
          <button
            className="add-btn"
            disabled={outOfStock}
            onClick={() => { onAdd(p, qty); setQty(1); }}
          >
            {outOfStock ? 'Out of stock' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
