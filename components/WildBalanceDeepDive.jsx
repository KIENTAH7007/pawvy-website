import Link from 'next/link';
import { imageUrl } from '../lib/api';
import { productDisplayName } from '../lib/productDisplayName';
import { productUrl } from '../lib/productDisplayName';
import { formatPrice } from '../lib/formatPrice';
import { groupWildBalanceProducts } from '../lib/wildBalanceGrouping';
import CasseroleCalculator from './CasseroleCalculator';
import FreshlyCookedCalculator from './FreshlyCookedCalculator';
import FrozenYoghurtToggle from './FrozenYoghurtToggle';
import ChewSelector from './ChewSelector';

// Real product photo card, matching GiGwi's CategoryBrowser.jsx pattern
// exactly (import { imageUrl } from '../lib/api', then
// <img src={imageUrl(product.image_url)}>) — whatever's already
// uploaded for each Wild Balance SKU in Pawvy App shows up here
// automatically, no separate step needed.
function ProductCard({ product }) {
  return (
    <Link href={productUrl(product)} className="pcard-link">
      <div className="pcard">
        <div className="img" style={{ background: '#EFE9DD' }}>
          {product.image_url
            ? <img src={imageUrl(product.image_url)} alt={productDisplayName(product)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 11, color: 'var(--dark-gray)' }}>No image yet</span>}
        </div>
        <div className="body">
          <div className="name">{productDisplayName(product)}</div>
          <div className="sub">{product.variation || ''} · {formatPrice(product.effective_price_rrp_sg)}</div>
        </div>
      </div>
    </Link>
  );
}

export default function WildBalanceDeepDive({ products }) {
  const { casseroles, freshlyCooked, yoghurt, chews } = groupWildBalanceProducts(products);

  return (
    <>
      {casseroles.length > 0 && (
        <section className="section" id="casseroles">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Homemade-Style Casseroles</div>
              <h2>Cooked low and slow, ready in seconds</h2>
              <p>Real meat and vegetables in their own natural sauce — no freezer, no thawing. Just open the 280g pack and serve.</p>
            </div>
            <div className="pgrid">
              {casseroles.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <CasseroleCalculator products={casseroles} />
          </div>
        </section>
      )}

      {freshlyCooked.length > 0 && (
        <section className="section" id="freshly-cooked">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Freshly Cooked Dog Food</div>
              <h2>A complete daily meal, no freezer required</h2>
              <p>90% real meat, cooked low and slow with pumpkin, carrot, and spinach. Shelf-stable until opened — no thawing, ever.</p>
            </div>
            <div className="pgrid">
              {freshlyCooked.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <FreshlyCookedCalculator products={freshlyCooked} />
          </div>
        </section>
      )}

      {yoghurt.length > 0 && (
        <section className="section" id="frozen-yoghurt">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Frozen Yoghurt</div>
              <h2>One treat, two ways to serve</h2>
            </div>
            <FrozenYoghurtToggle product={yoghurt[0]} />
          </div>
        </section>
      )}

      {chews.length > 0 && (
        <section className="section" id="natural-chews">
          <div className="wrap">
            <div className="section-head">
              <div className="eyebrow">Natural Chews</div>
              <h2>Single-ingredient, dehydrated, no additives</h2>
              <p>Six real animal-part chews — softness and chew time vary by cut. Not sure which one fits your dog? Use the picker below.</p>
            </div>
            <ChewSelector products={chews} />
          </div>
        </section>
      )}
    </>
  );
}
