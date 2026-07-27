'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND_SLUGS } from '../lib/brandSlugs';
import { useCart } from '../lib/CartContext';
import { customerApi, getSessionToken, setSessionToken } from '../lib/api';

// FREE_SHIPPING_THRESHOLD matches the $60 free-delivery rule already
// established elsewhere on the site (ShopClient, checkout) — keep these
// in sync if that number ever changes.
const FREE_SHIPPING_THRESHOLD = 60;

export default function Nav() {
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [balance, setBalance] = useState(0);
  const { itemCount, subtotal } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!getSessionToken()) return;
    customerApi.me()
      .then(({ customer, buttons_balance }) => { setCustomer(customer); setBalance(buttons_balance); })
      .catch(() => setSessionToken(null));
  }, []);

  const unlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const focText = unlocked
    ? 'Free delivery unlocked!'
    : `Add $${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} for free delivery`;
  const firstName = customer?.name?.split(' ')[0] || 'there';

  return (
    <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <Link href="/" className="brand-mark">
          <img src="/pawvy-logo-white.png" alt="Pawvy" />
        </Link>

        <div className="nav-right">
          <div className="nav-links">
            <Link href="/">Home</Link>

            <div
              className={`nav-item${shopOpen ? ' open' : ''}`}
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <Link href="/shop">
                Shop
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>
              </Link>
              <div className="dropdown">
                {Object.entries(BRAND_SLUGS).map(([name, slug]) => (
                  <Link key={slug} href={`/brands/${slug}`}>{name}</Link>
                ))}
              </div>
            </div>

            <Link href="/stockist">Stockist</Link>
            <Link href="/#enquiry">Contact</Link>
            <Link href="/blog">Blog</Link>
          </div>

          <div className={`foc-pill${unlocked ? ' unlocked' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 19a2 2 0 100-4 2 2 0 000 4zM17.5 19a2 2 0 100-4 2 2 0 000 4z" /></svg>
            <span>{focText}</span>
          </div>

          <div className="nav-auth">
            {customer ? (
              <Link href="/account" className="nav-greeting">
                <span className="nav-greeting-name">Hi, {firstName}</span>
                <span className="nav-greeting-balance">{balance}B</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="nav-login">Log in</Link>
                <Link href="/signup" className="btn btn-orange nav-signup"><span>Sign up</span></Link>
              </>
            )}
          </div>

          <Link href="/cart" className="cart-link">
            <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6L4 3H2" /></svg>
            <span className={`cart-badge${itemCount > 0 ? ' show' : ''}`}>{itemCount}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
