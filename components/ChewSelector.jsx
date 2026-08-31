'use client';

import { useState } from 'react';
import { imageUrl } from '../lib/api';
import { displayBrandName } from '../lib/brandSlugs';
import { productDisplayName } from '../lib/productDisplayName';
import { formatPrice } from '../lib/formatPrice';
import { useCart } from '../lib/CartContext';
import Link from 'next/link';
import { productUrl } from '../lib/productDisplayName';

// Which real chew belongs to which chewer-level bucket — matched by a
// distinctive phrase from each chew's own description (same known-text
// reasoning as lib/wildBalanceGrouping.js — Claude wrote these
// descriptions, KT confirmed pasting them in as-is).
const CHEW_BUCKETS = {
  gullet: { label: 'Very gentle / new to chews', marker: 'gullet' },
  tripe: { label: 'Light chewer', marker: 'tripe' },
  trachea: { label: 'Moderate chewer', marker: 'trachea' },
  headskin: { label: 'Determined chewer', marker: 'headskin' },
};

function bucketFor(product) {
  const text = (product.description || '').toLowerCase();
  for (const [key, { marker }] of Object.entries(CHEW_BUCKETS)) {
    if (text.includes(marker)) return key;
  }
  return null;
}

export default function ChewSelector({ products }) {
  const { addItem } = useCart();
  const [active, setActive] = useState('tripe');
  const [adding, setAdding] = useState(null);

  const withBucket = products.map(p => ({ ...p, bucket: bucketFor(p) }));
  const matches = withBucket.filter(p => p.bucket === active);

  function handleAdd(product) {
    addItem(product, 1);
    setAdding(product.id);
    setTimeout(() => setAdding(null), 1500);
  }

  return (
    <>
      <div className="chew-selector">
        <div className="q">How does your dog chew?</div>
        <div className="chew-opts">
          {Object.entries(CHEW_BUCKETS).map(([key, { label }]) => (
            <button key={key} type="button" className={active === key ? 'active' : ''} onClick={() => setActive(key)}>
              {label}
            </button>
          ))}
        </div>
        {matches.length > 0 && (
          <div className="chew-rec">
            We recommend: <strong>{matches.map(p => productDisplayName(p)).join(' or ')}</strong>
          </div>
        )}
      </div>

      <div className="pgrid chews">
        {withBucket.map(p => (
          <div key={p.id} className={`pcard${p.bucket === active ? ' chew-highlight' : ''}`}>
            <Link href={productUrl(p)}>
              <div className="img" style={{ background: '#EFE9DD' }}>
                {p.image_url ? <img src={imageUrl(p.image_url)} alt={productDisplayName(p)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : displayBrandName(p.brand_name)}
              </div>
              <div className="body">
                <div className="name">{productDisplayName(p)}</div>
                <div className="sub">{p.variation || ''}</div>
              </div>
            </Link>
            <div style={{ padding: '0 14px 14px' }}>
              <button type="button" className="calc-cart-btn" style={{ width: '100%', padding: '8px 0', fontSize: 12 }} onClick={() => handleAdd(p)}>
                {adding === p.id ? 'Added ✓' : `Add — ${formatPrice(p.effective_price_rrp_sg)}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
