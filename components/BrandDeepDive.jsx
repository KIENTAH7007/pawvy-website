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
// Both durability cards and fit cards render <ProductAddButton> — Add to
// Cart, with a variant-picker modal when there's more than one real
// option. `products` (the brand's already-fetched product list, same data
// ShopClient renders below) is threaded through from page.js so the
// button never needs its own fetch — see ProductAddButton.jsx for the
// matching logic.
import { Fragment } from 'react';
import ProductAddButton from './ProductAddButton';
import RecipeSelector from './RecipeSelector';
import CategoryBrowser from './CategoryBrowser';

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

export default function BrandDeepDive({ deepDive, brandDisplayName, products }) {
  if (!deepDive) return null;
  const { chew, durability, intro, featureSplit, stats, checklist, fishGroups, fitCards, pillars, beforeAfter, fitCardGroups, selector, categoryIntro, browser } = deepDive;

  return (
    <>
      {/* Invisible scroll target for the hero's "Shop now" button
          (app/brands/[slug]/page.js). Deliberately NOT placed on any of
          the section-specific anchors below (durability/fitCards/etc.) —
          those already carry their own semantic ids that other things
          link to (e.g. Lillidale's pillar nav links to #supplements,
          not #shop), and brands differ in which section shape they use.
          A dedicated zero-height anchor at the very top of the deep-dive
          block, right after the hero, works identically for all 6 brands
          without touching any existing anchor. */}
      <div id="shop" style={{ height: 0 }} aria-hidden="true" />

      {pillars && (
        <section className="lil-pillars">
          <div className="wrap">
            <h2>{pillars.heading}</h2>
            <p className="lil-pillars-sub">{pillars.sub}</p>
            <div className="lil-pillars-grid">
              {pillars.items.map(p => (
                <a className="lil-pillar-card" href={`#${p.anchor}`} key={p.anchor}>
                  <ImageSlot image={p.image} alt={p.heading} hint={p.imageHint} className="lil-pillar-image" />
                  <div className="lil-pillar-body">
                    <h3>{p.heading}</h3>
                    <p>{p.body}</p>
                    <span className="lil-pillar-link">Jump to {p.heading.toLowerCase()} ↓</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {beforeAfter && (
        <section className="lil-before-after">
          <div className="wrap">
            <div className="eyebrow center on-dark">{beforeAfter.eyebrow}</div>
            <h2>{beforeAfter.heading}</h2>
            <p className="lil-ba-sub">{beforeAfter.sub}</p>
            <div className="lil-ba-grid">
              {beforeAfter.items.map(item => (
                <div className="lil-ba-card" key={item.product}>
                  <div className={`lil-ba-split${item.orientation === 'vertical' ? ' vertical' : ''}`}>
                    <div className="lil-ba-half-wrap">
                      <ImageSlot image={item.beforeImage} alt={`${item.product} before`} hint="Before" className="lil-ba-half" />
                      <span className="lil-ba-tag">{item.beforeTag || 'Before'}</span>
                    </div>
                    <div className="lil-ba-half-wrap">
                      <ImageSlot image={item.afterImage} alt={`${item.product} after`} hint="After" className="lil-ba-half" />
                      <span className="lil-ba-tag">{item.afterTag || 'After'}</span>
                    </div>
                  </div>
                  <div className="lil-ba-body">
                    <div className="lil-ba-product">{item.product}</div>
                    <h3>{item.title}</h3>
                    <div className="lil-ba-label">{item.beforeLabel}</div>
                    <div className="lil-ba-label">{item.afterLabel}</div>
                    {item.source && <p className="lil-ba-source">— {item.source}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                <div className="durability-card" key={lvl.label}>
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
                    <ProductAddButton
                      products={products}
                      productLabel={`BetterBone ${lvl.label}`}
                      seriesIncludes={lvl.seriesIncludes}
                      variationIncludes={lvl.variationIncludes}
                    />
                  </div>
                </div>
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
          {intro.values && (
            <div className="wrap intro-value-grid">
              {intro.values.map(v => (
                <div className="intro-value-card" key={v.title}>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </div>
              ))}
            </div>
          )}
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

      {selector && <RecipeSelector selector={selector} />}

      {categoryIntro && (
        <section className="cat-intro">
          <div className="wrap">
            <div className="cat-intro-head">
              <div className="eyebrow center" style={{ color: 'var(--lime, #B4D93C)' }}>{categoryIntro.eyebrow}</div>
              <h2>{categoryIntro.heading}</h2>
              <p>{categoryIntro.sub}</p>
            </div>
            <div className="cat-intro-grid">
              {categoryIntro.items.map(item => (
                <div className="cat-intro-card" key={item.title} style={{ '--accent': item.color }}>
                  <div className="cat-intro-icon"><ImageSlot image={item.image} alt={item.title} hint={item.title} className="cat-intro-icon-img" /></div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {browser && <CategoryBrowser browser={browser} products={products} />}

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

      {fishGroups && (
        <section className="fish-groups">
          <div className="wrap">
            <div className="fish-groups-head">
              <div className="eyebrow center">{fishGroups.eyebrow}</div>
              <h2>{fishGroups.heading}</h2>
              <p>{fishGroups.sub}</p>
            </div>
            <div className="fish-groups-row">
              {fishGroups.groups.map(g => (
                <div className={`fish-group ${g.key}`} key={g.key} style={{ '--fish-group-color': g.color }}>
                  <div className="fish-group-fishrow">
                    {g.fish.map(f => (
                      <div className="fish-group-fish" key={f.name}>
                        <ImageSlot image={f.icon} alt={f.name} hint={f.name} className="fish-group-fish-img" />
                        <div className="fish-group-fish-name">{f.name}</div>
                      </div>
                    ))}
                  </div>
                  <hr className="fish-group-line" />
                  <p>{g.benefit}</p>
                </div>
              ))}
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
                <div className="pf-fit-card" key={item.name}>
                  <ImageSlot image={item.variants[0].image} alt={item.name} hint={item.imageHint} className="pf-fit-image" />
                  <div className="pf-fit-info">
                    <h3>{item.name}</h3>
                    <div className="fit-for">{item.fitFor}</div>
                    <div className="pf-swatches">
                      {item.variants.map(v => <span key={v.label} className="pf-swatch" style={{ background: v.hex }} title={v.label} />)}
                    </div>
                    <ProductAddButton products={products} productLabel={item.name} variants={item.variants} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {fitCardGroups && fitCardGroups.map(group => (
        <section className={`pf-fit lil-fit-group${group.alt ? ' alt' : ''}`} id={group.anchor} key={group.anchor}>
          <div className="wrap">
            <div className="pf-fit-head">
              <div className="eyebrow center">{group.eyebrow}</div>
              <h2>{group.heading}</h2>
              <p>{group.sub}</p>
            </div>
            <div className="pf-fit-grid">
              {group.items.map(item => (
                <div className="pf-fit-card" key={item.name}>
                  <ImageSlot image={(item.variants.find(v => v.default) || item.variants[0]).image} alt={item.name} hint={item.imageHint} className="pf-fit-image" />
                  <div className="pf-fit-info">
                    <h3>{item.name}</h3>
                    <div className="fit-for">{item.fitFor}</div>
                    <ProductAddButton products={products} productLabel={item.name} variants={item.variants} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
