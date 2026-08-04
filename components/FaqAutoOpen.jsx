'use client';

import { useEffect } from 'react';

// Native <details> elements don't auto-open just because the URL hash
// points at them (the browser will scroll to the closed summary, but the
// answer stays hidden) — this opens the matching one and scrolls it into
// view. Used so links like "see our sizing guide" from a product page can
// land directly on an expanded, visible answer instead of a closed FAQ
// item the person then has to go hunting for.
export default function FaqAutoOpen() {
  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el || el.tagName !== 'DETAILS') return;
    el.open = true;
    // Let the answer actually expand before scrolling, so the scroll
    // lands on the fully-opened item rather than where it was mid-animation.
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }, []);

  return null;
}
