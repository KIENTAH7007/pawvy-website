'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { customerApi, setSessionToken } from '../../lib/api';

// useSearchParams() requires a Suspense boundary in the App Router — the
// page export below just provides that; LoginForm has the actual logic.
export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px' }}>Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Where to send the customer after logging in, or after choosing to
  // continue as a guest from the signup handoff — defaults to home so
  // links to /login with no ?next= behave exactly as before.
  const next = searchParams.get('next') || '/';
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { exists, has_password } = await customerApi.checkEmail(email);
      if (!exists) {
        router.push(`/signup?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`);
        return;
      }
      if (has_password) {
        setStep('password');
      } else {
        await customerApi.login(email);
        setStep('magic-sent');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await customerApi.loginPassword(email, password);
      setSessionToken(result.session_token);
      router.push(result.customer?.profile_bonus_claimed ? next : '/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function sendMagicLinkInstead() {
    setBusy(true);
    try {
      await customerApi.login(email);
      setStep('magic-sent');
    } finally {
      setBusy(false);
    }
  }

  if (step === 'magic-sent') {
    return (
      <div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>
        <h1>Check your email</h1>
        <p style={{ color: '#666' }}>We've sent a login link to <strong>{email}</strong>.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px' }}>
      <h1>Log in to Pawvy</h1>

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} style={{ marginTop: 24 }}>
          <label>
            Email
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
          </label>
          {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ padding: '10px 16px', marginTop: 12 }}>
            {busy ? 'Checking…' : 'Continue'}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} style={{ marginTop: 24 }}>
          <p style={{ fontSize: 13, color: '#666' }}>{email}</p>
          <label>
            Password
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
          </label>
          {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ padding: '10px 16px', marginTop: 12 }}>
            {busy ? 'Logging in…' : 'Log In'}
          </button>
          <p style={{ fontSize: 13, marginTop: 12 }}>
            <button type="button" onClick={sendMagicLinkInstead} style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>
              Forgot your password? Email me a login link instead
            </button>
          </p>
        </form>
      )}

      <p style={{ fontSize: 13, color: '#666', marginTop: 20 }}>
        New to Pawvy? <Link href={`/signup?next=${encodeURIComponent(next)}`}>Sign up</Link>
      </p>
    </div>
  );
}
