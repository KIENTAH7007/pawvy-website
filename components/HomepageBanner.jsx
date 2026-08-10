'use client';

import { useEffect } from 'react';
import { imageUrl } from '../lib/api';

// The reusable full-width homepage takeover banner — built for announcing
// a new brand (Wild Balance being the first case this was built for, see
// the Nov 2026 discussion). Content is entirely admin-driven from the
// Pawvy App's Marketing page (image, headline, link, active window) — a
// real launch should just be filling in that form, not a website deploy.
//
// Deliberately simple by design, per KT/Janice: no eyebrow text, no
// headline overlay, no buttons, no close button — just the uploaded image
// at full strength (no dimming scrim), the whole thing one big link to
// wherever "Links to" points in the admin. The design team owns the
// actual visual entirely through the image they hand over; this component
// doesn't add any of its own text or chrome on top of it.
//
// No manual dismiss anymore — this isn't a modal (it doesn't block
// anything below it), and the nav bar above it stays fully usable the
// whole time, so a visitor who doesn't want to click through can just
// scroll or use the nav like normal. The previous version's small close
// button also visually collided with the nav bar's own icons at that
// screen position, which was the actual "stray X in a circle" seen in
// testing — removing it resolves that too, not just simplifies the
// design.
//
// Still a client component — not for any UI state anymore, but for the
// scroll-restoration fix below, which needs to run in the browser.
export default function HomepageBanner({ banner }) {
  // Root cause of the "loads scrolled to the old hero position instead of
  // the banner" bug: browsers remember scroll position by raw pixel
  // offset across a reload (history.scrollRestoration defaults to
  // 'auto'), not by what content is actually there. Turning the banner on
  // makes the page taller by inserting content ABOVE everything else — so
  // "the same pixel offset as before" now points to wherever the hero
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
    if (banner?.active && window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, [banner?.active]);

  if (!banner?.active) return null;

  return (
    <a href={banner.link} className="wb-takeover">
      <img src={imageUrl(banner.image)} alt={banner.headline || 'New at Pawvy'} className="wb-takeover-bg" />
    </a>
  );
}
