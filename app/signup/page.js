'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { customerApi } from '../../lib/api';

const PDPA_CONSENT_TEXT = 'I agree to Pawvy creating an account for me on Pawvy.co using the information above, and to receive account-related emails (including reward/credit updates) and occasional product announcements. See our Privacy Policy.';

// useSearchParams() requires a Suspense boundary in the App Router — the
// page export below just provides that; SignupForm has the actual logic.
export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px' }}>Loading…</div>}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref') || '';

  const [form, setForm] = useState({ name: '', email: searchParams.get('email') || '', phone: '', address: '' });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

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
        referral_code: referralCode || undefined,
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
      <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
        <h1>Check your email</h1>
        <p style={{ color: '#666' }}>
          We've sent a confirmation link to <strong>{form.email}</strong>. Click it to activate
          your account and your 150 BUTTONS signup bonus.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px' }}>
      <h1>Create your Pawvy account</h1>
      {referralCode && (
        <p style={{ fontSize: 13, color: '#666' }}>Referred by code: <strong>{referralCode}</strong></p>
      )}

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

        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
          <span>{PDPA_CONSENT_TEXT}</span>
        </label>

        {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}

        <button type="submit" disabled={busy} style={{ padding: '10px 16px', marginTop: 8 }}>
          {busy ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>

      <p style={{ fontSize: 13, color: '#666', marginTop: 20 }}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4 };
