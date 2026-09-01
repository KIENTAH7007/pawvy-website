'use client';

import { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/formatPrice';
import { findMatches } from '../lib/matching';

// Real feeding data KT pulled directly from Wild Balance's own site
// (Aug 2026) — a straight bracket lookup, matching exactly how Wild
// Balance's own site presents it (grams/day per weight bracket, not a
// continuous formula). Verified against all 24 real data points before
// this was written.
const FEEDING_TABLE = {
  anchovy: [320, 571, 1088, 1528, 1829, 2386],
  salmon: [253, 450, 856, 1202, 1439, 1876],
  pork: [141, 252, 480, 675, 807, 1053],
  beef: [264, 470, 897, 1260, 1355, 1968],
};
const BRACKETS = [5, 10, 20, 30, 40, Infinity];
// Same real seriesIncludes/variationIncludes matching used by the
// Casseroles fitCard grid above — one real source of truth for which
// flavour is which, rather than a second, separately-maintained list.
const FLAVOURS = [
  { key: 'anchovy', label: 'Anchovy, Turkey & Apple', variationIncludes: 'Anchovy' },
  { key: 'salmon', label: 'Salmon, Chicken & Pear', variationIncludes: 'Salmon' },
  { key: 'pork', label: 'Pork & Pumpkin', variationIncludes: 'Pork' },
  { key: 'beef', label: 'Beef & Pineapple', variationIncludes: 'Beef' },
];

function gramsPerDayFor(flavourKey, weight) {
  const table = FEEDING_TABLE[flavourKey];
  if (!table) return 0;
  for (let i = 0; i < BRACKETS.length; i++) {
    if (weight <= BRACKETS[i]) return table[i];
  }
  return table[table.length - 1];
}

// products: the site's real, already-fetched product list for this
// brand — same array every other card on the page already uses, not a
// pre-filtered subset. Resolves each flavour to its real product via
// the same findMatches/seriesIncludes matching every fitCard uses.
export default function CasseroleCalculator({ products }) {
  const { addItem } = useCart();
  const [flavourKey, setFlavourKey] = useState('anchovy');
  const [weight, setWeight] = useState(7);
  const [days, setDays] = useState(7);
  const [added, setAdded] = useState(false);

  const activeFlavour = FLAVOURS.find(f => f.key === flavourKey);
  const selectedProduct = findMatches(products, {
    seriesIncludes: 'Casseroles',
    variationIncludes: activeFlavour.variationIncludes,
  })[0] || null;

  const gramsPerDay = gramsPerDayFor(flavourKey, weight);
  const packs = Math.ceil((gramsPerDay * days) / 280);

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
      <div className="hardness-selector-sub">Pick a flavour, enter your dog&rsquo;s weight, and how many days you want to feed for.</div>

      <div className="wb-calc-row-full">
        <label htmlFor="cc-flavour">Flavour</label>
        <select id="cc-flavour" value={flavourKey} onChange={e => setFlavourKey(e.target.value)}>
          {FLAVOURS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
        </select>
      </div>

      <div className="wb-calc-row">
        <div className="wb-calc-field">
          <label htmlFor="cc-weight">Dog&rsquo;s weight (kg)</label>
          <input id="cc-weight" type="number" min="0.5" step="0.5" value={weight}
            onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="wb-calc-field">
          <label htmlFor="cc-days">Feed for how many days?</label>
          <input id="cc-days" type="number" min="1" step="1" value={days}
            onChange={e => setDays(parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="wb-calc-result">
        <div className="wb-calc-result-nums">
          <div className="wb-calc-result-num"><div className="n">{gramsPerDay}g</div><div className="l">per day</div></div>
          <div className="wb-calc-result-num"><div className="n">{packs} pack{packs === 1 ? '' : 's'}</div><div className="l">needed</div></div>
        </div>
        <button type="button" className="fit-add-btn wb-calc-btn" onClick={handleAddToCart} disabled={!selectedProduct}>
          {added ? 'Added ✓' : selectedProduct ? `Add ${packs} to Cart — ${formatPrice(selectedProduct.effective_price_rrp_sg * packs)}` : 'Unavailable'}
        </button>
      </div>
      <div className="hardness-selector-sub" style={{ marginTop: 12, marginBottom: 0 }}>Based on Wild Balance&rsquo;s own feeding guide, per weight bracket — every flavour needs a different amount since calorie density varies. Individual dogs vary — check with your vet for a dog with specific health needs.</div>
    </div>
  );
}
