'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_SLUGS } from '../lib/brandSlugs';

// Matches the current live site's nav structure exactly (checked via a
// direct fetch of pawvy.co): Home, Shop (with brand dropdown), Stockist,
// Contact (+FAQ), Blog. 'use client' for the dropdown open/close state.
export default function Nav() {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <nav style={{ borderBottom: '1px solid #eee', padding: '14px 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: 'none', color: 'inherit' }}>
          Pawvy
        </Link>

        <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 14 }}>
          <Link href="/" style={navLinkStyle}>Home</Link>

          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link href="/shop" style={navLinkStyle}>Shop ▾</Link>
            {shopOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, background: '#fff',
                border: '1px solid #eee', borderRadius: 8, padding: 8, minWidth: 180,
                boxShadow: '0 4px 12px rgba(0,0,0,.08)', zIndex: 20,
              }}>
                {Object.entries(BRAND_SLUGS).map(([name, slug]) => (
                  <Link
                    key={slug}
                    href={`/brands/${slug}`}
                    style={{ display: 'block', padding: '8px 10px', fontSize: 13, textDecoration: 'none', color: '#333', borderRadius: 4 }}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/stockist" style={navLinkStyle}>Stockist</Link>
          <Link href="/contact" style={navLinkStyle}>Contact</Link>
          <Link href="/blog" style={navLinkStyle}>Blog</Link>
          <Link href="/cart" style={navLinkStyle}>Cart</Link>
        </div>
      </div>
    </nav>
  );
}

const navLinkStyle = { textDecoration: 'none', color: 'inherit' };
