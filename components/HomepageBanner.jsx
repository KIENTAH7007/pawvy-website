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
  // Speed (Oct 2026): only the FIRST banner's images download at page load, with
  // high priority, so it appears as fast as possible. The other slides' images
  // are only requested once the first has finished (or after a short fallback
  // wait), and then only the slide about to show next (plus any already shown).
  // Previously every slide's images downloaded at once and competed with the first.
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(() => new Set([0]));
  const hasBanners = banners && banners.length > 0;

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

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    setSeen(prev => (prev.has(active) ? prev : new Set(prev).add(active)));
  }, [active]);

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
          <h1>Official Singapore distributor. Authentic products. Local support.</h1>
        </div>
      </section>
    );
  }

  return (
    <section
      className="banner-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {banners.map((b, i) => {
        const n = banners.length;
        const loadNow = i === 0 || i === active || seen.has(i) || (ready && i === (active + 1) % n);
        return (
        <a
          key={i}
          href={b.link}
          className={`banner-slide${i === active ? ' active' : ''}`}
          aria-hidden={i !== active}
          tabIndex={i === active ? 0 : -1}
        >
          {loadNow && (
            <picture>
              {b.mobileImage && b.mobileImage !== b.image && (
                <source media="(max-width: 700px)" srcSet={imageUrl(b.mobileImage)} />
              )}
              {b.tabletImage && b.tabletImage !== b.image && (
                <source media="(max-width: 1024px)" srcSet={imageUrl(b.tabletImage)} />
              )}
              <img
                src={imageUrl(b.image)} alt={b.headline || 'Pawvy'} className="banner-slide-bg"
                {...(i === 0
                  ? { fetchPriority: 'high', loading: 'eager', onLoad: () => setReady(true) }
                  : { decoding: 'async' })}
              />
            </picture>
          )}
          {b.headline && (
            i === 0
              ? <h1 className={`banner-caption${b.showCaption === false ? ' sr-only' : ''}`}>{b.headline}</h1>
              : <p className={`banner-caption${b.showCaption === false ? ' sr-only' : ''}`}>{b.headline}</p>
          )}
        </a>
        );
      })}

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
