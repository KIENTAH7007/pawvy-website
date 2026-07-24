'use client';

import React, { useEffect, useState } from 'react';
import { stockistApi } from '../lib/api';

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
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} style={{ padding: 8 }}>
          <option value="">All brands</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={regionFilter} onChange={e => setRegionFilter(e.target.value)} style={{ padding: 8 }}>
          <option value="">All regions</option>
          {['Central', 'East', 'North', 'North-East', 'West'].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : stockists.length === 0 ? (
        <p style={{ color: '#666' }}>No stockists match those filters.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {stockists.map(s => (
            <div key={s.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div style={{ fontWeight: 600 }}>{s.company_name}</div>
              {s.region && <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{s.region}</div>}
              {s.address && <div style={{ fontSize: 13, color: '#444', marginTop: 8 }}>{s.address}</div>}
              {s.phone && <div style={{ fontSize: 13, color: '#444', marginTop: 4 }}>{s.phone}</div>}

              {s.brands?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {s.brands.map(b => (
                    <span key={b.name} style={{ fontSize: 11, fontWeight: 600, color: b.color || '#666', border: `1px solid ${b.color || '#ccc'}`, borderRadius: 4, padding: '2px 6px' }}>
                      {b.name}
                    </span>
                  ))}
                </div>
              )}

              {s.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: '#1a73e8', textDecoration: 'none' }}
                >
                  View on Google Maps →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
