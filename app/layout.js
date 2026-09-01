import { CartProvider } from '../lib/CartContext';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import PageTransition from '../components/PageTransition';
import CustomCursor from '../components/CustomCursor';
import { buildOgMeta, ORGANIZATION_JSON_LD } from '../lib/seo';
import { shopApi } from '../lib/api';
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

export default async function RootLayout({ children }) {
  // Real, already-filtered brand list (shopApi.brands() excludes
  // anything hidden via Pawvy App's hidden_on_website toggle) — passed
  // to Nav so a hidden brand can't show up in the Shop dropdown and
  // link to a 404. Every page goes through this layout, so this one
  // fetch covers the nav on the whole site.
  const { brands } = await shopApi.brandsForNav().catch(() => ({ brands: [] }));

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <CartProvider>
          <CustomCursor />
          <Nav brands={brands} />
          <PageTransition>{children}</PageTransition>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
