'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { BRAND_SLUGS, BRAND_LOGOS } from '../lib/brandSlugs';

// Short, punchy taglines per brand for the gallery cards — same copy
// confirmed in the reviewed mockup. Real per-brand descriptions live on
// each brand's own page.
const TAGLINES = {
  'Better Bone': 'Better for your dog, better for the planet — plant-based, biodegradable chews.',
  'Lillidale': 'UK-formulated care, from waterless shampoo to joint supplements.',
  'Puzzle Feeder': 'Slows the gulp, keeps the mind busy — the slow feeder that truly works.',
  'East Sea Brother': 'Korean-made treats, closely sourced — simple, traceable ingredients.',
  'Salmoil': 'Norwegian-grade omega-3, from real salmon — for coat, joints and heart health.',
  'GiGwi': 'Playful design, durable build — toys made for dogs that play hard.',
};

export default function BrandGallery() {
  const trackRef = useRef(null);

  // Real pointer-driven drag-to-scroll — overflow-x:auto alone only
  // responds to trackpad/shift-scroll, not an actual mouse click-drag.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let isDown = false, startX = 0, scrollStart = 0, moved = false;

    function pointerDown(e) {
      isDown = true; moved = false;
      track.classList.add('dragging');
      startX = e.touches ? e.touches[0].pageX : e.pageX;
      scrollStart = track.scrollLeft;
    }
    function pointerMove(e) {
      if (!isDown) return;
      const x = e.touches ? e.touches[0].pageX : e.pageX;
      const delta = x - startX;
      if (Math.abs(delta) > 4) moved = true;
      track.scrollLeft = scrollStart - delta;
      if (!e.touches) e.preventDefault();
    }
    function pointerUp() { isDown = false; track.classList.remove('dragging'); }
    function clickGuard(e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }

    track.addEventListener('mousedown', pointerDown);
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup', pointerUp);
    track.addEventListener('touchstart', pointerDown, { passive: true });
    track.addEventListener('touchmove', pointerMove, { passive: true });
    track.addEventListener('touchend', pointerUp);
    track.addEventListener('click', clickGuard, true);

    return () => {
      track.removeEventListener('mousedown', pointerDown);
      window.removeEventListener('mousemove', pointerMove);
      window.removeEventListener('mouseup', pointerUp);
      track.removeEventListener('touchstart', pointerDown);
      track.removeEventListener('touchmove', pointerMove);
      track.removeEventListener('touchend', pointerUp);
      track.removeEventListener('click', clickGuard, true);
    };
  }, []);

  // 3D tilt-toward-cursor on each card, desktop only.
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const cards = trackRef.current?.querySelectorAll('.tilt-card') || [];
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
    <div className="gallery-track" ref={trackRef}>
      {Object.entries(BRAND_SLUGS).map(([name, slug]) => (
        <Link key={slug} href={`/brands/${slug}`} className="tilt-card">
          <div className="logostage"><img src={BRAND_LOGOS[name]} alt={name} /></div>
          <p>{TAGLINES[name]}</p>
          <span className="go">
            Shop {name}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
