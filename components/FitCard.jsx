'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductAddButton, { findMatches } from './ProductAddButton';
import { pickPrimaryMatch } from '../lib/matching';

// Local copy of the same tiny helper used in BrandDeepDive.jsx and
// RecipeSelector.jsx — not worth importing across files for six lines,
// matches the existing convention already in this codebase (each of
// those two already has its own copy rather than sharing one).
function ImageSlot({ image, alt, hint, className }) {
  if (image) return <img src={image} alt={alt} className={className} />;
  return (
    <div className={`${className} img-placeholder`}>
      <span>{hint}</span>
    </div>
  );
}

// One "Find the one" product card, with hover-to-preview on the color
// swatches — hovering a dot swaps the card's photo to that variant's
// image (same photo data already used by the Add to Cart modal's
// pill-swap, nothing new needed there), reverting to the default
// variant on mouse-leave. Click-through to Add to Cart still opens the
// same variant-picker modal as before, unchanged.
//
// This has to be its own client component (needs hover state) since
// the rest of the page renders server-side — see the comment on the
// FitCard import in components/BrandDeepDive.jsx. Exact same classNames
// and DOM structure as before this feature existed, just wrapped with
// state, so no layout/CSS changes were needed alongside this.
//
// halfPack (new): a variant flagged `halfPack: true` renders as a
// half-filled circle (solid color on one side, the card's own cream
// background showing through the other, via a hard-stop CSS gradient)
// instead of a plain solid dot — KT's Option B for visually
// distinguishing a "half" size (e.g. Pollack 60g) from the full size
// (125g) sharing the same base color, rather than the two looking
// identical. No new shape/asset needed, and it still shows the
// variant's real color, just half of it.
export default function FitCard({ item, products }) {
  const defaultIndex = Math.max(item.variants.findIndex(v => v.default), 0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const activeIndex = hoverIndex ?? defaultIndex;
  const active = item.variants[activeIndex];

  // Same "is any variant of this card currently new" check used for GiGwi's
  // grouped cards in CategoryBrowser.jsx — reuses the exact same matching
  // logic ProductAddButton already uses to find the real product behind
  // each variant (via the shared findMatches export), so this can never
  // drift out of sync with what Add to Cart actually finds.
  const isNew = item.variants.some(v => {
    const matches = findMatches(products, {
      seriesIncludes: v.seriesIncludes, seriesExcludes: v.seriesExcludes,
      variationIncludes: v.variationIncludes, variationIncludesAny: v.variationIncludesAny,
    });
    return matches.some(m => m.is_new_active);
  });

  // Click-through target (Aug 2026, per customer feedback) — whichever
  // variant is currently shown (default, or hovered swatch), so clicking
  // right after previewing a color takes the customer to that specific
  // variant's page. Falls back through the same matches array
  // ProductAddButton itself would use, same pickPrimaryMatch helper as
  // BrandDeepDive.jsx's other card types.
  const activeMatches = findMatches(products, {
    seriesIncludes: active.seriesIncludesAny || active.seriesIncludes,
    seriesExcludes: active.seriesExcludes,
    variationIncludes: active.variationIncludes,
    variationIncludesAny: active.variationIncludesAny,
  });
  const primary = pickPrimaryMatch(activeMatches);
  // Full sibling set across ALL colors/variants for the PDP switcher —
  // not just the currently-hovered one. Same reasoning as BrandDeepDive's
  // fit cards: pass the already-resolved IDs explicitly rather than
  // making the PDP re-derive them via item_series, which doesn't hold
  // for every brand's data shape.
  const siblingIds = item.variants
    .map(v => findMatches(products, {
      seriesIncludes: v.seriesIncludesAny || v.seriesIncludes,
      seriesExcludes: v.seriesExcludes,
      variationIncludes: v.variationIncludes,
      variationIncludesAny: v.variationIncludesAny,
    })[0])
    .filter(Boolean)
    .map(p => p.id)
    .join(',');

  return (
    <div className="pf-fit-card">
      {isNew && <span className="new-tag">New</span>}
      {primary ? (
        <Link href={`/shop/${primary.id}?siblings=${siblingIds}`} className="pf-fit-card-link">
          <ImageSlot image={active.image} alt={item.name} hint={item.imageHint} className="pf-fit-image" />
          <div className="pf-fit-info" style={{ paddingBottom: 0 }}>
            <h3>{item.name}</h3>
            <div className="fit-for">{item.fitFor}</div>
          </div>
        </Link>
      ) : (
        <>
          <ImageSlot image={active.image} alt={item.name} hint={item.imageHint} className="pf-fit-image" />
          <div className="pf-fit-info" style={{ paddingBottom: 0 }}>
            <h3>{item.name}</h3>
            <div className="fit-for">{item.fitFor}</div>
          </div>
        </>
      )}
      <div className="pf-fit-info" style={{ paddingTop: 0 }}>
        <div className="pf-swatches">
          {item.variants.map((v, i) => (
            <span
              key={v.label}
              className={`pf-swatch${v.halfPack ? ' pf-swatch-half' : ''}`}
              style={v.halfPack
                ? { background: `linear-gradient(90deg, ${v.hex} 50%, transparent 50%)` }
                : { background: v.hex }}
              title={v.halfPack ? `${v.label} (smaller pack)` : v.label}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
          ))}
        </div>
        <ProductAddButton products={products} productLabel={item.name} variants={item.variants} />
      </div>
    </div>
  );
}
