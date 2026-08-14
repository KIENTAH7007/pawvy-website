'use client';

import React, { useEffect, useRef } from 'react';

// Ported from the original static v3 mockup, revised Aug 2026 after
// customer feedback that the ring's deliberate lag behind the mouse
// ("chasing the dot") read as the site itself being laggy — confirmed
// that was the actual design (a lerp/easing loop, not a real
// performance issue) before changing anything. This is Option 4 from
// the mockups KT reviewed ("Magnetic hover"): both dot and ring now
// track the mouse instantly, 1:1, no interpolation loop at all — the
// "special" feel now comes entirely from the ring's expand-and-glow
// reaction on hover (see #cursor-ring.hover in globals.css, unchanged),
// not from a constant chasing motion.
//
// Desktop/fine-pointer only (touch devices get no custom cursor, and the
// real system cursor stays visible for them) — checked via matchMedia,
// not just CSS, so the mouse listeners themselves never attach on touch
// devices either.
//
// The ring is deliberately NOT re-queried on every render — it uses a
// MutationObserver once on mount to catch hoverable elements added later
// by client-side navigation (App Router swaps page content without a full
// reload, so a one-time querySelectorAll at mount would miss anything
// rendered after that, e.g. product cards that load once the shop page's
// fetch resolves).
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.body.classList.add('cursor-ready');
    const dot = dotRef.current;
    const ring = ringRef.current;

    function onMove(e) {
      const x = e.clientX, y = e.clientY;
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';
    }
    window.addEventListener('mousemove', onMove);

    const HOVER_SELECTOR = 'a, button, .tilt-card, .product-card, .stockist-card';
    function attach(el) {
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
    }
    function enter() { ring.classList.add('hover'); }
    function leave() { ring.classList.remove('hover'); }

    document.querySelectorAll(HOVER_SELECTOR).forEach(attach);

    // Catch elements added after mount (client-fetched product grids,
    // route changes that don't remount this component since it lives in
    // the root layout above PageTransition).
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          if (node.matches?.(HOVER_SELECTOR)) attach(node);
          node.querySelectorAll?.(HOVER_SELECTOR).forEach(attach);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      document.body.classList.remove('cursor-ready');
    };
  }, []);

  return (
    <>
      <div id="cursor-ring" ref={ringRef} />
      <div id="cursor-dot" ref={dotRef} />
    </>
  );
}
