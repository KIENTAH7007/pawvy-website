'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BRAND_SLUGS, displayBrandName } from '../lib/brandSlugs';
import { useCart } from '../lib/CartContext';
import { customerApi, getSessionToken, setSessionToken } from '../lib/api';

// FREE_SHIPPING_THRESHOLD matches the $60 free-delivery rule already
// established elsewhere on the site (ShopClient, checkout) — keep these
// in sync if that number ever changes.
const FREE_SHIPPING_THRESHOLD = 60;

// Pages whose content starts with a navy-background hero (home's morphing
// blobs, or a .subhero/.shop-hero) — on these, the nav starts transparent
// so it blends into that hero, matching the original mockup, then gains
// its solid background once scrolled. Everywhere else (cart, login/signup,
// blog, etc.) doesn't have navy right at the top, so the nav needs its
// solid background from the start or nav text would be unreadable against
// a light page background.
function startsOnNavy(pathname) {
  if (pathname === '/' || pathname === '/shop' || pathname === '/stockist' || pathname === '/account') return true;
  if (pathname.startsWith('/brands/')) return true;
  return false;
}

export default function Nav() {
  const pathname = usePathname();
  const [shopOpen, setShopOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [balance, setBalance] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [birthdayBonus, setBirthdayBonus] = useState(null);
  const { itemCount, subtotal } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) { setCustomer(null); setBalance(0); setBirthdayBonus(null); return; }
    customerApi.me()
      .then(({ customer, buttons_balance, active_multiplier, active_multiplier_source }) => {
        setCustomer(customer);
        setBalance(buttons_balance);
        // Only the birthday-month bonus shows in the nav — an active
        // campaign is already covered by the homepage ticker, so it isn't
        // duplicated here.
        setBirthdayBonus(active_multiplier_source === 'birthday' ? active_multiplier : null);
      })
      .catch(() => { setSessionToken(null); setCustomer(null); setBalance(0); setBirthdayBonus(null); });
  }, [pathname]);

  // Close the mobile menu whenever navigation actually happens, and don't
  // carry the Shop submenu's open state across a fresh open.
  useEffect(() => { setMobileOpen(false); setMobileShopOpen(false); }, [pathname]);

  // Lock background scroll while the mobile drawer is open, same pattern
  // any modal/drawer needs so the page underneath doesn't scroll with it.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const unlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const focText = unlocked
    ? 'Free delivery unlocked!'
    : `Add $${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} for free delivery`;
  const firstName = customer?.name?.split(' ')[0] || 'there';
  const solid = scrolled || !startsOnNavy(pathname);

  return (
    <nav className={`site-nav${solid ? ' scrolled' : ''}`}>
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
                  <Link key={slug} href={`/brands/${slug}`}>{displayBrandName(name)}</Link>
                ))}
              </div>
            </div>

            <Link href="/stockist">Stockist</Link>
            <Link href="/#enquiry">Contact</Link>
            <Link href="/blog">Blog</Link>
          </div>

          {birthdayBonus && (
            <div className="promo-pill" title="Your pet's birthday month bonus is active">
              <span>🎂 {birthdayBonus}× BUTTONS</span>
            </div>
          )}

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

          <button
            type="button"
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />

      <div className={`mobile-drawer${mobileOpen ? ' open' : ''}`}>
        <Link href="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>

        <div className={`mobile-shop${mobileShopOpen ? ' open' : ''}`}>
          <button type="button" className="mobile-link mobile-shop-toggle" onClick={() => setMobileShopOpen((o) => !o)}>
            Shop
            <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <div className="mobile-shop-list">
            <Link href="/shop" className="mobile-sublink" onClick={() => setMobileOpen(false)}>All products</Link>
            {Object.entries(BRAND_SLUGS).map(([name, slug]) => (
              <Link key={slug} href={`/brands/${slug}`} className="mobile-sublink" onClick={() => setMobileOpen(false)}>{displayBrandName(name)}</Link>
            ))}
          </div>
        </div>

        <Link href="/stockist" className="mobile-link" onClick={() => setMobileOpen(false)}>Stockist</Link>
        <Link href="/#enquiry" className="mobile-link" onClick={() => setMobileOpen(false)}>Contact</Link>
        <Link href="/blog" className="mobile-link" onClick={() => setMobileOpen(false)}>Blog</Link>

        <div className="mobile-drawer-divider" />

        {customer ? (
          <Link href="/account" className="mobile-link mobile-greeting" onClick={() => setMobileOpen(false)}>
            Hi, {firstName} <span className="nav-greeting-balance">{balance}B</span>
          </Link>
        ) : (
          <div className="mobile-auth-row">
            <Link href="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Log in</Link>
            <Link href="/signup" className="btn btn-orange" onClick={() => setMobileOpen(false)}><span>Sign up</span></Link>
          </div>
        )}
      </div>
    </nav>
  );
}
