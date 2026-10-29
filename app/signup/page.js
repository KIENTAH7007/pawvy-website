'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { customerApi } from '../../lib/api';
import { normalizeRefCode, saveRefCode, readRefCode } from '../../lib/referral';

const PDPA_CONSENT_TEXT = 'I agree to Pawvy creating an account for me on Pawvy.co using the information above, and to receive account-related emails (including reward/credit updates) and occasional product announcements. See our Privacy Policy.';

// useSearchParams() requires a Suspense boundary in the App Router — the
// page export below just provides that; SignupForm has the actual logic.
export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px' }}>Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Code from the link (?ref=) wins; otherwise one remembered from an earlier visit (30 days).
  const urlRef = normalizeRefCode(searchParams.get('ref'));
  // Where to send someone who decides not to sign up after all — set when
  // this page is reached from the login flow's "no account found" handoff
  // (e.g. from checkout, via /login?next=/cart). Defaults to /cart since
  // that's the only place this handoff currently happens from.
  const next = searchParams.get('next') || '/cart';
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  const [form, setForm] = useState({ name: '', email: searchParams.get('email') || '', phone: '', address: '' });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [referralCode, setReferralCode] = useState(urlRef);
  const [refState, setRefState] = useState('idle'); // idle | checking | valid | invalid

  useEffect(() => {
    if (urlRef) saveRefCode(urlRef);
    else { const saved = readRefCode(); if (saved) setReferralCode(saved); }
  }, [urlRef]);

  // Live "Code accepted" check — debounced so we don't ask the server on every keystroke.
  useEffect(() => {
    const code = normalizeRefCode(referralCode);
    if (!code) { setRefState('idle'); return; }
    if (code.length < 4) { setRefState('invalid'); return; }
    setRefState('checking');
    const t = setTimeout(() => {
      customerApi.checkReferralCode(code)
        .then(r => setRefState(r.valid ? 'valid' : 'invalid'))
        .catch(() => setRefState('idle'));
    }, 350);
    return () => clearTimeout(t);
  }, [referralCode]);

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!consent) { setError('Please agree to the consent statement to continue.'); return; }

    setBusy(true);
    setError(null);
    try {
      await customerApi.signup({
        ...form,
        pdpa_consent: true,
        pdpa_consent_text: PDPA_CONSENT_TEXT,
        source: 'website',
        referral_code: normalizeRefCode(referralCode) || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>
        <h1>Check your email</h1>
        <p style={{ color: '#666' }}>
          We've sent a confirmation link to <strong>{form.email}</strong>. Click it to activate
          your account and your 150 BUTTONS signup bonus.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px' }}>
      <h1>Create your Pawvy account</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        <label>
          Name
          <input required value={form.name} onChange={e => update('name', e.target.value)} style={inputStyle} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} />
        </label>
        <label>
          Phone
          <input required value={form.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} />
        </label>
        <label>
          Address (needed if we're mailing your order — you can add this later too)
          <input value={form.address} onChange={e => update('address', e.target.value)} style={inputStyle} />
        </label>

        <label>
          Referral code <span style={{ color: '#888', fontWeight: 400 }}>(optional)</span>
          <input
            value={referralCode} onChange={e => setReferralCode(normalizeRefCode(e.target.value))}
            maxLength={12} autoCapitalize="characters" autoComplete="off"
            style={{
              ...inputStyle, textTransform: 'uppercase', letterSpacing: 2,
              borderColor: refState === 'valid' ? '#2fbf71' : refState === 'invalid' ? '#e5534b' : undefined,
            }}
          />
          <span style={{ display: 'block', fontSize: 13, marginTop: 6, color: refState === 'valid' ? '#1f9a58' : refState === 'invalid' ? '#c0392b' : '#777', fontWeight: refState === 'valid' || refState === 'invalid' ? 600 : 400 }}>
            {refState === 'valid' && '✓ Code accepted — you\'ll both get 200 BUTTONS after your first purchase.'}
            {refState === 'invalid' && 'We couldn\'t find that code. Check the spelling, or leave it blank to continue.'}
            {refState === 'checking' && 'Checking…'}
            {(refState === 'idle') && 'Got a code from a friend? Enter it and you both get 200 BUTTONS after your first purchase.'}
          </span>
        </label>

        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
          <span>
            I agree to Pawvy creating an account for me on Pawvy.co using the information above, and to receive account-related emails (including reward/credit updates) and occasional product announcements. See our{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange, #F36F4A)' }}>Privacy Policy</a>.
          </span>
        </label>

        {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}

        <button type="submit" disabled={busy} style={{ padding: '10px 16px', marginTop: 8 }}>
          {busy ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p style={{ fontSize: 13, color: '#666', marginTop: 20 }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>

      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee' }}>
        {!showGuestWarning ? (
          <p style={{ fontSize: 13, color: '#666' }}>
            Not ready to sign up?{' '}
            <button
              type="button"
              onClick={() => setShowGuestWarning(true)}
              style={{ background: 'none', border: 'none', color: 'var(--orange)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: 13 }}
            >
              Check out as guest instead
            </button>
          </p>
        ) : (
          <div style={{ background: '#fdf3ef', border: '1px solid #f3d9cc', borderRadius: 10, padding: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 700, margin: 0 }}>Skip signup and check out as a guest?</p>
            <p style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
              You'll miss out on your 150 BUTTONS signup bonus, earning BUTTONS on this order, and saved
              order history — you can always create an account later using the same email.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
              <button type="button" onClick={() => router.push(next)} style={{ padding: '8px 14px' }}>
                Yes, continue as guest
              </button>
              <button
                type="button"
                onClick={() => setShowGuestWarning(false)}
                style={{ padding: '8px 14px', background: 'none', border: '1px solid #ccc', cursor: 'pointer' }}
              >
                Stay and sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4 };
