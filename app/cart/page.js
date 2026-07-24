'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/CartContext';
import { shopApi } from '../../lib/api';
import ProductCard from '../../components/ProductCard';

const FREE_SHIPPING_THRESHOLD = 60;
const SHIPPING_COST = 3;

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, addItem } = useCart();
  const [topSellers, setTopSellers] = useState([]);
  const isMobile = useIsMobile();
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  useEffect(() => {
    shopApi.topSellers(20).then(d => setTopSellers(d.products));
  }, []);

  const cartIds = new Set(items.map(i => i.id));
  const upsellCount = isMobile ? 6 : 8;
  const upsellProducts = topSellers.filter(p => !cartIds.has(p.id)).slice(0, upsellCount);

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px' }}>
      <Link href="/shop" style={{ fontSize: 13, color: '#666' }}>&larr; Back to shop</Link>

      <h1 style={{ marginTop: 12 }}>Your Cart</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: '#666' }}>Your cart is empty.</p>
          <Link href="/shop"><button style={{ padding: '10px 16px', marginTop: 12 }}>Browse the Shop</button></Link>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 16 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 6, background: '#f5f5f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.image_data ? (
                      <img src={item.image_data} alt={item.item_series} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 9, color: '#999' }}>No image</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#666' }}>{item.brand_name}</div>
                    <div>{item.item_series}{item.variation ? ` — ${item.variation}` : ''}</div>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>${item.price.toFixed(2)} each</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <input
                    type="number" min="1" value={item.qty}
                    onChange={e => updateQty(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: 50, padding: 6 }}
                  />
                  <button onClick={() => removeItem(item.id)} style={{ padding: '6px 10px', color: 'crimson' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, fontSize: 14 }}>
            <Row label="Subtotal" value={subtotal} />
            <Row label={freeShipping ? 'Shipping (free!)' : 'Shipping'} value={shipping} />
            {!freeShipping && (
              <p style={{ fontSize: 12, color: '#666' }}>
                Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.
              </p>
            )}
            <Row label="Total" value={total} bold />
          </div>

          <button disabled style={{ width: '100%', padding: 12, marginTop: 20, opacity: 0.5, cursor: 'not-allowed' }}>
            Checkout — coming soon
          </button>
          <p style={{ fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 }}>
            Checkout & payment aren't built yet — this cart works, but there's nowhere to pay just yet.
          </p>
        </>
      )}

      {upsellProducts.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 16 }}>🔥 Popular right now</h2>
          <p style={{ fontSize: 12.5, color: '#666', marginTop: -8 }}>Based on real sales over the last 3 months</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
            {upsellProducts.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontWeight: bold ? 700 : 400 }}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}
