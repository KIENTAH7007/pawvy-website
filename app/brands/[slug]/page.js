import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shopApi } from '../../../lib/api';
import { brandNameFromSlug, BRAND_SLUGS, BRAND_LOGOS, displayBrandName } from '../../../lib/brandSlugs';
import { BRAND_CONTENT } from '../../../lib/brandContent';
import ShopClient from '../../../components/ShopClient';

export async function generateStaticParams() {
  return Object.values(BRAND_SLUGS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brandName = brandNameFromSlug(slug);
  if (!brandName) return { title: 'Brand | Pawvy' };
  const content = BRAND_CONTENT[brandName];
  return {
    title: `${displayBrandName(brandName)} | Pawvy`,
    description: content?.description || `Shop ${displayBrandName(brandName)} products on Pawvy.co — Singapore's exclusive distributor.`,
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brandName = brandNameFromSlug(slug);
  if (!brandName) notFound();

  const { brands } = await shopApi.brands();
  const brand = brands.find(b => b.name === brandName);
  if (!brand) notFound();

  const { products } = await shopApi.products({ brand_id: brand.id });
  const content = BRAND_CONTENT[brandName] || {
    tagline: '', description: `Shop ${displayBrandName(brandName)} on Pawvy.`, exclusive: true, faqs: [],
  };
  const logo = BRAND_LOGOS[brandName];

  return (
    <>
      <section className="subhero">
        <div className="blob" />
        <div className="wrap subhero-inner">
          <Link href="/#gallery" className="back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
            All brands
          </Link>
          <h1>{displayBrandName(brandName)}</h1>
          {content.tagline && <p className="tag">{content.tagline}</p>}
          <p className="desc">{content.description}</p>
          <div className="subhero-actions">
            <a href="#enquiry-cta" className="btn btn-orange"><span>Ask about {displayBrandName(brandName)}</span></a>
            <Link href="/stockist" className="btn btn-outline-light"><span>Find a stockist</span></Link>
          </div>
        </div>
      </section>

      <div className="section-curve" style={{ background: 'var(--navy)' }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      {logo && (
        <section className="brand-stage">
          <div className="wrap brand-stage-grid">
            <div className="brand-stage-logo"><img src={logo} alt={displayBrandName(brandName)} /></div>
            <div className="brand-stage-copy">
              <h2>Why Pawvy carries {displayBrandName(brandName)}</h2>
              <p>{content.description}</p>
            </div>
          </div>
        </section>
      )}

      {content.faqs.length > 0 && (
        <section className="faq">
          <div className="wrap">
            <div className="faq-head">
              <div className="eyebrow center">Common questions</div>
              <h2>{displayBrandName(brandName)} FAQ</h2>
            </div>
            <div className="faq-list">
              {content.faqs.map(([q, a]) => (
                <details className="faq-item" key={q}>
                  <summary>{q}<span className="plus" /></summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="wrap" style={{ paddingTop: 90 }}>
        <div className="gallery-head" style={{ marginBottom: 0 }}>
          <div>
            <div className="eyebrow">Shop this brand</div>
            <h2>{displayBrandName(brandName)} products</h2>
          </div>
        </div>
      </div>
      <ShopClient initialProducts={products} brands={brands} showHero={false} />

      <section id="enquiry-cta" className="cta-band">
        <div className="wrap">
          <h2>Have a question we didn't cover?</h2>
          <Link href="/#enquiry" className="btn btn-orange"><span>Get in touch</span></Link>
        </div>
      </section>
    </>
  );
}
