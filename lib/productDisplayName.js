import { displayBrandName } from './brandSlugs';

// Customer-facing product display name — strips the internal SKU code
// and redundant brand name out of `item_series` for display, WITHOUT
// touching the underlying data anywhere. item_series stays exactly as
// stored (SKU code and all) everywhere else in the system — POS, Portal,
// Sales Ledger, Invoices, and critically GiGwi's CategoryBrowser, which
// matches every one of its 100+ cards by searching for the bare SKU
// number inside item_series (see matchByPrefix in CategoryBrowser.jsx).
// Renaming the stored field would break that matching outright. This
// module only ever runs on already-fetched product data, for display.
//
// Validated (Aug 2026) against the real seed catalog — all 217 SKUs
// across all 6 brands — before this was wired into any page. See the SEO
// assessment thread for the full before/after sample. Two known rough
// edges in the source data itself (SKUs 7519 "GiGwi with Silvervine
// Ring" and 7527 "GiGwi with Leatherette" — missing a product-line name
// before "with"), not something this function can fix since the words
// just aren't there to keep.

const BRAND_NAME_ALIASES = {
  'Better Bone': ['better bone'],
  'East Sea Brother': ['east sea brother'],
  'GiGwi': ['gigwi', 'gigiw'], // 'gigiw' is a real recurring typo in the source data
  'Lillidale': ['lillidale'],
  'Puzzle Feeder': [],          // sub-lines (Puzzle Digger, Puzzle Lick Bowl, etc.) are real product names, not brand-name redundancy — nothing to strip
  'Salmoil': ['salmoil'],
};

// A leading token counts as an internal SKU code if it's purely numeric
// (GiGwi's format), alphanumeric with a digit (Better Bone/Lillidale/
// Salmoil's format), or a hyphenated code prefix (East Sea Brother/
// Puzzle Feeder's format, e.g. "EFDF-C125", "PD-P001").
function looksLikeSkuCode(token) {
  return /^\d+$/.test(token) || (/\d/.test(token) && /[A-Za-z]/.test(token)) || /^[A-Z]+-/.test(token);
}

function stripBrandAlias(text, brandName) {
  let result = text;
  for (const alias of (BRAND_NAME_ALIASES[brandName] || [])) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`\\b${escaped}\\b`, 'i'), '');
  }
  return result.replace(/\s+/g, ' ').trim();
}

// Returns the clean, customer-facing product name for use in <h1>,
// Shop-grid card titles, and image alt text. Does NOT include the brand
// name (the brand is already shown separately as its own tag/chip on
// every card and product page) — see productTitleTag() below for the
// version that DOES include the brand, for <title> tags specifically.
export function productDisplayName(product) {
  const { item_series, variation, brand_name } = product;
  let tokens = (item_series || '').split(' ');
  if (tokens.length && looksLikeSkuCode(tokens[0])) tokens = tokens.slice(1);
  let line = stripBrandAlias(tokens.join(' ').trim(), brand_name);

  // A pure leftover code (e.g. a stray hyphenated fragment) isn't real
  // words — treat it the same as "nothing readable left".
  if (line && /^[A-Z0-9-]+$/.test(line) && /\d/.test(line)) line = '';

  const hasVariation = variation && variation !== '-';
  if (!line) return hasVariation ? variation : (item_series || '');
  if (hasVariation && !line.toLowerCase().includes(variation.toLowerCase())) {
    return `${line} — ${variation}`;
  }
  return line;
}

// <title> tag version — same clean name, but with the brand prepended.
// Search results and link previews don't show the separate brand-tag
// chip the way the on-page card/H1 does, so the brand name is worth
// keeping here specifically for search relevance.
export function productTitleTag(product) {
  const brand = displayBrandName(product.brand_name);
  const name = productDisplayName(product);
  return `${brand} ${name}`;
}
