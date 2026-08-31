// Wild Balance product grouping (Aug 2026, updated after KT shared a
// real Products & Pricing screenshot)
//
// First version of this file matched purely on description text, since
// nobody had confirmed real item_series naming and this project has
// been burned before by assuming a field's real value matches an
// assumed spelling (see the "Better Bone" vs "BetterBone" and GiGwi
// SKU-prefix lessons).
//
// That screenshot changed things: it shows the REAL item_series values
// for all 18 live Wild Balance SKUs, and they consistently include the
// category name right in the text — "WCAT280 Wild Balance Casseroles",
// "WFCH200 Wild Balance Freshly Cooked", "WICY110 Wild Balance Ice
// Cream", "WSBT100 Wild Balance Natural Snacks". That's now a
// *confirmed*, real signal — more robust than description matching,
// since it won't break if a description is ever edited or shortened
// later. Matching is OR'd across both item_series and description
// (whichever matches, the product is included) for defense-in-depth —
// no reason to drop the description check now that it's proven to
// work, just no longer solely relying on it.

const CASSEROLE_MARKERS = ['casseroles', 'homemade-style casserole'];
const FRESHLY_COOKED_MARKERS = ['freshly cooked', 'cooked low and slow with 90%'];
const YOGHURT_MARKERS = ['ice cream', 'lactose-free yoghurt'];
const CHEW_MARKERS = ['natural snacks'];
// need_tag 'chew' is a second, independent confirmation for the chews
// group specifically — kept alongside the item_series check as extra
// redundancy, not a replacement for it.

function hasAnyMarker(product, markers) {
  const text = `${product.item_series || ''} ${product.description || ''}`.toLowerCase();
  return markers.some(m => text.includes(m));
}

// Freshly Cooked comes in 2 sizes (200g/400g), each its own real product
// row — confirmed in the real screenshot (e.g. "WFCH200"/"WFCH400" for
// Chicken). Extracts the size from a plain number-plus-"g" pattern in
// item_series/variation combined, rather than an exact string, so it
// isn't thrown off by minor formatting differences.
function derivePackSize(product) {
  const text = `${product.item_series || ''} ${product.variation || ''}`;
  const match = text.match(/(\d{3})\s?g/);
  return match ? parseInt(match[1], 10) : null;
}

// Casserole flavour → key used by the feeding calculator's lookup
// table. Matches against variation text (confirmed real, e.g. "Anchovy,
// Turkey & Apple 280g") first, falling back to description if variation
// is ever missing for some reason.
const CASSEROLE_FLAVOUR_MARKERS = [
  ['anchovy', 'anchovy'],
  ['salmon', 'salmon'],
  ['pork', 'pork'],
  ['beef', 'beef'],
];

function flavourKeyFor(product) {
  const text = `${product.variation || ''} ${product.description || ''}`.toLowerCase();
  const match = CASSEROLE_FLAVOUR_MARKERS.find(([, marker]) => text.includes(marker));
  return match ? match[0] : null;
}

export function groupWildBalanceProducts(products) {
  const casseroles = products.filter(p => hasAnyMarker(p, CASSEROLE_MARKERS))
    .map(p => ({ ...p, flavourKey: flavourKeyFor(p) }))
    .filter(p => p.flavourKey !== null);
  const freshlyCooked = products.filter(p => hasAnyMarker(p, FRESHLY_COOKED_MARKERS))
    .map(p => ({ ...p, packSize: derivePackSize(p) }))
    .filter(p => p.packSize !== null);
  const yoghurt = products.filter(p => hasAnyMarker(p, YOGHURT_MARKERS));
  const chews = products.filter(p => {
    const tags = Array.isArray(p.need_tags) ? p.need_tags : [];
    return hasAnyMarker(p, CHEW_MARKERS) || tags.includes('chew');
  });

  return { casseroles, freshlyCooked, yoghurt, chews };
}
