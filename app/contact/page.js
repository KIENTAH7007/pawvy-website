import EnquiryForm from '../../components/EnquiryForm';

export const metadata = {
  title: 'Contact & FAQ | Pawvy',
  description: 'Get in touch with Pawvy, or check our frequently asked questions.',
};

// Server Component wrapper (real HTML/SEO for the page shell) around the
// client EnquiryForm island (the only part that actually needs JS).
export default function ContactPage() {
  return (
    <div style={{ maxWidth: 480, margin: '60px auto', padding: '0 20px' }}>
      <h1>Contact Us</h1>
      <p style={{ color: '#666' }}>
        Have a question? Send us a message below, or reach us directly via the WhatsApp button
        in the corner.
      </p>
      <EnquiryForm />

      {/* FAQ section — placeholder until per-brand FAQ content is ready. */}
      <div style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 18 }}>FAQ</h2>
        <p style={{ color: '#666', fontSize: 14 }}>Coming soon.</p>
      </div>
    </div>
  );
}
