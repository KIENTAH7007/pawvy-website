'use client';

// Add to Cart button + variant picker modal for the brand deep-dive "fit
// cards" (see BrandDeepDive.jsx). brandContent.js only has static
// placeholder data (hex swatches, a `match` search string) — it doesn't
// know live product IDs, since those come from the database and can
// change. So on click, this resolves each variant's *actual* product
// (id, price, real image) via a live search against shopApi, then either
// adds straight to cart (single-variant cards) or opens a modal to let the
// customer pick which option first (2+ variants).
import { useState } from 'react';
import { shopApi } from '../lib/api';
import { useCart } from '../lib/CartContext';
import QtyStepper from './QtyStepper';

export default function FitCardActions({ productName, brandId, variants }) {
  const { addItem } = useCart();
  const single = variants.length === 1;

  const [modalOpen, setModalOpen] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState(null); // 'added' | 'error' | null

  async function resolveVariant(v) {
    try {
      const data = await shopApi.products({ search: v.match, brand_id: brandId });
      return data.products?.[0] || null;
    } catch {
      return null;
    }
  }

  async function handleAddClick(e) {
    e.preventDefault();
    if (single) {
      setLoading(true);
      const product = await resolveVariant(variants[0]);
      setLoading(false);
      if (product) {
        addItem(product, 1);
        setStatus('added');
        setTimeout(() => setStatus(null), 1800);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(null), 2200);
      }
      return;
    }
    setModalOpen(true);
    setSelected(0);
    setQty(1);
    setLoading(true);
    const results = await Promise.all(variants.map(resolveVariant));
    setResolved(variants.map((v, i) => ({ ...v, product: results[i] })));
    setLoading(false);
  }

  function handleConfirmAdd() {
    const chosen = resolved[selected];
    if (!chosen?.product) return;
    addItem(chosen.product, qty);
    setModalOpen(false);
    setStatus('added');
    setTimeout(() => setStatus(null), 1800);
  }

  const current = resolved?.[selected];

  return (
    <>
      <button
        type="button"
        className={`fit-add-btn${status === 'added' ? ' added' : ''}${status === 'error' ? ' error' : ''}`}
        onClick={handleAddClick}
        disabled={loading && single}
      >
        {status === 'added' ? 'Added ✓' : status === 'error' ? 'Unavailable' : (loading && single) ? 'Adding…' : 'Add to Cart'}
      </button>

      {modalOpen && (
        <div className="fit-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="fit-modal" onClick={e => e.stopPropagation()}>
            <button type="button" className="fit-modal-close" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
            <h3>{productName}</h3>

            {loading || !resolved ? (
              <p className="fit-modal-loading">Loading options…</p>
            ) : (
              <>
                <div className="fit-modal-image-wrap">
                  <img src={current?.product?.image_data || current?.image} alt={current?.label} />
                </div>
                <div className="fit-modal-options">
                  {resolved.map((r, i) => (
                    <button
                      key={r.label}
                      type="button"
                      className={`fit-modal-option${i === selected ? ' active' : ''}`}
                      onClick={() => setSelected(i)}
                      disabled={!r.product}
                    >
                      <span className="fit-modal-swatch" style={{ background: r.hex }} />
                      {r.label}{!r.product ? ' (unavailable)' : ''}
                    </button>
                  ))}
                </div>
                <div className="fit-modal-footer">
                  <QtyStepper value={qty} onChange={setQty} />
                  <button
                    type="button"
                    className="btn btn-orange"
                    disabled={!current?.product}
                    onClick={handleConfirmAdd}
                  >
                    <span>Add to Cart{current?.product ? ` — $${current.product.effective_price_rrp_sg.toFixed(2)}` : ''}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
