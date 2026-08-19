// Pure, framework-agnostic matching logic — deliberately in its own file
// with NO 'use client' directive, so both Server Components
// (BrandDeepDive.jsx) and Client Components (ProductAddButton.jsx,
// FitCard.jsx) can import it safely.
//
// This existed only inside ProductAddButton.jsx (a 'use client' file)
// until Aug 2026, when adding the out-of-stock sort to BrandDeepDive.jsx
// (a Server Component) tried to import it from there and broke every
// brand page using fitCards/fitCardGroups (Lillidale, Puzzle Feeder,
// Salmoil, East Sea Brother) with a hard 500 — React's Server/Client
// Component boundary forbids calling ANY function from a 'use client'
// file from server-rendered code, even a plain function with zero
// hooks/state. GiGwi and BetterBone were unaffected only because
// GiGwi's CategoryBrowser.jsx is itself a Client Component with its own
// local copy of this logic, and BetterBone never calls this code path
// at all (it uses a fixed durability-level selector, not a product
// grid). Moving the function here — outside any 'use client' boundary —
// is the actual fix, not a workaround: one real source of truth,
// importable from anywhere.
export function findMatches(products, { seriesIncludes, seriesExcludes = [], variationIncludes, variationIncludesAny }) {
  const seriesTerms = Array.isArray(seriesIncludes) ? seriesIncludes : [seriesIncludes];
  const variationTerms = variationIncludesAny || (variationIncludes ? [variationIncludes] : null);
  const lower = s => (s || '').toLowerCase();
  return products.filter(p => {
    // Which field holds the descriptive fish/product name isn't
    // consistent across brands — Puzzle Feeder/BetterBone put it in
    // item_series (e.g. "PF-G001 Puzzle Feeder"), Eastsea Brother puts
    // just the SKU code there ("EFDF-P125") and the real name in
    // variation ("FD Pollack 125g") instead. Checking both combined
    // avoids needing to know which convention a given brand uses.
    const combined = `${lower(p.item_series)} ${lower(p.variation)}`;
    const variation = lower(p.variation);
    if (!seriesTerms.some(t => combined.includes(lower(t)))) return false;
    if (seriesExcludes.some(x => combined.includes(lower(x)))) return false;
    // variationIncludesAny: match if ANY of the given terms appear — used
    // to hedge against a size being written slightly differently than
    // expected in the real data (e.g. "2kg" vs "2 kg" vs "2000g") without
    // needing a confirmed screenshot for every possible format.
    if (variationTerms && !variationTerms.some(t => variation.includes(lower(t)))) return false;
    return true;
  });
}

// Picks which real product a card's click-through (Aug 2026 — "click the
// card anywhere except Add to Cart" per KT/customer feedback) should link
// to, when the card actually represents several real variant rows (a
// durability level or a fit-card grouping can match more than one real
// product — different sizes/flavors of the same line). Deliberately
// separate from ProductAddButton's own internal default-selection logic
// rather than sharing it — that component's logic is already tested and
// in production; duplicating this small piece here means adding card
// click-through can't accidentally change what Add to Cart itself does.
// Same preference order either way: prefer in stock, first match order
// as the tiebreak/fallback.
export function pickPrimaryMatch(matches) {
  if (!matches || matches.length === 0) return null;
  return matches.find(p => p.stock_status !== 'out_of_stock') || matches[0];
}
