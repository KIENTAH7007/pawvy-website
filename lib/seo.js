// Shared OG/Twitter metadata builder — one place so every page's social
// share preview is built the same way, rather than each page repeating
// the same openGraph/twitter shape. Aug 2026, part of the SEO pass.
//
// images: pass a relative path (e.g. '/og-default.jpg') or a full
// already-resolved absolute URL (e.g. a product photo via
// lib/api.js's imageUrl()) — Next.js resolves relative paths against
// layout.js's metadataBase automatically either way.
//
// Deliberately no JSON-LD Product `offers` (price/availability) here —
// KT's call (Aug 2026): prices/discounts change often enough that a
// stale cached price in Google's search results risked looking
// untrustworthy, or triggering a Google manual review, for a benefit
// (slightly higher click-through) that wasn't worth that risk yet.
// Worth revisiting once the catalog has more price stability.
export function buildOgMeta({ title, description, path, image = '/og-default.jpg' }) {
  return {
    openGraph: {
      title,
      description,
      url: path,
      siteName: 'Pawvy',
      images: [image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// Product JSON-LD — name/description/image/brand only, per the note
// above. Rendered as a <script type="application/ld+json"> tag on the
// product detail page.
export function buildProductJsonLd({ name, description, image, brandName, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    brand: { '@type': 'Brand', name: brandName },
    url,
  };
}

// Organization JSON-LD — site-wide, rendered once in the root layout.
export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Pawvy',
  url: 'https://pawvy.co',
  logo: 'https://pawvy.co/og-default.jpg',
  description: "Singapore's exclusive distributor of natural pet wellness brands.",
};
