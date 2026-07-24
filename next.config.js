/** @type {import('next').NextConfig} */
const nextConfig = {
  // Product images currently come through as base64 data URLs from the
  // Pawvy App backend (image_data field) — no external image domains to
  // whitelist yet. Revisit if/when images move to a CDN/object storage.
  images: {
    unoptimized: true, // base64 data URLs don't benefit from next/image optimization anyway
  },
};

module.exports = nextConfig;
