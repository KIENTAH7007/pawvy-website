'use client';

import React, { useState } from 'react';
import { displayBrandName } from '../lib/brandSlugs';
import { productDisplayName, productUrl } from '../lib/productDisplayName';
import { imageUrl } from '../lib/api';
import { formatPrice } from '../lib/formatPrice';
import Link from 'next/link';
import QtyStepper from './QtyStepper';

// Shared between the Shop grid and Cart's upsell section — identical to
// the Vite version, just using next/link instead of react-router-dom.
export default function ProductCard({ product: p, onAdd }) {
  const [qty, setQty] = useState(1);
  const outOfStock = p.stock_status === 'out_of_stock';
  const name = productDisplayName(p);

  return (
    <div className="product-card" style={{ opacity: outOfStock ? 0.6 : 1 }}>
      <Link href={productUrl(p)}>
        <div className="card-tags">
          <span className="brand-tag" style={{ color: p.brand_color || 'var(--navy)' }}>{displayBrandName(p.brand_name)}</span>
          {(p.stock_status === 'low_stock' || outOfStock) && (
            <span className={`stock-tag ${outOfStock ? 'out' : 'low'}`}>{outOfStock ? 'Out of stock' : 'Low stock'}</span>
          )}
        </div>
        <div className="thumb">
          {p.is_new_active && <span className="new-tag">New</span>}
          {p.image_url ? (
            <img src={imageUrl(p.image_url)} alt={name} />
          ) : (
            <span className="no-img">No image</span>
          )}
        </div>
        <div className="info">
          <h3>{name}</h3>
          <div className="price">
            {p.is_discount_active && <span className="was">{formatPrice(p.price_rrp_sg)}</span>}
            {formatPrice(p.effective_price_rrp_sg)}
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
