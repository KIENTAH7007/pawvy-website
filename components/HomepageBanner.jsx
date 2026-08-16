'use client';

import { useEffect, useState } from 'react';
import { imageUrl } from '../lib/api';

// Homepage banner CAROUSEL (Aug 2026 rewrite, per KT) — replaces both the
// old single-banner takeover AND the separate generic-text hero section
// that used to sit below it. Content is entirely admin-driven from the
// Pawvy App's Marketing page (image, headline/caption, link, active
// window, and now sort_order for carousel position) — a real update
// should just be filling in that form, not a website deploy.
//
// SEO note, since this replaced a real text-heavy hero: only the FIRST
// banner (by sort_order — index 0 in this array, not whichever slide
// currently happens to be showing) renders its headline as a real <h1>.
// Google reads the server-rendered HTML once, not the live rotation, so
// tying the H1 to "whichever slide is active right now" would be
// meaningless — array position is what actually matters. Every other
// slide's headline is still real, readable text on the page (not
// invisible to Google), just not marked as the page's single most
// important heading, since a page should only have one. Reordering
// banners in the admin automatically moves which one carries the H1 —
// nothing else to remember to update.
//
// If zero banners are currently active, falls back to a plain-text
// heading rather than rendering nothing — a completely empty top of the
// page would mean no H1 exists at all, not just a less specific one.
const AUTO_ADVANCE_MS = 6000;

export default function HomepageBanner({ banners }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [edgeColors, setEdgeColors] = useState({});
  const hasBanners = banners && banners.length > 0;

  // TEST (Aug 2026, per KT) — desktop-only max-width experiment. The
  // banner no longer stretches infinitely wide on very wide monitors;
  // CSS caps it (see .banner-carousel's max-width, only set outside the
  // tablet/mobile media queries) and whatever's beyond that edge shows
  // this computed color instead of a hard-coded navy. If this doesn't
  // read well in practice, reverting is just removing max-width from
  // that one CSS rule and this whole color-detection effect — nothing
  // else depends on it.
  //
  // Samples a thin strip (2% of width) from the LEFT and RIGHT edges of
  // each banner's real desktop image — deliberately the edges, not the
  // whole image, since the edges are literally the part that would sit
  // adjacent to the letterboxed background once max-width kicks in.
  // Requires the backend to send Access-Control-Allow-Origin (confirmed
  // already present via the app-wide cors() middleware) — without it,
  // reading pixel data from a cross-origin image throws a security
  // error, caught below, silently falling back to the CSS default navy.
  useEffect(() => {
    if (!hasBanners) return;
    let cancelled = false;
    banners.forEach((b, i) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (cancelled) return;
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const stripWidth = Math.max(1, Math.round(img.naturalWidth * 0.02));
          const left = ctx.getImageData(0, 0, stripWidth, img.naturalHeight).data;
          const right = ctx.getImageData(img.naturalWidth - stripWidth, 0, stripWidth, img.naturalHeight).data;
          let r = 0, g = 0, bch = 0, count = 0;
          for (const data of [left, right]) {
            for (let p = 0; p < data.length; p += 4) {
              r += data[p]; g += data[p + 1]; bch += data[p + 2]; count++;
            }
          }
          const color = `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(bch / count)})`;
          if (!cancelled) setEdgeColors(prev => ({ ...prev, [i]: color }));
        } catch {
          // Falls back to the default navy background — see .banner-carousel in globals.css
        }
      };
      img.src = imageUrl(b.image);
    });
    return () => { cancelled = true; };
  }, [hasBanners, banners]);

  // Root cause of the "loads scrolled to the old hero position instead of
  // the banner" bug: browsers remember scroll position by raw pixel
  // offset across a reload (history.scrollRestoration defaults to
  // 'auto'), not by what content is actually there. Turning the banner on
  // makes the page taller by inserting content ABOVE everything else — so
  // "the same pixel offset as before" now points to wherever old content
  // happens to sit today, not the top of the page. Two things: stop the
  // browser from trying to restore a remembered offset on this and future
  // loads, and explicitly correct THIS load if a stale offset already got
  // applied before this effect had a chance to run (scroll restoration
  // happens very early, before React hydrates).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (hasBanners && window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, [hasBanners]);

  // Auto-advance, paused on hover/focus — an auto-rotating carousel that
  // can never be paused is a real accessibility problem (WCAG 2.2.2),
  // not just a nicety.
  useEffect(() => {
    if (!hasBanners || banners.length < 2 || paused) return;
    const timer = setInterval(() => {
      setActive(a => (a + 1) % banners.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [hasBanners, banners?.length, paused]);

  if (!hasBanners) {
    return (
      <section className="banner-carousel banner-fallback">
        <div className="wrap">
          <h1>Wellness products that Pawvy is the exclusive distributor of.</h1>
        </div>
      </section>
    );
  }

  return (
    <section
      className="banner-carousel"
      style={edgeColors[active] ? { background: edgeColors[active] } : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {banners.map((b, i) => (
        <a
          key={i}
          href={b.link}
          className={`banner-slide${i === active ? ' active' : ''}`}
          aria-hidden={i !== active}
          tabIndex={i === active ? 0 : -1}
        >
          <picture>
            {b.mobileImage && b.mobileImage !== b.image && (
              <source media="(max-width: 700px)" srcSet={imageUrl(b.mobileImage)} />
            )}
            {b.tabletImage && b.tabletImage !== b.image && (
              <source media="(max-width: 1024px)" srcSet={imageUrl(b.tabletImage)} />
            )}
            <img src={imageUrl(b.image)} alt={b.headline || 'Pawvy'} className="banner-slide-bg" />
          </picture>
          {b.headline && (
            i === 0
              ? <h1 className={`banner-caption${b.showCaption === false ? ' sr-only' : ''}`}>{b.headline}</h1>
              : <p className={`banner-caption${b.showCaption === false ? ' sr-only' : ''}`}>{b.headline}</p>
          )}
        </a>
      ))}

      {banners.length > 1 && (
        <div className="banner-dots" role="tablist" aria-label="Banner slides">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show banner ${i + 1} of ${banners.length}`}
              className={`banner-dot${i === active ? ' active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActive(i); }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
