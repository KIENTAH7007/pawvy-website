'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Short, easy-to-type address for Instagram comments, stories and print:
// pawvy.co/join → the signup page (which has the "Referral code" field).
export default function Join() {
  const router = useRouter();
  useEffect(() => { router.replace('/signup'); }, [router]);
  return <div style={{ maxWidth: 440, margin: '160px auto', padding: '0 20px', textAlign: 'center', color: '#666' }}>Taking you to sign up…</div>;
}
