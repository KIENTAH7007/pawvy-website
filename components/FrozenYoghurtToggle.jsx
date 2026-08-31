'use client';

import { useState } from 'react';
import { imageUrl } from '../lib/api';
import { productDisplayName } from '../lib/productDisplayName';
import { formatPrice } from '../lib/formatPrice';
import { useCart } from '../lib/CartContext';

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
        <p>{product.description}</p>
        <div className="yog-toggle">
          <button type="button" className={serving === 'room' ? 'active' : ''} onClick={() => setServing('room')}>
            <span className="ic">🥣</span> Room Temperature
          </button>
          <button type="button" className={serving === 'frozen' ? 'active' : ''} onClick={() => setServing('frozen')}>
            <span className="ic">🍦</span> Frozen
          </button>
        </div>
        <div className="yog-desc-line">{DESCS[serving]}</div>
        <button type="button" className="calc-cart-btn" style={{ marginTop: 16 }} onClick={handleAdd}>
          {added ? 'Added ✓' : `Add to Cart — ${formatPrice(product.effective_price_rrp_sg)}`}
        </button>
      </div>
    </div>
  );
}
