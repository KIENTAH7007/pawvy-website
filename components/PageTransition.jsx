'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

// Next's App Router swaps page content instantly with no transition of its
// own — the "elegant" feel from the original static mockups came from
// scroll-reveal animations, not page-to-page navigation, which didn't
// exist yet at that stage. This re-creates a lightweight version of that:
// keying the wrapper on the pathname forces React to remount it on every
// navigation, which restarts the CSS fade-in animation below. Deliberately
// simple (opacity + a few px of upward motion, ~350ms) rather than a full
// exit/enter crossfade — that would need either the View Transitions API
// (not yet reliable across browsers for App Router) or a client-side
// animation library synchronizing unmount timing with route changes, which
// is a much bigger change than this specific ask calls for.
export default function PageTransition({ children }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
