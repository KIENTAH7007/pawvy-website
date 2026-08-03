'use client';

import React, { useEffect, useState } from 'react';

// Replaces the old auto-scrolling marquee for testimonials — with only 4
// real reviews, the infinite-loop marquee had to duplicate content to fill
// wide screens, which made the repeat obvious almost immediately. A
// paginated carousel shows exactly as many as actually exist, no filler.
//
// 2 cards per page on PC and wide mobile, 1 per page on compact screens
// (<=480px) — matches how much horizontal room a card realistically has
// at each size. Breakpoint tracked via matchMedia so it responds live to
// resizing/rotating, not just on first render.
export default function TestimonialCarousel({ testimonials }) {
  const [perPage, setPerPage] = useState(2);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 480px)');
    function update() {
      setPerPage(mq.matches ? 1 : 2);
      setPage(0);
    }
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const totalPages = Math.max(1, Math.ceil(testimonials.length / perPage));
  const start = page * perPage;
  const visible = testimonials.slice(start, start + perPage);

  function prev() { setPage(p => (p - 1 + totalPages) % totalPages); }
  function next() { setPage(p => (p + 1) % totalPages); }

  return (
    <div className="test-carousel">
      <div className="test-row">
        {visible.map((t, i) => (
          <div className="test-card" key={start + i}>
            <div className="test-photo">
              {t.image ? <img src={t.image} alt={t.who} /> : <span className="test-avatar-fallback">🐾</span>}
            </div>
            <div className="test-body">
              <div className="stars">★★★★★</div>
              <p>"{t.quote}"</p>
              <div className="who">— {t.who}</div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="test-nav">
          <button type="button" onClick={prev} aria-label="Previous reviews" className="test-nav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="test-dots">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span key={i} className={`test-dot${i === page ? ' active' : ''}`} />
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next reviews" className="test-nav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
