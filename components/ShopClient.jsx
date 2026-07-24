'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { shopApi } from '../lib/api';
import { useCart } from '../lib/CartContext';
import ProductCard from './ProductCard';

const FREE_SHIPPING_THRESHOLD = 60;

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

// Receives server-fetched initial products/brands as props — the page's
// first paint (what Google/social previews see) already has real product
// HTML from the server. This component only re-fetches when the customer
// actually interacts (search, brand filter), same behavior as before, just
// no longer responsible for the very first render.
export default function ShopClient({ initialProducts, brands }) {
  const [products, setProducts] = useState(initialProducts);
  const [brandFilter, setBrandFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const { addItem, itemCount, subtotal } = useCart();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Skip the redundant fetch on mount — we already have server-fetched
    // initialProducts for the default (no filter) view.
    if (firstRun) { setFirstRun(false); return; }
    setLoading(true);
    const params = {};
    if (brandFilter) params.brand_id = brandFilter;
    if (search) params.search = search;
    shopApi.products(params).then(d => setProducts(d.products)).finally(() => setLoading(false));
  }, [brandFilter, search]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <div>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#fff', borderBottom: '1px solid #eee', padding: '16px 20px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: 22 }}>Shop</h1>
            <input
              type="search"
              placeholder="Search products…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              style={{ flex: 1, minWidth: 160, maxWidth: 320, padding: 8 }}
            />
            <Link href="/cart"><button style={{ padding: '8px 14px' }}>Cart ({itemCount})</button></Link>
          </div>

          <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} style={{ padding: 8 }}>
              <option value="">All brands</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

            {itemCount > 0 && (
              <div style={{ fontSize: 12.5, color: remaining > 0 ? '#666' : '#2e7d32' }}>
                {remaining > 0
                  ? `Add $${remaining.toFixed(2)} more for free shipping`
                  : "You've got free shipping! 🎉"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '20px auto', padding: '0 20px' }}>
        {loading ? (
          <p>Loading…</p>
        ) : products.length === 0 ? (
          <p style={{ color: '#666' }}>No products found.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16 }}>
            {products.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
          </div>
        )}
      </div>
    </div>
  );
}
