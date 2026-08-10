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
const DESCRIPTION = "Singapore's exclusive distributor of BetterBone, Salmoil, Lillidale, Eastsea Brother & Puzzle Feeder. Trusted, natural pet wellness products to help you make informed choices.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL('https://pawvy.co'),
  alternates: { canonical: '/' },
  ...buildOgMeta({ title: TITLE, description: DESCRIPTION, path: '/' }),
};

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
