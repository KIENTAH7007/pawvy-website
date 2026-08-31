'use client';

import { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { formatPrice } from '../lib/formatPrice';

// Real feeding data KT pulled directly from Wild Balance's own site
// (Aug 2026) — a straight bracket lookup, matching exactly how Wild
// Balance's own site presents it (grams/day per weight bracket, not a
// continuous formula). Verified against all 24 real data points before
// this was written — see the mockup delivery for the test log.
const FEEDING_TABLE = {
  anchovy: [320, 571, 1088, 1528, 1829, 2386],
  salmon: [253, 450, 856, 1202, 1439, 1876],
  pork: [141, 252, 480, 675, 807, 1053],
  beef: [264, 470, 897, 1260, 1355, 1968],
};
// Bracket upper bounds matching the 6 real brackets: 1-5, 6-10, 11-20,
// 21-30, 31-40, >40 (kg)
const BRACKETS = [5, 10, 20, 30, 40, Infinity];

function gramsPerDayFor(flavourKey, weight) {
  const table = FEEDING_TABLE[flavourKey];
  if (!table) return 0;
  for (let i = 0; i < BRACKETS.length; i++) {
    if (weight <= BRACKETS[i]) return table[i];
  }
  return table[table.length - 1];
}

// products: the 4 real casserole products, each with a `.flavourKey`
// already attached by lib/wildBalanceGrouping.js (anchovy/salmon/pork/
// beef) so this component never needs to know anything about
// item_series/description matching itself — that's handled once,
// upstream, where the real product data actually lives.
export default function CasseroleCalculator({ products }) {
  const { addItem } = useCart();
  const [flavourKey, setFlavourKey] = useState(products[0]?.flavourKey || 'anchovy');
  const [weight, setWeight] = useState(7);
  const [days, setDays] = useState(7);
  const [added, setAdded] = useState(false);

  const selectedProduct = products.find(p => p.flavourKey === flavourKey) || products[0];
  const gramsPerDay = gramsPerDayFor(flavourKey, weight);
  const packs = Math.ceil((gramsPerDay * days) / 280);

  function handleAddToCart() {
    if (!selectedProduct) return;
    addItem(selectedProduct, packs);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="calc">
      <div className="calc-head"><h3>How much should I feed?</h3></div>
      <div className="calc-sub">Pick a flavour, enter your dog&rsquo;s weight, and how many days you want to feed for.</div>

      <div className="calc-row-full calc-field">
        <label htmlFor="cc-flavour">Flavour</label>
        <select id="cc-flavour" value={flavourKey} onChange={e => setFlavourKey(e.target.value)}>
          {products.map(p => (
            <option key={p.id} value={p.flavourKey}>{p.variation || p.item_series}</option>
          ))}
        </select>
      </div>

      <div className="calc-row">
        <div className="calc-field">
          <label htmlFor="cc-weight">Dog&rsquo;s weight (kg)</label>
          <input id="cc-weight" type="number" min="0.5" step="0.5" value={weight}
            onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
        </div>
        <div className="calc-field">
          <label htmlFor="cc-days">Feed for how many days?</label>
          <input id="cc-days" type="number" min="1" step="1" value={days}
            onChange={e => setDays(parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="calc-result">
        <div className="calc-result-nums">
          <div className="calc-result-num"><div className="n">{gramsPerDay}g</div><div className="l">per day</div></div>
          <div className="calc-result-num"><div className="n">{packs} pack{packs === 1 ? '' : 's'}</div><div className="l">needed</div></div>
        </div>
        <button type="button" className="calc-cart-btn" onClick={handleAddToCart} disabled={!selectedProduct}>
          {added ? 'Added ✓' : selectedProduct ? `Add ${packs} to Cart — ${formatPrice(selectedProduct.effective_price_rrp_sg * packs)}` : 'Add to Cart'}
        </button>
      </div>
      <div className="calc-note">Based on Wild Balance&rsquo;s own feeding guide, per weight bracket — every flavour needs a different amount since calorie density varies (Beef &amp; Pineapple vs. Pork &amp; Pumpkin differ by over 5x). Individual dogs vary — check with your vet for a dog with specific health needs.</div>
    </div>
  );
}
