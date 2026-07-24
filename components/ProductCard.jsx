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
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, opacity: outOfStock ? 0.6 : 1 }}>
      <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ aspectRatio: '1 / 1', background: '#f5f5f5', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {p.image_data ? (
            <img src={p.image_data} alt={p.item_series} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 12, color: '#999' }}>No image</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: p.brand_color || '#999', marginTop: 8, fontWeight: 600 }}>{p.brand_name}</div>
        <div style={{ fontSize: 14, marginTop: 2 }}>{p.item_series}{p.variation ? ` — ${p.variation}` : ''}</div>
        <div style={{ marginTop: 6 }}>
          {p.is_discount_active ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#999', fontSize: 12, marginRight: 6 }}>${p.price_rrp_sg.toFixed(2)}</span>
              <span style={{ fontWeight: 700 }}>${p.effective_price_rrp_sg.toFixed(2)}</span>
            </>
          ) : (
            <span style={{ fontWeight: 700 }}>${p.price_rrp_sg.toFixed(2)}</span>
          )}
        </div>
        {p.stock_status === 'out_of_stock' && <div style={{ fontSize: 11, color: 'crimson', marginTop: 4 }}>Out of stock</div>}
        {p.stock_status === 'low_stock' && <div style={{ fontSize: 11, color: '#e6a700', marginTop: 4 }}>Low stock</div>}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <QtyStepper value={qty} onChange={setQty} disabled={outOfStock} />
        <button
          disabled={outOfStock}
          onClick={() => { onAdd(p, qty); setQty(1); }}
          style={{ flex: 1, padding: 8 }}
        >
          {outOfStock ? 'Out of stock' : 'Add'}
        </button>
      </div>
    </div>
  );
}
