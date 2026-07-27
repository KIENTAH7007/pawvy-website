import EnquiryForm from '../../components/EnquiryForm';

export const metadata = {
  title: 'Contact & FAQ | Pawvy',
  description: 'Get in touch with Pawvy, or check our frequently asked questions.',
};

export default function ContactPage() {
  return (
    <>
      <section className="subhero">
        <div className="blob" />
        <div className="wrap subhero-inner">
          <div className="eyebrow">Get in touch</div>
          <h1>Contact us</h1>
          <p className="desc">
            Have a question? Send us a message below, or reach us directly via the WhatsApp button
            in the corner. For brand-specific FAQs, check that brand's own page.
          </p>
        </div>
      </section>

      <div className="section-curve">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none"><path fill="var(--ivory)" d="M0,40 C300,90 600,0 900,35 C1150,63 1300,20 1440,45 L1440,90 L0,90 Z" /></svg>
      </div>

      <section className="enquiry">
        <div className="wrap enq-grid">
          <div className="enq-copy">
            <h2>Send us a message</h2>
            <p>Whether you're a pawrent with a question or a retailer interested in carrying our brands, we'd love to hear from you.</p>
            <div className="enq-contact">
              <a href="mailto:hello@pawvy.info">hello@pawvy.info</a>
              <a href="tel:+6596894853">+65 9689 4853</a>
              <div>Singapore</div>
            </div>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
