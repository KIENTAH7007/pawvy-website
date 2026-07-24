import { CartProvider } from '../lib/CartContext';
import Nav from '../components/Nav';
import WhatsAppButton from '../components/WhatsAppButton';
import './globals.css';

// Default metadata for every page — individual pages (product, brand)
// override title/description with their own via each page's own
// `export const metadata` or `generateMetadata()`. Base description/
// keywords copied from the current live site (checked via a direct fetch)
// so we're not starting SEO from scratch.
export const metadata = {
  title: 'Pawvy | Natural Pet Wellness Products Singapore',
  description: "Singapore's exclusive distributor of BetterBone, Salmoil, Lillidale, Eastsea Brother & Puzzle Feeder. Trusted, natural pet wellness products to help you make informed choices.",
  metadataBase: new URL('https://pawvy.co'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Nav />
          {children}
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
