import Link from 'next/link';
import { notFound } from 'next/navigation';
import { shopApi } from '../../../lib/api';
import { brandNameFromSlug, BRAND_SLUGS, BRAND_HERO_PHOTOS, displayBrandName } from '../../../lib/brandSlugs';
import { BRAND_CONTENT, faqSlug } from '../../../lib/brandContent';
import { buildOgMeta } from '../../../lib/seo';
import BrandDeepDive from '../../../components/BrandDeepDive';
import FaqAutoOpen from '../../../components/FaqAutoOpen';

export async function generateStaticParams() {
  return Object.values(BRAND_SLUGS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brandName = brandNameFromSlug(slug);
  if (!brandName) return { title: 'Brand | Pawvy' };
  const content = BRAND_CONTENT[brandName];
  const title = `${displayBrandName(brandName)} | Pawvy`;
  const description = content?.description
    || (content?.exclusive
      ? `Shop ${displayBrandName(brandName)} products on Pawvy.co — Singapore's exclusive distributor.`
      : `Shop ${displayBrandName(brandName)} products on Pawvy.co — Singapore's official distributor.`);
  return {
    title,
    description,
    alternates: { canonical: `/brands/${slug}` },
    // Each brand's own hero photo, not the generic site-wide default —
    // a real product/lifestyle shot makes for a much better share
    // preview than the logo repeated on every brand page.
    ...buildOgMeta({ title, description, path: `/brands/${slug}`, image: BRAND_HERO_PHOTOS[brandName] }),
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
    tagline: '', description: `Shop ${displayBrandName(brandName)} on Pawvy.`, exclusive: false, faqs: [],
  };
  const heroPhoto = BRAND_HERO_PHOTOS[brandName];

  return (
    <>
      <section className="subhero">
        {heroPhoto && <img src={heroPhoto} alt="" className="subhero-bg-photo" />}
        <div className="blob" />
        <div className="wrap subhero-inner">
          <Link href="/#gallery" className="back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
            All brands
          </Link>
          <h1>{displayBrandName(brandName)}</h1>
          {content.tagline && <p className="tag">{content.tagline}</p>}
          {content.description && <p className="desc">{content.description}</p>}
          <p className="distributor-badge sr-only">
            {content.exclusive
              ? `Official & exclusive Singapore distributor of ${displayBrandName(brandName)}.`
              : `Official Singapore distributor of ${displayBrandName(brandName)}.`}
          </p>
          <div className="subhero-actions">
            <a href="#shop" className="btn btn-orange"><span>Shop now</span></a>
            <a href="#faq" className="btn btn-outline-light"><span>FAQ</span></a>
          </div>
        </div>
      </section>

      <BrandDeepDive deepDive={content.deepDive} brandDisplayName={displayBrandName(brandName)} brandId={brand.id} products={products} />

      {content.faqs.length > 0 && (
        <section id="faq" className="faq">
          <div className="blob" />
          <div className="wrap">
            <div className="faq-head">
              <div className="eyebrow center">Common questions</div>
              <h2>{displayBrandName(brandName)} FAQ</h2>
            </div>
            <div className="faq-list">
              <FaqAutoOpen />
              {content.faqs.map(([q, a]) => (
                <details className="faq-item" id={faqSlug(q)} key={q}>
                  <summary>{q}<span className="plus" /></summary>
                  {/* FAQ answers are first-party authored content (not user
                      input), so a small set of them use real HTML — mainly
                      tables, where a table is genuinely easier to scan than
                      a paragraph (e.g. dosage-by-weight guides). Plain-text
                      answers render exactly the same either way. */}
                  <div className="faq-answer" dangerouslySetInnerHTML={{ __html: a }} />
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="enquiry-cta" className="cta-band cta-band-light">
        <div className="wrap">
          <h2>Have a question we didn't cover?</h2>
          <Link href="/#enquiry" className="btn btn-orange"><span>Get in touch</span></Link>
        </div>
      </section>
    </>
  );
}
