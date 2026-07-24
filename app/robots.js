// Next.js generates a real /robots.txt from this file automatically.
// Account/cart/login/etc. are disallowed since they're personalized pages
// with no SEO value and shouldn't be indexed anyway.
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/cart', '/login', '/signup', '/verify', '/login-verify', '/set-password'],
    },
    sitemap: 'https://pawvy.co/sitemap.xml',
  };
}
