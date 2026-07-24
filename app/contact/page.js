export const metadata = {
  title: 'Contact & FAQ | Pawvy',
  description: 'Get in touch with Pawvy, or check our frequently asked questions.',
};

// Placeholder structure — real build needs: an enquiry form (submits to a
// backend endpoint + Telegram notification, same pattern already proven
// for order alerts), per-brand FAQ content, and possibly policy links.
export default function ContactPage() {
  return (
    <div style={{ maxWidth: 640, margin: '60px auto', padding: '0 20px' }}>
      <h1>Contact Us</h1>
      <p style={{ color: '#666' }}>
        An enquiry form and FAQ are coming soon. In the meantime, reach us via the WhatsApp
        button in the corner, or email janicelee@pawvy.co.
      </p>
    </div>
  );
}
