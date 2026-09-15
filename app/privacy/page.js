import { buildOgMeta } from '../../lib/seo';

const TITLE = 'Privacy Policy | Pawvy';
const DESCRIPTION = "How Pawvy collects, uses, and protects your personal data.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/privacy' }),
};

const wrap = { maxWidth: 760, margin: '140px auto 60px', padding: '0 20px', lineHeight: 1.7, color: '#333' };
const h2 = { marginTop: 40, marginBottom: 12 };

export default function PrivacyPage() {
  return (
    <div style={wrap}>
      <h1>Privacy Policy</h1>
      <p style={{ color: '#666', fontSize: 14 }}>Last updated: September 2026</p>

      <p>
        Pawvy Limited Partnership ("Pawvy", "we", "us") respects your privacy
        and is committed to protecting your personal data in accordance with
        Singapore's Personal Data Protection Act 2012 ("PDPA"). This policy
        explains what personal data we collect, why, and how we use it.
      </p>

      <h2 style={h2}>1. What we collect</h2>
      <p>Depending on how you use Pawvy (creating an account, checking out as a guest, or joining our loyalty programme), we may collect:</p>
      <ul>
        <li>Your name, email address, phone number, and delivery address</li>
        <li>Your pet's name, breed, weight, birthday, and any allergies you tell us about — used to personalise recommendations and reminders</li>
        <li>Order history and purchase details</li>
        <li>Your Instagram handle, if you provide it (e.g. for social promotions)</li>
        <li>How you first heard about us or were referred, if applicable</li>
      </ul>
      <p>
        We do <strong>not</strong> collect or store your payment card details.
        Payments are processed directly by Stripe, our payment processor —
        see Section 4.
      </p>

      <h2 style={h2}>2. Why we collect it</h2>
      <ul>
        <li>To process and deliver your orders</li>
        <li>To create and manage your Pawvy account</li>
        <li>To operate our BUTTONS rewards programme (tracking what you've earned and redeemed)</li>
        <li>To send you order confirmations, account-related emails, and — where you've consented — reward reminders and occasional product announcements</li>
        <li>To respond to your enquiries and provide customer service</li>
        <li>To improve our products and services</li>
      </ul>

      <h2 style={h2}>3. Marketing emails and opt-out</h2>
      <p>
        We may send you account-related emails (such as reward or credit
        updates) as well as occasional product announcements or promotional
        reminders. Every such email includes a link to unsubscribe, and you
        can opt out at any time without affecting your ability to use your
        Pawvy account or place orders. Transactional emails necessary to
        fulfil an order (such as order confirmations) are not affected by
        marketing opt-outs.
      </p>

      <h2 style={h2}>4. Who we share data with</h2>
      <p>We share personal data only where necessary to run our business, and only with service providers bound to protect it:</p>
      <ul>
        <li><strong>Stripe</strong> — to process card payments. Stripe receives your payment details directly; we do not see or store your full card number.</li>
        <li><strong>Resend</strong> — our email delivery provider, used to send order confirmations and the account emails described above.</li>
      </ul>
      <p>
        We do not sell your personal data to third parties, and we do not
        share it with anyone for their own independent marketing purposes.
      </p>

      <h2 style={h2}>5. Cookies and local storage</h2>
      <p>
        Pawvy does not use tracking, advertising, or analytics cookies. To
        keep you logged in and remember your cart between visits, we use
        your browser's local storage rather than cookies — this data stays
        on your own device and is not used to track you across other
        websites.
      </p>

      <h2 style={h2}>6. How long we keep your data</h2>
      <p>
        We retain your personal data for as long as your account remains
        active, and for a reasonable period afterward where needed to
        resolve disputes, comply with our legal and accounting obligations,
        or enforce our agreements. You may request deletion of your account
        and associated data at any time — see Section 7.
      </p>

      <h2 style={h2}>7. Your rights</h2>
      <p>Under the PDPA, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Withdraw your consent to our collection, use, or disclosure of your data (which may limit our ability to serve you — for example, we can't fulfil an order without a delivery address)</li>
        <li>Request deletion of your account and data</li>
      </ul>
      <p>
        To exercise any of these rights, contact us using the details in
        Section 9. If you're unsatisfied with our response, you may also
        lodge a complaint with Singapore's Personal Data Protection
        Commission (PDPC).
      </p>

      <h2 style={h2}>8. Security</h2>
      <p>
        We take reasonable technical and organisational measures to protect
        your personal data against unauthorised access, loss, or misuse.
        No method of transmission or storage is completely secure, but we
        work to protect your information to industry standards.
      </p>

      <h2 style={h2}>9. Contact us</h2>
      <p>
        If you have questions about this policy or how we handle your
        personal data, please reach out to us via the contact details on
        our{' '}
        <a href="/#enquiry" style={{ color: 'var(--orange, #F36F4A)' }}>contact page</a>.
      </p>

      <h2 style={h2}>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. Material changes will
        be reflected by updating the "last updated" date above.
      </p>
    </div>
  );
}
