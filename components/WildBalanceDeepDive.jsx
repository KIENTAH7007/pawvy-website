import FitCard from './FitCard';
import { findMatches } from '../lib/matching';
import { sortItemsByStock } from './BrandDeepDive';
import CasseroleCalculator from './CasseroleCalculator';
import FreshlyCookedCalculator from './FreshlyCookedCalculator';
import FrozenYoghurtToggle from './FrozenYoghurtToggle';
import ChewRecommender from './ChewRecommender';

// Rebuilt (Aug 2026) to standardize with every other curated brand
// page, per KT/Janice's design review. Previously had its own bespoke
// card markup and matching logic — now uses the exact same real
// <FitCard> component, findMatches/sortItemsByStock utilities, and
// .pf-fit/.pf-fit-head/.pf-fit-grid section structure Lillidale/Puzzle
// Feeder/Salmoil/East Sea Brother already use, reading real matching
// config from deepDive.wbGroups (see lib/brandContent.js) instead of
// deriving groups from description text. This is a data-config
// approach now, not a custom grouping algorithm — same standard shape,
// just needs its own render function (not BrandDeepDive's own generic
// fitCardGroups block) so the feeding calculators and chew
// recommender can be interspersed in the right places, and so the
// Frozen Yoghurt section (not a card grid at all) can render alongside.
function groupByAnchor(groups, anchor) {
  return groups.find(g => g.anchor === anchor);
}

export default function WildBalanceDeepDive({ deepDive, products }) {
  const groups = deepDive.wbGroups || [];
  const casseroles = groupByAnchor(groups, 'casseroles');
  const freshlyCooked = groupByAnchor(groups, 'freshly-cooked');
  const naturalChews = groupByAnchor(groups, 'natural-chews');

  const yoghurtProduct = deepDive.yoghurt
    ? findMatches(products, { seriesIncludes: deepDive.yoghurt.seriesIncludes })[0] || null
    : null;

  return (
    <>
      {casseroles && (
        <section className="pf-fit lil-fit-group" id={casseroles.anchor}>
          <div className="wrap">
            <div className="pf-fit-head">
              <div className="eyebrow center">{casseroles.eyebrow}</div>
              <h2>{casseroles.heading}</h2>
              <p>{casseroles.sub}</p>
            </div>
            <div className="pf-fit-grid">
              {sortItemsByStock(casseroles.items, products).map(item => (
                <FitCard item={item} products={products} key={item.name} />
              ))}
            </div>
            <CasseroleCalculator products={products} />
          </div>
        </section>
      )}

      {freshlyCooked && (
        <section className="pf-fit lil-fit-group alt" id={freshlyCooked.anchor}>
          <div className="wrap">
            <div className="pf-fit-head">
              <div className="eyebrow center">{freshlyCooked.eyebrow}</div>
              <h2>{freshlyCooked.heading}</h2>
              <p>{freshlyCooked.sub}</p>
            </div>
            <div className="pf-fit-grid">
              {sortItemsByStock(freshlyCooked.items, products).map(item => (
                <FitCard item={item} products={products} key={item.name} />
              ))}
            </div>
            <FreshlyCookedCalculator products={products} />
          </div>
        </section>
      )}

      {yoghurtProduct && (
        <section className="pf-fit lil-fit-group">
          <div className="wrap">
            <div className="pf-fit-head">
              <div className="eyebrow center">Frozen Yoghurt</div>
              <h2>One treat, two ways to serve</h2>
            </div>
            <FrozenYoghurtToggle product={yoghurtProduct} />
          </div>
        </section>
      )}

      {naturalChews && (
        <section className="pf-fit lil-fit-group alt" id={naturalChews.anchor}>
          <div className="wrap">
            <div className="pf-fit-head">
              <div className="eyebrow center">{naturalChews.eyebrow}</div>
              <h2>{naturalChews.heading}</h2>
              <p>{naturalChews.sub}</p>
            </div>
            <ChewRecommender />
            <div className="pf-fit-grid">
              {sortItemsByStock(naturalChews.items, products).map(item => (
                <FitCard item={item} products={products} id={item.chewCardId} key={item.name} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
