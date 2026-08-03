'use client';

// GiGwi's shop-by-category browser. Unlike every other brand's deep-dive
// cards (BetterBone/Lillidale/Salmoil), nothing here is individually
// curated — with 100+ SKUs, KT's Excel gives category + SKU prefix (+
// grouping/sizes/featured) and this filters the brand's real, already-
// fetched `products` array against it. Add a new SKU in the Pawvy App
// with a prefix already in the config and it appears automatically; a
// genuinely new prefix still needs a one-line addition to the `browser`
// data in lib/brandContent.js, same tradeoff as everywhere else.
//
// MATCHING RISK: skuPrefix is matched as a case-insensitive substring
// against the combined item_series + variation text, same pattern as
// every other brand's seriesIncludes — but here it's a bare 4-digit
// number, not a distinctive product name, so it's more exposed to
// unexpected collisions than usual (e.g. a price or a second SKU number
// appearing elsewhere in the same string). Not confirmed against a real
// Pawvy App screenshot of GiGwi's actual item_series format — flagged in
// the README, needs a real click-through per category after deploy.
import { useState, useMemo } from 'react';
import { useCart } from '../lib/CartContext';
import ProductCard from './ProductCard';
import ProductAddButton from './ProductAddButton';

function matchByPrefix(products, prefix) {
  const p = String(prefix).toLowerCase();
  return products.find(prod => {
    const combined = `${prod.item_series || ''} ${prod.variation || ''}`.toLowerCase();
    return combined.includes(p);
  }) || null;
}

// Fisher-Yates — reshuffles on every mount (i.e. every page load/nav),
// per KT's ask: featured items lead each category but in a fresh random
// order each time, not a fixed ranking.
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GroupCard({ card, products }) {
  // Cover photo: first variant that actually matches a real, in-catalog
  // product — no curated image field exists for GiGwi, this is always a
  // live database photo.
  const coverMatch = card.variants.map(v => matchByPrefix(products, v.skuPrefix)).find(m => m?.image_data);
  const anyMatch = card.variants.map(v => matchByPrefix(products, v.skuPrefix)).find(Boolean);
  const priceRef = anyMatch;

  return (
    <div className="product-card">
      <div className="card-tags">
        <span className="brand-tag">GiGwi</span>
      </div>
      <div className="thumb">
        {coverMatch?.image_data
          ? <img src={coverMatch.image_data} alt={card.name} />
          : <span className="no-img">No image</span>}
      </div>
      <div className="info">
        <h3>{card.name}</h3>
        <div className="price">
          {priceRef ? `From $${priceRef.effective_price_rrp_sg.toFixed(2)}` : ''}
        </div>
      </div>
      <div className="info" style={{ paddingTop: 0 }}>
        <ProductAddButton products={products} productLabel={card.name} variants={card.variants.map(v => ({ label: v.label, seriesIncludes: v.skuPrefix }))} />
      </div>
    </div>
  );
}

export default function CategoryBrowser({ browser, products }) {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState(browser.tabs[0]?.id);

  // useMemo (not useEffect) so the shuffle happens exactly once per real
  // mount, in the same render pass — no flash of unshuffled order.
  const orderedByTab = useMemo(() => {
    const result = {};
    for (const tab of browser.tabs) {
      const featured = shuffle(tab.cards.filter(c => c.featured));
      const rest = tab.cards.filter(c => !c.featured);
      result[tab.id] = [...featured, ...rest];
    }
    return result;
  }, [browser]);

  const activeCards = orderedByTab[activeTab] || [];

  return (
    <section className="gigwi-browser">
      <div className="wrap">
        <div className="gigwi-browser-head">
          <div className="eyebrow center">{browser.eyebrow}</div>
          <h2>{browser.heading}</h2>
          <p>{browser.sub}</p>
        </div>
        <div className="gigwi-cat-tabs">
          {browser.tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`gigwi-cat-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {activeCards.map(card => {
            if (card.type === 'single') {
              const matched = matchByPrefix(products, card.skuPrefix);
              // Archived/removed SKUs just don't match anymore — the
              // right behavior is for the card to disappear, not sit on
              // the page permanently showing "Unavailable". (A genuine
              // matching bug looks identical from here — that's what the
              // README's click-through ask is for, not a permanent
              // on-page state.)
              if (!matched) return null;
              return <ProductCard key={card.skuPrefix} product={matched} onAdd={addItem} />;
            }
            const anyMatch = card.variants.some(v => matchByPrefix(products, v.skuPrefix));
            if (!anyMatch) return null;
            return <GroupCard key={card.name} card={card} products={products} />;
          })}
        </div>
      </div>
    </section>
  );
}
