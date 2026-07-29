// Renders the optional "deep dive" block on a brand page — sits between
// the "Why Pawvy carries..." section and the FAQ. Data-driven off
// content.deepDive in lib/brandContent.js so this scales to other brands
// without touching this file; brands without a deepDive block just don't
// render it (see app/brands/[slug]/page.js).
//
// Durability cards combine the lifestyle dog photo AND the product
// packaging shot in one card (packaging shot as a small inset badge) —
// Option 1 from the two combined-layout mockups shown to KT, chosen over
// a plain stacked/no-overlap version.
//
// Image slots: every section takes either a real `image` path or falls
// back to a dashed placeholder box showing `imageHint`, so this still
// degrades gracefully if a future brand's data is filled in without
// photos yet.

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

export default function BrandDeepDive({ deepDive, brandDisplayName }) {
  if (!deepDive) return null;
  const { chew, durability, guide } = deepDive;

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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {guide && (
        <section className="find-guide">
          <div className="blob" />
          <div className="wrap find-guide-inner">
            <h2>{guide.heading}</h2>
            <p>{guide.sub}</p>
            <a href={guide.ctaHref} className="btn btn-orange"><span>{guide.ctaLabel}</span></a>
          </div>
        </section>
      )}
    </>
  );
}
