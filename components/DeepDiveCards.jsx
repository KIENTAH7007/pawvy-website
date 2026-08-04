'use client';

// Interactive card wrappers for the brand deep-dive page — extracted into
// their own 'use client' file because they need useRef (to call
// ProductAddButton's exposed openInfo()) and onClick handlers, neither of
// which are allowed directly inside BrandDeepDive.jsx (a Server Component).
// BrandDeepDive.jsx just imports and renders these like any other client
// component, same as it already does with RecipeSelector/CategoryBrowser.
//
// Each card wraps its image + title area (excluding the Add to Cart
// button itself) in a click handler that opens ProductAddButton's info
// modal — which now also shows the product's description — so browsing
// ("what is this thing") stays a zero-friction click even on cards where
// buying is a single instant-add click. The Add to Cart button's own
// click handler calls stopPropagation, so clicking it doesn't also
// trigger the card's click-to-open-info handler.
import { useRef } from 'react';
import ProductAddButton from './ProductAddButton';

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

export function DurabilityCard({ lvl, products }) {
  const btnRef = useRef(null);
  const openInfo = () => btnRef.current?.openInfo();
  return (
    <div className="durability-card">
      <div className="durability-image-wrap" onClick={openInfo} style={{ cursor: 'pointer' }}>
        <ImageSlot image={lvl.image} alt={lvl.label} hint={lvl.imageHint} className="durability-image" />
        <div className="durability-product-badge">
          <ImageSlot image={lvl.productImage} alt={lvl.productName} hint={lvl.productImageHint || `${lvl.label} pack`} className="durability-product-badge-img" />
        </div>
      </div>
      <div className="durability-info">
        <div onClick={openInfo} style={{ cursor: 'pointer' }}>
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
        <ProductAddButton
          ref={btnRef}
          products={products}
          productLabel={`BetterBone ${lvl.label}`}
          seriesIncludes={lvl.seriesIncludes}
          variationIncludes={lvl.variationIncludes}
        />
      </div>
    </div>
  );
}

export function FitCard({ item, products }) {
  const btnRef = useRef(null);
  const openInfo = () => btnRef.current?.openInfo();
  return (
    <div className="pf-fit-card">
      <div onClick={openInfo} style={{ cursor: 'pointer' }}>
        <ImageSlot image={item.variants[0].image} alt={item.name} hint={item.imageHint} className="pf-fit-image" />
      </div>
      <div className="pf-fit-info">
        <div onClick={openInfo} style={{ cursor: 'pointer' }}>
          <h3>{item.name}</h3>
          <div className="fit-for">{item.fitFor}</div>
          <div className="pf-swatches">
            {item.variants.map(v => <span key={v.label} className="pf-swatch" style={{ background: v.hex }} title={v.label} />)}
          </div>
        </div>
        <ProductAddButton ref={btnRef} products={products} productLabel={item.name} variants={item.variants} />
      </div>
    </div>
  );
}

export function FitGroupCard({ item, products }) {
  const btnRef = useRef(null);
  const openInfo = () => btnRef.current?.openInfo();
  return (
    <div className="pf-fit-card">
      <div onClick={openInfo} style={{ cursor: 'pointer' }}>
        <ImageSlot image={(item.variants.find(v => v.default) || item.variants[0]).image} alt={item.name} hint={item.imageHint} className="pf-fit-image" />
      </div>
      <div className="pf-fit-info">
        <div onClick={openInfo} style={{ cursor: 'pointer' }}>
          <h3>{item.name}</h3>
          <div className="fit-for">{item.fitFor}</div>
        </div>
        <ProductAddButton ref={btnRef} products={products} productLabel={item.name} variants={item.variants} />
      </div>
    </div>
  );
}
