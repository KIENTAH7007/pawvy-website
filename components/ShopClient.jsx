'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { shopApi, waitlistApi, imageUrl } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { BRAND_SLUGS, displayBrandName } from '../lib/brandSlugs';
import { formatPrice } from '../lib/formatPrice';
import { NEED_CATEGORIES, needLabel } from '../lib/needTags';
import { productDisplayName } from '../lib/productDisplayName';
import ProductCard from './ProductCard';

const FREE_SHIPPING_THRESHOLD = 60;

const BRAND_ORDER = Object.keys(BRAND_SLUGS);
function sortBrands(brands) {
  return [...brands].sort((a, b) => BRAND_ORDER.indexOf(a.name) - BRAND_ORDER.indexOf(b.name));
}

// One testimonial card — image-first (single photo, or a labelled
// before/after split when a second photo exists), with an optional
// shoppable row for the linked product. Kept in this file rather than
// its own component since it's only ever used here (Shop-by-Need pages).
function TestimonialCard({ t }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    if (!t.product_id) return;
    addItem({
      id: t.product_id,
      item_series: t.product_name,
      variation: t.product_variation,
      image_url: t.product_image_url,
      effective_price_rrp_sg: t.effective_price_rrp_sg,
      price_rrp_sg: t.price_rrp_sg,
    }, 1);
    setAdding(true);
    setTimeout(() => setAdding(false), 1500);
  }

  return (
    <div className={`testi-card${t.image_url_after ? ' has-split' : ''}`}>
      <div className={`testi-img-wrap${t.image_url_after ? ' split' : ''}`}>
        {t.image_url && <img src={imageUrl(t.image_url)} alt="" className="testi-img" />}
        {t.image_url_after && (
          <>
            <span className="testi-img-label before">Before</span>
            <img src={imageUrl(t.image_url_after)} alt="" className="testi-img" />
            <span className="testi-img-label after">After</span>
          </>
        )}
      </div>
      <div className="testi-body">
        <p className="testi-quote">&ldquo;{t.quote}&rdquo;</p>
        {t.customer_handle && <div className="testi-who">— {t.customer_handle}</div>}
        {t.product_id && (
          <div className="testi-shop-row">
            <span className="testi-product-name">
              {displayBrandName(t.product_brand_name)} — {productDisplayName({ item_series: t.product_name, variation: t.product_variation, brand_name: t.product_brand_name })}
            </span>
            <button type="button" className="testi-add-btn" onClick={handleAdd}>
              {adding ? 'Added ✓' : 'Add to cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Receives server-fetched initial products/brands/testimonials as props —
// the page's first paint (what Google/social previews see) already has
// real content, including for a /shop?need=dental link someone shared.
// Interactive filtering still happens client-side after that.
//
// initialNeed: the validated need slug from the URL, or null. Sidebar
// filters (Need, Brand, Availability) replace the old dropdown entirely
// (Aug 2026, per KT — confirmed fine to fully discard the dropdown).
// Only Need, Brand, and Availability are real/functional here — Pet and
// Product Type filters from the original mockup aren't wired up because
// there's no real data backing them yet; better to ship filters that
// actually filter something than fake ones that don't.
export default function ShopClient({ initialProducts, brands, showHero = true, brandId = null, initialNeed = null, initialTestimonials = [] }) {
  const [products, setProducts] = useState(initialProducts);
  const [brandFilter, setBrandFilter] = useState(brandId || '');
  const [needFilter, setNeedFilter] = useState(initialNeed || '');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [testimonials, setTestimonials] = useState(initialTestimonials);
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
    if (needFilter) params.need = needFilter;
    shopApi.products(params).then(d => setProducts(d.products)).finally(() => setLoading(false));
  }, [brandFilter, search, needFilter]);

  // Testimonials re-fetch only when the need filter itself changes (not
  // brand/search) — they're always for the currently-selected need,
  // independent of the other filters narrowing the product grid below.
  useEffect(() => {
    if (firstRun) return;
    if (!needFilter) { setTestimonials([]); return; }
    shopApi.testimonials(needFilter).then(d => setTestimonials(d.testimonials)).catch(() => setTestimonials([]));
  }, [needFilter]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Keep the URL in sync with the Need filter (so it stays shareable/
  // bookmarkable and survives a refresh) without a full page reload.
  useEffect(() => {
    if (firstRun) return;
    const url = new URL(window.location.href);
    if (needFilter) url.searchParams.set('need', needFilter);
    else url.searchParams.delete('need');
    window.history.replaceState({}, '', url);
  }, [needFilter]);

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const unlocked = remaining === 0 && itemCount > 0;
  const visibleProducts = inStockOnly ? products.filter(p => p.stock_status !== 'out_of_stock') : products;

  const sidebar = (
    <aside className="shop-sidebar">
      <h3>Filters</h3>
      <div className="shop-filter-group">
        <div className="shop-filter-label">Need</div>
        <div className="shop-filter-chips">
          {NEED_CATEGORIES.map(n => (
            <button
              key={n.slug}
              type="button"
              className={`shop-chip${needFilter === n.slug ? ' active' : ''}`}
              onClick={() => setNeedFilter(needFilter === n.slug ? '' : n.slug)}
            >
              <span style={{display:'inline-flex',alignItems:'center',gap:5}}>{n.icon} {n.label}{needFilter === n.slug ? ' ✕' : ''}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="shop-filter-group">
        <div className="shop-filter-label">Brand</div>
        <div className="shop-filter-checks">
          <label className="shop-check">
            <input type="radio" name="brand" checked={!brandFilter} onChange={() => setBrandFilter('')} />
            All brands
          </label>
          {sortedBrands.map(b => (
            <label className="shop-check" key={b.id}>
              <input type="radio" name="brand" checked={brandFilter === String(b.id)} onChange={() => setBrandFilter(String(b.id))} />
              {displayBrandName(b.name)}
            </label>
          ))}
        </div>
      </div>
      <div className="shop-filter-group">
        <div className="shop-filter-label">Availability</div>
        <label className="shop-check">
          <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
          In stock only
        </label>
      </div>
    </aside>
  );

  const searchBar = (
    <div className="shop-controls-wrap">
      <div className="shop-controls">
        <input
          type="search"
          placeholder="Search products…"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>
      {itemCount > 0 && (
        <div className={`shop-foc${unlocked ? ' unlocked' : ''}`}>
          {unlocked ? "You've got free delivery! 🎉" : `Add ${formatPrice(remaining)} more for free delivery`}
        </div>
      )}
    </div>
  );

  const grid = (
    <>
      {loading ? (
        <p style={{ color: 'var(--dark-gray)' }}>Loading…</p>
      ) : visibleProducts.length === 0 ? (
        <p style={{ color: 'var(--dark-gray)' }}>No products found.</p>
      ) : (
        <div className="product-grid">
          {visibleProducts.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
        </div>
      )}
    </>
  );

  const needTestimonials = needFilter && testimonials.length > 0 && (
    <div className="shop-testimonials">
      <div className="shop-testimonials-head">
        <div className="eyebrow center">From real customers</div>
        <h2>What pawrents say about {needLabel(needFilter).toLowerCase()}</h2>
      </div>
      <div className="testi-grid">
        {testimonials.map(t => <TestimonialCard key={t.id} t={t} />)}
      </div>
    </div>
  );

  const activeNeedBanner = needFilter && (
    <div className="shop-active-need-banner">
      <span>Showing products for: <strong>{needLabel(needFilter)}</strong></span>
      <button type="button" onClick={() => setNeedFilter('')}>Clear and view full Shop →</button>
    </div>
  );

  if (!showHero) {
    // Embedded in a brand page, which already has its own hero above —
    // just render controls + grid inline, no duplicate hero/backgrounds,
    // no sidebar (brand pages already scope by brand implicitly).
    return (
      <div className="wrap" style={{ paddingBottom: 40 }}>
        {searchBar}
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
          {searchBar}
        </div>
      </section>

      <div className="section-curve" style={{ background: 'var(--navy)' }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      <nav className="breadcrumb wrap" aria-label="Breadcrumb" style={{ marginTop: 8 }}>
        <Link href="/">Home</Link><span className="sep">/</span>
        <span className="current">{needFilter ? needLabel(needFilter) : 'Shop'}</span>
      </nav>

      {needTestimonials}

      <section className="shop-grid-section">
        <div className="wrap shop-layout">
          {sidebar}
          <div className="shop-main">
            {activeNeedBanner}
            {grid}
          </div>
        </div>
      </section>
    </>
  );
}
