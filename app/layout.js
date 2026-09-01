import { CartProvider } from '../lib/CartContext';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import PageTransition from '../components/PageTransition';
import CustomCursor from '../components/CustomCursor';
import { buildOgMeta, ORGANIZATION_JSON_LD } from '../lib/seo';
import './globals.css';

// Default metadata for every page — individual pages (product, brand)
// override title/description with their own via each page's own
// `export const metadata` or `generateMetadata()`. Base description/
// keywords copied from the current live site (checked via a direct fetch)
// so we're not starting SEO from scratch.
const TITLE = 'Pawvy | Natural Pet Wellness Products Singapore';
// Was a hand-written list of 5 brand names — already stale (missing
// GiGwi and Wild Balance) before this fix, exactly the kind of thing
// this whole round is about. Reworded to not enumerate brands by name
// at all, so a future brand launch or hide doesn't require remembering
// to update this specific string too.
const DESCRIPTION = "Singapore's exclusive distributor of premium natural pet wellness brands. Trusted, natural pet wellness products to help you make informed choices.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL('https://pawvy.co'),
  alternates: { canonical: '/' },
  ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/' }),
};

// Back to a plain, sync component (Aug 2026) — a previous version of
// this fetched the real brand list here and passed it to Nav, so a
// hidden brand couldn't show in the Shop dropdown. That part was
// right, but doing it as a server-side layout fetch meant relying on
// Next's ISR revalidation actually working the way expected on
// Railway's hosting — and after unhiding Wild Balance, the nav still
// didn't show it while everywhere else on the site correctly did,
// meaning that reliance didn't hold up in practice. Nav now fetches
// its own brand list client-side instead (see components/Nav.jsx) —
// always genuinely fresh on every page load, no server-side caching
// layer to get right, and also sidesteps the layout-fetch-forces-
// every-page-dynamic issue from even needing the ISR workaround.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <CartProvider>
          <CustomCursor />
          <Nav />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
