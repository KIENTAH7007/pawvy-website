'use client';

import { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/formatPrice';
import { findMatches } from '../lib/matching';

// Same real flavour/size matching used by the Freshly Cooked fitCard
// grid above — one real source of truth, not a second list.
const FLAVOURS = ['Duck', 'Chicken', 'Salmon', 'Beef'];

export default function FreshlyCookedCalculator({ products }) {
  const { addItem } = useCart();
  const [flavour, setFlavour] = useState('Duck');
  const [packSize, setPackSize] = useState(200);
  const [weight, setWeight] = useState(7);
  const [days, setDays] = useState(7);
  const [added, setAdded] = useState(false);

  function handleFlavourChange(newFlavour) {
    setFlavour(newFlavour);
    if (newFlavour === 'Beef' && packSize === 400) setPackSize(200);
  }

  const selectedProduct = findMatches(products, {
    seriesIncludes: 'Freshly Cooked',
    variationIncludes: `${flavour} ${packSize}`,
  })[0] || null;

  const gramsPerDay = weight * 40; // confirmed 200g-per-5kg rate, consistent across flavours
  const packs = Math.ceil((gramsPerDay * days) / packSize);

  function handleAddToCart() {
    if (!selectedProduct) return;
    addItem(selectedProduct, packs);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="hardness-selector wb-calc">
      <div className="hardness-selector-q">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F36F4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 11H5a2 2 0 00-2 2v3a2 2 0 002 2h.5M9 11V9a2 2 0 012-2h2a2 2 0 012 2v2M9 11h6m0 0h4a2 2 0 012 2v3a2 2 0 01-2 2h-.5" />
        </svg>
        How much should I feed?
      </div>
      <div className="hardness-selector-sub">Feed 200g Wild Balance Freshly Cooked Food per 5kg pet weight.</div>

      <div className="wb-calc-row-full">
        <label htmlFor="fc-flavour">Protein</label>
        <select id="fc-flavour" value={flavour} onChange={e => handleFlavourChange(e.target.value)}>
          {FLAVOURS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="wb-calc-row">
        <div className="wb-calc-field">
          <label htmlFor="fc-size">Pack size</label>
          <select id="fc-size" value={packSize} onChange={e => setPackSize(Number(e.target.value))}>
            <option value={200}>200g</option>
            {flavour !== 'Beef' && <option value={400}>400g</option>}
          </select>
        </div>
        <div className="wb-calc-field">
          <label htmlFor="fc-weight">Dog&rsquo;s weight (kg)</label>
          <input id="fc-weight" type="number" min="0.5" step="0.5" value={weight}
            onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
        </div>
      </div>
      <div className="wb-calc-row-full">
        <label htmlFor="fc-days">Feed for (days)</label>
        <input id="fc-days" type="number" min="1" step="1" value={days}
          onChange={e => setDays(parseInt(e.target.value) || 0)} />
      </div>

      <div className="wb-calc-result">
        <div className="wb-calc-result-nums">
          <div className="wb-calc-result-num"><div className="n">{Math.round(gramsPerDay)}g</div><div className="l">per day</div></div>
          <div className="wb-calc-result-num"><div className="n">{packs} pack{packs === 1 ? '' : 's'}</div><div className="l">Wild Balance {flavour}</div></div>
        </div>
        <button type="button" className="fit-add-btn wb-calc-btn" onClick={handleAddToCart} disabled={!selectedProduct}>
          {added ? 'Added ✓' : selectedProduct ? `Add ${packs} packs to Cart — ${formatPrice(selectedProduct.effective_price_rrp_sg * packs)}` : 'Unavailable'}
        </button>
      </div>
      <div className="hardness-selector-sub" style={{ marginTop: 12, marginBottom: 0 }}>Individual dogs vary — check with your vet for a dog with specific health needs.</div>
    </div>
  );
}
