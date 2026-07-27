'use client';

import React, { useEffect, useRef } from 'react';

// Generic infinite auto-scroll marquee. Two confirmed fixes baked in from
// earlier rounds of testing:
// 1. The "empty gap, then jump" bug — a fixed set of items wasn't always
//    wide enough to fill very wide screens, so the loop scrolled into real
//    empty space before wrapping. Fixed by cloning the item set until it's
//    always comfortably wider than the viewport, then duplicating that
//    whole safe set once more for a seamless translateX(-50%) loop.
// 2. Speed staying constant regardless of screen size — duration is
//    calculated from the actual final content width ÷ a fixed px/second,
//    not a flat duration that would move faster on wider screens where
//    more content got cloned in.
export default function Marquee({ children, pxPerSecond = 55, trackClassName = 'marquee-track' }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const originalUnits = Array.from(track.children);
    if (originalUnits.length === 0) return;

    function setup() {
      let guard = 0;
      while (track.scrollWidth < window.innerWidth * 1.3 && guard < 25) {
        originalUnits.forEach((u) => track.appendChild(u.cloneNode(true)));
        guard++;
      }
      const filledSet = Array.from(track.children);
      filledSet.forEach((u) => track.appendChild(u.cloneNode(true)));

      const halfWidth = track.scrollWidth / 2;
      track.style.animationDuration = `${halfWidth / pxPerSecond}s`;
      track.style.animationPlayState = 'running';
    }

    // Measuring text width before the real web font has swapped in (still
    // on the fallback font) can under-measure — wait for fonts.ready so the
    // duplication/duration math uses the real, final metrics.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setup);
    } else {
      setTimeout(setup, 500);
    }
  }, [children, pxPerSecond]);

  return (
    <div ref={trackRef} className={trackClassName} style={{ animationPlayState: 'paused' }}>
      {children}
    </div>
  );
}
