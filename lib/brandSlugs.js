// Matches the URL slugs the current live pawvy.co site already uses
// (checked via a direct fetch of the live site) — using the same slugs
// here means any existing Google indexing/backlinks to these brand pages
// carry over cleanly once this new site is what pawvy.co actually points
// to, instead of starting from zero.
export const BRAND_SLUGS = {
  'Better Bone': 'betterbone-nylon-free-dog-chew',
  'Lillidale': 'lillidale-natural-pet-supplement',
  'Puzzle Feeder': 'puzzle-feeder-slow-feeder-dog-bowl',
  'East Sea Brother': 'eastsea-brother',
  'Salmoil': 'salmoil-fish-oil-for-dogs',
  'GiGwi': 'gigwi',
};

export function brandSlug(brandName) {
  return BRAND_SLUGS[brandName] || brandName.toLowerCase().replace(/\s+/g, '-');
}

export function brandNameFromSlug(slug) {
  const entry = Object.entries(BRAND_SLUGS).find(([, s]) => s === slug);
  return entry ? entry[0] : null;
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
};
