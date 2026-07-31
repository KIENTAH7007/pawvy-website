'use client';

// Add to Cart button + variant picker modal for brand deep-dive cards
// (BetterBone durability cards, Puzzle Feeder fit cards — see
// BrandDeepDive.jsx). Used two ways:
//
// 1. Explicit `variants` — a curated list with known labels/hex/photos
//    (Puzzle Feeder cards, where we want specific swatch colors and nice
//    curated preview photos per option).
// 2. `seriesIncludes` / `seriesExcludes` / `variationIncludes` — dynamic
//    discovery: filters the already-fetched `products` array and turns
//    every real match into an option, using that product's own live
//    variation text as the label and its own image_data as the preview.
//    Used for BetterBone, where the real size/flavor combinations aren't
//    something we should guess at — whatever's actually in the catalog
//    shows up automatically, and stays correct if the catalog changes.
//
// Either way, `products` is the brand's full product list the page
// already fetched server-side (same array ShopClient renders below) — no
// separate live fetch here, which was the root cause of the earlier
// "Unavailable" bug: matching a combined "Name — Color" string that never
// exists as a literal value in either the item_series or variation
// columns (the dash is only inserted for display, in ProductCard.jsx).
import { useState, useMemo } from 'react';
import { useCart } from '../lib/CartContext';
import QtyStepper from './QtyStepper';

const COLOR_KEYWORDS = [
  ['green', '#5C846A'], ['pink', '#A17E78'], ['purple', '#3F2469'],
  ['orange', '#E2A83D'], ['yellow', '#E2A83D'], ['cyan', '#97D9CC'],
  ['teal', '#97D9CC'], ['blue', '#5B7FA6'], ['coral', '#EF7B60'],
];
function swatchFor(text) {
  const lower = (text || '').toLowerCase();
  const hit = COLOR_KEYWORDS.find(([kw]) => lower.includes(kw));
  return hit ? hit[1] : '#B8B2A6';
}

function findMatches(products, { seriesIncludes, seriesExcludes = [], variationIncludes }) {
  const seriesTerms = Array.isArray(seriesIncludes) ? seriesIncludes : [seriesIncludes];
  return products.filter(p => {
    const series = p.item_series || '';
    const variation = p.variation || '';
    if (!seriesTerms.some(t => series.includes(t))) return false;
    if (seriesExcludes.some(x => series.includes(x))) return false;
    if (variationIncludes && !variation.includes(variationIncludes)) return false;
    return true;
  });
}

export default function ProductAddButton({ products, productLabel, variants, seriesIncludes, seriesExcludes, variationIncludes }) {
  const { addItem } = useCart();

  // Resolve the option list once, synchronously — no fetch/loading state
  // needed since `products` is already in hand.
  const options = useMemo(() => {
    if (variants) {
      // Explicit mode: pair each curated variant with its real product.
      return variants.map(v => {
        const match = findMatches(products, {
          seriesIncludes: v.seriesIncludesAny || v.seriesIncludes,
          seriesExcludes: v.seriesExcludes,
          variationIncludes: v.variationIncludes,
        })[0] || null;
        return { label: v.label, hex: v.hex, image: v.image, product: match };
      });
    }
    // Dynamic mode: every real match becomes its own option.
    const matches = findMatches(products, { seriesIncludes, seriesExcludes, variationIncludes });
    return matches.map(p => ({
      label: p.variation || p.item_series,
      hex: swatchFor(p.variation || p.item_series),
      image: p.image_data,
      product: p,
    }));
  }, [products, variants, seriesIncludes, seriesExcludes, variationIncludes]);

  const available = options.filter(o => o.product && o.product.stock_status !== 'out_of_stock');
  const single = available.length === 1 && options.length === 1;

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState(null); // 'added' | null

  if (options.length === 0) {
    return <button type="button" className="fit-add-btn" disabled>Unavailable</button>;
  }

  function addNow(product) {
    addItem(product, qty);
    setStatus('added');
    setTimeout(() => setStatus(null), 1800);
  }

  function handleAddClick(e) {
    e.preventDefault();
    if (single) { addNow(available[0].product); return; }
    setModalOpen(true);
    setSelected(options.findIndex(o => o.product && o.product.stock_status !== 'out_of_stock'));
    setQty(1);
  }

  function handleConfirmAdd() {
    const chosen = options[selected];
    if (!chosen?.product || chosen.product.stock_status === 'out_of_stock') return;
    addNow(chosen.product);
    setModalOpen(false);
  }

  const current = options[selected];

  return (
    <>
      <button
        type="button"
        className={`fit-add-btn${status === 'added' ? ' added' : ''}`}
        onClick={handleAddClick}
        disabled={available.length === 0}
      >
        {status === 'added' ? 'Added ✓' : available.length === 0 ? 'Out of stock' : 'Add to Cart'}
      </button>

      {modalOpen && (
        <div className="fit-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="fit-modal" onClick={e => e.stopPropagation()}>
            <button type="button" className="fit-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
            <h3>{productLabel}</h3>

            <div className="fit-modal-image-wrap">
              {current?.image ? <img src={current.image} alt={current.label} /> : <div className="img-placeholder" style={{ width: '100%', height: '100%' }}><span>No photo</span></div>}
            </div>
            <div className="fit-modal-options">
              {options.map((o, i) => {
                const outOfStock = o.product && o.product.stock_status === 'out_of_stock';
                const missing = !o.product;
                return (
                  <button
                    key={o.label}
                    type="button"
                    className={`fit-modal-option${i === selected ? ' active' : ''}`}
                    onClick={() => setSelected(i)}
                    disabled={outOfStock || missing}
                  >
                    <span className="fit-modal-swatch" style={{ background: o.hex }} />
                    {o.label}{outOfStock ? ' (out of stock)' : missing ? ' (unavailable)' : ''}
                  </button>
                );
              })}
            </div>
            <div className="fit-modal-footer">
              <QtyStepper value={qty} onChange={setQty} />
              <button
                type="button"
                className="btn btn-orange"
                disabled={!current?.product || current.product.stock_status === 'out_of_stock'}
                onClick={handleConfirmAdd}
              >
                <span>Add to Cart{current?.product ? ` — $${current.product.effective_price_rrp_sg.toFixed(2)}` : ''}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
