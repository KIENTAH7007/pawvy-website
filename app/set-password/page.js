'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerApi } from '../../lib/api';

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setBusy(true);
    setError(null);
    try {
      await customerApi.setPassword(password);
      router.push('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px' }}>
      <h1>You're verified! 🐾</h1>
      <p style={{ color: '#666' }}>
        Last step — set a password so you can log in directly next time, without needing an
        email link.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <label>
          New password
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        <label style={{ display: 'block', marginTop: 12 }}>
          Confirm password
          <input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
        </label>
        {error && <p style={{ color: 'crimson', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={busy} style={{ padding: '10px 16px', marginTop: 16 }}>
          {busy ? 'Saving…' : 'Set Password & Continue'}
        </button>
      </form>
    </div>
  );
}
