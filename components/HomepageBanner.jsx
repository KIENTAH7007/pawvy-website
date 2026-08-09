'use client';

import { useState, useEffect } from 'react';

// The reusable full-width homepage takeover banner — built for announcing
// a new brand (Wild Balance being the first case this was built for, see
// the Nov 2026 discussion). Content is entirely admin-driven from the
// Pawvy App's Marketing page (image, headline, link, active window) — a
// real launch should just be filling in that form, not a website deploy.
//
// Deliberately uses Pawvy's own navy/orange/cream palette rather than
// anything brand-specific (like Wild Balance's own green), since this same
// component needs to work for whichever brand launches next, not just the
// first one it was built for.
//
// Client component (needs the close-button state) — the rest of the
// homepage renders server-side; see the fetch + conditional render in
// app/page.js. Closing is per-page-view only (plain component state, no
// persistence) — reopens on a fresh page load, which is fine for a launch
// banner that's meant to be seen, not permanently dismissed like a cookie
// notice.
export default function HomepageBanner({ banner }) {
  const [closed, setClosed] = useState(false);

  // Root cause of the "loads scrolled to the old hero position instead of
  // the banner" bug: browsers remember scroll position by raw pixel
  // offset across a reload (history.scrollRestoration defaults to
  // 'auto'), not by what content is actually there. Turning the banner on
  // makes the page taller by inserting content ABOVE everything else — so
  // "the same pixel offset as before" now points to wherever the hero
  // happens to sit today, not the top of the page. This is a real browser
  // behavior, not something specific to this component, but it only ever
  // shows up when page height changes between visits, which is exactly
  // what toggling this banner does. Two things: stop the browser from
  // trying to restore a remembered offset on this and future loads, and
  // explicitly correct THIS load if a stale offset already got applied
  // before this effect had a chance to run (scroll restoration happens
  // very early, before React hydrates).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (banner?.active && window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, [banner?.active]);

  if (!banner?.active || closed) return null;

  return (
    <section className="wb-takeover">
      <img src={banner.image} alt="" className="wb-takeover-bg" />
      <div className="wb-takeover-scrim" />

      <button className="wb-takeover-close" aria-label="Close" onClick={() => setClosed(true)}>✕</button>

      <div className="wb-takeover-inner">
        <div className="wb-takeover-eyebrow">
          <span className="dot" />
          New at Pawvy
        </div>

        {banner.headline && <h1 className="wb-takeover-headline">{banner.headline}</h1>}

        <div className="wb-takeover-actions">
          <a href={banner.link} className="btn btn-orange">
            <span>Discover more →</span>
          </a>
          <button className="btn btn-outline-light" onClick={() => setClosed(true)}>
            <span>Continue to Pawvy.co</span>
          </button>
        </div>
      </div>
    </section>
  );
}
