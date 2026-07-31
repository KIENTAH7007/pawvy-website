'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { shopApi } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { BRAND_SLUGS, displayBrandName } from '../lib/brandSlugs';
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
//
// brandId (optional): when set (brand pages only), search/filter stays
// scoped to this brand even after the customer types — otherwise a search
// re-fetch drops the brand scope and pulls in matches from every brand.
//
// Also reads a `?highlight=` URL param on mount so the durability/fit cards
// further up the brand page (see BrandDeepDive) can deep-link straight to a
// specific product — e.g. clicking "Puzzle Mat" scrolls this (still fully
// unfiltered) grid to the Puzzle Mat card and gives it a brief highlight
// pulse, rather than filtering everything else out.
export default function ShopClient({ initialProducts, brands, showHero = true, brandId = null }) {
  const [products, setProducts] = useState(initialProducts);
  const [brandFilter, setBrandFilter] = useState(brandId || '');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const sortedBrands = sortBrands(brands);
  const [loading, setLoading] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const { addItem, itemCount, subtotal } = useCart();
  const searchParams = useSearchParams();

  useEffect(() => {
    const highlight = searchParams.get('highlight');
    if (!highlight) return;
    // Products are already in the DOM (unfiltered) via initialProducts —
    // just need a tick for the browser to finish painting before measuring
    // scroll position.
    const t = setTimeout(() => {
      const cards = document.querySelectorAll('[data-product-title]');
      const target = Array.from(cards).find(el =>
        el.getAttribute('data-product-title')?.toLowerCase().includes(highlight.toLowerCase())
      );
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('product-card-highlight');
        setTimeout(() => target.classList.remove('product-card-highlight'), 2200);
      }
    }, 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {sortedBrands.map(b => <option key={b.id} value={b.id}>{displayBrandName(b.name)}</option>)}
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
