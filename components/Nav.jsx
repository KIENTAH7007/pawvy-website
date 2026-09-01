'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { brandSlug, displayBrandName } from '../lib/brandSlugs';
import { NEED_CATEGORIES } from '../lib/needTags';
import { useCart } from '../lib/CartContext';
import { customerApi, contentApi, getSessionToken, setSessionToken } from '../lib/api';
import { formatPrice } from '../lib/formatPrice';

// FREE_SHIPPING_THRESHOLD matches the $60 free-delivery rule already
// established elsewhere on the site (ShopClient, checkout) — keep these
// in sync if that number ever changes.
const FREE_SHIPPING_THRESHOLD = 60;

// Same fix as ProductAddButton's Add to Cart modal (see the comment
// there): `position: fixed` gets trapped inside the nearest ancestor
// that has a `transform`/`filter`/`will-change` set, and ends up
// positioned relative to THAT box instead of the real viewport — which
// on a page you've scrolled down can make a fixed drawer render mostly
// or entirely off the top of the screen, looking "stuck" and unclosable
// even though the DOM/state is actually correct. Portaling straight into
// document.body sidesteps this regardless of what any given page's
// content does with transforms (reveal-on-scroll animations, card hover
// effects, etc.) — same reasoning as the modal fix, just applied to the
// mobile nav drawer instead.
function Portal({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

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

export default function Nav({ brands = [] }) {
  const pathname = usePathname();
  const [shopOpen, setShopOpen] = useState(false);
  const [needOpen, setNeedOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [balance, setBalance] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileNeedOpen, setMobileNeedOpen] = useState(false);
  const [promoBadge, setPromoBadge] = useState(null); // { emoji, multiplier, tooltip } | null
  const { itemCount, subtotal } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      setCustomer(null); setBalance(0);
      // Not logged in — there's no known customer, so no birthday bonus
      // is possible, but a campaign can still be shown to any visitor via
      // the public (unauthenticated) campaign endpoint. This is the case
      // that was previously invisible entirely: someone just browsing,
      // not logged in, had no way to see an active campaign on the site
      // at all before this fix.
      contentApi.activeCampaign()
        .then(({ active, name, multiplier }) => {
          setPromoBadge(active ? { emoji: '🎉', multiplier, tooltip: name ? `Campaign: ${name}` : 'Active campaign' } : null);
        })
        .catch(() => setPromoBadge(null));
      return;
    }
    customerApi.me()
      .then(({ customer, buttons_balance, active_multiplier, active_multiplier_source, active_campaign_name }) => {
        setCustomer(customer);
        setBalance(buttons_balance);
        // The backend already picks whichever of campaign-or-birthday is
        // higher (see getActiveMultiplierDetail in pawvy-app) — this just
        // renders whichever one it decided, same short pill either way so
        // the nav bar never gets cramped by a longer campaign name (that
        // goes in the tooltip instead, same pattern the birthday case
        // already used).
        if (active_multiplier_source === 'birthday') {
          setPromoBadge({ emoji: '🎂', multiplier: active_multiplier, tooltip: "Your pet's birthday month bonus is active" });
        } else if (active_multiplier_source === 'campaign') {
          setPromoBadge({ emoji: '🎉', multiplier: active_multiplier, tooltip: active_campaign_name ? `Campaign: ${active_campaign_name}` : 'Active campaign' });
        } else {
          setPromoBadge(null);
        }
      })
      .catch(() => { setSessionToken(null); setCustomer(null); setBalance(0); setPromoBadge(null); });
  }, [pathname]);

  // Close the mobile menu whenever navigation actually happens, and don't
  // carry the Shop submenu's open state across a fresh open.
  useEffect(() => { setMobileOpen(false); setMobileShopOpen(false); setMobileNeedOpen(false); }, [pathname]);

  // Lock background scroll while the mobile drawer is open, same pattern
  // any modal/drawer needs so the page underneath doesn't scroll with it.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const unlocked = subtotal >= FREE_SHIPPING_THRESHOLD;
  const focText = unlocked
    ? 'Free delivery unlocked!'
    : `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} for free delivery`;
  const firstName = customer?.name?.split(' ')[0] || 'there';
  // Homepage-only exception (Aug 2026, per KT): the banner carousel can
  // show light-colored images, and a transparent nav over a light banner
  // makes the (light-colored) nav text unreadable — same problem the
  // transparent-until-scrolled design was never meant to create. Forcing
  // solid specifically on '/' sidesteps that regardless of which banner
  // happens to be showing, without touching the scroll-based behavior
  // every other navy-starting page (shop, stockist, account, brand
  // pages) still correctly keeps.
  const solid = pathname === '/' || scrolled || !startsOnNavy(pathname);

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
              className={`nav-item${needOpen ? ' open' : ''}`}
              onMouseEnter={() => setNeedOpen(true)}
              onMouseLeave={() => setNeedOpen(false)}
            >
              <Link href="/#need-cards">
                Shop by Need
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>
              </Link>
              <div className="dropdown">
                {NEED_CATEGORIES.map(n => (
                  <Link key={n.slug} href={`/shop?need=${n.slug}`}>{n.label}</Link>
                ))}
              </div>
            </div>

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
                {brands.map((b) => (
                  <Link key={b.id} href={`/brands/${brandSlug(b.name)}`}>{displayBrandName(b.name)}</Link>
                ))}
              </div>
            </div>

            <Link href="/stockist">Stockist</Link>
            <Link href="/#enquiry">Contact</Link>
          </div>

          {promoBadge && (
            <div className="promo-pill" title={promoBadge.tooltip}>
              <span>{promoBadge.emoji} {promoBadge.multiplier}×B</span>
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

      <Portal>
        <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />

        <div className={`mobile-drawer${mobileOpen ? ' open' : ''}`}>
          <Link href="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>

          <div className={`mobile-shop${mobileNeedOpen ? ' open' : ''}`}>
            <button type="button" className="mobile-link mobile-shop-toggle" onClick={() => setMobileNeedOpen((o) => !o)}>
              Shop by Need
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="mobile-shop-list">
              {NEED_CATEGORIES.map(n => (
                <Link key={n.slug} href={`/shop?need=${n.slug}`} className="mobile-sublink" onClick={() => setMobileOpen(false)}>{n.label}</Link>
              ))}
            </div>
          </div>

          <div className={`mobile-shop${mobileShopOpen ? ' open' : ''}`}>
            <button type="button" className="mobile-link mobile-shop-toggle" onClick={() => setMobileShopOpen((o) => !o)}>
              Shop
              <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div className="mobile-shop-list">
              <Link href="/shop" className="mobile-sublink" onClick={() => setMobileOpen(false)}>All products</Link>
              {brands.map((b) => (
                <Link key={b.id} href={`/brands/${brandSlug(b.name)}`} className="mobile-sublink" onClick={() => setMobileOpen(false)}>{displayBrandName(b.name)}</Link>
              ))}
            </div>
          </div>

          <Link href="/stockist" className="mobile-link" onClick={() => setMobileOpen(false)}>Stockist</Link>
          <Link href="/#enquiry" className="mobile-link" onClick={() => setMobileOpen(false)}>Contact</Link>

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
      </Portal>
    </nav>
  );
}
