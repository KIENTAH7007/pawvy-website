'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../lib/CartContext';
import { shopApi, checkoutApi, customerApi, getSessionToken } from '../../lib/api';
import ProductCard from '../../components/ProductCard';

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
  const [guest, setGuest] = useState({ email: '', name: '', phone: '', address: '', pdpa_consent: false });
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
        body.pdpa_consent_text = 'I agree to Pawvy collecting my details to process this order and, optionally, create a Pawvy rewards account.';
      }

      const result = await checkoutApi.createSession(body);
      window.location.href = result.checkout_url; // hand off to Stripe's hosted Checkout page
    } catch (err) {
      setCheckoutError(err.message || 'Something went wrong starting checkout.');
      setCheckingOut(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: '0 20px' }}>
      <Link href="/shop" style={{ fontSize: 13, color: '#666' }}>&larr; Back to shop</Link>

      <h1 style={{ marginTop: 12 }}>Your Cart</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: '#666' }}>Your cart is empty.</p>
          <Link href="/shop"><button style={{ padding: '10px 16px', marginTop: 12 }}>Browse the Shop</button></Link>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 16 }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 6, background: '#f5f5f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {item.image_data ? (
                      <img src={item.image_data} alt={item.item_series} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 9, color: '#999' }}>No image</span>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#666' }}>{item.brand_name}</div>
                    <div>{item.item_series}{item.variation ? ` — ${item.variation}` : ''}</div>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>${item.price.toFixed(2)} each</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <input
                    type="number" min="1" value={item.qty}
                    onChange={e => updateQty(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: 50, padding: 6 }}
                  />
                  <button onClick={() => removeItem(item.id)} style={{ padding: '6px 10px', color: 'crimson' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Contact / shipping details ── */}
          <div style={{ marginTop: 24, background: '#fafafa', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            {customer ? (
              <>
                <div style={{ fontSize: 13, color: '#666' }}>Checking out as</div>
                <div style={{ fontWeight: 600, marginTop: 2 }}>{customer.name || customer.email} ({customer.email})</div>
                <label style={{ display: 'block', marginTop: 10 }}>
                  Shipping address
                  <input
                    value={loggedInAddress} onChange={e => setLoggedInAddress(e.target.value)}
                    placeholder="Where should we ship this?"
                    style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
                  />
                </label>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 15, marginTop: 0 }}>Contact & shipping details</h2>
                <p style={{ fontSize: 12.5, color: '#666', marginTop: -4 }}>
                  Have a Pawvy account? <Link href="/login">Log in</Link> first to use your BUTTONS and track this order.
                </p>
                <FormField label="Email" type="email" value={guest.email} onChange={v => setGuest(g => ({ ...g, email: v }))} />
                <FormField label="Name" value={guest.name} onChange={v => setGuest(g => ({ ...g, name: v }))} />
                <FormField label="Phone" value={guest.phone} onChange={v => setGuest(g => ({ ...g, phone: v }))} />
                <FormField label="Shipping address" value={guest.address} onChange={v => setGuest(g => ({ ...g, address: v }))} />
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 12, fontSize: 13 }}>
                  <input
                    type="checkbox" checked={guest.pdpa_consent}
                    onChange={e => setGuest(g => ({ ...g, pdpa_consent: e.target.checked }))}
                    style={{ marginTop: 3 }}
                  />
                  <span>I agree to Pawvy collecting my details to process this order and create a Pawvy rewards account for me.</span>
                </label>
              </>
            )}
          </div>

          {/* ── BUTTONS redemption (logged-in only) ── */}
          {customer && buttonsBalance > 0 && (
            <div style={{ marginTop: 12, background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 13, color: '#666' }}>Your BUTTONS balance: <strong>{buttonsBalance}B</strong></div>
              <label style={{ display: 'block', marginTop: 8, fontSize: 13 }}>
                Redeem BUTTONS on this order (up to {maxRedeemableB}B — 30% of subtotal, or your balance, whichever is lower)
                <input
                  type="number" min="0" max={maxRedeemableB} value={redeemInput}
                  onChange={e => setRedeemInput(e.target.value)}
                  placeholder="0"
                  style={{ display: 'block', width: 140, padding: 8, marginTop: 4 }}
                />
              </label>
              {previewRedemptionValue > 0 && (
                <p style={{ fontSize: 12.5, color: '#666', marginTop: 6 }}>
                  That's ${previewRedemptionValue.toFixed(2)} off this order.
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: 20, fontSize: 14 }}>
            <Row label="Subtotal" value={subtotal} />
            <Row label={freeShipping ? 'Shipping (free!)' : 'Shipping'} value={shipping} />
            {!freeShipping && (
              <p style={{ fontSize: 12, color: '#666' }}>
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
            style={{ width: '100%', padding: 12, marginTop: 12, opacity: checkingOut ? 0.6 : 1, cursor: checkingOut ? 'wait' : 'pointer' }}
          >
            {checkingOut ? 'Redirecting to payment…' : `Checkout — Pay $${total.toFixed(2)}`}
          </button>
          <p style={{ fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 }}>
            Payment by card or PayNow, securely handled by Stripe.
          </p>
        </>
      )}

      {upsellProducts.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 16 }}>🔥 Popular right now</h2>
          <p style={{ fontSize: 12.5, color: '#666', marginTop: -8 }}>Based on real sales over the last 3 months</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
            {upsellProducts.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontWeight: bold ? 700 : 400 }}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text' }) {
  return (
    <label style={{ display: 'block', marginTop: 10 }}>
      {label}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
    </label>
  );
}
