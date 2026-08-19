'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../lib/CartContext';
import { waitlistApi } from '../lib/api';

// Small client island — just the interactive part of the product page.
// The product name/price/description around this stays server-rendered.
export default function AddToCartSection({ product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const outOfStock = product.stock_status === 'out_of_stock';

  // OOS "Notify me" capture (Aug 2026) — posts to the public waitlist
  // endpoint (no login required, see pawvy-app's server/routes/waitlist.js).
  // Staff see who's signed up in Pawvy App → Products & Pricing → the
  // small bell badge on this product's row.
  const [email, setEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState(null); // null | 'sending' | 'done' | 'error'

  async function handleNotifySubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setNotifyStatus('sending');
    try {
      await waitlistApi.join(product.id, email.trim());
      setNotifyStatus('done');
    } catch {
      setNotifyStatus('error');
    }
  }

  if (outOfStock) {
    return (
      <div style={{ marginTop: 16 }}>
        <p style={{ color: 'crimson', fontWeight: 700, marginBottom: 12 }}>Out of stock</p>
        {notifyStatus === 'done' ? (
          <p style={{ fontSize: 13.5, color: 'var(--navy)' }}>✓ We'll email you when this is back in stock.</p>
        ) : (
          <form onSubmit={handleNotifySubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: '1 1 200px', padding: '10px 14px', borderRadius: 8,
                border: '1.5px solid rgba(20,33,61,.15)', fontSize: 14,
              }}
            />
            <button
              type="submit"
              className="btn btn-orange"
              disabled={notifyStatus === 'sending'}
            >
              <span>{notifyStatus === 'sending' ? 'Submitting…' : '🔔 Notify me'}</span>
            </button>
          </form>
        )}
        {notifyStatus === 'error' && (
          <p style={{ fontSize: 12.5, color: 'crimson', marginTop: 8 }}>Something went wrong — please try again.</p>
        )}
      </div>
    );
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
