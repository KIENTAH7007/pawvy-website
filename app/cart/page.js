'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/CartContext';
import { shopApi, checkoutApi, customerApi, getSessionToken, productImageUrl, THUMB_SIZE } from '../../lib/api';
import { readRefCode, normalizeRefCode } from '../../lib/referral';
import ProductCard from '../../components/ProductCard';
import { displayBrandName } from '../../lib/brandSlugs';
import { productDisplayName } from '../../lib/productDisplayName';
import { formatPrice } from '../../lib/formatPrice';

const FREE_SHIPPING_THRESHOLD = 60; // must match server/routes/checkout.js — see note there
const SHIPPING_COST = 3;            // must match server/routes/checkout.js — see note there

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    h();
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, addItem } = useCart();
  const [topSellers, setTopSellers] = useState([]);
  const isMobile = useIsMobile();

  const [customer, setCustomer] = useState(null); // logged-in customer, if any
  const [buttonsBalance, setButtonsBalance] = useState(0);
  const [redeemInput, setRedeemInput] = useState('');
  // pdpa_consent covers only what's legally required to process the order
  // itself; create_account is a separate, optional opt-in for a Pawvy
  // rewards account. These used to be one combined checkbox, which meant
  // declining the account also blocked checkout entirely — there was no
  // way to actually check out as a guest. See README for the matching
  // backend contract this now expects.
  const [guest, setGuest] = useState({ email: '', name: '', phone: '', address: '', pdpa_consent: false, create_account: true });
  const [refCode, setRefCode] = useState('');
  const [refState, setRefState] = useState('idle'); // idle | checking | valid | invalid
  const [loggedInAddress, setLoggedInAddress] = useState('');
  // Prefill from a remembered referral link, then let the customer type or change it.
  useEffect(() => { const saved = readRefCode(); if (saved) setRefCode(saved); }, []);
  useEffect(() => {
    const code = normalizeRefCode(refCode);
    if (!code) { setRefState('idle'); return; }
    if (code.length < 4) { setRefState('invalid'); return; }
    setRefState('checking');
    const t = setTimeout(() => {
      customerApi.checkReferralCode(code)
        .then(r => setRefState(r.valid ? 'valid' : 'invalid'))
        .catch(() => setRefState('idle'));
    }, 350);
    return () => clearTimeout(t);
  }, [refCode]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const requestedB = Math.max(0, parseInt(redeemInput) || 0);
  // Normal customers: up to 30% of the order in BUTTONS. Special ambassadors: no cap (balance only).
  // Must match redemptionCapPct() in pawvy-app server/lib/buttons.js.
  const capPct = customer && customer.is_ambassador ? 1 : 0.30;
  const maxRedeemableB = customer ? Math.min(buttonsBalance, Math.floor((subtotal * capPct) / 0.02 + 1e-9)) : 0;
  const previewRedemptionValue = customer ? Math.min(requestedB, maxRedeemableB) * 0.02 : 0;
  // Free delivery is checked AFTER BUTTONS are applied (shipping never earns BUTTONS).
  // Must match server/routes/checkout.js in pawvy-app.
  const freeShipping = (subtotal - previewRedemptionValue) >= FREE_SHIPPING_THRESHOLD - 0.001;
  const shipping = freeShipping ? 0 : SHIPPING_COST;
  const total = Math.max(0, subtotal + shipping - previewRedemptionValue);

  useEffect(() => {
    shopApi.topSellers(20).then(d => setTopSellers(d.products));
    if (getSessionToken()) {
      customerApi.me()
        .then(({ customer, buttons_balance }) => {
          setCustomer(customer);
          setButtonsBalance(buttons_balance);
          setLoggedInAddress(customer.address || '');
        })
        .catch(() => {}); // expired/invalid session — fall through to guest checkout, no error shown
    }
  }, []);

  const cartIds = new Set(items.map(i => i.id));
  const upsellCount = isMobile ? 6 : 8;
  const upsellProducts = topSellers.filter(p => !cartIds.has(p.id)).slice(0, upsellCount);

  async function handleCheckout() {
    setCheckoutError(null);

    if (!customer) {
      if (!guest.email.trim()) { setCheckoutError('Please enter your email.'); return; }
      if (!guest.pdpa_consent) { setCheckoutError('Please confirm you agree to share your details with Pawvy.'); return; }
    }

    setCheckingOut(true);
    try {
      const body = {
        items: items.map(i => ({ product_id: i.id, qty: i.qty })),
        shipping_address: customer ? loggedInAddress : guest.address,
        buttons_redeem: customer ? requestedB : 0,
      };
      // The code typed in the checkout field wins; otherwise a referral link remembered for 30 days still counts.
      // It only matters when the guest also creates an account (server ignores it otherwise / for existing accounts).
      if (!customer && guest.create_account) {
        const typed = normalizeRefCode(refCode);
        const code = typed && refState !== 'invalid' ? typed : (typed ? '' : readRefCode());
        if (code) body.referral_code = code;
      }
      if (!customer) {
        body.guest_email = guest.email;
        body.guest_name = guest.name;
        body.guest_phone = guest.phone;
        body.pdpa_consent = guest.pdpa_consent;
        body.create_account = guest.create_account;
        body.pdpa_consent_text = guest.create_account
          ? 'I agree to Pawvy collecting my details to process this order and create a Pawvy rewards account for me.'
          : 'I agree to Pawvy collecting my details to process this order only. I am checking out as a guest.';
      }

      const result = await checkoutApi.createSession(body);
      window.location.href = result.checkout_url; // hand off to Stripe's hosted Checkout page
    } catch (err) {
      setCheckoutError(err.message || 'Something went wrong starting checkout.');
      setCheckingOut(false);
    }
  }

  return (
    <div className="cart-page">
      <Link href="/shop" className="back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        <span>Back to shop</span>
      </Link>

      <h1>Your Cart</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="btn btn-orange"><span>Browse the Shop</span></Link>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 20 }}>
            {items.map(item => (
              <div key={item.id} className="cart-item-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <div className="cart-item-thumb">
                    {item.image_url ? (
                      <img src={productImageUrl(item.image_url, THUMB_SIZE)} alt={productDisplayName(item)} />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="cart-item-brand">{displayBrandName(item.brand_name)}</div>
                    <div className="cart-item-name">{productDisplayName(item)}</div>
                    <div className="cart-item-price">{formatPrice(item.price)} each</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  <input
                    type="number" min="1" value={item.qty}
                    onChange={e => updateQty(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: 54, padding: 8, borderRadius: 10, border: '2px solid var(--line)', textAlign: 'center', fontWeight: 700 }}
                  />
                  <button className="cart-remove" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Contact / shipping details ── */}
          <div className="cart-box">
            {customer ? (
              <>
                <div style={{ fontSize: 13, color: 'var(--dark-gray)' }}>Checking out as</div>
                <div style={{ fontWeight: 600, marginTop: 2, color: 'var(--navy)' }}>{customer.name || customer.email} ({customer.email})</div>
                <div className="field" style={{ marginTop: 14 }}>
                  <label>Shipping address</label>
                  <input
                    value={loggedInAddress} onChange={e => setLoggedInAddress(e.target.value)}
                    placeholder="Where should we ship this?"
                  />
                </div>
              </>
            ) : (
              <>
                <h2>Contact & shipping details</h2>
                <p className="hint">
                  Have a Pawvy account? <Link href="/login?next=/cart" style={{ color: 'var(--orange)', fontWeight: 700 }}>Log in</Link> first to use your BUTTONS and track this order.
                </p>
                <FormField label="Email" type="email" value={guest.email} onChange={v => setGuest(g => ({ ...g, email: v }))} />
                <FormField label="Name" value={guest.name} onChange={v => setGuest(g => ({ ...g, name: v }))} />
                <FormField label="Phone" value={guest.phone} onChange={v => setGuest(g => ({ ...g, phone: v }))} />
                <FormField label="Shipping address" value={guest.address} onChange={v => setGuest(g => ({ ...g, address: v }))} />

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 14, fontSize: 13.5, color: 'var(--dark-gray)' }}>
                  <input
                    type="checkbox" checked={guest.pdpa_consent}
                    onChange={e => setGuest(g => ({ ...g, pdpa_consent: e.target.checked }))}
                    style={{ marginTop: 3 }}
                  />
                  <span>
                    I agree to Pawvy collecting my details to process this order. (Required) See our{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange, #F36F4A)' }}>Privacy Policy</a>.
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 10, fontSize: 13.5, color: 'var(--dark-gray)' }}>
                  <input
                    type="checkbox" checked={guest.create_account}
                    onChange={e => setGuest(g => ({ ...g, create_account: e.target.checked }))}
                    style={{ marginTop: 3 }}
                  />
                  <span>Also create a free Pawvy rewards account for me, so I can earn BUTTONS on this order and track it later.</span>
                </label>

                {guest.create_account && (
                  <div style={{ marginTop: 12 }}>
                    <label style={{ display: 'block', fontSize: 13.5, color: 'var(--dark-gray)', fontWeight: 600 }}>
                      Referral code <span style={{ fontWeight: 400, color: '#888' }}>(optional)</span>
                      <input
                        value={refCode} onChange={e => setRefCode(normalizeRefCode(e.target.value))}
                        maxLength={12} autoCapitalize="characters" autoComplete="off"
                        style={{
                          display: 'block', width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 8,
                          border: '1.5px solid ' + (refState === 'valid' ? '#2fbf71' : refState === 'invalid' ? '#e5534b' : '#ddd'),
                          textTransform: 'uppercase', letterSpacing: 2, fontSize: 15, boxSizing: 'border-box',
                        }}
                      />
                    </label>
                    <span style={{ display: 'block', fontSize: 13, marginTop: 6, color: refState === 'valid' ? '#1f9a58' : refState === 'invalid' ? '#c0392b' : '#777', fontWeight: refState === 'valid' || refState === 'invalid' ? 600 : 400 }}>
                      {refState === 'valid' && '✓ Code accepted — you\'ll both get 200 BUTTONS after your first purchase.'}
                      {refState === 'invalid' && 'We couldn\'t find that code. Check the spelling, or clear it to continue without one.'}
                      {refState === 'checking' && 'Checking…'}
                      {refState === 'idle' && 'Got a code from a friend or ambassador? Enter it and you both get 200 BUTTONS after your first purchase.'}
                    </span>
                  </div>
                )}

                {!guest.create_account && (
                  <p className="hint" style={{ marginTop: 10, color: 'var(--orange)', fontWeight: 600 }}>
                    You're checking out as a guest — you won't earn BUTTONS on this order, and you'll need to re-enter your details next time. You can still create an account later using this same email.
                  </p>
                )}
              </>
            )}
          </div>

          {/* ── BUTTONS redemption (logged-in only) ── */}
          {customer && buttonsBalance > 0 && (
            <div className="cart-buttons-box">
              <div style={{ fontSize: 13, color: 'var(--dark-gray)' }}>Your BUTTONS balance: <strong style={{ color: 'var(--navy)' }}>{buttonsBalance}B</strong></div>
              <div className="field" style={{ marginTop: 10, marginBottom: 0 }}>
                <label>Redeem BUTTONS on this order (up to {maxRedeemableB}B{customer.is_ambassador ? ' — or your balance, whichever is lower' : ' — 30% of subtotal, or your balance, whichever is lower'})</label>
                <input
                  type="number" min="0" max={maxRedeemableB} value={redeemInput}
                  onChange={e => setRedeemInput(e.target.value)}
                  placeholder="0"
                  style={{ maxWidth: 140 }}
                />
              </div>
              {previewRedemptionValue > 0 && (
                <p style={{ fontSize: 12.5, color: 'var(--dark-gray)', marginTop: 8 }}>
                  That's {formatPrice(previewRedemptionValue)} off this order.
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: 22 }}>
            <Row label="Subtotal" value={subtotal} />
            <Row label={freeShipping ? 'Shipping (free!)' : 'Shipping'} value={shipping} />
            {previewRedemptionValue > 0 && <Row label="BUTTONS redeemed" value={-previewRedemptionValue} />}
            <Row label="Total" value={total} bold />
          </div>

          {checkoutError && (
            <p style={{ color: 'crimson', fontSize: 13, marginTop: 12 }}>{checkoutError}</p>
          )}

          <button
            onClick={handleCheckout} disabled={checkingOut}
            className="btn btn-orange"
            style={{ width: '100%', justifyContent: 'center', marginTop: 16, opacity: checkingOut ? 0.6 : 1, cursor: checkingOut ? 'wait' : 'pointer' }}
          >
            <span>{checkingOut ? 'Redirecting to payment…' : `Checkout — Pay ${formatPrice(total)}`}</span>
          </button>
          <p style={{ fontSize: 12.5, color: 'var(--dark-gray)', textAlign: 'center', marginTop: 10 }}>
            Payment by card or PayNow, securely handled by Stripe.
          </p>
        </>
      )}

      {upsellProducts.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: 20, color: 'var(--navy)', fontWeight: 600 }}>🔥 Popular right now</h2>
          <p style={{ fontSize: 12.5, color: 'var(--dark-gray)', marginTop: -6, marginBottom: 16 }}>Based on real sales over the last 3 months</p>
          <div className="product-grid" style={{ marginTop: 0 }}>
            {upsellProducts.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`cart-row-summary${bold ? ' bold' : ''}`}>
      <span>{label}</span>
      <span>{formatPrice(value)}</span>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text' }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
