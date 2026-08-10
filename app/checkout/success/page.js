'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { checkoutApi } from '../../../lib/api';
import { useCart } from '../../../lib/CartContext';
import { displayBrandName } from '../../../lib/brandSlugs';
import { productDisplayName } from '../../../lib/productDisplayName';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 480, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>Loading your order…</div>}>
      <SuccessLanding />
    </Suspense>
  );
}

function SuccessLanding() {
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const [status, setStatus] = useState('loading');
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { setStatus('error'); setMessage('Missing checkout session.'); return; }

    // The cart is cleared as soon as we land here, regardless of the order's
    // exact status below — Stripe only sends the customer to this page after
    // a session actually completed the payment step (card) or was submitted
    // for async confirmation (PayNow), so re-showing the old cart makes no
    // sense either way.
    clear();

    // A brief poll: for card payments the webhook has usually already fired
    // by the time this page loads, but there's no strict guarantee of
    // ordering between Stripe's redirect and its webhook delivery — so if
    // the order still shows pending_payment on the first check, we retry a
    // few times before settling on "we'll email you" messaging.
    let attempts = 0;
    const maxAttempts = 5;

    function poll() {
      checkoutApi.getSession(sessionId)
        .then(({ order, items }) => {
          setOrder(order);
          setItems(items);
          if (order.status === 'paid') {
            setStatus('paid');
          } else if (order.status === 'payment_failed') {
            setStatus('failed');
          } else if (attempts < maxAttempts) {
            attempts += 1;
            setTimeout(poll, 1500);
          } else {
            setStatus('pending'); // still processing — likely PayNow awaiting confirmation
          }
        })
        .catch(err => { setStatus('error'); setMessage(err.message); });
    }
    poll();
  }, [searchParams]);

  if (status === 'loading') {
    return <div style={{ maxWidth: 480, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>Confirming your order…</div>;
  }

  if (status === 'error') {
    return (
      <div style={{ maxWidth: 480, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 20 }}>We couldn't find that order</h1>
        <p style={{ color: '#666', marginTop: 8 }}>{message}</p>
        <Link href="/shop"><button style={{ padding: '10px 16px', marginTop: 16 }}>Back to Shop</button></Link>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div style={{ maxWidth: 480, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 20, color: 'crimson' }}>Payment didn't go through</h1>
        <p style={{ color: '#666', marginTop: 8 }}>Nothing was charged. You can try again from your cart.</p>
        <Link href="/cart"><button style={{ padding: '10px 16px', marginTop: 16 }}>Back to Cart</button></Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '140px auto 40px', padding: '0 20px' }}>
      {status === 'paid' ? (
        <>
          <h1 style={{ fontSize: 22 }}>🐾 Thank you for your order!</h1>
          <p style={{ color: '#666', marginTop: 8 }}>
            Order #{order.id} is confirmed. A receipt has been sent to {order.customer_email}.
          </p>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 22 }}>Order received — confirming payment</h1>
          <p style={{ color: '#666', marginTop: 8 }}>
            If you paid via PayNow, this can take a minute to confirm on our end. We'll email
            {' '}{order?.customer_email || 'you'} as soon as it's done — no need to wait on this page.
          </p>
        </>
      )}

      {order && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 20 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0' }}>
              <span>{item.qty}x {displayBrandName(item.brand_name)} — {productDisplayName(item)}</span>
              <span>${(item.unit_price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #eee', marginTop: 8, paddingTop: 8, fontSize: 14 }}>
            <Row label="Subtotal" value={order.subtotal} />
            <Row label="Shipping" value={order.shipping_amount} />
            {order.buttons_redemption_value > 0 && <Row label={`BUTTONS redeemed (${order.buttons_redeemed}B)`} value={-order.buttons_redemption_value} />}
            <Row label="Total paid" value={order.total_amount} bold />
          </div>
        </div>
      )}

      <Link href="/shop"><button style={{ padding: '10px 16px', marginTop: 20 }}>Continue Shopping</button></Link>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontWeight: bold ? 700 : 400 }}>
      <span>{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}
