'use client';

// TEMPORARY diagnostic (Aug 2026) — companion to the CSS-only tier
// badge in globals.css. That badge tells us WHICH tier the device
// matches; this shows the EXACT pixel number, so the real breakpoint
// value can be set precisely on the first try rather than guessing
// again. Remove alongside the CSS badge once resolved.
import { useState, useEffect } from 'react';

export default function DebugWidth() {
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (width === null) return null;

  return (
    <div style={{
      position: 'fixed', top: 130, left: '50%', transform: 'translateX(-50%)',
      zIndex: 999, padding: '8px 18px', borderRadius: 8,
      background: '#000', color: '#fff', fontFamily: 'monospace',
      fontSize: 16, fontWeight: 700, pointerEvents: 'none',
    }}>
      window.innerWidth = {width}px
    </div>
  );
}
