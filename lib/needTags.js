// Canonical Shop-by-Need categories — must match NEED_TAGS in
// pawvy-app's server/lib/needTags.js exactly (same slugs, same order).
// Icons live in components/NeedIcon.jsx (custom SVG, keyed on slug) —
// not stored here, since some (Enrichment's gradient, Joint's two
// crossing bones) need real markup, not a single character.
export const NEED_CATEGORIES = [
  { slug: 'skin-coat',  label: 'Skin & Coat' },
  { slug: 'chew',       label: 'Chew' },
  { slug: 'enrichment', label: 'Enrichment' },
  { slug: 'gut',        label: 'Gut' },
  { slug: 'food',       label: 'Food' },
  { slug: 'dental',     label: 'Dental' },
  { slug: 'grooming',   label: 'Grooming' },
  { slug: 'joints',     label: 'Joint' },
];

export function needLabel(slug) {
  return NEED_CATEGORIES.find(n => n.slug === slug)?.label || slug;
}
