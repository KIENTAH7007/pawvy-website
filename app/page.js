import Link from 'next/link';
import Marquee from '../components/Marquee';
import TestimonialCarousel from '../components/TestimonialCarousel';
import BrandGallery from '../components/BrandGallery';
import EnquiryForm from '../components/EnquiryForm';
import Reveal from '../components/Reveal';
import InstagramGrid from '../components/InstagramGrid';
import HomepageBanner from '../components/HomepageBanner';
import PawvyPicksGrid from '../components/PawvyPicksGrid';
import { contentApi, shopApi } from '../lib/api';
import { NEED_CATEGORIES } from '../lib/needTags';
import { brandCountLabel } from '../lib/brandSlugs';

const FACTS_FALLBACK_BASE = ['Premium Pet Wellness', 'Official Singapore Distributor', 'BRAND_COUNT_PLACEHOLDER', '107+ Retail Partners'];

const TESTIMONIALS = [
  { quote: 'Thank you for the recommendation! Sparky has not stopped playing since we came home.', who: 'Sparky_yipeedee_dee', image: '/testimonials/sparky.jpg' },
  { quote: "We've been adding this to Maddie's food for almost a week and can absolutely see the difference on her teeth and breath.", who: 'Macholefrenchie', image: '/testimonials/macholefrenchie.jpg' },
  { quote: 'Now the puzzle feeder is keeping him occupied — and more importantly, slowing him down!', who: 'Megan', image: '/testimonials/megan.jpg' },
  { quote: 'I saw mobility improvement in my chihuahua. She likes to play a lot now.', who: 'Freya_deedee_millie', image: '/testimonials/freya.jpg' },
];

// Server Component — real HTML for SEO. Only the pieces that need
// interactivity (typewriter, marquee, drag/tilt gallery, counters, the
// form) are client components imported in as islands.
export default async function Home() {
  // Real, already-filtered brand list (excludes anything hidden via
  // Pawvy App's hidden_on_website toggle) — used for both the gallery
  // cards below and the dynamic "N brands, one standard" text, so a
  // brand going live or getting hidden doesn't mean hunting down every
  // place that number was hardcoded (Aug 2026, per KT).
  const { brands } = await shopApi.brands().catch(() => ({ brands: [] }));
  // Marquee facts use Title Case ("Premium Pet Wellness") — reuse the same
  // spelled-out-number logic as brandCountLabel, just title-cased for this
  // context instead of sentence-cased.
  const brandCountFact = brandCountLabel(brands.length).replace(/\b\w/g, c => c.toUpperCase());
  const factsFallback = FACTS_FALLBACK_BASE.map(f => f === 'BRAND_COUNT_PLACEHOLDER' ? brandCountFact : f);

  // Ticker messages are managed from the Pawvy App's Ticker Messages admin
  // page — this fetches whatever's currently active at request time, so
  // updates show up live with no website deploy needed. Falls back to the
  // static facts if the list is empty or the backend is unreachable, so
  // the ticker is never just blank.
  const ticker = await contentApi.ticker().catch(() => null);
  const facts = ticker?.messages?.length ? ticker.messages : factsFallback;
  const igPosts = await contentApi.instagramPosts().catch(() => null);
  const igItems = igPosts?.items || [];
  const banners = await contentApi.homepageBanners().catch(() => null);
  const picks = await shopApi.pawvyPicks().catch(() => null);
  const pickProducts = picks?.products || [];

  return (
    <>
      <HomepageBanner banners={banners?.banners} />

      <div className="marquee">
        <Marquee pxPerSecond={55}>
          {facts.map((fact, i) => (
            <span className="marquee-item" key={i}>{fact}<span className="dot" /></span>
          ))}
        </Marquee>
      </div>

      {/* Need cards + Pawvy's Picks (Aug 2026) — replaces the old "200+
          Products / 100% Vetted Quality" stats strip at KT & Janice's
          request, freeing up room for these without the homepage getting
          longer overall. */}
      <section id="need-cards" className="need-cards-section">
        <div className="wrap">
          <Reveal as="div" className="need-cards-head">
            <div className="eyebrow center">Start here</div>
            <h2>What does your pet need help with?</h2>
          </Reveal>
          <Reveal as="div" className="need-cards-grid" stagger>
            {NEED_CATEGORIES.map(n => (
              <Link href={`/shop?need=${n.slug}`} className="need-card" key={n.slug}>
                <span className="need-card-icon">{n.icon}</span>
                <span className="need-card-label">{n.label}</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {pickProducts.length > 0 && (
        <section className="pawvy-picks-section">
          <div className="wrap">
            <Reveal as="div" className="need-cards-head">
              <div className="eyebrow center">Curated by Pawvy</div>
              <h2>Pawvy's Picks</h2>
            </Reveal>
            <PawvyPicksGrid products={pickProducts} />
          </div>
        </section>
      )}

      <div className="section-curve" style={{ background: 'var(--cream)' }}>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      <section id="gallery" className="gallery">
        <div className="wrap">
          <Reveal as="div" className="gallery-head">
            <div>
              <div className="eyebrow">The collection</div>
              <h2>{brandCountLabel(brands.length)}</h2>
            </div>
          </Reveal>
          <BrandGallery brands={brands} />
        </div>
        <Reveal as="div" className="wrap gallery-cta">
          <p>Know what you're after? Skip the browsing.</p>
          <Link href="/shop" className="btn btn-outline-dark"><span>Go straight to Shop</span></Link>
        </Reveal>
      </section>

      <section className="testimonials">
        <Reveal as="div" className="test-head">
          <div className="eyebrow center">Customer reviews</div>
          <h2>Here's what pawrents are saying</h2>
        </Reveal>
        <TestimonialCarousel testimonials={TESTIMONIALS} />
      </section>

      <section className="instagram">
        <div className="wrap">
          <Reveal as="div" className="eyebrow center">Social media</Reveal>
          <h2>Instagram</h2>
          <p className="sub">Follow us at <a href="https://instagram.com/pawvy_sg" target="_blank" rel="noopener noreferrer">Pawvy_SG</a> to discover new products, exciting updates, and care tips for your pets.</p>
          {igItems.length > 0 ? (
            <Reveal as="div" className="ig-embed-wrap">
              <InstagramGrid items={igItems} />
            </Reveal>
          ) : (
            <a href="https://instagram.com/pawvy_sg" target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark" style={{ marginTop: 32 }}>
              <span>Visit our Instagram</span>
            </a>
          )}
        </div>
      </section>

      <section id="enquiry" className="enquiry">
        <div className="wrap enq-grid">
          <Reveal as="div" className="enq-copy">
            <div className="eyebrow">Get in touch</div>
            <h2>Have a question, or want to stock our brands?</h2>
            <p>Whether you're a pawrent with a question or a retailer interested in carrying our brands, we'd love to hear from you.</p>
            <div className="enq-contact">
              <a href="mailto:hello@pawvy.info">hello@pawvy.info</a>
              <a href="tel:+6596894853">+65 9689 4853</a>
              <div>Singapore</div>
            </div>
          </Reveal>
          <Reveal as="div"><EnquiryForm /></Reveal>
        </div>
      </section>
    </>
  );
}
