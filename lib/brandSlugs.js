// Matches the URL slugs the current live pawvy.co site already uses
// (checked via a direct fetch of the live site) — using the same slugs
// here means any existing Google indexing/backlinks to these brand pages
// carry over cleanly once this new site is what pawvy.co actually points
// to, instead of starting from zero.
export const BRAND_SLUGS = {
  'Better Bone': 'betterbone-nylon-free-dog-chew',
  'Lillidale': 'lillidale-natural-pet-supplement',
  'Puzzle Feeder': 'puzzle-feeder-slow-feeder-dog-bowl',
  'East Sea Brother': 'eastsea-brother-freeze-dried-dog-treats',
  'Salmoil': 'salmoil-fish-oil-for-dogs',
  'GiGwi': 'gigwi-durable-dog-toys',
  // New brand (Aug 2026) — no legacy live-site URL to preserve, so this
  // is a fresh, SEO-friendly slug following the same descriptive
  // pattern as the others.
  'Wild Balance': 'wild-balance-natural-dog-food',
};

export function brandSlug(brandName) {
  return BRAND_SLUGS[brandName] || brandName.toLowerCase().replace(/\s+/g, '-');
}

export function brandNameFromSlug(slug) {
  const entry = Object.entries(BRAND_SLUGS).find(([, s]) => s === slug);
  return entry ? entry[0] : null;
}

// The backend/database and all the lookup keys above use "Better Bone"
// and "East Sea Brother" (with spaces) — that has to stay exactly as-is,
// since it's what product filtering, brand routing, and API matching all
// key off of. The approved marketing spelling for anything actually shown
// to a visitor is "BetterBone" and "Eastsea Brother" instead. This maps
// the backend/lookup form to the marketing form for display only — never
// use the output of this function as a lookup key, filter value, or in a
// URL/slug.
const BRAND_DISPLAY_NAMES = {
  'Better Bone': 'BetterBone',
  'East Sea Brother': 'Eastsea Brother',
};

export function displayBrandName(name) {
  return BRAND_DISPLAY_NAMES[name] || name;
}

// Static brand mark assets — logos are fixed brand assets, not something
// that needs to live in the product database. Keyed by the same display
// names used in BRAND_SLUGS above, so anywhere that already has a brand
// name can look up its logo the same way.
export const BRAND_LOGOS = {
  'Better Bone': '/brand-logos/betterbone.png',
  'Lillidale': '/brand-logos/lillidale.png',
  'Puzzle Feeder': '/brand-logos/puzzle.png',
  'East Sea Brother': '/brand-logos/eastsea.png',
  'Salmoil': '/brand-logos/salmoil.png',
  'GiGwi': '/brand-logos/gigwi.png',
  'Wild Balance': '/brand-logos/wildbalance.png',
};

// Per-brand subhero background photos (KT-provided, one per brand — see
// app/brands/[slug]/page.js). Same 18% opacity treatment as the homepage
// hero, sitting behind the morphing blobs.
export const BRAND_HERO_PHOTOS = {
  'Better Bone': '/brand-heroes/betterbone-hero.jpg',
  'Lillidale': '/brand-heroes/lillidale-hero.jpg',
  'Puzzle Feeder': '/brand-heroes/puzzle-feeder-hero.jpg',
  'East Sea Brother': '/brand-heroes/eastsea-brother-hero.jpg',
  'Salmoil': '/brand-heroes/salmoil-hero.jpg',
  'GiGwi': '/brand-heroes/gigwi-hero.jpg',
  'Wild Balance': '/brand-heroes/wild-balance-hero.jpg',
};
