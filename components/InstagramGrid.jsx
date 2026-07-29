'use client';

import { useEffect, useRef } from 'react';

// Renders each URL as Instagram's own official embed (the same thing
// Instagram itself gives you from a post's "..." -> Embed option) rather
// than a third-party feed widget. Each post loads live, directly from
// Instagram, whenever the page renders - no separate caching/refresh step,
// and KT controls exactly which posts show by managing the URL list from
// the Pawvy App's Marketing page.
export default function InstagramGrid({ urls }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!urls?.length) return;

    function process() {
      if (window.instgrm?.Embeds) window.instgrm.Embeds.process();
    }

    if (window.instgrm) {
      process();
    } else {
      // Instagram's embed script processes every .instagram-media block
      // present in the DOM once it loads - only need to load it once even
      // if this component re-renders.
      const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
      if (existing) {
        existing.addEventListener('load', process);
      } else {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = process;
        document.body.appendChild(script);
      }
    }
  }, [urls]);

  if (!urls?.length) return null;

  return (
    <div className="ig-embed-grid" ref={containerRef}>
      {urls.map((url) => (
        <blockquote
          key={url}
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ background: '#FFF', border: 0, borderRadius: '20px', margin: 0, width: '100%' }}
        />
      ))}
    </div>
  );
}
