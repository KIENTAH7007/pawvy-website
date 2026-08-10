/** @type {import('next').NextConfig} */
const nextConfig = {
  // Product images currently come through as base64 data URLs from the
  // Pawvy App backend (image_data field) — no external image domains to
  // whitelist yet. Revisit if/when images move to a CDN/object storage.
  images: {
    unoptimized: true, // base64 data URLs don't benefit from next/image optimization anyway
  },
  // SEO slug update (Aug 2026): East Sea Brother and GiGwi's brand page
  // slugs changed from bare ('eastsea-brother', 'gigwi') to keyword-rich
  // ones (see lib/brandSlugs.js). These redirects mean anything already
  // tested, bookmarked, or crawled under the old URLs still resolves
  // correctly rather than 404ing — safe to remove once you're confident
  // nothing still points at the old paths (e.g. after a few weeks live).
  async redirects() {
    return [
      { source: '/brands/eastsea-brother', destination: '/brands/eastsea-brother-freeze-dried-dog-treats', permanent: true },
      { source: '/brands/gigwi', destination: '/brands/gigwi-durable-dog-toys', permanent: true },
    ];
  },
};

module.exports = nextConfig;
