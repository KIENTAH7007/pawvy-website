'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { customerApi, setSessionToken } from '../../lib/api';

export default function LoginVerifyPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>Logging you in…</div>}>
      <LoginLanding />
    </Suspense>
  );
}

function LoginLanding() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('Missing login token.'); return; }

    customerApi.loginVerify(token)
      .then(result => {
        setSessionToken(result.session_token);
        setStatus('success');
        const nextPage = !result.customer.has_password
          ? '/set-password'
          : (result.customer.profile_bonus_claimed ? '/' : '/account');
        setTimeout(() => router.push(nextPage), 1200);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.message);
      });
  }, [searchParams, router]);

  return (
    <div style={{ maxWidth: 440, margin: '140px auto 40px', padding: '0 20px', textAlign: 'center' }}>
      {status === 'loading' && <p>Logging you in…</p>}
      {status === 'success' && (
        <>
          <h1>You're in! 🐾</h1>
          <p style={{ color: '#666' }}>Redirecting to your account…</p>
        </>
      )}
      {status === 'error' && (
        <>
          <h1 style={{ color: 'crimson' }}>Link invalid or expired</h1>
          <p style={{ color: '#666' }}>{message}</p>
        </>
      )}
    </div>
  );
}
