// Plain image grid for the homepage Instagram section — each photo is
// uploaded directly by KT via the Pawvy App's Marketing page, stored in
// the Railway Storage Bucket (Aug 2026 — previously base64 straight in
// the database). This replaced an earlier version that rendered
// Instagram's own official embed script (instagram.com/embed.js): that
// showed the full post card (caption, like count, Instagram's own UI),
// not a clean photo grid, and depended on Instagram's embed script
// loading reliably. A plain <img> has neither problem — it looks exactly
// like what's uploaded, loads as fast as any other image on the site,
// and has zero external script dependency.
//
// Each item is { image, link } — `image` is a relative bucket-proxied
// path (e.g. "/api/uploads/instagram/5-...jpg"), prefixed with the
// backend URL via imageUrl() below. `link` always has a value (the
// backend falls back to the Pawvy Instagram profile URL if a specific
// post link wasn't set for that photo — see
// server/routes/publicContent.js in pawvy-app), so a click never
// dead-ends.
import { imageUrl } from '../lib/api';

export default function InstagramGrid({ items }) {
  if (!items?.length) return null;

  return (
    <div className="ig-grid">
      {items.map((item, i) => (
        <a
          key={item.image + i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ig-grid-item"
        >
          <img src={imageUrl(item.image)} alt="" loading="lazy" />
        </a>
      ))}
    </div>
  );
}
