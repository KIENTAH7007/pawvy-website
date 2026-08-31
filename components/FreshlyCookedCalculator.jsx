'use client';

import { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/formatPrice';

// products: the 8 real Freshly Cooked products (4 flavours × 2 sizes).
// Feeding rate (200g per 5kg body weight daily) is confirmed consistent
// across all 4 flavours — see the description data KT provided — so
// this doesn't need a per-flavour lookup table the way casseroles do.
export default function FreshlyCookedCalculator({ products }) {
  const { addItem } = useCart();
  const sizes = [...new Set(products.map(p => p.packSize))].sort((a, b) => a - b);
  const [packSize, setPackSize] = useState(sizes[0] || 200);
  const [weight, setWeight] = useState(7);
  const [days, setDays] = useState(7);
  const [added, setAdded] = useState(false);
  const [flavourId, setFlavourId] = useState(products.find(p => p.packSize === (sizes[0] || 200))?.id);

  const matchingSizeProducts = products.filter(p => p.packSize === packSize);
  const selectedProduct = matchingSizeProducts.find(p => p.id === flavourId) || matchingSizeProducts[0];

  const gramsPerDay = weight * 40; // 200g per 5kg = 40g/kg, confirmed rate
  const packs = Math.ceil((gramsPerDay * days) / packSize);

  function handleAddToCart() {
    if (!selectedProduct) return;
    addItem(selectedProduct, packs);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="calc">
      <div className="calc-head"><h3>How much should I feed?</h3></div>
      <div className="calc-sub">Same 200g-per-5kg guide across all 4 flavours — pick a flavour and pack size, enter your dog&rsquo;s weight and how many days.</div>

      <div className="calc-row-full calc-field">
        <label htmlFor="fc-flavour">Flavour</label>
        <select id="fc-flavour" value={flavourId} onChange={e => setFlavourId(Number(e.target.value))}>
          {matchingSizeProducts.map(p => (
            <option key={p.id} value={p.id}>{p.variation || p.item_series}</option>
          ))}
        </select>
      </div>

      <div className="calc-row">
        <div className="calc-field">
          <label htmlFor="fc-size">Pack size</label>
          <select id="fc-size" value={packSize} onChange={e => setPackSize(Number(e.target.value))}>
            {sizes.map(s => <option key={s} value={s}>{s}g</option>)}
          </select>
        </div>
        <div className="calc-field">
          <label htmlFor="fc-weight">Dog&rsquo;s weight (kg)</label>
          <input id="fc-weight" type="number" min="0.5" step="0.5" value={weight}
            onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
        </div>
      </div>
      <div className="calc-row-full calc-field">
        <label htmlFor="fc-days">Feed for how many days?</label>
        <input id="fc-days" type="number" min="1" step="1" value={days}
          onChange={e => setDays(parseInt(e.target.value) || 0)} />
      </div>

      <div className="calc-result">
        <div className="calc-result-nums">
          <div className="calc-result-num"><div className="n">{Math.round(gramsPerDay)}g</div><div className="l">per day</div></div>
          <div className="calc-result-num"><div className="n">{packs} pack{packs === 1 ? '' : 's'}</div><div className="l">needed</div></div>
        </div>
        <button type="button" className="calc-cart-btn" onClick={handleAddToCart} disabled={!selectedProduct}>
          {added ? 'Added ✓' : selectedProduct ? `Add ${packs} to Cart — ${formatPrice(selectedProduct.effective_price_rrp_sg * packs)}` : 'Add to Cart'}
        </button>
      </div>
      <div className="calc-note">Based on the confirmed 200g-per-5kg-of-body-weight guide, consistent across all 4 flavours. Individual dogs vary — check with your vet for a dog with specific health needs.</div>
    </div>
  );
}
