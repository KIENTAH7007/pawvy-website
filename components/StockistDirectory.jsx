'use client';

import React, { useEffect, useState } from 'react';
import { stockistApi } from '../lib/api';
import { BRAND_SLUGS, displayBrandName } from '../lib/brandSlugs';

// The backend returns brands in whatever order they exist in the database
// — not necessarily the confirmed display sequence used everywhere else on
// the site (nav dropdown, hero paragraph, gallery, Shop filter). Sort here
// so this filter matches that same order.
const BRAND_ORDER = Object.keys(BRAND_SLUGS);
function sortBrands(brands) {
  return [...brands].sort((a, b) => BRAND_ORDER.indexOf(a.name) - BRAND_ORDER.indexOf(b.name));
}

// No maps/geocoding API used anywhere here — filtering is by a plain
// region tag + brand, both free. Each result gets a link built from
// plain text (the address) into a Google Maps *search* URL — this is
// just a hyperlink (https://www.google.com/maps/search/?api=1&query=...),
// not an API call, so it's free and needs no key, unlike an embedded
// interactive map would.
export default function StockistDirectory({ initialStockists, brands }) {
  const [stockists, setStockists] = useState(initialStockists);
  const [brandFilter, setBrandFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const sortedBrands = sortBrands(brands);
  const [loading, setLoading] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

  useEffect(() => {
    if (firstRun) { setFirstRun(false); return; }
    setLoading(true);
    const params = {};
    if (brandFilter) params.brand_id = brandFilter;
    if (regionFilter) params.region = regionFilter;
    stockistApi.list(params).then(d => setStockists(d.stockists)).finally(() => setLoading(false));
  }, [brandFilter, regionFilter]);

  return (
    <section className="stockist-list">
      <div className="wrap">
        <div className="filter-bar" style={{ marginBottom: 40 }}>
          <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
            <option value="">All brands</option>
            {sortedBrands.map(b => <option key={b.id} value={b.id}>{displayBrandName(b.name)}</option>)}
          </select>
          <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
            <option value="">All regions</option>
            {['Central', 'East', 'North', 'North-East', 'West'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {loading ? (
          <p style={{ color: 'var(--dark-gray)' }}>Loading…</p>
        ) : stockists.length === 0 ? (
          <p style={{ color: 'var(--dark-gray)' }}>No stockists match those filters.</p>
        ) : (
          <div className="stockist-grid">
            {stockists.map(s => (
              <div key={s.id} className="stockist-card">
                {s.region && <span className="region-tag">{s.region}</span>}
                <h3>{s.company_name}</h3>
                {s.address && <div className="addr">{s.address}</div>}
                {s.phone && <div className="addr">{s.phone}</div>}

                {s.brands?.length > 0 && (
                  <div className="brands-carried">{s.brands.map(b => b.name).join(' · ')}</div>
                )}

                {s.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="maplink"
                  >
                    View on Google Maps
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
