'use client';

// Interactive ingredient/recipe highlight panel — built for Salmoil, where
// KT specifically wanted "hover the card on desktop, click on mobile" to
// swap which recipe's real photo shows on the right. Pulled into its own
// client component (rather than living inline in BrandDeepDive.jsx) since
// BrandDeepDive is a Server Component and useState needs "use client".
import { useState } from 'react';

function ImageSlot({ image, alt, hint, className }) {
  if (image) return <img src={image} alt={alt} className={className} />;
  return (
    <div className={`${className} img-placeholder`}>
      <span>{hint}</span>
    </div>
  );
}

export default function RecipeSelector({ selector }) {
  const [active, setActive] = useState(selector.items[0]?.id);

  return (
    <section className="sal-selector">
      <div className="wrap">
        <div className="sal-selector-head">
          <div className="eyebrow center on-dark">{selector.eyebrow}</div>
          <h2>{selector.heading}</h2>
          <p>{selector.sub}</p>
        </div>
        <div className="sal-selector-grid">
          <div className="sal-tabs">
            {selector.items.map(item => (
              <div
                key={item.id}
                className={`sal-tab${active === item.id ? ' active' : ''}`}
                style={{ '--tab-color': item.color }}
                onClick={() => setActive(item.id)}
                onMouseEnter={() => setActive(item.id)}
              >
                <div className="sal-tab-recipe">{item.recipeName}</div>
                <h4>{item.ingredient}</h4>
              </div>
            ))}
          </div>
          <div className="sal-selector-image">
            {selector.items.map(item => (
              <ImageSlot
                key={item.id}
                image={item.image}
                alt={item.recipeName}
                hint={item.recipeName}
                className={`sal-selector-img${active === item.id ? ' active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
