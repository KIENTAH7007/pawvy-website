import { buildOgMeta } from '../../lib/seo';

const TITLE = 'Terms & Conditions | Pawvy';
const DESCRIPTION = "The terms that apply when you use Pawvy's website and place an order.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/terms' },
  ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/terms' }),
};

const wrap = { maxWidth: 760, margin: '140px auto 60px', padding: '0 20px', lineHeight: 1.7, color: '#333' };
const h2 = { marginTop: 40, marginBottom: 12 };
const note = { background: '#FBEAE3', border: '1px solid #F3A98A', borderRadius: 8, padding: '10px 14px', fontSize: 13, margin: '8px 0 16px' };

export default function TermsPage() {
  return (
    <div style={wrap}>
      <h1>Terms & Conditions</h1>
      <p style={{ color: '#666', fontSize: 14 }}>Last updated: September 2026</p>

      <p>
        These terms apply when you use pawvy.co (the "Site") or place an
        order with Pawvy Limited Partnership ("Pawvy", "we", "us"). By using
        the Site or placing an order, you agree to these terms.
      </p>

      <h2 style={h2}>1. Products and pricing</h2>
      <p>
        We make reasonable efforts to display accurate product information,
        images, and pricing. Actual products may vary slightly from images
        shown. Prices are in Singapore Dollars (SGD) and may change at any
        time without notice; the price charged is the price displayed at
        the time you complete checkout.
      </p>

      <h2 style={h2}>2. Availability</h2>
      <p>
        All orders are subject to stock availability. If an item you've
        ordered becomes unavailable after your order is placed, we'll
        contact you to arrange a substitute, refund, or delay, as
        appropriate.
      </p>

      <h2 style={h2}>3. Orders and payment</h2>
      <p>
        Orders can be paid by credit/debit card or PayNow via Stripe, our
        payment processor. An order is confirmed once payment is
        successfully processed. We reserve the right to refuse or cancel
        any order, including in cases of suspected fraud or pricing errors.
      </p>

      <h2 style={h2}>4. Delivery</h2>
      <p>
        We aim to deliver orders within a reasonable timeframe from
        confirmation. Delivery times are estimates, not guarantees, and may
        be affected by circumstances outside our control.
      </p>
      <div style={note}>
        <strong>Flagging for KT:</strong> worth adding real specifics here —
        typical delivery timeframe, delivery fee/free-delivery threshold
        (the site already shows a $60 free-delivery line elsewhere), and
        areas covered — once confirmed, this section can be filled in or
        linked to a dedicated Shipping page.
      </div>

      <h2 style={h2}>5. Returns and refunds</h2>
      <p>
        If there's an issue with your order — damaged, incorrect, or
        defective items — please contact us and we'll work with you to make
        it right.
      </p>
      <div style={note}>
        <strong>Flagging for KT:</strong> this section is intentionally
        general — it doesn't commit to a specific return window or
        restocking/exchange policy since that's a real business decision,
        not something I should set on your behalf. Worth confirming: how
        many days for a return, does the item need to be unopened, who
        covers return shipping, and whether opened food/treats can ever be
        returned for hygiene reasons (common for pet food retailers to
        exclude). Once confirmed, I can write this properly and build a
        dedicated Returns page.
      </div>

      <h2 style={h2}>6. BUTTONS rewards programme</h2>
      <p>
        BUTTONS earned through Pawvy's rewards programme have no cash value
        and cannot be exchanged for cash. We may modify, suspend, or
        discontinue the programme, or adjust how BUTTONS are earned or
        redeemed, at any time. BUTTONS may expire as communicated at the
        time they're earned.
      </p>

      <h2 style={h2}>7. Accounts</h2>
      <p>
        You're responsible for keeping your account details accurate and
        for any activity under your account. Let us know right away if you
        believe your account has been accessed without authorisation.
      </p>

      <h2 style={h2}>8. Intellectual property</h2>
      <p>
        All content on this Site — including text, images, logos, and
        design — belongs to Pawvy or its licensors and may not be used,
        copied, or reproduced without our permission.
      </p>

      <h2 style={h2}>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Pawvy is not liable for any
        indirect, incidental, or consequential loss arising from your use
        of the Site or products purchased through it. Nothing in these
        terms limits any liability that cannot be excluded under Singapore
        law.
      </p>

      <h2 style={h2}>10. Governing law</h2>
      <p>
        These terms are governed by the laws of Singapore, and any disputes
        will be subject to the exclusive jurisdiction of the Singapore
        courts.
      </p>

      <h2 style={h2}>11. Contact us</h2>
      <p>
        Questions about these terms? Reach out via our{' '}
        <a href="/#enquiry" style={{ color: 'var(--orange, #F36F4A)' }}>contact page</a>.
      </p>

      <h2 style={h2}>12. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the
        Site after changes are posted means you accept the updated terms.
      </p>
    </div>
  );
}
