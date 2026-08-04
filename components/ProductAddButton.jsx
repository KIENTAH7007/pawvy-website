'use client';

// Add to Cart button + variant picker modal for brand deep-dive cards
// (BetterBone durability cards, Puzzle Feeder fit cards — see
// BrandDeepDive.jsx). Used two ways:
//
// 1. Explicit `variants` — a curated list with known labels/hex/photos
//    (Puzzle Feeder cards, where we want specific swatch colors and nice
//    curated preview photos per option). Modal shows a pill list — fine
//    for 2-3 color options.
// 2. `seriesIncludes` / `seriesExcludes` / `variationIncludes` — dynamic
//    discovery: filters the already-fetched `products` array and turns
//    every real match into an option. Used for BetterBone, where the real
//    size/flavor combinations aren't something we should guess at —
//    whatever's actually in the catalog shows up automatically. Modal
//    shows Size + Flavor dropdowns (parsed from each match's own
//    `variation` text) instead of a flat pill list once there's enough
//    combinations that pills get messy — matches the existing pawvy.co
//    product-detail pattern KT pointed at, rather than a wall of buttons.
//
// Either way, `products` is the brand's full product list the page
// already fetched server-side (same array ShopClient renders below) — no
// separate live fetch here, which was the root cause of an earlier
// "Unavailable" bug: matching a combined "Name — Color" string that never
// exists as a literal value in either the item_series or variation
// columns (the dash is only inserted for display, in ProductCard.jsx).
//
// The modal is rendered via a portal into document.body rather than
// inline where the button lives. Without this, `position: fixed` on the
// overlay gets trapped inside the nearest ancestor with a `transform` —
// and durability-card/pf-fit-card both set `transform` on :hover — so the
// modal would render pinned to the card's box while hovering it, then
// visibly jump to the true screen-centered position the instant the mouse
// left the card (that transform-triggered containing block disappearing).
// Portaling to body sidesteps this entirely.
import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

function findMatches(products, { seriesIncludes, seriesExcludes = [], variationIncludes, variationIncludesAny }) {
  const seriesTerms = Array.isArray(seriesIncludes) ? seriesIncludes : [seriesIncludes];
  const variationTerms = variationIncludesAny || (variationIncludes ? [variationIncludes] : null);
  const lower = s => (s || '').toLowerCase();
  return products.filter(p => {
    // Which field holds the descriptive fish/product name isn't
    // consistent across brands — Puzzle Feeder/BetterBone put it in
    // item_series (e.g. "PF-G001 Puzzle Feeder"), Eastsea Brother puts
    // just the SKU code there ("EFDF-P125") and the real name in
    // variation ("FD Pollack 125g") instead. Checking both combined
    // avoids needing to know which convention a given brand uses.
    const combined = `${lower(p.item_series)} ${lower(p.variation)}`;
    const variation = lower(p.variation);
    if (!seriesTerms.some(t => combined.includes(lower(t)))) return false;
    if (seriesExcludes.some(x => combined.includes(lower(x)))) return false;
    // variationIncludesAny: match if ANY of the given terms appear — used
    // to hedge against a size being written slightly differently than
    // expected in the real data (e.g. "2kg" vs "2 kg" vs "2000g") without
    // needing a confirmed screenshot for every possible format.
    if (variationTerms && !variationTerms.some(t => variation.includes(lower(t)))) return false;
    return true;
  });
}

// "Soft Classic Mini" + hardness prefix "Soft" -> { flavor: "Classic", size: "Mini" }.
// Assumes "<known prefix> <flavor...> <size>" — last word is size, everything
// else after stripping the known prefix is flavor. Matches every real
// example seen so far (Classic/Beef x Mini/Small/Large).
function parseSizeFlavor(variation, prefix) {
  let rest = (variation || '').trim();
  if (prefix) {
    const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    rest = rest.replace(new RegExp(`^${esc}\\s*`, 'i'), '').trim();
  }
  const parts = rest.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { flavor: '', size: '' };
  const size = parts[parts.length - 1];
  const flavor = parts.slice(0, -1).join(' ');
  return { flavor, size };
}

