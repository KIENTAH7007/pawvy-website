'use client';

import { useEffect } from 'react';

// Native <details> elements don't auto-open just because the URL hash
// points at them (the browser will scroll to the closed summary, but the
// answer stays hidden) — this opens the matching one and scrolls it into
// view. Used so links like "see our sizing guide" from a product page can
// land directly on an expanded, visible answer instead of a closed FAQ
// item the person then has to go hunting for.
//
// Retries for a short window rather than checking once on mount: on
// client-side navigation (next/link, not a full page load), there can be
// a timing gap between this component mounting and the target <details>
// actually being present/ready in the DOM, and a single early check can
// silently miss it. A few retries over ~1.5s covers that without leaving
// anything running indefinitely.
export default function FaqAutoOpen() {
  useEffect(() => {
    function openFromHash() {
      const hash = window.location.hash?.slice(1);
      if (!hash) return true; // nothing to do — stop retrying
      const el = document.getElementById(hash);
      if (!el || el.tagName !== 'DETAILS') return false; // not ready yet
      if (!el.open) {
        el.open = true;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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

