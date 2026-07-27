'use client';

import React, { useEffect, useRef } from 'react';

const WORDS = ['nourish', 'heal', 'clean', 'restore'];

export default function Typewriter() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let wi = 0, ci = 0, deleting = false, timer;

    function tick() {
      const word = WORDS[wi];
      if (!deleting) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; timer = setTimeout(tick, 2200); return; }
        timer = setTimeout(tick, 115);
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % WORDS.length; timer = setTimeout(tick, 450); return; }
        timer = setTimeout(tick, 55);
      }
    }
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="type-line">
      <span ref={ref} />
      <span className="typewriter-caret">&nbsp;</span>
    </span>
  );
}
