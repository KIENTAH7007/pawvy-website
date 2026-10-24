// Referral code helpers shared by the signup page, the /r/CODE link and checkout.
// The code from a referral link is remembered for 30 days in a first-party
// cookie so a visitor who signs up later (or checks out as a guest) still counts.
const COOKIE = 'pawvy_ref';
const MAX_AGE = 60 * 60 * 24 * 30;

export function normalizeRefCode(v) {
  return String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

export function saveRefCode(code) {
  const c = normalizeRefCode(code);
  if (!c || typeof document === 'undefined') return;
  document.cookie = `${COOKIE}=${c}; max-age=${MAX_AGE}; path=/; SameSite=Lax`;
}

export function readRefCode() {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.split('; ').find(r => r.startsWith(COOKIE + '='));
  return m ? normalizeRefCode(m.split('=')[1]) : '';
}
