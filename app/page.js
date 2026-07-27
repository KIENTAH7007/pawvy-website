import Link from 'next/link';
import Typewriter from '../components/Typewriter';
import Marquee from '../components/Marquee';
import BrandGallery from '../components/BrandGallery';
import StatCounter from '../components/StatCounter';
import EnquiryForm from '../components/EnquiryForm';
import Reveal from '../components/Reveal';

const FACTS = ['Premium Pet Wellness', 'Exclusive Singapore Distributor', 'Six Brands, One Standard', '107+ Retail Partners'];

const TESTIMONIALS = [
  { quote: 'Thank you for the recommendation! Sparky has not stopped playing since we came home.', who: 'Sparky_yipeedee_dee' },
  { quote: "We've been adding this to Maddie's food for almost a week and can absolutely see the difference on her teeth and breath.", who: 'Macholefrenchie' },
  { quote: 'Now the puzzle feeder is keeping him occupied — and more importantly, slowing him down!', who: 'Megan' },
  { quote: 'I saw mobility improvement in my chihuahua. She likes to play a lot now.', who: 'Freya_deedee_millie' },
];

// Server Component — real HTML for SEO. Only the pieces that need
// interactivity (typewriter, marquee, drag/tilt gallery, counters, the
// form) are client components imported in as islands.
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="blob" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="blob b4" />
        <div className="float-dot fd1" /><div className="float-dot fd2" /><div className="float-dot fd3" /><div className="float-dot fd4" />
        <div className="paw-badge">
          <svg viewBox="0 0 120 120">
            <defs><path id="circlePath" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" /></defs>
            <circle cx="60" cy="60" r="58" fill="var(--orange)" />
            <text fontSize="10.5" fontWeight="800" fill="var(--navy)" letterSpacing="2">
              <textPath href="#circlePath" startOffset="0%">PET LOVERS • PAWVY • PET LOVERS •</textPath>
            </text>
          </svg>
          <span className="paw-center">🐾</span>
        </div>

        <div className="wrap hero-inner">
          <h1>
            <div className="line-reveal"><span>Wellness</span></div>
            <div className="line-reveal"><span>products that</span></div>
            <div className="line-reveal"><Typewriter /></div>
          </h1>
          <Reveal as="p" className="lead">
            Pawvy is the exclusive distributor of{' '}
            <Link href="/brands/betterbone-nylon-free-dog-chew" className="brand-link">Better Bone</Link>,{' '}
            <Link href="/brands/lillidale-natural-pet-supplement" className="brand-link">Lillidale</Link>,{' '}
            <Link href="/brands/puzzle-feeder-slow-feeder-dog-bowl" className="brand-link">Puzzle Feeder</Link>,{' '}
            <Link href="/brands/eastsea-brother" className="brand-link">East Sea Brother</Link> and{' '}
            <Link href="/brands/salmoil-fish-oil-for-dogs" className="brand-link">Salmoil</Link> — curated for pawrents who want the best for their furkids.
          </Reveal>
          <div className="hero-actions">
            <a href="#gallery" className="btn btn-orange"><span>Explore the brands</span></a>
            <a href="#enquiry" className="btn btn-outline-light"><span>Get in touch</span></a>
          </div>
        </div>

        <div className="marquee">
          <Marquee pxPerSecond={55}>
            {FACTS.map((fact, i) => (
              <span className="marquee-item" key={i}>{fact}<span className="dot" /></span>
            ))}
          </Marquee>
        </div>
      </section>

      <section className="stats">
        <Reveal className="wrap stats-grid" stagger>
          <div><div className="stat-num"><StatCounter target={6} /></div><div className="stat-label">Brands Distributed</div></div>
          <div><div className="stat-num"><StatCounter target={107} suffix="+" /></div><div className="stat-label">Retail Partners</div></div>
          <div><div className="stat-num"><StatCounter target={1000} suffix="+" /></div><div className="stat-label">Happy Pets</div></div>
          <div><div className="stat-num"><StatCounter target={100} /></div><div className="stat-label">% Vetted Quality</div></div>
        </Reveal>
      </section>

      <div className="section-curve">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      <section id="gallery" className="gallery">
        <div className="wrap">
          <Reveal as="div" className="gallery-head">
            <div>
              <div className="eyebrow">The collection</div>
              <h2>Six brands, one standard</h2>
            </div>
            <div className="gallery-hint">
              Drag to explore
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </div>
          </Reveal>
        </div>
        <BrandGallery />
        <Reveal as="div" className="wrap gallery-cta">
          <p>Know what you're after? Skip the browsing.</p>
          <Link href="/shop" className="btn btn-outline-dark"><span>Go straight to Shop</span></Link>
        </Reveal>
      </section>

      <section className="why">
        <div className="wrap why-grid">
          <Reveal as="div" className="why-visual">
            <div className="blob" />
            <span className="paw-emoji">🐾</span>
          </Reveal>
          <div>
            <Reveal as="div" className="eyebrow">Why Pawvy</Reveal>
            <Reveal as="div" className="why-item">
              <span className="num">01</span>
              <h3>The one that works</h3>
              <p>Beyond design and claims, what matters most is function — only what truly works earns its place on our shelf.</p>
            </Reveal>
            <Reveal as="div" className="why-item">
              <span className="num">02</span>
              <h3>The one that resonates</h3>
              <p>Every product should have a clear purpose and real value in everyday use — fitting naturally into your pet's life.</p>
            </Reveal>
            <Reveal as="div" className="why-item">
              <span className="num">03</span>
              <h3>The one we stand behind</h3>
              <p>As the exclusive distributor, we vet every brand before it reaches you — no marketplace guesswork.</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <Reveal as="div" className="test-head">
          <div className="eyebrow center">Customer reviews</div>
          <h2>Here's what pawrents are saying</h2>
        </Reveal>
        <Marquee pxPerSecond={38}>
          {TESTIMONIALS.map((t, i) => (
            <div className="test-card" key={i}>
              <div className="stars">★★★★★</div>
              <p>"{t.quote}"</p>
              <div className="who">— {t.who}</div>
            </div>
          ))}
        </Marquee>
      </section>

      <section className="instagram">
        <div className="wrap">
          <Reveal as="div" className="eyebrow center">Social media</Reveal>
          <h2>Instagram</h2>
          <p className="sub">Follow us at <a href="https://instagram.com/pawvy_sg" target="_blank" rel="noopener noreferrer">@Pawvy_SG</a> to discover new products, exciting updates, and care tips for your pets.</p>
          <Reveal as="div" className="ig-grid" stagger>
            {[0, 1, 2, 3].map((i) => (
              <div className="ig-tile" key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg>
              </div>
            ))}
          </Reveal>
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
