/** @type {import('next').NextConfig} */
const nextConfig = {
  // Product images (Aug 2026 update): now real files served from a
  // Railway Storage Bucket, proxied through the Pawvy App backend
  // (/api/uploads/...) rather than base64 data URLs — see
  // server/lib/bucket.js and server/routes/uploads.js in pawvy-app, and
  // lib/api.js's imageUrl() helper here. Still using plain <img> tags
  // everywhere rather than next/image for this delivery — deliberately
  // conservative, since converting to next/image needs known dimensions
  // or a sized `fill` container per usage site, and getting that wrong
  // risks a layout bug I can't verify without a running browser. Real
  // URLs are already the big win (no more giant base64 in every page/API
  // response); next/image's automatic resizing/WebP conversion is a
  // worthwhile follow-up once each usage site's layout is reviewed one
  // at a time, not a change to rush through in this same pass.
  images: {
    unoptimized: true,
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
