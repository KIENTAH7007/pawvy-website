// Canonical Shop-by-Need categories — must match NEED_TAGS in
// pawvy-app's server/lib/needTags.js exactly (same slugs, same order).
// Icons are decorative only, chosen to be broadly recognizable without
// needing icon assets.
export const NEED_CATEGORIES = [
  { slug: 'skin-coat',  label: 'Skin & Coat', icon: '✨' },
  { slug: 'chew',       label: 'Chew',        icon: '🐾' },
  { slug: 'enrichment', label: 'Enrichment',  icon: '🧩' },
  { slug: 'gut',        label: 'Gut',         icon: '🌿' },
  { slug: 'food',       label: 'Food',        icon: '🍖' },
  { slug: 'dental',     label: 'Dental',      icon: '🦷' },
  { slug: 'grooming',   label: 'Grooming',    icon: '🧴' },
  { slug: 'joints',     label: 'Joint',       icon: '🦴' },
];

export function needLabel(slug) {
  return NEED_CATEGORIES.find(n => n.slug === slug)?.label || slug;
}
