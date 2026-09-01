'use client';

import { useState } from 'react';
import { imageUrl } from '../lib/api';
import { productDisplayName } from '../lib/productDisplayName';
import { formatPrice } from '../lib/formatPrice';
import { useCart } from '../lib/CartContext';

// Curated excerpt for THIS brand-page display specifically (Aug 2026,
// per KT/Janice) — deliberately NOT the same as product.description.
// KT doesn't want to trim the real database description, since that
// text is what powers this product's own detail page (both its full
// on-page content AND its meta description tag — see
// app/shop/[id]/page.js) and trimming it there would genuinely cost
// SEO value. This is a different page showing different display text
// for the same product; the real description stays completely
// untouched in Pawvy App and keeps doing its SEO job on the canonical
// product page, unaffected by whatever shows here.
const YOGHURT_BRAND_PAGE_EXCERPT = 'A lactose-free yoghurt with natural prebiotics, in blackberry and chia seed flavour — supports healthy gut flora and digestive comfort in both dogs and cats. Can be served straight from the tub at room temperature, or popped in the freezer for an ice-cream-like frozen treat on a hot day. A source of natural antioxidants from the blackberry and chia seeds. Add it daily to a BARF ration or any other diet. 110g.';

const DESCS = {
  room: 'Straight from the tub, a soft everyday gut-health treat added to meals or given on its own.',
  frozen: 'Pop it in the freezer a few hours ahead for an ice-cream-like frozen treat, a favourite for hot days, no special prep needed.',
};

export default function FrozenYoghurtToggle({ product }) {
  const { addItem } = useCart();
  const [serving, setServing] = useState('room');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="yog-wrap">
      <div className="yog-img">
        {product.image_url
          ? <img src={imageUrl(product.image_url)} alt={productDisplayName(product)} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 20 }} />
          : <span>{productDisplayName(product)}</span>}
      </div>
      <div className="yog-info">
        <h3>{productDisplayName(product)}</h3>
        <div className="price">{formatPrice(product.effective_price_rrp_sg)}</div>
        <p>{YOGHURT_BRAND_PAGE_EXCERPT}</p>
        <div className="yog-toggle">
          <button type="button" className={serving === 'room' ? 'active' : ''} onClick={() => setServing('room')}>
            <span className="ic">🥣</span> Room Temperature
          </button>
          <button type="button" className={serving === 'frozen' ? 'active' : ''} onClick={() => setServing('frozen')}>
            <span className="ic">🍦</span> Frozen
          </button>
        </div>
        <div className="yog-desc-line">{DESCS[serving]}</div>
        <button type="button" className="fit-add-btn" style={{ marginTop: 16, width: 'auto', padding: '13px 22px' }} onClick={handleAdd}>
          {added ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
