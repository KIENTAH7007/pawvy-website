// Matches the URL slugs the current live pawvy.co site already uses
// (checked via a direct fetch of the live site) — using the same slugs
// here means any existing Google indexing/backlinks to these brand pages
// carry over cleanly once this new site is what pawvy.co actually points
// to, instead of starting from zero.
export const BRAND_SLUGS = {
  'Better Bone': 'betterbone-nylon-free-dog-chew',
  'East Sea Brother': 'eastsea-brother',
  'Lillidale': 'lillidale-natural-pet-supplement',
  'Puzzle Feeder': 'puzzle-feeder-slow-feeder-dog-bowl',
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
