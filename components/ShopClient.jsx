'use client';

import React, { useEffect, useState } from 'react';
import { shopApi } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { BRAND_SLUGS } from '../lib/brandSlugs';
import ProductCard from './ProductCard';

const FREE_SHIPPING_THRESHOLD = 60;

// The backend returns brands in whatever order they exist in the database
// — sort here to match the confirmed display sequence used everywhere
// else on the site.
const BRAND_ORDER = Object.keys(BRAND_SLUGS);
function sortBrands(brands) {
  return [...brands].sort((a, b) => BRAND_ORDER.indexOf(a.name) - BRAND_ORDER.indexOf(b.name));
}

// Receives server-fetched initial products/brands as props — the page's
// first paint (what Google/social previews see) already has real product
// HTML from the server. This component only re-fetches when the customer
// actually interacts (search, brand filter), same behavior as before, just
// no longer responsible for the very first render.
export default function ShopClient({ initialProducts, brands, showHero = true }) {
  const [products, setProducts] = useState(initialProducts);
  const [brandFilter, setBrandFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const sortedBrands = sortBrands(brands);
  const [loading, setLoading] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const { addItem, itemCount, subtotal } = useCart();

  useEffect(() => {
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
  const unlocked = remaining === 0 && itemCount > 0;

  const controls = (
    <div className="shop-controls-wrap">
      <div className="shop-controls">
        <input
          type="search"
          placeholder="Search products…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
          <option value="">All brands</option>
          {sortedBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      {itemCount > 0 && (
        <div className={`shop-foc${unlocked ? ' unlocked' : ''}`}>
          {unlocked ? "You've got free delivery! 🎉" : `Add $${remaining.toFixed(2)} more for free delivery`}
        </div>
      )}
    </div>
  );

  const grid = (
    <div className="wrap" style={{ marginTop: showHero ? 36 : 0 }}>
      {loading ? (
        <p style={{ color: 'var(--dark-gray)' }}>Loading…</p>
      ) : products.length === 0 ? (
        <p style={{ color: 'var(--dark-gray)' }}>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
        </div>
      )}
    </div>
  );

  if (!showHero) {
    // Embedded in a brand page, which already has its own hero above —
    // just render controls + grid inline, no duplicate hero/backgrounds.
    return (
      <div className="wrap" style={{ paddingBottom: 40 }}>
        {controls}
        {grid}
      </div>
    );
  }

  return (
    <>
      <section className="shop-hero">
        <div className="blob" />
        <div className="wrap shop-hero-inner">
          <div className="eyebrow">The full collection</div>
          <h1>Shop</h1>
          <p>Every product, across all six brands, in one place.</p>
          {controls}
        </div>
      </section>

      <div className="section-curve" style={{ background: 'var(--navy)' }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      <section className="shop-grid-section">
        {grid}
      </section>
    </>
  );
}
