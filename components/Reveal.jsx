'use client';

import React, { useEffect, useRef, useState } from 'react';

// Generic scroll-reveal wrapper — wrap any block in <Reveal> and it fades/
// slides up once scrolled into view. `stagger` renders as a `.reveal-stagger`
// container instead, which staggers its direct children via CSS
// transition-delay (see globals.css) rather than needing individual
// <Reveal> wrappers per child.
export default function Reveal({ children, as: Tag = 'div', stagger = false, className = '', style, ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = stagger ? 'reveal-stagger' : 'reveal';
  return (
    <Tag ref={ref} className={`${base}${inView ? ' reveal-in' : ''} ${className}`.trim()} style={style} {...rest}>
      {children}
    </Tag>
  );
}
