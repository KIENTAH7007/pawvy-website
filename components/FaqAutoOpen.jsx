'use client';

import { useEffect } from 'react';

// Native <details> elements don't auto-open just because the URL hash
// points at them. Visibility itself is guaranteed by a CSS :target rule
// (see .faq-item:target in globals.css) regardless of whether this runs —
// that's the reliable part, since :target is native browser behavior with
// no timing dependency. This component is a secondary, best-effort layer:
// it sets the real `open` attribute so the FAQ item is also semantically
// (and accessibly) marked open, not just visually forced open by CSS, and
// so it stays open if the person later navigates within the same page.
// Scrolling is left to next/link's own built-in scroll-to-hash behavior.
export default function FaqAutoOpen() {
  useEffect(() => {
    function openFromHash() {
      const hash = window.location.hash?.slice(1);
      if (!hash) return true;
      const el = document.getElementById(hash);
      if (!el || el.tagName !== 'DETAILS') return false;
      el.open = true;
      return true;
    }

    if (openFromHash()) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (openFromHash() || attempts >= 6) clearInterval(interval);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return null;
}


