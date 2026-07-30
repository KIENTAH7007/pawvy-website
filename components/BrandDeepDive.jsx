// Renders the optional "deep dive" block on a brand page — sits between
// the brand's hero/subhero section and the FAQ. Data-driven off
// content.deepDive in lib/brandContent.js so this scales to other brands
// without touching this file; brands without a deepDive block just don't
// render it (see app/brands/[slug]/page.js).
//
// Section shapes so far:
// - chew / durability: BetterBone's hardness-level pattern. Durability
//   cards combine the lifestyle dog photo AND the product packaging shot
//   in one card (packaging shot as a small inset badge) — Option 1 from
//   the two combined-layout mockups shown to KT.
// - intro / featureSplit / stats / checklist / fitCards: Puzzle Feeder's
//   pattern — not every brand sells "hardness levels", so this is a
//   separate set of shapes for brands where a size/type comparison makes
//   more sense than a durability scale.
//
// Cards that lead into the shop (durability levels, fit cards) are links
// straight into the shop grid below, pre-searched for that item — e.g.
// clicking "Soft" or "Puzzle Feeder Lite" scrolls to #brand-products
// already filtered (see ShopClient's `q` param handling). The existing
// hover state on the card doubles as the click affordance, per KT's
// request to make that hover feel "selectable".
//
// Image slots: every section takes either a real `image` path or falls
// back to a dashed placeholder box showing `imageHint`, so this still
// degrades gracefully if a future brand's data is filled in without
// photos yet.
import Link from 'next/link';
import { Fragment } from 'react';

function ImageSlot({ image, alt, hint, className }) {
  if (image) return <img src={image} alt={alt} className={className} />;
  return (
    <div className={`${className} img-placeholder`}>
      <span>{hint}</span>
    </div>
  );
}

function BiteMeter({ level }) {
  return (
    <div className="bite-meter" aria-hidden="true">
      {[1, 2, 3].map(n => (
        <span key={n} className={n <= level ? 'dot filled' : 'dot'} />
      ))}
    </div>
  );
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
);
const VetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-6.5-4.35-9-8.5C1 8.5 3 5 6.5 5c2 0 3.5 1.5 5.5 4 2-2.5 3.5-4 5.5-4C21 5 23 8.5 21 12.5c-2.5 4.15-9 8.5-9 8.5z" /></svg>
);

export default function BrandDeepDive({ deepDive, brandDisplayName }) {
  if (!deepDive) return null;
  const { chew, durability, intro, featureSplit, stats, checklist, fitCards } = deepDive;

  return (
    <>
      {chew && (
        <section className="chew-feature">
          <div className="wrap">
            <div className="chew-feature-head">
              <h2>{chew.heading}</h2>
              <p>{chew.intro}</p>
            </div>
            <div className="chew-feature-grid">
              <div className="chew-feature-copy">
                <p>{chew.body}</p>
                <div className="chew-feature-divider" />
              </div>
              <ImageSlot image={chew.image} alt={chew.heading} hint={chew.imageHint} className="chew-feature-image" />
            </div>
          </div>
        </section>
      )}

      {durability && (
        <section className="durability">
          <div className="wrap">
            <div className="durability-head">
              <div className="eyebrow center">{durability.eyebrow}</div>
              <h2>{durability.heading}</h2>
              <p>{durability.sub}</p>
            </div>
            <div className="durability-grid">
              {durability.levels.map(lvl => (
                <Link
                  href={`?q=${encodeURIComponent(lvl.label)}#brand-products`}
                  className="durability-card"
                  key={lvl.label}
                  aria-label={`Shop BetterBone ${lvl.label} chews`}
                >
                  <div className="durability-image-wrap">
                    <ImageSlot image={lvl.image} alt={lvl.label} hint={lvl.imageHint} className="durability-image" />
                    <div className="durability-product-badge">
                      <ImageSlot image={lvl.productImage} alt={lvl.productName} hint={lvl.productImageHint || `${lvl.label} pack`} className="durability-product-badge-img" />
                    </div>
                  </div>
                  <div className="durability-info">
                    <div className="durability-label-row">
                      <span className="durability-label">{lvl.label}</span>
                      <BiteMeter level={lvl.level} />
                    </div>
                    <p className="durability-caption">{lvl.caption}</p>
                    {lvl.productName && (
                      <div className="product-divider">
                        <p className="product-name">{lvl.productName}</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {intro && (
        <section className="feature-intro">
          <div className="wrap feature-intro-grid">
            <div className="feature-intro-copy">
              <div className="eyebrow">{intro.eyebrow}</div>
              <h2>{intro.heading.split('\n').map((line, i) => <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>)}</h2>
              <p>{intro.body}</p>
            </div>
            <ImageSlot image={intro.image} alt={intro.heading} hint={intro.imageHint} className="feature-intro-image" />
          </div>
        </section>
      )}

      {featureSplit && (
        <section className="feature-split">
          <div className={`wrap feature-split-grid${featureSplit.imagePosition === 'left' ? ' img-left' : ''}`}>
            <ImageSlot image={featureSplit.image} alt={featureSplit.heading} hint={featureSplit.imageHint} className="feature-split-image" />
            <div className="feature-split-copy">
              <div className="eyebrow">{featureSplit.eyebrow}</div>
              <h2>{featureSplit.heading}</h2>
              {featureSplit.body.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </div>
        </section>
      )}

      {stats && stats.length > 0 && (
        <section className="pf-stats">
          <div className="wrap pf-stats-grid">
            {stats.map(s => (
              <div key={s.label}>
                <div className="pf-stat-num">{s.num}</div>
                <div className="pf-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {checklist && (
        <section className="pf-checklist">
          <div className="wrap pf-checklist-grid">
            <div className="pf-checklist-copy">
              <div className="eyebrow">{checklist.eyebrow}</div>
              <h2>{checklist.heading}</h2>
              {checklist.items.map(item => (
                <div className="pf-check-item" key={item}>
                  <div className="pf-check-icon"><CheckIcon /></div>{item}
                </div>
              ))}
            </div>
            <div className="pf-vet-badge">
              <div className="pf-vet-icon"><VetIcon /></div>
              <h3>{checklist.badgeHeading}</h3>
              <p>{checklist.badgeBody}</p>
            </div>
          </div>
        </section>
      )}

      {fitCards && (
        <section className="pf-fit">
          <div className="wrap">
            <div className="pf-fit-head">
              <div className="eyebrow center">{fitCards.eyebrow}</div>
              <h2>{fitCards.heading}</h2>
              <p>{fitCards.sub}</p>
            </div>
            <div className="pf-fit-grid">
              {fitCards.items.map(item => (
                <Link
                  href={`?q=${encodeURIComponent(item.name)}#brand-products`}
                  className="pf-fit-card"
                  key={item.name}
                  aria-label={`Shop ${item.name}`}
                >
                  <ImageSlot image={item.image} alt={item.name} hint={item.imageHint} className="pf-fit-image" />
                  <div className="pf-fit-info">
                    <h3>{item.name}</h3>
                    <div className="fit-for">{item.fitFor}</div>
                    {item.colors && (
                      <div className="pf-swatches">
                        {item.colors.map(c => <span key={c} className="pf-swatch" style={{ background: c }} />)}
                      </div>
                    )}
                    {item.tags && (
                      <div className="pf-tags">
                        {item.tags.map(t => <span key={t} className="pf-tag">{t}</span>)}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
