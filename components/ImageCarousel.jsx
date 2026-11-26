'use client';

// Multiple product photos (Nov 2026, per KT/Janice).
//
// Two pieces share one small swipe/arrow hook:
//   <ImageCarousel>  — for Shop cards and grouped brand cards. Arrow buttons
//                      (desktop), swipe (phones), dots underneath. No hover
//                      behaviour and no auto-rotation: it only moves when the
//                      visitor clicks an arrow or swipes.
//   <ProductGallery> — for the product page. Big photo + thumbnails + arrows
//                      + swipe. Tapping a thumbnail shows that photo.
//
// With ONE photo (or none) both render exactly what the page showed before,
// so products without extra photos look and behave as they always did.
import React, { useState, useRef, useCallback } from 'react';

function useSlider(count) {
  const [idx, setIdx] = useState(0);
  const touch = useRef(null);
  const swiped = useRef(false);

  const go = useCallback((n) => setIdx(i => ((n(i) % count) + count) % count), [count]);
  const preload = (urls, i) => { try { const u = urls[(i + 1) % urls.length]; if (u) { const im = new Image(); im.src = u; } } catch { /* ignore */ } };

  const handlers = (urls) => ({
    onTouchStart: (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY }; preload(urls, idx); },
    onTouchEnd: (e) => {
      const s = touch.current; touch.current = null;
      if (!s) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - s.x, dy = t.clientY - s.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        go(i => (dx < 0 ? i + 1 : i - 1));
        swiped.current = true;
        setTimeout(() => { swiped.current = false; }, 400);
      }
    },
    // A swipe that starts on a card must not also open the product link.
    onClickCapture: (e) => { if (swiped.current) { e.preventDefault(); e.stopPropagation(); } },
  });
  return { idx, setIdx, go, handlers, preload };
}

const Chevron = ({ dir }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
  </svg>
);

// images: full URLs. children: what to show when there is nothing to flip through.
// imgClassName / imgStyle: applied to the <img> so it matches the original markup.
export default function ImageCarousel({ images, alt, imgClassName, imgStyle, children }) {
  const list = (images || []).filter(Boolean);
  const { idx, go, handlers, preload } = useSlider(Math.max(list.length, 1));
  if (list.length < 2) return children || null;

  const stop = (e, fn) => { e.preventDefault(); e.stopPropagation(); preload(list, idx); fn(); };
  return (
    <div className="img-carousel" {...handlers(list)}>
      <img src={list[idx]} alt={alt} className={imgClassName} style={imgStyle} loading="lazy" decoding="async" draggable={false} />
      <button type="button" className="img-carousel-arrow prev" aria-label="Previous photo" onClick={e => stop(e, () => go(i => i - 1))}><Chevron dir="left" /></button>
      <button type="button" className="img-carousel-arrow next" aria-label="Next photo" onClick={e => stop(e, () => go(i => i + 1))}><Chevron dir="right" /></button>
      <div className="img-carousel-dots" aria-hidden="true">
        {list.map((_, i) => <span key={i} className={i === idx ? 'on' : ''} />)}
      </div>
    </div>
  );
}

// Product page gallery. images: [{ full, thumb }]
export function ProductGallery({ images, alt }) {
  const list = (images || []).filter(im => im && im.full);
  const { idx, setIdx, go, handlers, preload } = useSlider(Math.max(list.length, 1));
  if (!list.length) return <div className="product-detail-image"><span>No image</span></div>;
  if (list.length === 1) return <div className="product-detail-image"><img src={list[0].full} alt={alt} /></div>;

  const fulls = list.map(l => l.full);
  return (
    <div className="product-detail-gallery">
      <div className="product-detail-image has-gallery" {...handlers(fulls)}>
        <img src={list[idx].full} alt={`${alt} — photo ${idx + 1} of ${list.length}`} draggable={false} />
        <button type="button" className="img-carousel-arrow prev" aria-label="Previous photo" onClick={() => { preload(fulls, idx); go(i => i - 1); }}><Chevron dir="left" /></button>
        <button type="button" className="img-carousel-arrow next" aria-label="Next photo" onClick={() => { preload(fulls, idx); go(i => i + 1); }}><Chevron dir="right" /></button>
      </div>
      <div className="product-detail-thumbs" role="tablist" aria-label="Product photos">
        {list.map((im, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === idx} aria-label={`Show photo ${i + 1}`}
            className={i === idx ? 'on' : ''}
            onClick={() => setIdx(i)}
            onMouseEnter={() => { try { const p = new Image(); p.src = im.full; } catch { /* ignore */ } }}>
            <img src={im.thumb || im.full} alt="" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  );
}