function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function ProductAddButton({ products, productLabel, variants, seriesIncludes, seriesExcludes, variationIncludes }) {
  const { addItem } = useCart();
  const isDynamic = !variants;

  // ---- Explicit mode (Puzzle Feeder: curated color variants) ----
  const options = useMemo(() => {
    if (!variants) return [];
    return variants.map(v => {
      const match = findMatches(products, {
        seriesIncludes: v.seriesIncludesAny || v.seriesIncludes,
        seriesExcludes: v.seriesExcludes,
        variationIncludes: v.variationIncludes,
        variationIncludesAny: v.variationIncludesAny,
      })[0] || null;
      return { label: v.label, hex: v.hex, image: v.image, default: v.default, forceImage: v.forceImage, product: match };
    });
  }, [products, variants]);

  // ---- Dynamic mode (BetterBone: real Size x Flavor discovery) ----
  const dynamicMatches = useMemo(() => {
    if (!isDynamic) return [];
    return findMatches(products, { seriesIncludes, seriesExcludes, variationIncludes });
  }, [isDynamic, products, seriesIncludes, seriesExcludes, variationIncludes]);

  const parsed = useMemo(() => {
    if (!isDynamic) return [];
    return dynamicMatches.map(p => ({ ...parseSizeFlavor(p.variation, variationIncludes), product: p }));
  }, [isDynamic, dynamicMatches, variationIncludes]);

  const sizes = useMemo(() => [...new Set(parsed.map(x => x.size).filter(Boolean))], [parsed]);
  const flavors = useMemo(() => [...new Set(parsed.map(x => x.flavor).filter(Boolean))], [parsed]);
  const showSizePicker = sizes.length > 1;
  const showFlavorPicker = flavors.length > 1;

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(0); // explicit-mode index
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState(null); // 'added' | null

  const currentDynamic = isDynamic
    ? parsed.find(x => x.size === selectedSize && x.flavor === selectedFlavor)
    : null;

  const explicitAvailable = options.filter(o => o.product && o.product.stock_status !== 'out_of_stock');
  const dynamicAvailable = parsed.filter(x => x.product.stock_status !== 'out_of_stock');

  const noOptionsAtAll = isDynamic ? parsed.length === 0 : options.every(o => !o.product);
  if (noOptionsAtAll) {
    return <button type="button" className="fit-add-btn" disabled title="Couldn't find a matching product in the catalog">Unavailable</button>;
  }

  const single = isDynamic
    ? parsed.length === 1 && dynamicAvailable.length === 1
    : options.length === 1 && explicitAvailable.length === 1;

  function addNow(product) {
    addItem(product, qty);
    setStatus('added');
    setTimeout(() => setStatus(null), 1800);
  }

  function handleAddClick(e) {
    e.preventDefault();
    if (single) {
      addNow(isDynamic ? dynamicAvailable[0].product : explicitAvailable[0].product);
      return;
    }
    setQty(1);
    if (isDynamic) {
      const first = dynamicAvailable[0] || parsed[0];
      setSelectedSize(first?.size || '');
      setSelectedFlavor(first?.flavor || '');
    } else {
      // Prefer the variant explicitly flagged `default: true` (e.g. the
      // size a brand wants shown first, regardless of display order) if
      // it's in stock; otherwise fall back to the first available option.
      const defaultIdx = options.findIndex(o => o.default && o.product && o.product.stock_status !== 'out_of_stock');
      setSelected(defaultIdx >= 0 ? defaultIdx : options.findIndex(o => o.product && o.product.stock_status !== 'out_of_stock'));
    }
    setModalOpen(true);
  }

  function handleConfirmAdd() {
    const chosen = isDynamic ? currentDynamic : options[selected];
    if (!chosen?.product || chosen.product.stock_status === 'out_of_stock') return;
    addNow(chosen.product);
    setModalOpen(false);
  }

  const noStockAtAll = isDynamic ? dynamicAvailable.length === 0 : explicitAvailable.length === 0;
  const current = isDynamic ? currentDynamic : options[selected];

  return (
    <>
      <button
        type="button"
        className={`fit-add-btn${status === 'added' ? ' added' : ''}`}
        onClick={handleAddClick}
        disabled={noStockAtAll}
      >
        {status === 'added' ? 'Added ✓' : noStockAtAll ? 'Out of stock' : 'Add to Cart'}
      </button>

      {modalOpen && (
        <Portal>
          <div className="fit-modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="fit-modal" onClick={e => e.stopPropagation()}>
              <button type="button" className="fit-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
              <h3>{productLabel}</h3>

              <div className="fit-modal-image-wrap">
                {(current?.forceImage ? current?.image : (current?.product?.image_data || current?.image))
                  ? <img src={current.forceImage ? current.image : (current.product?.image_data || current.image)} alt={productLabel} />
                  : <div className="img-placeholder" style={{ width: '100%', height: '100%' }}><span>No photo</span></div>}
              </div>

              {isDynamic ? (
                <div className="fit-modal-selects">
                  {showSizePicker && (
                    <label className="fit-modal-field">
                      <span>Size</span>
                      <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
                        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </label>
                  )}
                  {showFlavorPicker && (
                    <label className="fit-modal-field">
                      <span>Flavor</span>
                      <select value={selectedFlavor} onChange={e => setSelectedFlavor(e.target.value)}>
                        {flavors.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </label>
                  )}
                  {!current && <p className="fit-modal-loading">That combination isn't available.</p>}
                  {current && current.product.stock_status === 'out_of_stock' && (
                    <p className="fit-modal-loading">Out of stock.</p>
                  )}
                </div>
              ) : (
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
              )}

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
        </Portal>
      )}
    </>
  );
}
