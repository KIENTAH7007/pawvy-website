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
import { imageUrl } from '../lib/api';
import { formatPrice } from '../lib/formatPrice';
import { pickPrimaryMatch } from '../lib/matching';
import { productUrl } from '../lib/productDisplayName';
import ProductAddButton from './ProductAddButton';
import Link from 'next/link';

function matchByPrefix(products, prefix) {
  const p = String(prefix).toLowerCase();
  return products.find(prod => {
    const combined = `${prod.item_series || ''} ${prod.variation || ''}`.toLowerCase();
    return combined.includes(p);
  }) || null;
}

// A "single" card is just a group with one variant — shared by GiGwiCard
// (rendering) and the New/Featured/Alphabetical ordering logic below, so
// both always agree on what a card's real variant list is.
function cardVariants(card) {
  return card.type === 'single' ? [{ skuPrefix: card.skuPrefix }] : card.variants;
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

// Single-SKU and grouped-SKU cards render through the exact same
// component — a "single" card is just a group with one variant. This is
// deliberate, not just less code: it's what fixed the earlier
// inconsistency where single cards showed the raw database item_series
// (SKU code + vendor name baked in) instead of KT's curated Excel name,
// and where single cards used the sitewide orange .add-btn while grouped
// cards used ProductAddButton's navy .fit-add-btn. Routing everything
// through ProductAddButton means one card always displays `card.name`
// (never touches item_series for the title) and always gets the navy
// button — a single real variant just skips straight to Add to Cart with
// no picker, same as it would ProductAddButton's own single-variant logic
// already handled elsewhere.
function GiGwiCard({ card, products }) {
  const variants = cardVariants(card);

  const matches = variants.map(v => matchByPrefix(products, v.skuPrefix));
  const coverMatch = matches.find(m => m?.image_url) || matches.find(Boolean);
  const prices = matches.filter(Boolean).map(m => m.effective_price_rrp_sg);
  const minPrice = prices.length ? Math.min(...prices) : null;
  // This card can represent several variant SKUs at once (different colors
  // of the same product) — shows New if ANY of them currently is, since a
  // customer would still discover that SKU by opening the card and picking
  // a variant, even if the "cover" photo variant itself isn't the new one.
  const anyNew = matches.some(m => m?.is_new_active);
  // Click-through target (Aug 2026, per customer feedback) — same
  // pickPrimaryMatch preference (in-stock first) as the other brand
  // pages' cards, applied to whichever real SKUs this card's variants
  // actually resolved to.
  const primary = pickPrimaryMatch(matches.filter(Boolean));
  // Explicit sibling IDs (Aug 2026 fix) — this is exactly the case that
  // needed it: GiGwi's colors are matched by distinct SKU prefixes
  // (matchByPrefix above), meaning each color is genuinely a different
  // item_series in the database, not a shared series with a different
  // variation. The PDP can't correctly re-derive "siblings" from
  // item_series here, so pass the real resolved set explicitly instead.
  const siblingIds = matches.filter(Boolean).map(m => m.id).join(',');

  return (
    <div className="product-card">
      {primary ? (
        <Link href={`${productUrl(primary)}?siblings=${siblingIds}`}>
          <div className="card-tags">
            <span className="brand-tag">GiGwi</span>
          </div>
          <div className="thumb">
            {anyNew && <span className="new-tag">New</span>}
            {coverMatch?.image_url
              ? <img src={imageUrl(coverMatch.image_url)} alt={card.name} />
              : <span className="no-img">No image</span>}
          </div>
          <div className="info">
            <h3>{card.name}</h3>
            <div className="price">
              {minPrice != null ? (variants.length > 1 ? `From ${formatPrice(minPrice)}` : formatPrice(minPrice)) : ''}
            </div>
          </div>
        </Link>
      ) : (
        <>
          <div className="card-tags">
            <span className="brand-tag">GiGwi</span>
          </div>
          <div className="thumb">
            {anyNew && <span className="new-tag">New</span>}
            {coverMatch?.image_url
              ? <img src={imageUrl(coverMatch.image_url)} alt={card.name} />
              : <span className="no-img">No image</span>}
          </div>
          <div className="info">
            <h3>{card.name}</h3>
            <div className="price">
              {minPrice != null ? (variants.length > 1 ? `From ${formatPrice(minPrice)}` : formatPrice(minPrice)) : ''}
            </div>
          </div>
        </>
      )}
      <div className="info" style={{ paddingTop: 0 }}>
        <ProductAddButton products={products} productLabel={card.name} variants={variants.map(v => ({ label: v.label, seriesIncludes: v.skuPrefix }))} />
      </div>
    </div>
  );
}

export default function CategoryBrowser({ browser, products }) {
  const [activeTab, setActiveTab] = useState(browser.tabs[0]?.id);

  // Out-of-stock sink (Aug 2026, per KT): a card only sinks to the
  // bottom once EVERY variant inside it is out of stock — a group card
  // like "Orange Tennis Ball" with an S and an M size stays in its
  // normal position as long as even one size is still buyable. A
  // variant with no matching active product at all (archived/removed)
  // counts the same as out-of-stock here, since it's equally not
  // purchasable — this only affects sort position, not visibility
  // (the `visible` filter above already requires at least one real
  // match to show the card at all).
  //
  // New -> Featured -> Alphabetical, per KT's ask (Aug 2026). "New"
  // means any matched variant is currently is_new_active — same flag
  // that drives the "New" badge on the card itself (see GiGwiCard's
  // anyNew above), so a card lands in this top tier for exactly as long
  // as its badge shows, no separate rule to keep in sync. A card that's
  // both New AND Featured counts as New (goes in the top tier, not
  // duplicated) — otherwise a brand-new SKU KT also marks Featured
  // would get buried back in the shuffled Featured group instead of
  // leading the page.
  //
  // Featured (non-new) keeps the existing once-per-mount shuffle so that
  // tier still feels fresh on repeat visits, same as before this change.
  // The bottom tier is now genuinely alphabetical by card.name — it
  // previously just fell back to whatever order the cards happened to be
  // declared in lib/brandContent.js (usually KT's original SKU-sheet row
  // order), which looked roughly alphabetical by coincidence for some
  // tabs but wasn't actually sorting on anything.
  //
  // The New/Featured/Alphabetical ordering is applied identically to
  // the in-stock group and the all-OOS group (via orderWithinGroup) —
  // OOS status is a separate, higher-priority partition on top of that
  // existing logic, not a replacement for it.
  //
  // useMemo (not useEffect) so the shuffle happens exactly once per real
  // mount, in the same render pass — no flash of unshuffled order.
  const orderedByTab = useMemo(() => {
    function orderWithinGroup(cards) {
      const isNewCard = card => cardVariants(card).some(v => matchByPrefix(products, v.skuPrefix)?.is_new_active);
      const newCards = cards.filter(isNewCard).sort((a, b) => a.name.localeCompare(b.name));
      const featuredCards = shuffle(cards.filter(c => c.featured && !isNewCard(c)));
      const restCards = cards.filter(c => !c.featured && !isNewCard(c)).sort((a, b) => a.name.localeCompare(b.name));
      return [...newCards, ...featuredCards, ...restCards];
    }

    const result = {};
    for (const tab of browser.tabs) {
      // Only cards with at least one currently-active matching product —
      // archived/removed SKUs disappear rather than sitting broken on
      // the page (see the matchByPrefix note above the component).
      const visible = tab.cards.filter(card => cardVariants(card).some(v => matchByPrefix(products, v.skuPrefix)));
      const allVariantsOOS = card => cardVariants(card).every(v => {
        const matched = matchByPrefix(products, v.skuPrefix);
        return !matched || matched.stock_status === 'out_of_stock';
      });

      const availableCards = visible.filter(c => !allVariantsOOS(c));
      const oosCards = visible.filter(allVariantsOOS);

      result[tab.id] = [...orderWithinGroup(availableCards), ...orderWithinGroup(oosCards)];
    }
    return result;
  }, [browser, products]);

  const activeCards = orderedByTab[activeTab] || [];

  return (
    <section className="gigwi-browser" id="shop">
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
          {activeCards.map(card => (
            <GiGwiCard key={card.type === 'single' ? card.skuPrefix : card.name} card={card} products={products} />
          ))}
        </div>
      </div>
    </section>
  );
}
