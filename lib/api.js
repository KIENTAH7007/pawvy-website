// Calls the Pawvy App backend's API — same backend, same endpoints as the
// previous Vite version of this site. NEXT_PUBLIC_ prefix is required so
// this same constant works from both Server Components (product/shop pages,
// fetched at request/build time) and Client Components (cart, account,
// login — genuinely personal/interactive, no SEO value, so they stay
// client-rendered exactly as before).
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE && typeof window !== 'undefined') {
  console.error(
    'NEXT_PUBLIC_API_BASE_URL is not set. Set it in .env.local (dev) or Railway env vars (prod) ' +
    'to your Pawvy App backend URL, e.g. https://pawvy-app-production.up.railway.app'
  );
}

const SESSION_KEY = 'pawvy_customer_session';

// Product/banner/Instagram images (Aug 2026 bucket migration): the
// backend now returns a relative path like "/api/uploads/products/123-
// 1723200000000.jpg" in each `image_url` field, proxied from a private
// Railway Storage Bucket — see server/lib/bucket.js and
// server/routes/uploads.js in pawvy-app. This just prefixes that with
// the same API_BASE everything else already uses, so every component
// that renders an image goes through one place instead of repeating the
// prefix logic. Returns null (not a broken <img> src) if there's no
// image yet, e.g. a product that hasn't had a photo uploaded.
export function imageUrl(relativePath) {
  if (!relativePath) return null;
  return `${API_BASE}${relativePath}`;
}

// localStorage only exists in the browser — guard every call so this
// module can also be safely imported from Server Components without
// throwing during server-side rendering.
export function getSessionToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionToken(token) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(SESSION_KEY, token);
  else localStorage.removeItem(SESSION_KEY);
}

async function request(path, { method = 'GET', body, auth = false, cache } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getSessionToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    // Server Components fetching public catalog data can opt into Next's
    // caching (e.g. 'force-cache' + revalidate); client-side calls and
    // anything personalized should stay uncached. Left as a pass-through
    // rather than a default, since the right choice differs per call site.
    ...(cache ? { cache } : {}),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const stockistApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/stockists${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  },
  regions: () => request('/api/stockists/regions', { cache: 'no-store' }),
};

// Read-only marketing content (marquee ticker messages, active campaign
// info) — managed from the Pawvy App's Campaigns / Ticker Messages admin
// pages, no website code changes ever needed to update these. no-store
// since this should reflect whatever's live right now, not a stale build.
export const contentApi = {
  ticker: () => request('/api/public-content/ticker', { cache: 'no-store' }),
  activeCampaign: () => request('/api/public-content/campaign', { cache: 'no-store' }),
  instagramPosts: () => request('/api/public-content/instagram', { cache: 'no-store' }),
  homepageBanners: () => request('/api/public-content/banners', { cache: 'no-store' }),
};

export const shopApi = {
  products: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/shop/products${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
  },
  product: (id) => request(`/api/shop/products/${id}`, { cache: 'no-store' }),
  brands: () => request('/api/shop/brands', { cache: 'no-store' }),
  topSellers: (limit = 8) => request(`/api/shop/top-sellers?limit=${limit}`, { cache: 'no-store' }),
};

export const customerApi = {
  signup: (body) => request('/api/customers/signup', { method: 'POST', body }),
  checkEmail: (email) => request('/api/customers/check-email', { method: 'POST', body: { email } }),
  loginPassword: (email, password) => request('/api/customers/login-password', { method: 'POST', body: { email, password } }),
  setPassword: (password) => request('/api/customers/me/set-password', { method: 'POST', body: { password }, auth: true }),
  login: (email) => request('/api/customers/login', { method: 'POST', body: { email } }),
  loginVerify: (token) => request('/api/customers/login/verify', { method: 'POST', body: { token } }),
  verify: (token) => request('/api/customers/verify', { method: 'POST', body: { token } }),
  me: () => request('/api/customers/me', { auth: true }),
  updateProfile: (body) => request('/api/customers/me', { method: 'PATCH', body, auth: true }),
  updatePet: (body) => request('/api/customers/me/pet', { method: 'PUT', body, auth: true }),
  logout: () => request('/api/customers/logout', { method: 'POST', auth: true }),
};

export const checkoutApi = {
  // auth is opt-in here (not required=true) — checkout works for logged-in
  // customers (BUTTONS earn/redeem applies) AND guests (Authorization header
  // just won't be sent if there's no session token, since getSessionToken()
  // returns null and `request` only attaches the header when a token exists).
  createSession: (body) => request('/api/checkout/create-session', { method: 'POST', body, auth: true }),
  getSession: (sessionId) => request(`/api/checkout/session/${sessionId}`, { cache: 'no-store' }),
};
