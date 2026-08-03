'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/CartContext';
import { shopApi, checkoutApi, customerApi, getSessionToken } from '../../lib/api';
import ProductCard from '../../components/ProductCard';
import { displayBrandName } from '../../lib/brandSlugs';

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
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_COST;

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
  const [loggedInAddress, setLoggedInAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const requestedB = Math.max(0, parseInt(redeemInput) || 0);
  const maxRedeemableB = customer ? Math.min(buttonsBalance, Math.floor((subtotal * 0.30) / 0.02)) : 0;
  const previewRedemptionValue = customer ? Math.min(requestedB, maxRedeemableB) * 0.02 : 0;
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
                    {item.image_data ? (
                      <img src={item.image_data} alt={item.item_series} />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="cart-item-brand">{displayBrandName(item.brand_name)}</div>
                    <div className="cart-item-name">{item.item_series}{item.variation ? ` — ${item.variation}` : ''}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)} each</div>
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
                <div style={{ fontWeight: 800, marginTop: 2, color: 'var(--navy)' }}>{customer.name || customer.email} ({customer.email})</div>
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
                  <span>I agree to Pawvy collecting my details to process this order. (Required)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 10, fontSize: 13.5, color: 'var(--dark-gray)' }}>
                  <input
                    type="checkbox" checked={guest.create_account}
                    onChange={e => setGuest(g => ({ ...g, create_account: e.target.checked }))}
                    style={{ marginTop: 3 }}
                  />
                  <span>Also create a free Pawvy rewards account for me, so I can earn BUTTONS on this order and track it later.</span>
                </label>

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
                <label>Redeem BUTTONS on this order (up to {maxRedeemableB}B — 30% of subtotal, or your balance, whichever is lower)</label>
                <input
                  type="number" min="0" max={maxRedeemableB} value={redeemInput}
                  onChange={e => setRedeemInput(e.target.value)}
                  placeholder="0"
                  style={{ maxWidth: 140 }}
                />
              </div>
              {previewRedemptionValue > 0 && (
                <p style={{ fontSize: 12.5, color: 'var(--dark-gray)', marginTop: 8 }}>
                  That's ${previewRedemptionValue.toFixed(2)} off this order.
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: 22 }}>
            <Row label="Subtotal" value={subtotal} />
            <Row label={freeShipping ? 'Shipping (free!)' : 'Shipping'} value={shipping} />
            {!freeShipping && (
              <p style={{ fontSize: 12.5, color: 'var(--dark-gray)' }}>
                Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.
              </p>
            )}
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
            <span>{checkingOut ? 'Redirecting to payment…' : `Checkout — Pay $${total.toFixed(2)}`}</span>
          </button>
          <p style={{ fontSize: 12.5, color: 'var(--dark-gray)', textAlign: 'center', marginTop: 10 }}>
            Payment by card or PayNow, securely handled by Stripe.
          </p>
        </>
      )}

      {upsellProducts.length > 0 && (
        <div style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: 20, color: 'var(--navy)', fontWeight: 800 }}>🔥 Popular right now</h2>
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
      <span>${value.toFixed(2)}</span>
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
