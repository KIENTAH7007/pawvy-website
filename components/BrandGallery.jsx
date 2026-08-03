'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { BRAND_SLUGS, BRAND_LOGOS, displayBrandName } from '../lib/brandSlugs';

// Short, punchy taglines per brand for the gallery cards — same copy
// confirmed in the reviewed mockup. Real per-brand descriptions live on
// each brand's own page.
// Per-brand logo size adjustments relative to the shared 60px base
// max-height — some brand marks read visually smaller/larger than others
// at the same pixel height, so these are tuned per-brand rather than
// forcing every logo to an identical box. 1 = unchanged.
const LOGO_SCALE = {
  'Better Bone': 0.9,     // -10%
  'Lillidale': 1.5,       // +50%
  'Puzzle Feeder': 1.2,   // +20%
  'Salmoil': 0.9,         // -10%
  'GiGwi': 1.5,           // +50%
};
const LOGO_BASE_MAX_HEIGHT = 60; // px, matches .tilt-card .logostage img in globals.css

const TAGLINES = {
  'Better Bone': 'Better for your dog, better for the planet — plant-based, ingestible chews.',
  'Lillidale': 'Nutritionist-formulated pet care, from all-natural supplements to hygiene care products.',
  'Puzzle Feeder': 'Slows the gulp, keeps the mind busy — the slow feeder that truly works.',
  'East Sea Brother': 'Human-grade treats, closely sourced — simple, traceable ingredients.',
  'Salmoil': 'Norwegian-grade omega-3, from real salmon — for coat, joints and heart health.',
  'GiGwi': 'Playful design, durable build — toys made for dogs that play hard.',
};

// A static, responsive grid — deliberately not a horizontally-scrolling
// track. The scroll-track approach (drag-to-scroll + centering-when-it-
// fits/left-aligning-when-it-overflows) went through several rounds of
// fixes that each worked on some screen sizes/browsers but not others.
// A grid that simply wraps to more rows on narrow screens sidesteps that
// whole category of bug: there's no scroll position to get right, no
// overflow to detect, nothing to measure — every card is always fully
// visible, on every screen size, guaranteed by ordinary CSS layout rather
// than JS calculating anything.
export default function BrandGallery() {
  const gridRef = useRef(null);

  // 3D tilt-toward-cursor on each card, desktop only. Purely cosmetic and
  // entirely independent of the grid/scroll question above.
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const cards = gridRef.current?.querySelectorAll('.tilt-card') || [];
    function onMove(e) {
      const r = this.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      this.style.transform = `perspective(700px) rotateX(${py * -8}deg) rotateY(${px * 8}deg) translateY(-4px)`;
    }
    function onLeave() { this.style.transform = ''; }
    cards.forEach((c) => { c.addEventListener('mousemove', onMove); c.addEventListener('mouseleave', onLeave); });
    return () => cards.forEach((c) => { c.removeEventListener('mousemove', onMove); c.removeEventListener('mouseleave', onLeave); });
  }, []);

  return (
    <div className="gallery-grid" ref={gridRef}>
      {Object.entries(BRAND_SLUGS).map(([name, slug]) => (
        <Link key={slug} href={`/brands/${slug}`} className="tilt-card">
          <div className="logostage">
            <img
              src={BRAND_LOGOS[name]}
              alt={name}
              style={{ maxHeight: `${LOGO_BASE_MAX_HEIGHT * (LOGO_SCALE[name] || 1)}px` }}
            />
          </div>
          <p>{TAGLINES[name]}</p>
          <span className="go">
            Shop {displayBrandName(name)}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
