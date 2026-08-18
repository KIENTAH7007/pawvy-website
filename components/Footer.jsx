import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src="/pawvy-logo-white.png" alt="Pawvy" />
            <p>We help you make informed choices.</p>
            <p className="foot-trust">Official distributor. Authentic products. Local support.</p>
          </div>
          <div className="foot-col">
            <div className="eyebrow" style={{ color: 'var(--light-pitch)' }}>Explore</div>
            <Link href="/shop">Shop Brands</Link>
            <Link href="/stockist">Stockist</Link>
            <Link href="/#enquiry">Contact</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div className="foot-col">
            <div className="eyebrow" style={{ color: 'var(--light-pitch)' }}>Connect</div>
            <a href="mailto:hello@pawvy.info">hello@pawvy.info</a>
            <a href="tel:+6596894853">+65 9689 4853</a>
            <div>Singapore</div>
          </div>
        </div>
        <div className="foot-word">PAWVY</div>
        <div className="wrap foot-bottom" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <span>© 2026 Pawvy — Curated for pawrents who want the best for their furkids.</span>
        </div>
      </div>
    </footer>
  );
}
