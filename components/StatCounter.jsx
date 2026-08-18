'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function StatCounter({ target, suffix = '' }) {
  const ref = useRef(null);
  // Starts at the real target, not 0 — so the number is always correct on
  // first paint (SSR, slow JS, or JS failing entirely never shows "0").
  // The count-up-from-0 effect below only kicks in once this scrolls into
  // view for browsers where the animation actually runs.
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const duration = 1200;
          const start = performance.now();
          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {value}
      {suffix && <span className="plus">{suffix}</span>}
    </span>
  );
}
