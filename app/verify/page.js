'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { customerApi, setSessionToken } from '../../lib/api';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>Verifying your account…</div>}>
      <VerifyLanding />
    </Suspense>
  );
}

function VerifyLanding() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); setMessage('Missing verification token.'); return; }

    customerApi.verify(token)
      .then(result => {
        setSessionToken(result.session_token);
        setStatus('success');
        const nextPage = result.customer.has_password ? '/account' : '/set-password';
        setTimeout(() => router.push(nextPage), 1500);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.message);
      });
  }, [searchParams, router]);

  return (
    <div style={{ maxWidth: 440, margin: '80px auto', padding: '0 20px', textAlign: 'center' }}>
      {status === 'loading' && <p>Verifying your account…</p>}
      {status === 'success' && (
        <>
          <h1>You're verified! 🐾</h1>
          <p style={{ color: '#666' }}>Redirecting you to your account…</p>
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
